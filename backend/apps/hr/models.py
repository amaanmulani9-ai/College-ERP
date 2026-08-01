"""
Human Resource Management System Models
======================================
Core HR models covering Departments, Designations, Employment Types, Leave,
Recruitment, Onboarding, Performance, Training, Promotions, Transfers, Exits,
Disciplinary Actions, Announcements, and Audit Logs.
"""

import uuid
from django.conf import settings
from django.db import models
from apps.staff.models import Employee


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Department & Designation & Employment Types
# ---------------------------------------------------------------------------
class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department_code = models.CharField(max_length=50, unique=True, db_index=True)
    department_name = models.CharField(max_length=150)
    head_of_department = models.ForeignKey(
        Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="managed_hr_departments"
    )
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, default="active", db_index=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["department_code"]
        verbose_name = "HR Department"
        verbose_name_plural = "HR Departments"

    def __str__(self):
        return f"{self.department_name} ({self.department_code})"


class Designation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=150)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="designations")
    grade = models.CharField(max_length=50, default="L1")
    hierarchy_level = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["hierarchy_level", "title"]
        verbose_name = "HR Designation"
        verbose_name_plural = "HR Designations"

    def __str__(self):
        return f"{self.title} - {self.department.department_name}"


class EmploymentType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True) # Permanent, Contract, Visiting, Adjunct, Intern
    description = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Employment Type"
        verbose_name_plural = "Employment Types"

    def __str__(self):
        return self.name


# ---------------------------------------------------------------------------
# Leave & Shift Management
# ---------------------------------------------------------------------------
class LeaveType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True) # Annual, Sick, Casual, Maternity, Paternity, Study, Special
    max_days_per_year = models.PositiveIntegerField(default=12)
    is_encashable = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Leave Type"
        verbose_name_plural = "Leave Types"

    def __str__(self):
        return f"{self.name} ({self.max_days_per_year} days/yr)"


class LeaveBalance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_leave_balances")
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    total_allocated = models.PositiveIntegerField(default=12)
    used = models.PositiveIntegerField(default=0)
    remaining = models.PositiveIntegerField(default=12)

    class Meta:
        unique_together = ("employee", "leave_type")

    def __str__(self):
        return f"Balance: {self.employee.employee_id} - {self.leave_type.name}: {self.remaining} left"


class LeaveRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_leave_requests")
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Leave: {self.employee.employee_id} ({self.start_date} to {self.end_date}) [{self.status}]"


class HolidayCalendar(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    holiday_name = models.CharField(max_length=150)
    date = models.DateField()
    academic_year = models.CharField(max_length=20, default="2026-2027")
    holiday_type = models.CharField(max_length=50, default="National")

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.holiday_name} ({self.date})"


class Shift(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shift_name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    grace_time_mins = models.PositiveIntegerField(default=15)

    def __str__(self):
        return f"{self.shift_name} ({self.start_time} - {self.end_time})"


class EmployeeShiftAssignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="shift_assignments")
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE)
    effective_date = models.DateField()

    def __str__(self):
        return f"{self.employee.employee_id} -> {self.shift.shift_name}"


class AttendancePolicy(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy_name = models.CharField(max_length=100, default="Standard Institutional Policy")
    late_threshold_mins = models.PositiveIntegerField(default=15)
    half_day_threshold_hours = models.DecimalField(max_digits=4, decimal_places=2, default=4.00)
    overtime_eligible = models.BooleanField(default=True)

    def __str__(self):
        return self.policy_name


# ---------------------------------------------------------------------------
# Recruitment & Onboarding
# ---------------------------------------------------------------------------
class RecruitmentJob(models.Model):
    STATUS_CHOICES = [("open", "Open"), ("closed", "Closed"), ("on_hold", "On Hold")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=150)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open", db_index=True)
    posted_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Job: {self.title} ({self.department.department_name})"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("shortlisted", "Shortlisted"),
        ("rejected", "Rejected"),
        ("hired", "Hired"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(RecruitmentJob, on_delete=models.CASCADE, related_name="applications")
    candidate_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="applied", db_index=True)
    applied_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate_name} -> {self.job.title} [{self.status}]"


