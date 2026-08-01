import uuid

from apps.academics.models import AcademicSession, Program, Semester, Subject
from apps.staff.models import Employee
from apps.students.models import Student
from apps.timetable.models import Classroom
from django.conf import settings
from django.db import models


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Exam Type
# ---------------------------------------------------------------------------


class ExamType(models.Model):
    CATEGORY_CHOICES = [
        ("internal", "Internal Exam"),
        ("external", "External Exam"),
        ("practical", "Practical Exam"),
        ("viva", "Viva"),
        ("unit_test", "Unit Test"),
        ("assignment", "Assignment"),
        ("mid_semester", "Mid Semester"),
        ("end_semester", "End Semester"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="mid_semester")
    is_internal = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Exam Type"
        verbose_name_plural = "Exam Types"

    def __str__(self):
        return f"{self.name} ({self.code})"


# ---------------------------------------------------------------------------
# Exam
# ---------------------------------------------------------------------------


class Exam(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("scheduled", "Scheduled"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name="exams")
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="exams")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="exams")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="exams")
    exam_type = models.ForeignKey(ExamType, on_delete=models.PROTECT, related_name="exams")

    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled", db_index=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-start_date", "subject__code"]
        verbose_name = "Exam"
        verbose_name_plural = "Exams"

    def __str__(self):
        return f"{self.exam_type.name} - {self.subject.code} ({self.academic_session.name})"


# ---------------------------------------------------------------------------
# Exam Schedule
# ---------------------------------------------------------------------------


class ExamSchedule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="schedules")
    date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="exam_schedules")
    invigilator = models.ForeignKey(
        Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="invigilated_schedules"
    )
    capacity = models.PositiveIntegerField(default=60)
    is_locked = models.BooleanField(default=False, db_index=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["date", "start_time"]
        verbose_name = "Exam Schedule"
        verbose_name_plural = "Exam Schedules"

    def __str__(self):
        return f"{self.exam.subject.code} Exam on {self.date} ({self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')})"


# ---------------------------------------------------------------------------
# Hall Ticket
# ---------------------------------------------------------------------------


class HallTicket(models.Model):
    STATUS_CHOICES = [
        ("issued", "Issued"),
        ("verified", "Verified"),
        ("revoked", "Revoked"),
        ("blocked", "Blocked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="hall_tickets")
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="hall_tickets")
    hall_ticket_number = models.CharField(max_length=100, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="issued", db_index=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("student", "exam")
        ordering = ["-generated_at"]
        verbose_name = "Hall Ticket"
        verbose_name_plural = "Hall Tickets"

    def __str__(self):
        return f"HallTicket {self.hall_ticket_number} - {self.student.student_id}"


# ---------------------------------------------------------------------------
# Exam Attendance
# ---------------------------------------------------------------------------


class ExamAttendance(models.Model):
    STATUS_CHOICES = [
        ("present", "Present"),
        ("absent", "Absent"),
        ("malpractice", "Malpractice"),
        ("excused", "Excused"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="exam_attendances")
    exam_schedule = models.ForeignKey(ExamSchedule, on_delete=models.CASCADE, related_name="attendances")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="present", db_index=True)
    check_in_time = models.DateTimeField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("exam_schedule", "student")
        ordering = ["student__roll_number"]
        verbose_name = "Exam Attendance"
        verbose_name_plural = "Exam Attendances"

    def __str__(self):
        return f"Exam Att: {self.student.student_id} - {self.get_status_display()} ({self.exam_schedule.date})"


# ---------------------------------------------------------------------------
# Invigilator Assignment
# ---------------------------------------------------------------------------


class InvigilatorAssignment(models.Model):
    DUTY_STATUS_CHOICES = [
        ("assigned", "Assigned"),
        ("confirmed", "Confirmed"),
        ("substituted", "Substituted"),
        ("completed", "Completed"),
        ("absent", "Absent"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    faculty = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="invigilator_duties")
    exam_schedule = models.ForeignKey(ExamSchedule, on_delete=models.CASCADE, related_name="invigilators")
    duty_status = models.CharField(max_length=20, choices=DUTY_STATUS_CHOICES, default="assigned", db_index=True)
    remarks = models.CharField(max_length=255, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("exam_schedule", "faculty")
        ordering = ["exam_schedule__date", "faculty"]
        verbose_name = "Invigilator Assignment"
        verbose_name_plural = "Invigilator Assignments"

    def __str__(self):
        return f"Invigilator {self.faculty.employee_id} for {self.exam_schedule}"


# ---------------------------------------------------------------------------
# Exam Audit Log
# ---------------------------------------------------------------------------


class ExamAuditLog(models.Model):
    EVENT_CHOICES = [
        ("exam_created", "Exam Created"),
        ("schedule_updated", "Schedule Updated"),
        ("hall_ticket_generated", "Hall Ticket Generated"),
        ("attendance_marked", "Attendance Marked"),
        ("invigilator_assigned", "Invigilator Assigned"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Exam Audit Log"
        verbose_name_plural = "Exam Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description} at {self.timestamp}"
