import uuid

from django.conf import settings
from django.db import models

from apps.academics.models import AcademicSession, Program
from apps.students.models import Student


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Certificate Type
# ---------------------------------------------------------------------------

class CertificateType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    template = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Certificate Type"
        verbose_name_plural = "Certificate Types"

    def __str__(self):
        return f"{self.name} ({self.code})"


# ---------------------------------------------------------------------------
# Certificate
# ---------------------------------------------------------------------------

class Certificate(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("issued", "Issued"),
        ("revoked", "Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="certificates")
    certificate_type = models.ForeignKey(CertificateType, on_delete=models.PROTECT, related_name="issued_certificates")
    certificate_number = models.CharField(max_length=100, unique=True, db_index=True)
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.SET_NULL, null=True, blank=True, related_name="certificates")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="issued", db_index=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-generated_at"]
        verbose_name = "Certificate"
        verbose_name_plural = "Certificates"

    def __str__(self):
        return f"{self.certificate_number} - {self.certificate_type.name} ({self.student.student_id})"


# ---------------------------------------------------------------------------
# Transcript
# ---------------------------------------------------------------------------

class Transcript(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("issued", "Issued"),
        ("revoked", "Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="official_transcript")
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="transcripts")

    total_credits = models.IntegerField(default=0)
    earned_credits = models.IntegerField(default=0)
    sgpa = models.FloatField(default=0.0)
    cgpa = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="issued", db_index=True)

    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-generated_at"]
        verbose_name = "Official Transcript"
        verbose_name_plural = "Official Transcripts"

    def __str__(self):
        return f"Transcript: {self.student.student_id} - CGPA {self.cgpa}"


# ---------------------------------------------------------------------------
# Certificate Audit Log
# ---------------------------------------------------------------------------

class CertificateAuditLog(models.Model):
    EVENT_CHOICES = [
        ("certificate_generated", "Certificate Generated"),
        ("transcript_generated", "Transcript Generated"),
        ("downloaded", "Downloaded"),
        ("verified", "Verified"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    certificate = models.ForeignKey(Certificate, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    transcript = models.ForeignKey(Transcript, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Certificate Audit Log"
        verbose_name_plural = "Certificate Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description} at {self.timestamp}"
