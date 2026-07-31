import uuid

from django.conf import settings
from django.db import models

from apps.profiles.models import UserProfile
from apps.students.models import Student


class ParentSoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class Parent(models.Model):
    """
    Represents a Parent or Guardian entity linked one-to-one with a UserProfile.
    Stores occupation, income, education, and verification status.
    """

    RELATIONSHIP_CHOICES = [
        ("father", "Father"),
        ("mother", "Mother"),
        ("guardian", "Guardian"),
        ("grandfather", "Grandfather"),
        ("grandmother", "Grandmother"),
        ("uncle", "Uncle"),
        ("aunt", "Aunt"),
        ("sibling", "Sibling"),
        ("other", "Other"),
    ]

    EDUCATION_CHOICES = [
        ("none", "No Formal Education"),
        ("primary", "Primary School"),
        ("secondary", "Secondary School"),
        ("diploma", "Diploma"),
        ("bachelor", "Bachelor's Degree"),
        ("master", "Master's Degree"),
        ("doctorate", "Doctorate"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_code = models.CharField(max_length=50, unique=True, db_index=True)
    profile = models.OneToOneField(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="parent_profile",
    )

    # Relationship & identity
    relationship_type = models.CharField(
        max_length=30,
        choices=RELATIONSHIP_CHOICES,
        default="guardian",
    )
    occupation = models.CharField(max_length=200, blank=True, default="")
    employer_name = models.CharField(max_length=200, blank=True, default="")
    annual_income = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True
    )
    education_level = models.CharField(
        max_length=30,
        choices=EDUCATION_CHOICES,
        default="bachelor",
    )

    # Verification
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_parents",
    )

    # Portal access
    portal_access_enabled = models.BooleanField(default=True)
    notification_enabled = models.BooleanField(default=True)

    # Soft delete
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ParentSoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Parent"
        verbose_name_plural = "Parents"

    def __str__(self):
        return f"{self.parent_code} - {self.profile.get_full_name()}"


class StudentParentLink(models.Model):
    """
    Many-to-many through model linking a Student to their Parent(s)/Guardian(s).
    A single parent can be linked to multiple students (e.g. siblings).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="parent_links",
    )
    parent = models.ForeignKey(
        Parent,
        on_delete=models.CASCADE,
        related_name="student_links",
    )
    is_primary_contact = models.BooleanField(default=False)
    is_emergency_contact = models.BooleanField(default=False)
    can_pickup = models.BooleanField(
        default=True,
        help_text="Whether this parent is authorised to pick up the student.",
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "parent")
        ordering = ["-created_at"]
        verbose_name = "Student–Parent Link"
        verbose_name_plural = "Student–Parent Links"

    def __str__(self):
        return f"{self.parent.parent_code} ↔ {self.student.student_id}"


class ParentDocument(models.Model):
    """
    Identity and supporting documents uploaded by or on behalf of the parent.
    """

    DOCUMENT_TYPE_CHOICES = [
        ("id_proof", "Government ID Proof"),
        ("address_proof", "Address Proof"),
        ("income_certificate", "Income Certificate"),
        ("relationship_certificate", "Relationship Certificate"),
        ("court_order", "Court Order / Legal Guardian"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("expired", "Expired"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey(
        Parent,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    document_type = models.CharField(
        max_length=40,
        choices=DOCUMENT_TYPE_CHOICES,
        default="id_proof",
    )
    document_file = models.FileField(upload_to="parent_documents/")
    document_number = models.CharField(max_length=100, blank=True, default="")
    description = models.CharField(max_length=255, blank=True, default="")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_parent_docs",
    )
    review_notes = models.TextField(blank=True, default="")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Parent Document"
        verbose_name_plural = "Parent Documents"

    def __str__(self):
        return f"{self.get_document_type_display()} for {self.parent.parent_code}"


class ParentCommunicationPreference(models.Model):
    """
    Per-parent notification channel preferences (email, SMS, push, WhatsApp).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.OneToOneField(
        Parent,
        on_delete=models.CASCADE,
        related_name="communication_preferences",
    )
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=False)
    whatsapp_notifications = models.BooleanField(default=False)

    # Granular event subscriptions
    attendance_alerts = models.BooleanField(default=True)
    fee_reminders = models.BooleanField(default=True)
    exam_results = models.BooleanField(default=True)
    general_announcements = models.BooleanField(default=True)
    disciplinary_notices = models.BooleanField(default=True)
    event_invitations = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Parent Communication Preference"
        verbose_name_plural = "Parent Communication Preferences"

    def __str__(self):
        return f"Comm prefs for {self.parent.parent_code}"


class ParentActivityLog(models.Model):
    """
    Audit trail of significant actions performed on or by the parent record.
    """

    ACTIVITY_CHOICES = [
        ("created", "Profile Created"),
        ("updated", "Profile Updated"),
        ("verified", "Profile Verified"),
        ("document_uploaded", "Document Uploaded"),
        ("document_reviewed", "Document Reviewed"),
        ("link_added", "Student Link Added"),
        ("link_removed", "Student Link Removed"),
        ("portal_login", "Portal Login"),
        ("portal_logout", "Portal Logout"),
        ("deleted", "Profile Soft Deleted"),
        ("restored", "Profile Restored"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey(
        Parent,
        on_delete=models.CASCADE,
        related_name="activity_logs",
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="parent_activity_logs",
    )
    activity_type = models.CharField(max_length=40, choices=ACTIVITY_CHOICES)
    description = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Parent Activity Log"
        verbose_name_plural = "Parent Activity Logs"

    def __str__(self):
        return f"[{self.activity_type}] {self.parent.parent_code} at {self.timestamp}"
