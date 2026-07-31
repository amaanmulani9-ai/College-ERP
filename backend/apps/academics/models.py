import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class Faculty(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, db_index=True)
    description = models.TextField(blank=True, default="")
    dean = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="managed_faculties")
    
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name = "Faculty / School"
        verbose_name_plural = "Faculties & Schools"

    def __str__(self):
        return f"{self.name} ({self.code})"

    def soft_delete(self):
        if self.departments.filter(is_deleted=False).exists():
            raise ValidationError("Cannot delete faculty with active child departments.")
        self.is_deleted = True
        self.save()


class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, db_index=True)
    description = models.TextField(blank=True, default="")
    hod = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="headed_departments")
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=30, blank=True, default="")

    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return f"{self.name} [{self.code}]"

    def soft_delete(self):
        if self.programs.filter(is_deleted=False).exists():
            raise ValidationError("Cannot delete department with active child programs.")
        self.is_deleted = True
        self.save()


class Program(models.Model):
    DEGREE_LEVEL_CHOICES = [
        ("UG", "Undergraduate (UG)"),
        ("PG", "Postgraduate (PG)"),
        ("Diploma", "Diploma"),
        ("Doctorate", "Doctorate (Ph.D)"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="programs")
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, db_index=True)
    degree_level = models.CharField(max_length=20, choices=DEGREE_LEVEL_CHOICES, default="UG")
    duration_years = models.IntegerField(default=3)
    total_credits = models.IntegerField(default=120)

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["name"]
        verbose_name = "Academic Program"
        verbose_name_plural = "Academic Programs"

    def __str__(self):
        return f"{self.name} ({self.code})"

    def soft_delete(self):
        if self.semesters.filter(is_deleted=False).exists():
            raise ValidationError("Cannot delete program with active child semesters.")
        self.is_deleted = True
        self.save()


class AcademicSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)  # e.g., "2025–2026"
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    is_current = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Academic Session"
        verbose_name_plural = "Academic Sessions"

    def __str__(self):
        return f"{self.name} {'(Current)' if self.is_current else ''}"

    def save(self, *args, **kwargs):
        if self.is_current:
            AcademicSession.objects.filter(is_current=True).exclude(id=self.id).update(is_current=False)
        super().save(*args, **kwargs)


class Semester(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="semesters")
    semester_number = models.IntegerField()
    name = models.CharField(max_length=100)  # e.g., "Semester 1"
    credits = models.IntegerField(default=20)
    
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("program", "semester_number")
        ordering = ["program", "semester_number"]
        verbose_name = "Semester"
        verbose_name_plural = "Semesters"

    def __str__(self):
        return f"{self.program.code} - {self.name}"


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, db_index=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="subjects")
    credits = models.IntegerField(default=4)
    theory_hours = models.IntegerField(default=3)
    practical_hours = models.IntegerField(default=2)
    internal_marks = models.IntegerField(default=40)
    external_marks = models.IntegerField(default=60)
    passing_marks = models.IntegerField(default=40)
    is_elective = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["code"]
        verbose_name = "Subject"
        verbose_name_plural = "Subjects"

    def __str__(self):
        return f"[{self.code}] {self.name}"


class SubjectOffering(models.Model):
    STATUS_CHOICES = [
        ("offered", "Offered"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="offerings")
    session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name="offerings")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="offerings")
    capacity = models.IntegerField(default=60)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="offered")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-session__start_date", "subject__code"]
        verbose_name = "Subject Offering"
        verbose_name_plural = "Subject Offerings"

    def __str__(self):
        return f"{self.subject.code} ({self.session.name}) - Cap: {self.capacity}"
