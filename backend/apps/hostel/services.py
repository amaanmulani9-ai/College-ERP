"""
Hostel Service
==============
Core business logic for hostel allocations, transfers, check-in/out, visitors, maintenance, and fee integration.

Methods:
    allocate_bed()        – Allocate vacant bed to student & create fee integration record
    transfer_room()       – Transfer student from current bed to a new vacant bed
    check_in()            – Perform check-in for student allocation
    check_out()           – Process check-out and vacate bed
    visitor_entry()       – Log visitor check-in
    maintenance_request() – Create maintenance ticket for room
    vacant_rooms()        – Query rooms with available capacity
    occupied_rooms()      – Query rooms with occupied beds
"""

import decimal
import logging
from datetime import date, datetime
from typing import Any, Dict, List, Optional

from apps.academics.models import AcademicSession
from apps.staff.models import Employee
from apps.students.models import Student
from django.db import models, transaction
from django.utils import timezone

from .models import (
    Bed,
    HostelAllocation,
    HostelAuditLog,
    MaintenanceRequest,
    Room,
    Visitor,
)
from .validators import (
    validate_bed_vacant,
    validate_room_capacity,
    validate_student_no_active_allocation,
)

logger = logging.getLogger(__name__)


class HostelService:

    # ------------------------------------------------------------------
    # 1. Allocate Bed
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def allocate_bed(
        student_id: str,
        bed_id: str,
        academic_session_id: str,
        fee_amount: Optional[decimal.Decimal] = None,
        actor=None,
    ) -> HostelAllocation:
        """
        Allocate a bed to a student for an academic session.
        Integrates with Fee Management if fee_amount is provided.
        """
        validate_student_no_active_allocation(student_id)

        try:
            bed = Bed.objects.select_for_update().select_related("room").get(pk=bed_id)
        except Bed.DoesNotExist:
            raise ValueError(f"Bed {bed_id!r} not found.")

        validate_bed_vacant(bed)
        validate_room_capacity(bed.room)

        student = Student.objects.get(pk=student_id)
        session = AcademicSession.objects.get(pk=academic_session_id)

        allocation = HostelAllocation.objects.create(
            student=student,
            bed=bed,
            academic_session=session,
            status="allocated",
        )

        # Update bed & room state
        bed.status = "allocated"
        bed.save(update_fields=["status", "updated_at"])

        room = bed.room
        room.occupied_beds += 1
        if room.occupied_beds >= room.capacity:
            room.status = "full"
        room.save(update_fields=["occupied_beds", "status", "updated_at"])

        # Fee Management Integration (if fee_amount provided)
        if fee_amount and fee_amount > 0:
            try:
                from apps.fees.models import FeeCategory, FeeStructure, StudentFee

                category, _ = FeeCategory.objects.get_or_create(
                    code="HOSTEL_FEE", defaults={"name": "Hostel Fee", "is_active": True}
                )
                structure, _ = FeeStructure.objects.get_or_create(
                    academic_session=session,
                    program=student.program,
                    semester=student.current_semester,
                    category=category,
                    defaults={
                        "amount": float(fee_amount),
                        "is_active": True,
                    },
                )
                StudentFee.objects.create(
                    student=student,
                    fee_structure=structure,
                    total_amount=float(fee_amount),
                    due_amount=float(fee_amount),
                    status="pending",
                )
            except Exception as exc:
                logger.warning("Failed to auto-create Hostel Fee in Fee Management: %s", exc)

        _log_audit(
            hostel=room.floor.block.hostel,
            allocation=allocation,
            actor=actor,
            event_type="room_allocated",
            description=f"Bed {bed.bed_number} in Room {room.room_number} allocated to Student {student.student_id}.",
        )
        return allocation

    # ------------------------------------------------------------------
    # 2. Transfer Room
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def transfer_room(allocation_id: str, new_bed_id: str, actor=None) -> HostelAllocation:
        """Transfer student from current bed to a new vacant bed."""
        try:
            alloc = (
                HostelAllocation.objects.select_for_update()
                .select_related("bed__room", "student")
                .get(pk=allocation_id)
            )
        except HostelAllocation.DoesNotExist:
            raise ValueError(f"HostelAllocation {allocation_id!r} not found.")

        if alloc.status not in ["allocated", "checked_in"]:
            raise ValueError(f"Cannot transfer allocation with status {alloc.status!r}.")

        try:
            new_bed = Bed.objects.select_for_update().select_related("room").get(pk=new_bed_id)
        except Bed.DoesNotExist:
            raise ValueError(f"New Bed {new_bed_id!r} not found.")

        validate_bed_vacant(new_bed)
        validate_room_capacity(new_bed.room)

        # Vacate old bed
        old_bed = alloc.bed
        old_bed.status = "vacant"
        old_bed.save(update_fields=["status", "updated_at"])

        old_room = old_bed.room
        if old_room.occupied_beds > 0:
            old_room.occupied_beds -= 1
        if old_room.status == "full":
            old_room.status = "available"
        old_room.save(update_fields=["occupied_beds", "status", "updated_at"])

        # Occupy new bed
        new_bed.status = "allocated"
        new_bed.save(update_fields=["status", "updated_at"])

        new_room = new_bed.room
        new_room.occupied_beds += 1
        if new_room.occupied_beds >= new_room.capacity:
            new_room.status = "full"
        new_room.save(update_fields=["occupied_beds", "status", "updated_at"])

        # Update allocation
        alloc.bed = new_bed
        alloc.status = "transferred"
        alloc.save(update_fields=["bed", "status", "updated_at"])

        _log_audit(
            hostel=new_room.floor.block.hostel,
            allocation=alloc,
            actor=actor,
            event_type="room_transferred",
            description=f"Student {alloc.student.student_id} transferred from Room {old_room.room_number} Bed {old_bed.bed_number} to Room {new_room.room_number} Bed {new_bed.bed_number}.",
        )
        return alloc

    # ------------------------------------------------------------------
    # 3. Check-In
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def check_in(allocation_id: str, check_in_date: Optional[date] = None, actor=None) -> HostelAllocation:
        """Perform check-in for a student allocation."""
        try:
            alloc = HostelAllocation.objects.get(pk=allocation_id)
        except HostelAllocation.DoesNotExist:
            raise ValueError(f"HostelAllocation {allocation_id!r} not found.")

        if alloc.status == "checked_in":
            raise ValueError("Student has already checked in.")

        alloc.check_in_date = check_in_date or date.today()
        alloc.status = "checked_in"
        alloc.save()

        _log_audit(
            allocation=alloc,
            actor=actor,
            event_type="check_in",
            description=f"Student {alloc.student.student_id} checked in on {alloc.check_in_date}.",
        )
        return alloc

    # ------------------------------------------------------------------
    # 4. Check-Out
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def check_out(allocation_id: str, check_out_date: Optional[date] = None, actor=None) -> HostelAllocation:
        """Process check-out and vacate bed."""
        try:
            alloc = (
                HostelAllocation.objects.select_for_update()
                .select_related("bed__room", "student")
                .get(pk=allocation_id)
            )
        except HostelAllocation.DoesNotExist:
            raise ValueError(f"HostelAllocation {allocation_id!r} not found.")

        if alloc.status == "checked_out":
            raise ValueError("Student has already checked out.")

        actual_checkout = check_out_date or date.today()
        alloc.check_out_date = actual_checkout
        alloc.status = "checked_out"
        alloc.save()

        # Vacate bed
        bed = alloc.bed
        bed.status = "vacant"
        bed.save(update_fields=["status", "updated_at"])

        room = bed.room
        if room.occupied_beds > 0:
            room.occupied_beds -= 1
        if room.status == "full":
            room.status = "available"
        room.save(update_fields=["occupied_beds", "status", "updated_at"])

        _log_audit(
            allocation=alloc,
            actor=actor,
            event_type="check_out",
            description=f"Student {alloc.student.student_id} checked out on {actual_checkout}.",
        )
        return alloc

    # ------------------------------------------------------------------
    # 5. Visitor Entry
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def visitor_entry(
        student_id: str,
        visitor_name: str,
        relation: str,
        mobile: str,
        visit_date: Optional[date] = None,
        check_in_time: Optional[datetime] = None,
        actor=None,
    ) -> Visitor:
        """Record visitor entry for a student."""
        student = Student.objects.get(pk=student_id)
        v_date = visit_date or date.today()
        v_in = check_in_time or timezone.now()

        visitor = Visitor.objects.create(
            student=student,
            visitor_name=visitor_name,
            relation=relation,
            mobile=mobile,
            visit_date=v_date,
            check_in_time=v_in,
        )

        _log_audit(
            actor=actor,
            event_type="visitor_entry",
            description=f"Visitor '{visitor_name}' registered for Student {student.student_id}.",
        )
        return visitor

    # ------------------------------------------------------------------
    # 6. Maintenance Request
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def maintenance_request(
        room_id: str,
        title: str,
        description: str,
        assigned_to_id: Optional[str] = None,
        actor=None,
    ) -> MaintenanceRequest:
        """Create room maintenance ticket."""
        room = Room.objects.get(pk=room_id)
        assigned_to = Employee.objects.get(pk=assigned_to_id) if assigned_to_id else None

        req = MaintenanceRequest.objects.create(
            room=room,
            title=title,
            description=description,
            assigned_to=assigned_to,
            status="pending",
        )

        _log_audit(
            actor=actor,
            event_type="maintenance_request",
            description=f"Maintenance request '{title}' logged for Room {room.room_number}.",
        )
        return req

    # ------------------------------------------------------------------
    # 7. Queries: Vacant / Occupied Rooms
    # ------------------------------------------------------------------

    @staticmethod
    def vacant_rooms() -> List[Dict[str, Any]]:
        """Return list of rooms with available bed capacity."""
        rooms = Room.objects.filter(occupied_beds__lt=models.F("capacity"), status__in=["available"]).select_related(
            "floor__block__hostel"
        )
        return list(
            rooms.values(
                "id",
                "room_number",
                "room_type",
                "capacity",
                "occupied_beds",
                "floor__floor_number",
                "floor__block__name",
                "floor__block__hostel__name",
            )
        )

    @staticmethod
    def occupied_rooms() -> List[Dict[str, Any]]:
        """Return list of rooms with occupied beds."""
        rooms = Room.objects.filter(occupied_beds__gt=0).select_related("floor__block__hostel")
        return list(
            rooms.values(
                "id",
                "room_number",
                "room_type",
                "capacity",
                "occupied_beds",
                "floor__floor_number",
                "floor__block__name",
                "floor__block__hostel__name",
            )
        )


def _log_audit(hostel=None, allocation=None, actor=None, event_type="", description=""):
    return HostelAuditLog.objects.create(
        hostel=hostel,
        allocation=allocation,
        actor=actor,
        event_type=event_type,
        description=description,
    )
