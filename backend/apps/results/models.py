import uuid

from apps.academics.models import Program, Semester, Subject
from apps.examinations.models import Exam
from apps.students.models import Student
from django.conf import settings
from django.db import models


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Result Scheme
# ---------------------------------------------------------------------------


class ResultScheme(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="result_schemes")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="result_schemes")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="result_schemes")

    max_internal = models.IntegerField(default=40)
    max_external = models.IntegerField(default=60)
    max_practical = models.IntegerField(default=0)
    max_viva = models.IntegerField(default=0)
    max_assignment = models.IntegerField(default=0)
    passing_marks = models.IntegerField(default=40)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("program", "semester", "subject")
        ordering = ["program", "semester", "subject"]
        verbose_name = "Result Scheme"
        verbose_name_plural = "Result Schemes"

    def __str__(self):
        return f"Scheme: {self.subject.code} ({self.program.code} S{self.semester.semester_number})"


# ---------------------------------------------------------------------------
# Student Result
# ---------------------------------------------------------------------------


class StudentResult(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("verified", "Verified"),
        ("published", "Published"),
        ("withheld", "Withheld"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="subject_results")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="student_results")
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_results")

    internal_marks = models.FloatField(default=0.0)
    external_marks = models.FloatField(default=0.0)
    practical_marks = models.FloatField(default=0.0)
    viva_marks = models.FloatField(default=0.0)
    assignment_marks = models.FloatField(default=0.0)
    grace_marks = models.FloatField(default=0.0)

    total_marks = models.FloatField(default=0.0)
    grade = models.CharField(max_length=5, default="F", db_index=True)
    grade_point = models.FloatField(default=0.0)
    credit_point = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", db_index=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("student", "subject", "exam")
        ordering = ["student__roll_number", "subject__code"]
        verbose_name = "Student Subject Result"
        verbose_name_plural = "Student Subject Results"

    def __str__(self):
        return f"{self.student.student_id} - {self.subject.code}: Grade {self.grade} ({self.total_marks} marks)"


# ---------------------------------------------------------------------------
# Semester Result
# ---------------------------------------------------------------------------


class SemesterResult(models.Model):
    STATUS_CHOICES = [
        ("pass", "Pass"),
        ("fail", "Fail"),
        ("promoted", "Promoted"),
        ("withheld", "Withheld"),
        ("draft", "Draft"),
        ("published", "Published"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="semester_results")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="semester_results")

    sgpa = models.FloatField(default=0.0, db_index=True)
    cgpa = models.FloatField(default=0.0, db_index=True)
    credits_earned = models.IntegerField(default=0)
    total_credits = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)

    result_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", db_index=True)
    is_published = models.BooleanField(default=False, db_index=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("student", "semester")
        ordering = ["semester", "rank", "-sgpa"]
        verbose_name = "Semester Result"
        verbose_name_plural = "Semester Results"

    def __str__(self):
        return f"{self.student.student_id} - {self.semester.name}: SGPA {self.sgpa} (CGPA {self.cgpa})"


# ---------------------------------------------------------------------------
# Result Audit Log
# ---------------------------------------------------------------------------


class ResultAuditLog(models.Model):
    EVENT_CHOICES = [
        ("marks_entered", "Marks Entered"),
        ("marks_updated", "Marks Updated"),
        ("marks_verified", "Marks Verified"),
        ("results_published", "Results Published"),
        ("result_corrected", "Result Corrected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_result = models.ForeignKey(
        StudentResult, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs"
    )
    semester_result = models.ForeignKey(
        SemesterResult, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs"
    )
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Result Audit Log"
        verbose_name_plural = "Result Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description} at {self.timestamp}"
