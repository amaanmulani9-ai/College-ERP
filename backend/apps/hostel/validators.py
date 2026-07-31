"""
Hostel Validators
=================
- One active hostel allocation per student
- Room capacity validation
- Vacant bed validation
"""
from typing import Optional


def validate_student_no_active_allocation(student_id: str, exclude_allocation_id: Optional[str] = None) -> None:
    """Ensure student doesn't already have an active allocation."""
    from .models import HostelAllocation
    qs = HostelAllocation.objects.filter(
        student_id=student_id,
        status__in=["allocated", "checked_in"],
    )
    if exclude_allocation_id:
        qs = qs.exclude(id=exclude_allocation_id)
    if qs.exists():
        raise ValueError("Student already has an active hostel bed allocation.")


def validate_bed_vacant(bed) -> None:
    """Ensure bed status is vacant."""
    if bed.status != "vacant":
        raise ValueError(f"Bed '{bed.bed_number}' in Room {bed.room.room_number} is not vacant. (Current status: {bed.status})")


def validate_room_capacity(room) -> None:
    """Ensure room hasn't reached maximum capacity."""
    if room.occupied_beds >= room.capacity:
        raise ValueError(f"Room {room.room_number} is at full capacity ({room.occupied_beds}/{room.capacity}).")
