import uuid

from django.conf import settings
from django.db import models

from apps.academics.models import Subject
from apps.staff.models import Employee
from apps.students.models import Student
from apps.timetable.models import Classroom, Timetable


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Attendance Session
# ---------------------------------------------------------------------------

class AttendanceSession(models.Model):
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("locked", "Locked"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timetable = models.ForeignKey(Timetable, on_delete=models.SET_NULL, null=True, blank=True, related_name="attendance_sessions")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="attendance_sessions")
    faculty = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="conducted_sessions")
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True, blank=True, related_name="attendance_sessions")

    date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="completed", db_index=True)
    
    qr_token = models.CharField(max_length=128, blank=True, default="")
    is_locked = models.BooleanField(default=False, db_index=True)
    
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-date", "-start_time"]
        verbose_name = "Attendance Session"
        verbose_name_plural = "Attendance Sessions"

    def __str__(self):
        return f"{self.subject.code} Session on {self.date} ({self.start_time.strftime('%H:%M')})"


# ---------------------------------------------------------------------------
# Student Attendance
# ---------------------------------------------------------------------------

class StudentAttendance(models.Model):
    STATUS_CHOICES = [
        ("present", "Present"),
        ("absent", "Absent"),
        ("late", "Late"),
        ("half_day", "Half Day"),
        ("excused", "Excused"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name="student_attendances")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendances")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="present", db_index=True)
    
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True, default="")

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("session", "student")
        ordering = ["student__roll_number", "created_at"]
        verbose_name = "Student Attendance Record"
        verbose_name_plural = "Student Attendance Records"

    def __str__(self):
        return f"{self.student.student_id} - {self.get_status_display()} ({self.session.date})"


# ---------------------------------------------------------------------------
# Faculty Attendance
# ---------------------------------------------------------------------------

class FacultyAttendance(models.Model):
    STATUS_CHOICES = [
        ("present", "Present"),
        ("absent", "Absent"),
        ("late", "Late"),
        ("half_day", "Half Day"),
        ("on_leave", "On Leave"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    faculty = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="faculty_attendances")
    date = models.DateField(db_index=True)
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="present", db_index=True)
    remarks = models.CharField(max_length=255, blank=True, default="")

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("faculty", "date")
        ordering = ["-date", "faculty"]
        verbose_name = "Faculty Attendance Record"
        verbose_name_plural = "Faculty Attendance Records"

    def __str__(self):
        return f"{self.faculty.employee_id} - {self.get_status_display()} on {self.date}"


# ---------------------------------------------------------------------------
# Attendance Audit Log
# ---------------------------------------------------------------------------

class AttendanceAuditLog(models.Model):
    EVENT_CHOICES = [
        ("created", "Session Created"),
        ("updated", "Attendance Updated"),
        ("locked", "Session Locked"),
        ("deleted", "Attendance Deleted"),
        ("bulk_marked", "Bulk Marked"),
        ("faculty_marked", "Faculty Marked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(AttendanceSession, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Attendance Audit Log"
        verbose_name_plural = "Attendance Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description} at {self.timestamp}"
