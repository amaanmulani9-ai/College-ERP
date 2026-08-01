import uuid

from apps.academics.models import AcademicSession, Program, Semester, Subject
from apps.staff.models import Employee
from django.conf import settings
from django.db import models


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Building
# ---------------------------------------------------------------------------


class Building(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=30, unique=True, db_index=True)
    address = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["name"]
        verbose_name = "Building"
        verbose_name_plural = "Buildings"

    def __str__(self):
        return f"{self.name} ({self.code})"


# ---------------------------------------------------------------------------
# Classroom
# ---------------------------------------------------------------------------


class Classroom(models.Model):
    ROOM_TYPE_CHOICES = [
        ("classroom", "Classroom"),
        ("laboratory", "Laboratory"),
        ("seminar_hall", "Seminar Hall"),
        ("auditorium", "Auditorium"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name="classrooms")
    room_number = models.CharField(max_length=30, db_index=True)
    capacity = models.PositiveIntegerField(default=60)
    floor = models.IntegerField(default=1)
    room_type = models.CharField(max_length=30, choices=ROOM_TYPE_CHOICES, default="classroom")
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("building", "room_number")
        ordering = ["building", "room_number"]
        verbose_name = "Classroom"
        verbose_name_plural = "Classrooms"

    def __str__(self):
        return f"{self.building.code}-{self.room_number} ({self.get_room_type_display()})"


# ---------------------------------------------------------------------------
# TimeSlot
# ---------------------------------------------------------------------------


class TimeSlot(models.Model):
    DAY_CHOICES = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    day = models.CharField(max_length=15, choices=DAY_CHOICES, db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    period_number = models.PositiveIntegerField()
    break_after = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["period_number", "start_time"]
        verbose_name = "Time Slot"
        verbose_name_plural = "Time Slots"

    def __str__(self):
        return f"{self.day} Period {self.period_number} ({self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')})"


# ---------------------------------------------------------------------------
# Timetable
# ---------------------------------------------------------------------------


class Timetable(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("draft", "Draft"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name="timetables")
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="timetables")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="timetables")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="timetables")
    faculty = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="timetables")
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="timetables")
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name="timetables")

    batch = models.CharField(max_length=50, default="all", help_text="e.g. all, Batch-A, Batch-B")
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["time_slot__period_number", "created_at"]
        verbose_name = "Timetable Entry"
        verbose_name_plural = "Timetable Entries"

    def __str__(self):
        return (
            f"{self.program.code} S{self.semester.semester_number} | "
            f"{self.subject.code} - {self.faculty.profile.get_full_name()} | "
            f"{self.classroom} @ {self.time_slot}"
        )


# ---------------------------------------------------------------------------
# Timetable Audit Log
# ---------------------------------------------------------------------------


class TimetableAuditLog(models.Model):
    EVENT_CHOICES = [
        ("created", "Created"),
        ("updated", "Updated"),
        ("deleted", "Deleted"),
        ("conflict_detected", "Conflict Detected"),
        ("room_changed", "Room Changed"),
        ("faculty_changed", "Faculty Changed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timetable = models.ForeignKey(
        Timetable, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs"
    )
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Timetable Audit Log"
        verbose_name_plural = "Timetable Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description} at {self.timestamp}"
