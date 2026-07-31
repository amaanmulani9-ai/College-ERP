import uuid
from django.db import models
from django.conf import settings
from apps.profiles.models import UserProfile
from apps.academics.models import Program, Department, Semester, AcademicSession


class StudentSoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class Student(models.Model):
    STATUS_CHOICES = [
        ("applicant", "Applicant"),
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("graduated", "Graduated"),
        ("withdrawn", "Withdrawn"),
        ("alumni", "Alumni"),
    ]

    CATEGORY_CHOICES = [
        ("General", "General"),
        ("OBC", "OBC"),
        ("SC", "SC"),
        ("ST", "ST"),
        ("International", "International"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_id = models.CharField(max_length=50, unique=True, db_index=True)
    enrollment_number = models.CharField(max_length=50, unique=True, db_index=True)
    roll_number = models.CharField(max_length=50, blank=True, default="")
    
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="student_profile")
    program = models.ForeignKey(Program, on_delete=models.PROTECT, related_name="students")
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="students")
    current_semester = models.ForeignKey(Semester, on_delete=models.PROTECT, related_name="students")
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.PROTECT, related_name="students")

    admission_date = models.DateField()
    expected_graduation_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="General")
    
    blood_group = models.CharField(max_length=5, blank=True, default="")
    nationality = models.CharField(max_length=100, blank=True, default="American")

    father_name = models.CharField(max_length=150, blank=True, default="")
    father_phone = models.CharField(max_length=30, blank=True, default="")
    mother_name = models.CharField(max_length=150, blank=True, default="")
    mother_phone = models.CharField(max_length=30, blank=True, default="")
    guardian_name = models.CharField(max_length=150, blank=True, default="")
    guardian_phone = models.CharField(max_length=30, blank=True, default="")
    emergency_contact = models.CharField(max_length=30, blank=True, default="")

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = StudentSoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Student"
        verbose_name_plural = "Students"

    def __str__(self):
        return f"{self.student_id} - {self.profile.get_full_name()}"


class StudentStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="status_history")
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(blank=True, default="")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Student Status History"
        verbose_name_plural = "Student Status Histories"

    def __str__(self):
        return f"{self.student.student_id}: {self.previous_status} -> {self.new_status} at {self.timestamp}"
