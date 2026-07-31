"""
Certificate & Transcript Business Services (CertificateService).
Handles certificate generation with unique numbering, transcript computation,
certificate verification, PDF download payload generation, and audit logging.
"""
import uuid
from typing import Dict, Any, List
from django.db import transaction
from django.utils import timezone
from apps.authentication.services import log_audit_event
from apps.results.models import SemesterResult, StudentResult
from apps.students.models import Student

from .models import Certificate, CertificateAuditLog, CertificateType, Transcript
from .validators import validate_results_published_for_certificate


class CertificateService:
    @staticmethod
    @transaction.atomic
    def generate_certificate(student_id: str, cert_type_id: str, actor=None, request=None) -> Certificate:
        cert_type = CertificateType.objects.get(pk=cert_type_id)
        student = Student.objects.get(pk=student_id)

        # Enforce business rule: published results required for academic certs
        validate_results_published_for_certificate(student_id, cert_type.code)

        cert_number = f"CERT-{timezone.now().year}-{cert_type.code}-{uuid.uuid4().hex[:6].upper()}"

        cert = Certificate.objects.create(
            student=student,
            certificate_type=cert_type,
            certificate_number=cert_number,
            academic_session=student.academic_session,
            status="issued",
            generated_by=actor,
            metadata={
                "student_name": f"{student.profile.first_name} {student.profile.last_name}",
                "program": student.program.name,
                "roll_number": student.roll_number,
            },
        )

        _log_audit(
            certificate=cert,
            actor=actor,
            event_type="certificate_generated",
            description=f"Generated {cert_type.name} pass {cert.certificate_number} for student {student.student_id}",
            request=request,
        )
        return cert

    @staticmethod
    @transaction.atomic
    def generate_transcript(student_id: str, actor=None, request=None) -> Transcript:
        student = Student.objects.get(pk=student_id)
        validate_results_published_for_certificate(student_id, "TRANSCRIPT")

        sem_results = SemesterResult.objects.filter(student_id=student_id, is_published=True, is_deleted=False)
        student_results = StudentResult.objects.filter(student_id=student_id, status="published", is_deleted=False)

        total_credits = sum(r.total_credits for r in sem_results)
        earned_credits = sum(r.credits_earned for r in sem_results)

        latest_sgpa = sem_results.order_by("-semester__semester_number").first().sgpa if sem_results.exists() else 0.0
        cgpa = sem_results.first().cgpa if sem_results.exists() else 0.0

        transcript_obj, created = Transcript.objects.update_or_create(
            student=student,
            defaults={
                "program": student.program,
                "total_credits": total_credits,
                "earned_credits": earned_credits,
                "sgpa": latest_sgpa,
                "cgpa": cgpa,
                "status": "issued",
                "generated_by": actor,
            },
        )

        _log_audit(
            transcript=transcript_obj,
            actor=actor,
            event_type="transcript_generated",
            description=f"Generated official transcript for student {student.student_id} (CGPA: {cgpa})",
            request=request,
        )
        return transcript_obj

    @staticmethod
    def verify_certificate(certificate_number: str, request=None) -> Dict[str, Any]:
        cert = Certificate.objects.filter(certificate_number=certificate_number, is_deleted=False).first()
        if not cert:
            return {"valid": False, "message": "Certificate number not found or invalid."}

        _log_audit(
            certificate=cert,
            actor=request.user if request and request.user.is_authenticated else None,
            event_type="verified",
            description=f"Verified certificate {certificate_number}",
            request=request,
        )

        return {
            "valid": True,
            "certificate_number": cert.certificate_number,
            "type": cert.certificate_type.name,
            "student_name": f"{cert.student.profile.first_name} {cert.student.profile.last_name}",
            "student_id": cert.student.student_id,
            "program": cert.student.program.name,
            "status": cert.status,
            "issued_date": cert.generated_at.isoformat(),
        }

    @staticmethod
    def download_pdf(certificate_id: str, actor=None, request=None) -> Dict[str, Any]:
        cert = Certificate.objects.get(pk=certificate_id)

        _log_audit(
            certificate=cert,
            actor=actor,
            event_type="downloaded",
            description=f"Downloaded PDF payload for certificate {cert.certificate_number}",
            request=request,
        )

        return {
            "certificate_number": cert.certificate_number,
            "type_name": cert.certificate_type.name,
            "student_name": f"{cert.student.profile.first_name} {cert.student.profile.last_name}",
            "program_name": cert.student.program.name,
            "issued_at": cert.generated_at.isoformat(),
            "content_body": f"Official Certificate of {cert.certificate_type.name} issued to {cert.student.profile.get_full_name()} for program {cert.student.program.name}.",
        }

    @staticmethod
    def student_certificates(student_id: str) -> List[Certificate]:
        return (
            Certificate.objects.filter(student_id=student_id, is_deleted=False)
            .select_related("certificate_type", "student__profile")
            .order_by("-generated_at")
        )


def _log_audit(certificate=None, transcript=None, actor=None, event_type: str = "", description: str = "", metadata: dict = None, request=None):
    if request:
        try:
            log_audit_event(request, event_type=f"cert_{event_type}", details=description)
        except Exception:
            pass

    return CertificateAuditLog.objects.create(
        certificate=certificate,
        transcript=transcript,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
    )
