"""
Certificate Validators.
Enforces:
 - Only published results allowed for marksheets & degree certificates
 - Immutability of issued certificates
"""
from apps.results.models import SemesterResult
from .models import Certificate


def validate_results_published_for_certificate(student_id: str, cert_code: str):
    """
    Validates that student possesses published results before issuing marksheets or degree certificates.
    """
    if cert_code in ["MARKSHEET", "DEGREE", "TRANSCRIPT", "CONSOLIDATED_TRANSCRIPT"]:
        published_results = SemesterResult.objects.filter(
            student_id=student_id, is_published=True, is_deleted=False
        )
        if not published_results.exists():
            raise ValueError("Cannot generate certificate: Student has no published semester results.")


def validate_certificate_unmodified(certificate: Certificate):
    """
    Ensures issued certificate is immutable.
    """
    if certificate.status in ["issued", "revoked"]:
        raise ValueError("Issued certificates are immutable and cannot be updated.")
