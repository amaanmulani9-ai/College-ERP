"""
Attendance Business Services (AttendanceService).
Handles session management, individual & bulk attendance marking, percentage calculation,
faculty attendance, reports, locking, and audit logs.
"""

import datetime
from typing import Any, Dict, List

from apps.authentication.services import log_audit_event
from django.db import transaction
from django.db.models import Count, Q

from .models import AttendanceAuditLog, AttendanceSession, FacultyAttendance, StudentAttendance
from .validators import generate_qr_attendance_token, validate_session_unlocked


class AttendanceService:
    @staticmethod
    @transaction.atomic
    def create_session(data: dict, actor=None, request=None) -> AttendanceSession:
        session = AttendanceSession.objects.create(**data)
        session.qr_token = generate_qr_attendance_token(str(session.id))
        session.save(update_fields=["qr_token"])

        _log_audit(
            session=session,
            actor=actor,
            event_type="created",
            description=f"Attendance session created for {session.subject.name} on {session.date}",
            request=request,
        )
        return session

    @staticmethod
    @transaction.atomic
    def mark_attendance(
        session: AttendanceSession,
        student_id: str,
        status: str = "present",
        remarks: str = "",
        actor=None,
        request=None,
    ) -> StudentAttendance:
        validate_session_unlocked(session)

        attendance, created = StudentAttendance.objects.update_or_create(
            session=session,
            student_id=student_id,
            defaults={"status": status, "remarks": remarks},
        )

        _log_audit(
            session=session,
            actor=actor,
            event_type="updated",
            description=f"Marked student attendance for {attendance.student.student_id} as {status}",
            request=request,
        )
        return attendance

    @staticmethod
    @transaction.atomic
    def bulk_mark(
        session: AttendanceSession, records: List[Dict[str, Any]], actor=None, request=None
    ) -> List[StudentAttendance]:
        validate_session_unlocked(session)

        marked_records = []
        for rec in records:
            student_id = rec["student_id"]
            status = rec.get("status", "present")
            remarks = rec.get("remarks", "")

            att, _ = StudentAttendance.objects.update_or_create(
                session=session,
                student_id=student_id,
                defaults={"status": status, "remarks": remarks},
            )
            marked_records.append(att)

        _log_audit(
            session=session,
            actor=actor,
            event_type="bulk_marked",
            description=f"Bulk marked attendance for {len(marked_records)} students in session {session.id}",
            request=request,
        )
        return marked_records

    @staticmethod
    @transaction.atomic
    def faculty_attendance(
        faculty_id: str,
        date: datetime.date,
        status: str = "present",
        check_in=None,
        check_out=None,
        remarks: str = "",
        actor=None,
        request=None,
    ) -> FacultyAttendance:
        rec, _ = FacultyAttendance.objects.update_or_create(
            faculty_id=faculty_id,
            date=date,
            defaults={"status": status, "check_in": check_in, "check_out": check_out, "remarks": remarks},
        )

        if request:
            try:
                log_audit_event(
                    request,
                    event_type="faculty_attendance_marked",
                    details=f"Faculty {faculty_id} attendance set to {status}",
                )
            except Exception:
                pass

        return rec

    @staticmethod
    def attendance_percentage(student_id: str, subject_id: str = None) -> Dict[str, Any]:
        qs = StudentAttendance.objects.filter(student_id=student_id, is_deleted=False)
        if subject_id:
            qs = qs.filter(session__subject_id=subject_id)

        total_sessions = qs.count()
        if total_sessions == 0:
            return {"total_sessions": 0, "present_count": 0, "percentage": 100.0}

        present_count = qs.filter(status__in=["present", "late"]).count()
        percentage = round((present_count / total_sessions) * 100.0, 2)

        return {
            "total_sessions": total_sessions,
            "present_count": present_count,
            "percentage": percentage,
        }

    @staticmethod
    def daily_report(target_date: datetime.date) -> Dict[str, Any]:
        sessions = AttendanceSession.objects.filter(date=target_date, is_deleted=False)
        student_records = StudentAttendance.objects.filter(session__date=target_date, is_deleted=False)
        faculty_records = FacultyAttendance.objects.filter(date=target_date, is_deleted=False)

        total_sessions = sessions.count()
        total_marked = student_records.count()
        present_students = student_records.filter(status__in=["present", "late"]).count()
        absent_students = student_records.filter(status="absent").count()

        return {
            "date": str(target_date),
            "total_sessions": total_sessions,
            "total_student_records": total_marked,
            "present_students": present_students,
            "absent_students": absent_students,
            "faculty_records_count": faculty_records.count(),
        }

    @staticmethod
    def monthly_report(year: int, month: int, subject_id: str = None) -> Dict[str, Any]:
        sessions = AttendanceSession.objects.filter(date__year=year, date__month=month, is_deleted=False)
        if subject_id:
            sessions = sessions.filter(subject_id=subject_id)

        records = StudentAttendance.objects.filter(session__in=sessions, is_deleted=False)

        stats = records.aggregate(
            total=Count("id"),
            present=Count("id", filter=Q(status__in=["present", "late"])),
            absent=Count("id", filter=Q(status="absent")),
            excused=Count("id", filter=Q(status="excused")),
        )
        total = stats["total"] or 0
        present = stats["present"] or 0
        percentage = round((present / total * 100.0), 2) if total > 0 else 100.0

        return {
            "year": year,
            "month": month,
            "total_sessions": sessions.count(),
            "total_records": total,
            "present_records": present,
            "absent_records": stats["absent"] or 0,
            "excused_records": stats["excused"] or 0,
            "average_percentage": percentage,
        }

    @staticmethod
    @transaction.atomic
    def lock_session(session: AttendanceSession, actor=None, request=None) -> AttendanceSession:
        session.is_locked = True
        session.status = "locked"
        session.save(update_fields=["is_locked", "status", "updated_at"])

        _log_audit(
            session=session,
            actor=actor,
            event_type="locked",
            description=f"Attendance session {session.id} locked by administrator.",
            request=request,
        )
        return session


def _log_audit(session, actor, event_type: str, description: str, metadata: dict = None, request=None):
    if request:
        try:
            log_audit_event(request, event_type=f"attendance_{event_type}", details=description)
        except Exception:
            pass

    return AttendanceAuditLog.objects.create(
        session=session,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
    )
