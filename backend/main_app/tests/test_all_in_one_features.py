from django.test import TestCase
from main_app.models import CustomUser, Student, Staff, Course, Subject, Session, Attendance, AttendanceReport, PlacementDrive
from main_app.naac_nirf_reports import generate_naac_nirf_data
from main_app.analytics_engine import calculate_student_risk, generate_system_risk_analytics
from main_app.mobile_api_views import api_biometric_punch
from django.test.client import RequestFactory
import json

class AllInOneFeaturesTest(TestCase):
    def setUp(self):
        self.rf = RequestFactory()
        self.session = Session.objects.create(start_year="2025-01-01", end_year="2026-01-01")
        self.course = Course.objects.create(name="B.Tech Computer Science")
        
        # Admin
        self.admin_user = CustomUser.objects.create_user(email="admin@college.edu", password="password", user_type='1')
        
        # Staff
        self.staff_user = CustomUser.objects.create_user(email="staff@college.edu", password="password", user_type='2')
        self.staff = Staff.objects.get(admin=self.staff_user)
        
        # Subject
        self.subject = Subject.objects.create(name="Data Structures", course=self.course, staff=self.staff)
        
        # Student 1 (High Risk)
        self.student1_user = CustomUser.objects.create_user(email="student1@college.edu", password="password", user_type='3', first_name="Aarav", last_name="Sharma")
        self.student1 = Student.objects.get(admin=self.student1_user)
        self.student1.course = self.course
        self.student1.session = self.session
        self.student1.id_card_code = "RFID-001"
        self.student1.unique_student_code = "CS-001"
        self.student1.save()
        
        # Student 2 (Safe)
        self.student2_user = CustomUser.objects.create_user(email="student2@college.edu", password="password", user_type='3', first_name="Ananya", last_name="Verma")
        self.student2 = Student.objects.get(admin=self.student2_user)
        self.student2.course = self.course
        self.student2.session = self.session
        self.student2.id_card_code = "RFID-002"
        self.student2.unique_student_code = "CS-002"
        self.student2.save()

    def test_naac_nirf_reports(self):
        report = generate_naac_nirf_data()
        self.assertIn("summary", report)
        self.assertIn("criteria_1_curricular", report)
        self.assertEqual(report["summary"]["total_students"], 2)
        self.assertEqual(report["summary"]["total_staff"], 1)

    def test_ai_predictive_risk_analytics(self):
        for i in range(5):
            att = Attendance.objects.create(session=self.session, subject=self.subject, date=f"2026-07-0{i+1}")
            status = True if i == 0 else False
            AttendanceReport.objects.create(student=self.student1, attendance=att, status=status)
            
        risk_profile = calculate_student_risk(self.student1)
        self.assertEqual(risk_profile["risk_level"], "High Risk")
        self.assertLess(risk_profile["attendance_pct"], 75.0)
        
        summary = generate_system_risk_analytics()
        self.assertGreaterEqual(summary["high_risk_count"], 1)

    def test_biometric_iot_punch_api(self):
        payload = {
            "id_card_code": "RFID-001",
            "status": True,
            "subject_id": self.subject.id,
            "date": "2026-07-28"
        }
        request = self.rf.post(
            '/api/biometric-punch/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        response = api_biometric_punch(request)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["student_code"], "CS-001")

    def test_placement_eligibility_engine(self):
        drive = PlacementDrive.objects.create(
            company_name="Google India",
            job_role="Software Development Engineer",
            eligibility="70% academic criteria and 60% minimum attendance",
            package="18 LPA",
            drive_date="2026-08-15"
        )
        self.assertEqual(drive.company_name, "Google India")
        profile = calculate_student_risk(self.student1)
        self.assertIn("attendance_pct", profile)

    def test_institution_onboarding_wizard(self):
        from main_app.models import InstitutionProfile
        from main_app.hod_views import institution_onboarding_wizard
        payload = {
            "institution_type": "College",
            "session_cycle": "April to March",
            "institution_name": "Apex Engineering Institute",
            "fee_structure_type": "Quarterly",
            "allow_fee_installments": True,
            "is_completed": True
        }
        request = self.rf.post(
            '/onboarding/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        request.user = self.admin_user
        response = institution_onboarding_wizard(request)
        self.assertEqual(response.status_code, 200)
        profile = InstitutionProfile.objects.get(id=1)
        self.assertEqual(profile.institution_name, "Apex Engineering Institute")
        self.assertTrue(profile.is_onboarding_completed)

