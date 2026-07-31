"""
Admissions Validators.
Custom validation logic for duplicate application detection and document checksums.
"""
import hashlib
from django.core.exceptions import ValidationError


def calculate_file_checksum(file_obj) -> str:
    """Calculate SHA-256 checksum for an uploaded document."""
    hasher = hashlib.sha256()
    for chunk in file_obj.chunks():
        hasher.update(chunk)
    file_obj.seek(0)
    return hasher.hexdigest()


def validate_duplicate_application(email: str, mobile: str, program_id: str, session_id: str, model_cls):
    """
    Prevents duplicate active applications for the same applicant per program and session.
    """
    existing = model_cls.objects.filter(
        email=email,
        program_id=program_id,
        academic_session_id=session_id,
        is_deleted=False,
    ).exclude(status__in=["enrolled", "cancelled", "rejected"]).exists()

    if existing:
        raise ValidationError(
            "An active admission application already exists for this email, program, and academic session."
        )
