"""
Scholarship Management Models
=============================
ScholarshipType        – Catalog of available scholarships (Government, Private, Merit, etc.)
Scholarship            – Active/Historical scholarship assigned to a student
ScholarshipApplication – Student application & approval workflow
ScholarshipRenewal     – Annual renewal for multi-year scholarships
ScholarshipAuditLog    – Immutable audit trail of scholarship events
"""

import uuid

from apps.academics.models import AcademicSession
from apps.students.models import Student
from django.conf import settings
from django.db import models

# ---------------------------------------------------------------------------
# Scholarship Type (Catalog)
# ---------------------------------------------------------------------------


class ScholarshipType(models.Model):
    PROVIDER_CHOICES = [
        ("government", "Government"),
        ("private", "Private Institution / Trust"),
        ("merit", "Merit Based"),
        ("sports", "Sports Excellence"),
        ("minority", "Minority Welfare"),
        ("need_based", "Financial Need Based"),
        ("fee_waiver", "Institutional Fee Waiver"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    provider = models.CharField(max_length=30, choices=PROVIDER_CHOICES, default="merit")
    description = models.TextField(blank=True, default="")
    min_cgpa_requirement = models.FloatField(default=0.0, help_text="Minimum CGPA required for eligibility")
    max_family_income = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True, help_text="Income cap for need-based scholarships"
    )
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Scholarship Type"
        verbose_name_plural = "Scholarship Types"

    def __str__(self):
        return f"{self.name} ({self.get_provider_display()})"


# ---------------------------------------------------------------------------
# Scholarship (Active / Granted Award)
# ---------------------------------------------------------------------------


class Scholarship(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("expired", "Expired"),
        ("revoked", "Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="scholarships")
    scholarship_type = models.ForeignKey(ScholarshipType, on_delete=models.PROTECT, related_name="scholarships")
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.PROTECT, related_name="scholarships")

    amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00, help_text="Flat scholarship amount in INR"
    )
    percentage = models.FloatField(default=0.0, help_text="Percentage discount (0-100%) if percentage-based")

    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Scholarship"
        verbose_name_plural = "Scholarships"
        unique_together = ("student", "scholarship_type", "academic_session")

    def __str__(self):
        return f"{self.student.student_id} — {self.scholarship_type.name} ({self.academic_session.name})"


# ---------------------------------------------------------------------------
# Scholarship Application
# ---------------------------------------------------------------------------


class ScholarshipApplication(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("under_review", "Under Review"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="scholarship_applications")
    scholarship_type = models.ForeignKey(ScholarshipType, on_delete=models.PROTECT, related_name="applications")
    academic_session = models.ForeignKey(
        AcademicSession, on_delete=models.PROTECT, related_name="scholarship_applications"
    )

    requested_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    family_annual_income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    current_cgpa = models.FloatField(default=0.0)
    documents = models.JSONField(default=dict, blank=True, help_text="Uploaded verification document metadata")
    statement_of_purpose = models.TextField(blank=True, default="")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="submitted", db_index=True)
    rejection_reason = models.CharField(max_length=500, blank=True, default="")

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_scholarship_apps",
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Scholarship Application"
        verbose_name_plural = "Scholarship Applications"
        unique_together = ("student", "scholarship_type", "academic_session")

    def __str__(self):
        return f"App #{str(self.id)[:8]} | {self.student.student_id} | {self.scholarship_type.code} | {self.status}"


# ---------------------------------------------------------------------------
# Scholarship Renewal
# ---------------------------------------------------------------------------


class ScholarshipRenewal(models.Model):
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE, related_name="renewals")
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.PROTECT, related_name="scholarship_renewals")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")
    remarks = models.TextField(blank=True, default="")
    processed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Scholarship Renewal"
        verbose_name_plural = "Scholarship Renewals"

    def __str__(self):
        return f"Renewal for {self.scholarship} -> {self.academic_session.name} ({self.status})"


# ---------------------------------------------------------------------------
# Scholarship Audit Log
# ---------------------------------------------------------------------------


class ScholarshipAuditLog(models.Model):
    EVENT_CHOICES = [
        ("application_submitted", "Application Submitted"),
        ("application_approved", "Application Approved"),
        ("application_rejected", "Application Rejected"),
        ("scholarship_applied", "Scholarship Applied to Fee"),
        ("scholarship_renewed", "Scholarship Renewed"),
        ("scholarship_revoked", "Scholarship Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="scholarship_audit_logs")
    scholarship = models.ForeignKey(Scholarship, on_delete=models.SET_NULL, null=True, blank=True)
    application = models.ForeignKey(ScholarshipApplication, on_delete=models.SET_NULL, null=True, blank=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Scholarship Audit Log"
        verbose_name_plural = "Scholarship Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description[:60]} at {self.timestamp}"
