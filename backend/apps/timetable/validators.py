"""
Conflict Engine & Validation Logic for Timetable Management.
Prevents:
 - Faculty double-booking
 - Classroom double-booking
 - Batch double-booking
"""
from typing import List, Dict, Any
from .models import Timetable


def check_timetable_conflicts(
    time_slot_id: str,
    classroom_id: str,
    faculty_id: str,
    program_id: str,
    semester_id: str,
    batch: str = "all",
    exclude_id: str = None,
) -> List[Dict[str, Any]]:
    """
    Validates proposed timetable parameters for potential scheduling conflicts.
    Returns a list of conflict dictionary objects if any exist.
    """
    conflicts = []

    # 1. Faculty Double Booking Check
    faculty_clash = Timetable.objects.filter(
        time_slot_id=time_slot_id,
        faculty_id=faculty_id,
        status="active",
        is_deleted=False,
    )
    if exclude_id:
        faculty_clash = faculty_clash.exclude(id=exclude_id)

    if faculty_clash.exists():
        clash = faculty_clash.first()
        conflicts.append({
            "type": "faculty_double_booking",
            "message": f"Faculty is already assigned to {clash.subject.name} in room {clash.classroom} during this time slot.",
            "conflicting_entry_id": str(clash.id),
        })

    # 2. Classroom Double Booking Check
    room_clash = Timetable.objects.filter(
        time_slot_id=time_slot_id,
        classroom_id=classroom_id,
        status="active",
        is_deleted=False,
    )
    if exclude_id:
        room_clash = room_clash.exclude(id=exclude_id)

    if room_clash.exists():
        clash = room_clash.first()
        conflicts.append({
            "type": "classroom_double_booking",
            "message": f"Classroom is already occupied by {clash.faculty.profile.get_full_name()} for {clash.subject.name}.",
            "conflicting_entry_id": str(clash.id),
        })

    # 3. Batch Double Booking Check
    batch_query = Timetable.objects.filter(
        time_slot_id=time_slot_id,
        program_id=program_id,
        semester_id=semester_id,
        status="active",
        is_deleted=False,
    )
    if batch != "all":
        batch_query = batch_query.filter(batch__in=["all", batch])

    if exclude_id:
        batch_query = batch_query.exclude(id=exclude_id)

    if batch_query.exists():
        clash = batch_query.first()
        conflicts.append({
            "type": "batch_double_booking",
            "message": f"Batch '{batch}' for this program & semester is already scheduled for {clash.subject.name} in room {clash.classroom}.",
            "conflicting_entry_id": str(clash.id),
        })

    return conflicts
