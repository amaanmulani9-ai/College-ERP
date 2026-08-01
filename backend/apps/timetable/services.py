"""
Timetable Business Services (TimetableService).
Handles timetable CRUD, conflict engine invocation, schedule queries, and audit logs.
"""

from apps.authentication.services import log_audit_event
from django.db import transaction

from .models import Timetable, TimetableAuditLog
from .validators import check_timetable_conflicts


class TimetableService:
    @staticmethod
    def check_conflicts(
        time_slot_id: str,
        classroom_id: str,
        faculty_id: str,
        program_id: str,
        semester_id: str,
        batch: str = "all",
        exclude_id: str = None,
    ):
        return check_timetable_conflicts(
            time_slot_id=time_slot_id,
            classroom_id=classroom_id,
            faculty_id=faculty_id,
            program_id=program_id,
            semester_id=semester_id,
            batch=batch,
            exclude_id=exclude_id,
        )

    @staticmethod
    @transaction.atomic
    def create(data: dict, actor=None, request=None) -> Timetable:
        # Conflict validation
        conflicts = TimetableService.check_conflicts(
            time_slot_id=str(data["time_slot"].id) if hasattr(data["time_slot"], "id") else str(data["time_slot"]),
            classroom_id=str(data["classroom"].id) if hasattr(data["classroom"], "id") else str(data["classroom"]),
            faculty_id=str(data["faculty"].id) if hasattr(data["faculty"], "id") else str(data["faculty"]),
            program_id=str(data["program"].id) if hasattr(data["program"], "id") else str(data["program"]),
            semester_id=str(data["semester"].id) if hasattr(data["semester"], "id") else str(data["semester"]),
            batch=data.get("batch", "all"),
        )
        if conflicts:
            raise ValueError(f"Timetable conflict detected: {conflicts[0]['message']}")

        timetable = Timetable.objects.create(**data)

        _log_audit(
            timetable=timetable,
            actor=actor,
            event_type="created",
            description=f"Timetable entry created: {timetable}",
            request=request,
        )
        return timetable

    @staticmethod
    @transaction.atomic
    def update(timetable: Timetable, data: dict, actor=None, request=None) -> Timetable:
        time_slot = data.get("time_slot", timetable.time_slot)
        classroom = data.get("classroom", timetable.classroom)
        faculty = data.get("faculty", timetable.faculty)
        program = data.get("program", timetable.program)
        semester = data.get("semester", timetable.semester)
        batch = data.get("batch", timetable.batch)

        room_changed = "classroom" in data and data["classroom"] != timetable.classroom
        faculty_changed = "faculty" in data and data["faculty"] != timetable.faculty

        conflicts = TimetableService.check_conflicts(
            time_slot_id=str(time_slot.id) if hasattr(time_slot, "id") else str(time_slot),
            classroom_id=str(classroom.id) if hasattr(classroom, "id") else str(classroom),
            faculty_id=str(faculty.id) if hasattr(faculty, "id") else str(faculty),
            program_id=str(program.id) if hasattr(program, "id") else str(program),
            semester_id=str(semester.id) if hasattr(semester, "id") else str(semester),
            batch=batch,
            exclude_id=str(timetable.id),
        )
        if conflicts:
            raise ValueError(f"Timetable conflict detected: {conflicts[0]['message']}")

        for attr, value in data.items():
            setattr(timetable, attr, value)
        timetable.save()

        event_type = "updated"
        if room_changed:
            event_type = "room_changed"
        elif faculty_changed:
            event_type = "faculty_changed"

        _log_audit(
            timetable=timetable,
            actor=actor,
            event_type=event_type,
            description=f"Timetable entry updated ({event_type}): {timetable}",
            request=request,
        )
        return timetable

    @staticmethod
    def delete(timetable: Timetable, actor=None, request=None):
        timetable.is_deleted = True
        timetable.save(update_fields=["is_deleted", "updated_at"])
        _log_audit(
            timetable=timetable,
            actor=actor,
            event_type="deleted",
            description=f"Timetable entry soft-deleted: {timetable}",
            request=request,
        )
        return True

    @staticmethod
    def faculty_schedule(faculty_id: str):
        return (
            Timetable.objects.filter(faculty_id=faculty_id, status="active", is_deleted=False)
            .select_related("time_slot", "classroom", "subject", "program", "semester")
            .order_by("time_slot__day", "time_slot__period_number")
        )

    @staticmethod
    def student_schedule(program_id: str = None, semester_id: str = None, batch: str = None):
        qs = Timetable.objects.filter(status="active", is_deleted=False)
        if program_id:
            qs = qs.filter(program_id=program_id)
        if semester_id:
            qs = qs.filter(semester_id=semester_id)
        if batch and batch != "all":
            qs = qs.filter(batch__in=["all", batch])
        return qs.select_related("time_slot", "classroom", "subject", "faculty__profile").order_by(
            "time_slot__day", "time_slot__period_number"
        )

    @staticmethod
    def room_schedule(classroom_id: str):
        return (
            Timetable.objects.filter(classroom_id=classroom_id, status="active", is_deleted=False)
            .select_related("time_slot", "subject", "faculty__profile", "program")
            .order_by("time_slot__day", "time_slot__period_number")
        )

    @staticmethod
    def weekly_schedule(session_id: str = None):
        qs = Timetable.objects.filter(status="active", is_deleted=False)
        if session_id:
            qs = qs.filter(academic_session_id=session_id)
        return qs.select_related(
            "time_slot", "classroom", "subject", "faculty__profile", "program", "semester"
        ).order_by("time_slot__day", "time_slot__period_number")


def _log_audit(timetable, actor, event_type: str, description: str, metadata: dict = None, request=None):
    if request:
        try:
            log_audit_event(request, event_type=f"timetable_{event_type}", details=description)
        except Exception:
            pass

    return TimetableAuditLog.objects.create(
        timetable=timetable,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
    )
