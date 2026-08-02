"""
Exam Business Services (ExamService).
Handles exam creation, schedule creation with conflict checks, hall ticket generation,
exam attendance marking, invigilator assignments, and schedules.
"""

import uuid
from typing import List

from apps.authentication.services import log_audit_event
from django.db import transaction
from django.utils import timezone

from .models import Exam, ExamAttendance, ExamAuditLog, ExamSchedule, HallTicket, InvigilatorAssignment
from .validators import check_exam_schedule_conflicts, validate_hall_ticket_required, validate_schedule_unlocked


class ExamService:
    @staticmethod
    @transaction.atomic
    def create_exam(data: dict, actor=None, request=None) -> Exam:
        exam = Exam.objects.create(**data)
        _log_audit(
            exam=exam,
            actor=actor,
            event_type="exam_created",
            description=f"Exam created for subject {exam.subject.code} ({exam.exam_type.name})",
            request=request,
        )
        return exam

    @staticmethod
    @transaction.atomic
    def schedule_exam(data: dict, actor=None, request=None) -> ExamSchedule:
        conflicts = check_exam_schedule_conflicts(
            date=data["date"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            classroom_id=str(data["classroom"].id) if hasattr(data["classroom"], "id") else str(data["classroom"]),
            invigilator_id=(
                str(data["invigilator"].id)
                if data.get("invigilator") and hasattr(data["invigilator"], "id")
                else (str(data["invigilator"]) if data.get("invigilator") else None)
            ),
        )
        if conflicts:
            raise ValueError(f"Exam scheduling conflict: {conflicts[0]['message']}")

        schedule = ExamSchedule.objects.create(**data)

        # If invigilator is specified, create InvigilatorAssignment record
        if schedule.invigilator:
            InvigilatorAssignment.objects.get_or_create(
                exam_schedule=schedule,
                faculty=schedule.invigilator,
                defaults={"duty_status": "assigned"},
            )

        _log_audit(
            exam=schedule.exam,
            actor=actor,
            event_type="schedule_updated",
            description=f"Exam scheduled for {schedule.exam.subject.code} on {schedule.date} in room {schedule.classroom}",
            request=request,
        )
        return schedule

    @staticmethod
    @transaction.atomic
    def generate_hall_ticket(student_id: str, exam_id: str, actor=None, request=None) -> HallTicket:
        exam = Exam.objects.get(pk=exam_id)
        number = f"HT-{exam.academic_session.name[:4]}-{exam.subject.code}-{uuid.uuid4().hex[:6].upper()}"

        ticket, created = HallTicket.objects.get_or_create(
            student_id=student_id,
            exam_id=exam_id,
            defaults={"hall_ticket_number": number, "status": "issued"},
        )

        _log_audit(
            exam=exam,
            actor=actor,
            event_type="hall_ticket_generated",
            description=f"Hall ticket {ticket.hall_ticket_number} generated for student {student_id}",
            request=request,
        )
        return ticket

    @staticmethod
    @transaction.atomic
    def mark_exam_attendance(
        schedule_id: str, student_id: str, status: str = "present", remarks: str = "", actor=None, request=None
    ) -> ExamAttendance:
        schedule = ExamSchedule.objects.get(pk=schedule_id)
        validate_schedule_unlocked(schedule)

        # Business Rule: Must possess valid Hall Ticket
        validate_hall_ticket_required(student_id=student_id, exam_id=str(schedule.exam.id))

        att, created = ExamAttendance.objects.update_or_create(
            exam_schedule=schedule,
            student_id=student_id,
            defaults={"status": status, "check_in_time": timezone.now(), "remarks": remarks},
        )

        _log_audit(
            exam=schedule.exam,
            actor=actor,
            event_type="attendance_marked",
            description=f"Marked exam attendance for student {student_id} as {status}",
            request=request,
        )
        return att

    @staticmethod
    @transaction.atomic
    def assign_invigilator(
        schedule_id: str, faculty_id: str, duty_status: str = "assigned", remarks: str = "", actor=None, request=None
    ) -> InvigilatorAssignment:
        schedule = ExamSchedule.objects.get(pk=schedule_id)
        validate_schedule_unlocked(schedule)

        # Check invigilator double-booking conflict
        conflicts = check_exam_schedule_conflicts(
            date=schedule.date,
            start_time=schedule.start_time,
            end_time=schedule.end_time,
            classroom_id=str(schedule.classroom.id),
            invigilator_id=faculty_id,
            exclude_id=str(schedule.id),
        )
        invig_conflicts = [c for c in conflicts if c["type"] == "invigilator_conflict"]
        if invig_conflicts:
            raise ValueError(invig_conflicts[0]["message"])

        assignment, _ = InvigilatorAssignment.objects.update_or_create(
            exam_schedule=schedule,
            faculty_id=faculty_id,
            defaults={"duty_status": duty_status, "remarks": remarks},
        )

        schedule.invigilator_id = faculty_id
        schedule.save(update_fields=["invigilator", "updated_at"])

        _log_audit(
            exam=schedule.exam,
            actor=actor,
            event_type="invigilator_assigned",
            description=f"Assigned invigilator {faculty_id} to schedule {schedule.id}",
            request=request,
        )
        return assignment

    @staticmethod
    def student_schedule(student_id: str) -> List[ExamSchedule]:
        from apps.students.models import Student

        student = Student.objects.get(pk=student_id)
        return (
            ExamSchedule.objects.filter(
                exam__program=student.program,
                exam__semester=student.current_semester,
                is_deleted=False,
            )
            .select_related("exam__subject", "exam__exam_type", "classroom__building")
            .order_by("date", "start_time")
        )

    @staticmethod
    def faculty_duties(faculty_id: str) -> List[InvigilatorAssignment]:
        return (
            InvigilatorAssignment.objects.filter(faculty_id=faculty_id)
            .select_related("exam_schedule__exam__subject", "exam_schedule__classroom__building")
            .order_by("exam_schedule__date", "exam_schedule__start_time")
        )


def _log_audit(exam, actor, event_type: str, description: str, metadata: dict = None, request=None):
    if request:
        try:
            log_audit_event(request, event_type=f"exam_{event_type}", details=description)
        except Exception:
            pass

    return ExamAuditLog.objects.create(
        exam=exam,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
    )
