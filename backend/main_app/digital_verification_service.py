import hashlib
import io
import qrcode
from django.core.files.base import ContentFile
from django.conf import settings
from typing import Dict, Any

class DigitalVerificationService:
    """
    Cryptographic SHA-256 Digital Verification & QR Code Service
    for Student ID Cards and Certificates.
    """

    SECRET_SALT = getattr(settings, 'SECRET_KEY', 'CollegeERPSecretSalt2026')

    @classmethod
    def generate_hash(cls, entity_type: str, entity_id: Any) -> str:
        """
        Generates a unique 64-character SHA-256 cryptographic hash.
        """
        raw_data = f"CAMPUSPRO:{entity_type}:{entity_id}:{cls.SECRET_SALT}"
        return hashlib.sha256(raw_data.encode('utf-8')).hexdigest()

    @classmethod
    def generate_qr_code_content_file(cls, verification_url: str, filename: str = "qr_code.png") -> ContentFile:
        """
        Generates a QR Code image pointing to the verification URL and returns a Django ContentFile.
        """
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=2,
        )
        qr.add_data(verification_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#1e293b", back_color="#ffffff")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        return ContentFile(buffer.getvalue(), name=filename)

    @classmethod
    def verify_credential(cls, hash_code: str) -> Dict[str, Any]:
        """
        Searches for a Student ID Card or Certificate by its SHA-256 verification hash.
        """
        from main_app.models import Student, CertificateRequest

        # 1. Search in CertificateRequest
        cert = CertificateRequest.objects.filter(verification_hash=hash_code).select_related('student__admin', 'student__course').first()
        if cert:
            return {
                'found': True,
                'type': 'Certificate',
                'title': f"{cert.get_certificate_type_display()}",
                'student_name': cert.student.admin.get_full_name(),
                'course': cert.student.course.name if cert.student.course else 'N/A',
                'unique_code': cert.student.unique_student_code or f"PAT-{cert.student.id:04d}",
                'status': cert.status,
                'issue_date': cert.approved_date or cert.created_at.date(),
                'hash': cert.verification_hash,
                'object': cert
            }

        # 2. Search in Student ID Card
        student = Student.objects.filter(verification_hash=hash_code).select_related('admin', 'course', 'session').first()
        if student:
            return {
                'found': True,
                'type': 'Student ID Card',
                'title': 'Official Student Identity Card',
                'student_name': student.admin.get_full_name(),
                'course': student.course.name if student.course else 'N/A',
                'unique_code': student.unique_student_code or f"PAT-{student.id:04d}",
                'status': 'Verified Active',
                'issue_date': student.admission_date or student.admin.created_at.date(),
                'hash': student.verification_hash,
                'object': student
            }

        return {
            'found': False,
            'message': 'No registered student credential found matching this verification signature hash.'
        }