class Interview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name="interviews")
    interviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    scheduled_time = models.DateTimeField()
    feedback = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, default="scheduled")

    def __str__(self):
        return f"Interview: {self.application.candidate_name} @ {self.scheduled_time}"


class OfferLetter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    candidate_name = models.CharField(max_length=150)
    email = models.EmailField()
    offer_date = models.DateField(auto_now_add=True)
    joining_date = models.DateField()
    offered_salary = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default="issued") # issued, accepted, declined

    def __str__(self):
        return f"Offer: {self.candidate_name} - ₹{self.offered_salary}"


class EmployeeOnboarding(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name="hr_onboarding")
    checklist = models.JSONField(default=dict, blank=True)
    documents_submitted = models.BooleanField(default=False)
    account_created = models.BooleanField(default=True)
    orientation_completed = models.BooleanField(default=False)
    completion_status = models.CharField(max_length=20, default="in_progress") # in_progress, completed

    def __str__(self):
        return f"Onboarding: {self.employee.employee_id} [{self.completion_status}]"


class EmployeeDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_documents")
    document_type = models.CharField(max_length=100) # Degree, Aadhar, Passport, Background Check
    file_url = models.CharField(max_length=255, blank=True, default="")
    expiry_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Doc: {self.document_type} - {self.employee.employee_id}"


# ---------------------------------------------------------------------------
# Performance, Training & Career Progression
# ---------------------------------------------------------------------------
class PerformanceReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_performance_reviews")
    reviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name="conducted_reviews")
    review_cycle = models.CharField(max_length=50) # e.g. Annual 2026
    rating = models.DecimalField(max_digits=3, decimal_places=1) # 1.0 - 5.0
    remarks = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review: {self.employee.employee_id} ({self.review_cycle}) Rating: {self.rating}"


class PerformanceGoal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_performance_goals")
    goal_title = models.CharField(max_length=200)
    target_date = models.DateField()
    status = models.CharField(max_length=20, default="in_progress") # in_progress, achieved, missed

    def __str__(self):
        return f"Goal: {self.goal_title} ({self.employee.employee_id})"


class TrainingProgram(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program_name = models.CharField(max_length=150)
    trainer = models.CharField(max_length=100)
    duration_days = models.PositiveIntegerField(default=1)
    venue = models.CharField(max_length=150, default="Main Auditorium / Online")

    def __str__(self):
        return f"Training: {self.program_name}"


class TrainingEnrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_trainings")
    program = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE)
    attendance = models.BooleanField(default=True)
    certificate_url = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        unique_together = ("employee", "program")

    def __str__(self):
        return f"Training Enrollment: {self.employee.employee_id} in {self.program.program_name}"


class Promotion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_promotions")
    old_designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, blank=True, related_name="promotions_from")
    new_designation = models.ForeignKey(Designation, on_delete=models.PROTECT, related_name="promotions_to")
    effective_date = models.DateField()
    reason = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Promotion: {self.employee.employee_id} -> {self.new_designation.title}"


class Transfer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_transfers")
    old_department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="transfers_from")
    new_department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="transfers_to")
    reason = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Transfer: {self.employee.employee_id} -> {self.new_department.department_name}"


# ---------------------------------------------------------------------------
# Exit, Disciplinary & Announcements & Audit Log
# ---------------------------------------------------------------------------
class Resignation(models.Model):
    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_resignations")
    notice_date = models.DateField()
    last_working_day = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="submitted", db_index=True)

    def __str__(self):
        return f"Resignation: {self.employee.employee_id} [{self.status}]"


class ExitInterview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name="hr_exit_interview")
    feedback = models.TextField()
    hr_notes = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Exit Interview: {self.employee.employee_id}"


class DisciplinaryAction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="hr_disciplinary_actions")
    category = models.CharField(max_length=100) # Misconduct, Attendance, Compliance
    reason = models.TextField()
    action_taken = models.CharField(max_length=150) # Warning Letter, Suspension, Inquiry
    status = models.CharField(max_length=20, default="open")

    def __str__(self):
        return f"Disciplinary: {self.employee.employee_id} - {self.category}"


class HRAnnouncement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    message = models.TextField()
    target_audience = models.CharField(max_length=100, default="All Staff")
    publish_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"HR Announcement: {self.title}"


class HRAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"[{self.timestamp}] HR Action: {self.action}"
