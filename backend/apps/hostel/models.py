"""
Hostel Management System Models
================================
Hostel             – Hostel building/complex
Block              – Wings/Blocks within a hostel
Floor              – Floors within a block
Room               – Rooms within a floor
Bed                – Individual beds within a room
Warden             – Staff warden assignments
HostelAllocation   – Student bed allocations & check-in/out tracking
Visitor            – Visitor register
MaintenanceRequest – Room maintenance tickets
HostelAuditLog     – Audit log for hostel events
"""
import uuid

from django.conf import settings
from django.db import models

from apps.academics.models import AcademicSession
from apps.staff.models import Employee
from apps.students.models import Student


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Hostel
# ---------------------------------------------------------------------------

class Hostel(models.Model):
    GENDER_CHOICES = [
        ("boys", "Boys Hostel"),
        ("girls", "Girls Hostel"),
        ("coed", "Co-Ed Hostel"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    gender_type = models.CharField(max_length=20, choices=GENDER_CHOICES, default="boys")
    address = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["name"]
        verbose_name = "Hostel"
        verbose_name_plural = "Hostels"

    def __str__(self):
        return f"{self.name} ({self.code})"


# ---------------------------------------------------------------------------
# Block
# ---------------------------------------------------------------------------

class Block(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name="blocks")
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        unique_together = ("hostel", "code")
        verbose_name = "Block"
        verbose_name_plural = "Blocks"

    def __str__(self):
        return f"{self.hostel.name} - Block {self.name}"


# ---------------------------------------------------------------------------
# Floor
# ---------------------------------------------------------------------------

class Floor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name="floors")
    floor_number = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["floor_number"]
        unique_together = ("block", "floor_number")
        verbose_name = "Floor"
        verbose_name_plural = "Floors"

    def __str__(self):
        return f"{self.block} - Floor {self.floor_number}"


# ---------------------------------------------------------------------------
# Room
# ---------------------------------------------------------------------------

class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ("single", "Single Bed"),
        ("double", "Double Sharing"),
        ("triple", "Triple Sharing"),
        ("dormitory", "Dormitory"),
    ]

    STATUS_CHOICES = [
        ("available", "Available"),
        ("full", "Full"),
        ("maintenance", "Under Maintenance"),
        ("inactive", "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name="rooms")
    room_number = models.CharField(max_length=50)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES, default="double")
    capacity = models.PositiveIntegerField(default=2)
    occupied_beds = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["room_number"]
        unique_together = ("floor", "room_number")
        verbose_name = "Room"
        verbose_name_plural = "Rooms"

    def __str__(self):
        return f"Room {self.room_number} ({self.floor})"


# ---------------------------------------------------------------------------
# Bed
# ---------------------------------------------------------------------------

class Bed(models.Model):
    STATUS_CHOICES = [
        ("vacant", "Vacant"),
        ("allocated", "Allocated"),
        ("maintenance", "Maintenance"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="beds")
    bed_number = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="vacant", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["bed_number"]
        unique_together = ("room", "bed_number")
        verbose_name = "Bed"
        verbose_name_plural = "Beds"

    def __str__(self):
        return f"{self.room.room_number} - Bed {self.bed_number} ({self.status})"


# ---------------------------------------------------------------------------
# Warden
# ---------------------------------------------------------------------------

class Warden(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="warden_assignments")
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name="wardens")
    contact_number = models.CharField(max_length=20, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["hostel__name"]
        verbose_name = "Warden"
        verbose_name_plural = "Wardens"

    def __str__(self):
        return f"Warden {self.employee.profile.user.get_full_name()} -> {self.hostel.name}"


# ---------------------------------------------------------------------------
# Hostel Allocation
# ---------------------------------------------------------------------------

class HostelAllocation(models.Model):
    STATUS_CHOICES = [
        ("allocated", "Allocated"),
        ("checked_in", "Checked In"),
        ("checked_out", "Checked Out"),
        ("transferred", "Transferred"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="hostel_allocations")
    bed = models.ForeignKey(Bed, on_delete=models.PROTECT, related_name="allocations")
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name="hostel_allocations")

    check_in_date = models.DateField(null=True, blank=True)
    check_out_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="allocated", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Hostel Allocation"
        verbose_name_plural = "Hostel Allocations"

    def __str__(self):
        return f"Allocation: {self.student.student_id} -> {self.bed} ({self.status})"


# ---------------------------------------------------------------------------
# Visitor Register
# ---------------------------------------------------------------------------

class Visitor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="hostel_visitors")
    visitor_name = models.CharField(max_length=150)
    relation = models.CharField(max_length=100)
    mobile = models.CharField(max_length=20)
    visit_date = models.DateField()
    check_in_time = models.DateTimeField()
    check_out_time = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-visit_date", "-check_in_time"]
        verbose_name = "Visitor Entry"
        verbose_name_plural = "Visitor Register"

    def __str__(self):
        return f"Visitor {self.visitor_name} for {self.student.student_id} on {self.visit_date}"


# ---------------------------------------------------------------------------
# Maintenance Request
# ---------------------------------------------------------------------------

class MaintenanceRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="maintenance_requests")
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)

    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="maintenance_assignments")
    completed_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Maintenance Request"
        verbose_name_plural = "Maintenance Requests"

    def __str__(self):
        return f"Maintenance: {self.title} (Room {self.room.room_number}) [{self.status}]"


# ---------------------------------------------------------------------------
# Audit Log
# ---------------------------------------------------------------------------

class HostelAuditLog(models.Model):
    EVENT_CHOICES = [
        ("hostel_created", "Hostel Created"),
        ("room_allocated", "Room Allocated"),
        ("room_transferred", "Room Transferred"),
        ("check_in", "Check In"),
        ("check_out", "Check Out"),
        ("visitor_entry", "Visitor Entry"),
        ("maintenance_request", "Maintenance Request"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hostel = models.ForeignKey(Hostel, on_delete=models.SET_NULL, null=True, blank=True)
    allocation = models.ForeignKey(HostelAllocation, on_delete=models.SET_NULL, null=True, blank=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Hostel Audit Log"
        verbose_name_plural = "Hostel Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description[:60]}"
