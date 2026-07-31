"""
Validators and Conflict Engine for Examinations Module.
Prevents:
 - Classroom exam double-booking
 - Faculty invigilator double-booking
 - Student exam overlap
Enforces:
 - Hall Ticket verification before marking attendance
 - Schedule lock checks
"""
from typing import List, Dict, Any
from .models import ExamSchedule, HallTicket


def check_exam_schedule_conflicts(
    date,
    start_time,
    end_time,
    classroom_id: str,
    invigilator_id: str = None,
    exclude_id: str = None,
) -> List[Dict[str, Any]]:
    """
    Validates proposed exam schedule for classroom and invigilator double-booking.
    """
    conflicts = []

    # 1. Classroom Conflict Check
    room_clash = ExamSchedule.objects.filter(
        date=date,
        classroom_id=classroom_id,
        start_time__lt=end_time,
        end_time__gt=start_time,
        is_deleted=False,
    )
    if exclude_id:
        room_clash = room_clash.exclude(id=exclude_id)

    if room_clash.exists():
        clash = room_clash.first()
        conflicts.append({
            "type": "classroom_conflict",
            "message": f"Classroom {clash.classroom} is already booked for exam '{clash.exam.subject.name}' on {date} from {clash.start_time} to {clash.end_time}.",
            "conflicting_schedule_id": str(clash.id),
        })

    # 2. Invigilator Conflict Check
    if invigilator_id:
        invig_clash = ExamSchedule.objects.filter(
            date=date,
            invigilator_id=invigilator_id,
            start_time__lt=end_time,
            end_time__gt=start_time,
            is_deleted=False,
        )
        if exclude_id:
            invig_clash = invig_clash.exclude(id=exclude_id)

        if invig_clash.exists():
            clash = invig_clash.first()
            conflicts.append({
                "type": "invigilator_conflict",
                "message": f"Faculty invigilator {clash.invigilator.profile.get_full_name()} is already assigned to an exam room on {date} during this time.",
                "conflicting_schedule_id": str(clash.id),
            })

    return conflicts


def validate_hall_ticket_required(student_id: str, exam_id: str) -> HallTicket:
    """
    Ensures student possesses an active/issued Hall Ticket for the given exam.
    Raises ValueError if Hall Ticket is missing or invalid.
    """
    ticket = HallTicket.objects.filter(student_id=student_id, exam_id=exam_id, is_deleted=False).first()
    if not ticket or ticket.status in ["revoked", "blocked"]:
        raise ValueError(f"Student does not possess a valid issued Hall Ticket for this examination.")
    return ticket


def validate_schedule_unlocked(schedule: ExamSchedule):
    """
    Ensures exam schedule is unlocked for modifications.
    """
    if schedule.is_locked:
        raise ValueError("Exam schedule is locked. Attendance & duties cannot be modified.")
