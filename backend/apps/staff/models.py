import uuid

from apps.academics.models import Department
from apps.profiles.models import UserProfile
from django.conf import settings
from django.db import models


class EmployeeSoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class Designation(models.Model):
    CATEGORY_CHOICES = [
        ("teaching", "Teaching Staff"),
        ("non_teaching", "Non-Teaching Staff"),
        ("administration", "Administration"),
        ("finance", "Finance"),
        ("library", "Library"),
        ("it_support", "IT Support"),
        ("hostel", "Hostel"),
        ("transport", "Transport"),
        ("security", "Security"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="designations"
    )
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="teaching")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Designation"
        verbose_name_plural = "Designations"

    def __str__(self):
        return f"{self.name} ({self.code})"


class Employee(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ("full_time", "Full-Time"),
        ("part_time", "Part-Time"),
        ("contract", "Contract"),
        ("visiting", "Visiting Faculty"),
        ("adjunct", "Adjunct Faculty"),
        ("temporary", "Temporary"),
        ("internship", "Internship"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("on_leave", "On Leave"),
        ("suspended", "Suspended"),
        ("resigned", "Resigned"),
        ("retired", "Retired"),
        ("terminated", "Terminated"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee_id = models.CharField(max_length=50, unique=True, db_index=True)
    employee_number = models.CharField(max_length=50, unique=True, db_index=True)

    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="employee_profile")
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="employees")
    designation = models.ForeignKey(Designation, on_delete=models.PROTECT, related_name="employees")

    employment_type = models.CharField(max_length=30, choices=EMPLOYMENT_TYPE_CHOICES, default="full_time")
    joining_date = models.DateField()
    probation_end_date = models.DateField(blank=True, null=True)
    employment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)

    reporting_manager = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="subordinates"
    )
    qualification = models.CharField(max_length=200, blank=True, default="")
    experience_years = models.DecimalField(max_digits=4, decimal_places=1, default=0.0)
    salary_grade = models.CharField(max_length=50, blank=True, default="")

    office_location = models.CharField(max_length=150, blank=True, default="")
    work_email = models.EmailField(blank=True, default="")
    extension_number = models.CharField(max_length=30, blank=True, default="")

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = EmployeeSoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Employee"
        verbose_name_plural = "Employees"

    def __str__(self):
        return f"{self.employee_id} - {self.profile.get_full_name()} ({self.designation.name})"


class EmployeeStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="status_history")
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(blank=True, default="")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Employee Status History"
        verbose_name_plural = "Employee Status Histories"

    def __str__(self):
        return f"{self.employee.employee_id}: {self.previous_status} -> {self.new_status} at {self.timestamp}"
