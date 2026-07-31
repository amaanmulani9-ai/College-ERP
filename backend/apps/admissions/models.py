import uuid

from django.conf import settings
from django.db import models

from apps.academics.models import AcademicSession, Department, Program, Semester
from apps.students.models import Student


# ---------------------------------------------------------------------------
# Managers
# ---------------------------------------------------------------------------

class ApplicationSoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Admission Application
# ---------------------------------------------------------------------------

class AdmissionApplication(models.Model):
    """
    Central entity for a prospective student's admission application.
    Holds applicant PII, academic intent, and workflow state.
    """

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("under_review", "Under Review"),
        ("document_verification", "Document Verification"),
        ("interview", "Interview"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("waitlisted", "Waitlisted"),
        ("enrolled", "Enrolled"),
        ("cancelled", "Cancelled"),
    ]

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer_not_to_say", "Prefer Not to Say"),
    ]

    CATEGORY_CHOICES = [
        ("General", "General"),
        ("OBC", "OBC"),
        ("SC", "SC"),
        ("ST", "ST"),
        ("EWS", "EWS"),
        ("International", "International"),
    ]

    SOURCE_CHOICES = [
        ("online_portal", "Online Portal"),
        ("walk_in", "Walk-In"),
        ("referral", "Referral"),
        ("campus_drive", "Campus Drive"),
        ("agent", "Agent"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application_number = models.CharField(max_length=30, unique=True, db_index=True)

    # Applicant PII
    first_name = models.CharField(max_length=150)
    middle_name = models.CharField(max_length=150, blank=True, default="")
    last_name = models.CharField(max_length=150)
    email = models.EmailField()
    mobile = models.CharField(max_length=30, blank=True, default="")
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default="prefer_not_to_say")
    nationality = models.CharField(max_length=100, blank=True, default="")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="General")

    # Academic intent
    academic_session = models.ForeignKey(
        AcademicSession, on_delete=models.PROTECT, related_name="admission_applications"
    )
    program = models.ForeignKey(Program, on_delete=models.PROTECT, related_name="admission_applications")
    department = models.ForeignKey(
        Department, on_delete=models.PROTECT, related_name="admission_applications"
    )

    # Previous qualification
    previous_qualification = models.CharField(max_length=255, blank=True, default="")
    percentage_cgpa = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    # Meta
    application_source = models.CharField(max_length=30, choices=SOURCE_CHOICES, default="online_portal")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="draft", db_index=True)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewing_applications",
    )

    # Guardian info (used during enrollment to create Parent)
    guardian_name = models.CharField(max_length=200, blank=True, default="")
    guardian_email = models.EmailField(blank=True, default="")
    guardian_phone = models.CharField(max_length=30, blank=True, default="")
    guardian_relationship = models.CharField(max_length=30, blank=True, default="guardian")

    # Linked student (populated after enrollment)
    enrolled_student = models.OneToOneField(
        Student, on_delete=models.SET_NULL, null=True, blank=True, related_name="admission_application"
    )

    remarks = models.TextField(blank=True, default="")
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ApplicationSoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Admission Application"
        verbose_name_plural = "Admission Applications"

    def __str__(self):
        return f"{self.application_number} — {self.first_name} {self.last_name} ({self.get_status_display()})"


# ---------------------------------------------------------------------------
# Application Status History
# ---------------------------------------------------------------------------

class ApplicationStatusHistory(models.Model):
    """Immutable log of every status transition."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        AdmissionApplication, on_delete=models.CASCADE, related_name="status_history"
    )
    previous_status = models.CharField(max_length=30)
    new_status = models.CharField(max_length=30)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    remarks = models.TextField(blank=True, default="")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Application Status History"
        verbose_name_plural = "Application Status Histories"

    def __str__(self):
        return (
            f"{self.application.application_number}: "
            f"{self.previous_status} → {self.new_status} at {self.timestamp}"
        )


# ---------------------------------------------------------------------------
# Admission Documents
# ---------------------------------------------------------------------------

class AdmissionDocument(models.Model):
    """Supporting document attached to an application."""

    DOCUMENT_TYPE_CHOICES = [
        ("aadhaar", "Aadhaar Card"),
        ("birth_certificate", "Birth Certificate"),
        ("marksheet", "Marksheet"),
        ("transfer_certificate", "Transfer Certificate"),
        ("leaving_certificate", "Leaving Certificate"),
        ("photo", "Passport Photo"),
        ("signature", "Signature"),
        ("income_certificate", "Income Certificate"),
        ("caste_certificate", "Caste Certificate"),
        ("other", "Other Document"),
    ]

    REVIEW_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        AdmissionApplication, on_delete=models.CASCADE, related_name="documents"
    )
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPE_CHOICES)
    file = models.FileField(upload_to="admission_documents/")
    original_filename = models.CharField(max_length=255, blank=True, default="")
    review_status = models.CharField(max_length=20, choices=REVIEW_STATUS_CHOICES, default="pending")
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="reviewed_admission_docs",
    )
    review_remarks = models.TextField(blank=True, default="")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Admission Document"
        verbose_name_plural = "Admission Documents"

    def __str__(self):
        return f"{self.get_document_type_display()} — {self.application.application_number}"


# ---------------------------------------------------------------------------
# Seat Matrix
# ---------------------------------------------------------------------------

class SeatMatrix(models.Model):
    """
    Defines total and occupied seats per program × session × category.
    Prevents over-enrollment.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="seat_matrices")
    academic_session = models.ForeignKey(
        AcademicSession, on_delete=models.CASCADE, related_name="seat_matrices"
    )
    category = models.CharField(
        max_length=30,
        choices=AdmissionApplication.CATEGORY_CHOICES,
        default="General",
    )
    total_seats = models.PositiveIntegerField(default=0)
    occupied_seats = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("program", "academic_session", "category")
        ordering = ["program", "category"]
        verbose_name = "Seat Matrix"
        verbose_name_plural = "Seat Matrices"

    def __str__(self):
        return (
            f"{self.program.code} | {self.academic_session.name} | "
            f"{self.category}: {self.occupied_seats}/{self.total_seats}"
        )

    @property
    def available_seats(self):
        return max(self.total_seats - self.occupied_seats, 0)


# ---------------------------------------------------------------------------
# Admission Audit Log
# ---------------------------------------------------------------------------

class AdmissionAuditLog(models.Model):
    """Fine-grained audit trail for every significant admissions action."""

    EVENT_CHOICES = [
        ("application_created", "Application Created"),
        ("status_changed", "Status Changed"),
        ("document_uploaded", "Document Uploaded"),
        ("document_approved", "Document Approved"),
        ("document_rejected", "Document Rejected"),
        ("application_approved", "Application Approved"),
        ("application_rejected", "Application Rejected"),
        ("student_created", "Student Created"),
        ("parent_linked", "Parent Linked"),
        ("enrollment_completed", "Enrollment Completed"),
        ("seat_allocated", "Seat Allocated"),
        ("application_deleted", "Application Deleted"),
        ("application_restored", "Application Restored"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        AdmissionApplication, on_delete=models.CASCADE, related_name="audit_logs"
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="admission_audit_entries",
    )
    event_type = models.CharField(max_length=40, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Admission Audit Log"
        verbose_name_plural = "Admission Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.application.application_number} at {self.timestamp}"
