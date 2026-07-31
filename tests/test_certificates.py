import datetime
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.academics.models import AcademicSession, Department, Faculty as FacultyDept, Program, Semester, Subject
from apps.authentication.models import User
from apps.certificates.models import Certificate, CertificateType, Transcript
from apps.certificates.services import CertificateService
from apps.profiles.models import UserProfile
from apps.results.models import ResultScheme, SemesterResult, StudentResult
from apps.results.services import ResultService
from apps.students.models import Student


@pytest.mark.django_db
class TestCertificatesModule:
    @pytest.fixture(autouse=True)
    def setup_data(self):
        self.user = User.objects.create_superuser(
            email="admin@college.edu", password="AdminPassword123!", first_name="Admin", last_name="User"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Academics
        self.fac_dept = FacultyDept.objects.create(name="School of Engineering", code="ENG")
        self.dept = Department.objects.create(name="Computer Science", code="CS", faculty=self.fac_dept)
        self.program = Program.objects.create(
            name="B.Tech Computer Science", code="BSCS", department=self.dept, degree_level="UG"
        )
        self.semester1 = Semester.objects.create(program=self.program, semester_number=1, name="Semester 1")
        self.session_academic = AcademicSession.objects.create(
            name="2026-2027", start_date=datetime.date(2026, 8, 1), end_date=datetime.date(2027, 5, 31), is_current=True
        )
        self.subject1 = Subject.objects.create(
            name="Data Structures", code="CS101", semester=self.semester1, credits=4
        )

        # Certificate Types
        self.cert_type_bonafide = CertificateType.objects.create(name="Bonafide Certificate", code="BONAFIDE")
        self.cert_type_degree = CertificateType.objects.create(name="Degree Certificate", code="DEGREE")

        # Student
        self.std_user = User.objects.create_user(
            email="student1@college.edu", password="Password123!", first_name="Alice", last_name="Smith"
        )
        self.std_profile, _ = UserProfile.objects.get_or_create(
            user=self.std_user, defaults={"first_name": "Alice", "last_name": "Smith"}
        )
        self.student = Student.objects.create(
            student_id="ERP-2026-BSCS-0001",
            enrollment_number="ENR-2026-BSCS-0001",
            profile=self.std_profile,
            program=self.program,
            department=self.dept,
            academic_session=self.session_academic,
            current_semester=self.semester1,
            roll_number="CS2026001",
            admission_date=datetime.date(2026, 8, 1),
        )

    def test_certificate_generation_and_published_results_rule(self):
        # Bonafide Certificate does not require published results
        bonafide_cert = CertificateService.generate_certificate(
            str(self.student.id), str(self.cert_type_bonafide.id), actor=self.user
        )
        assert bonafide_cert.certificate_number.startswith("CERT-")
        assert bonafide_cert.status == "issued"

        # Attempt to issue DEGREE certificate without published results -> ValueError
        with pytest.raises(ValueError, match="published semester results"):
            CertificateService.generate_certificate(
                str(self.student.id), str(self.cert_type_degree.id), actor=self.user
            )

        # Enter & Publish Result
        ResultService.enter_marks(
            {"student": self.student, "subject": self.subject1, "internal_marks": 35.0, "external_marks": 55.0},
            actor=self.user,
        )
        ResultService.calculate_sgpa(str(self.student.id), str(self.semester1.id))
        ResultService.publish_result(str(self.semester1.id), actor=self.user)

        # Now DEGREE certificate generation succeeds
        degree_cert = CertificateService.generate_certificate(
            str(self.student.id), str(self.cert_type_degree.id), actor=self.user
        )
        assert degree_cert.status == "issued"

    def test_transcript_generation_and_verification(self):
        # Publish result first
        ResultService.enter_marks(
            {"student": self.student, "subject": self.subject1, "internal_marks": 35.0, "external_marks": 55.0},
            actor=self.user,
        )
        ResultService.calculate_sgpa(str(self.student.id), str(self.semester1.id))
        ResultService.publish_result(str(self.semester1.id), actor=self.user)

        transcript = CertificateService.generate_transcript(str(self.student.id), actor=self.user)
        assert transcript.cgpa == 10.0
        assert transcript.earned_credits == 4

        # Issue a certificate and verify it
        cert = CertificateService.generate_certificate(
            str(self.student.id), str(self.cert_type_bonafide.id), actor=self.user
        )

        verification_res = CertificateService.verify_certificate(cert.certificate_number)
        assert verification_res["valid"] is True
        assert verification_res["student_id"] == self.student.student_id

        # Verify invalid number
        inv_res = CertificateService.verify_certificate("INVALID-NUMBER-999")
        assert inv_res["valid"] is False

    def test_pdf_download_and_student_history(self):
        cert = CertificateService.generate_certificate(
            str(self.student.id), str(self.cert_type_bonafide.id), actor=self.user
        )
        payload = CertificateService.download_pdf(str(cert.id), actor=self.user)
        assert payload["certificate_number"] == cert.certificate_number

        history = CertificateService.student_certificates(str(self.student.id))
        assert len(history) == 1
