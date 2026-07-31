import datetime
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.academics.models import AcademicSession, Department, Faculty as FacultyDept, Program, Semester, Subject
from apps.attendance.models import AttendanceSession, FacultyAttendance, StudentAttendance
from apps.attendance.services import AttendanceService
from apps.attendance.validators import generate_qr_attendance_token, process_biometric_event_payload
from apps.authentication.models import User
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.students.models import Student
from apps.timetable.models import Building, Classroom, TimeSlot, Timetable


@pytest.mark.django_db
class TestAttendanceModule:
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
        self.subject = Subject.objects.create(
            name="Data Structures", code="CS101", semester=self.semester1, credits=4
        )

        # Faculty Employee
        self.fac_user = User.objects.create_user(
            email="prof.john@college.edu", password="Password123!", first_name="John", last_name="Prof"
        )
        self.fac_profile, _ = UserProfile.objects.get_or_create(
            user=self.fac_user, defaults={"first_name": "John", "last_name": "Prof"}
        )
        self.designation = Designation.objects.create(name="Assistant Professor", code="ASST_PROF")
        self.faculty_emp = Employee.objects.create(
            employee_id="EMP-2026-00001",
            employee_number="EMP001",
            profile=self.fac_profile,
            department=self.dept,
            designation=self.designation,
            employment_type="full_time",
            joining_date=datetime.date(2026, 1, 1),
        )

        # Student
        self.std_user = User.objects.create_user(
            email="student1@college.edu", password="Password123!", first_name="Student", last_name="One"
        )
        self.std_profile, _ = UserProfile.objects.get_or_create(
            user=self.std_user, defaults={"first_name": "Student", "last_name": "One"}
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

        # Building & Classroom & Timetable
        self.building = Building.objects.create(name="Science Block", code="SB", address="North Campus")
        self.classroom = Classroom.objects.create(
            building=self.building, room_number="101", capacity=60, floor=1, room_type="classroom"
        )
        self.timeslot = TimeSlot.objects.create(
            day="Monday", start_time=datetime.time(9, 0), end_time=datetime.time(10, 0), period_number=1
        )
        self.timetable_entry = Timetable.objects.create(
            academic_session=self.session_academic,
            program=self.program,
            semester=self.semester1,
            subject=self.subject,
            faculty=self.faculty_emp,
            classroom=self.classroom,
            time_slot=self.timeslot,
            effective_from=datetime.date(2026, 8, 1),
            status="active",
        )

    def test_session_creation_and_locking(self):
        data = {
            "timetable": self.timetable_entry,
            "subject": self.subject,
            "faculty": self.faculty_emp,
            "classroom": self.classroom,
            "date": datetime.date(2026, 8, 10),
            "start_time": datetime.time(9, 0),
            "end_time": datetime.time(10, 0),
            "status": "completed",
        }
        session = AttendanceService.create_session(data, actor=self.user)
        assert session.status == "completed"
        assert session.qr_token != ""

        # Mark attendance
        att = AttendanceService.mark_attendance(session, str(self.student.id), status="present", actor=self.user)
        assert att.status == "present"

        # Lock session
        locked_session = AttendanceService.lock_session(session, actor=self.user)
        assert locked_session.is_locked is True

        # Attempt to mark after lock -> raises ValueError
        with pytest.raises(ValueError, match="session is locked"):
            AttendanceService.mark_attendance(session, str(self.student.id), status="absent", actor=self.user)

    def test_bulk_marking_and_percentage(self):
        data = {
            "timetable": self.timetable_entry,
            "subject": self.subject,
            "faculty": self.faculty_emp,
            "classroom": self.classroom,
            "date": datetime.date(2026, 8, 11),
            "start_time": datetime.time(9, 0),
            "end_time": datetime.time(10, 0),
            "status": "completed",
        }
        session = AttendanceService.create_session(data, actor=self.user)

        # Bulk mark
        records = [{"student_id": str(self.student.id), "status": "present", "remarks": "On time"}]
        marked = AttendanceService.bulk_mark(session, records, actor=self.user)
        assert len(marked) == 1
        assert marked[0].status == "present"

        # Check percentage calculation
        stats = AttendanceService.attendance_percentage(str(self.student.id), str(self.subject.id))
        assert stats["total_sessions"] == 1
        assert stats["present_count"] == 1
        assert stats["percentage"] == 100.0

    def test_reports_and_faculty_attendance(self):
        # Faculty Attendance
        fac_att = AttendanceService.faculty_attendance(
            str(self.faculty_emp.id),
            datetime.date(2026, 8, 12),
            status="present",
            check_in=datetime.time(8, 55),
            check_out=datetime.time(16, 30),
            actor=self.user,
        )
        assert fac_att.status == "present"

        # Daily Report
        daily = AttendanceService.daily_report(datetime.date(2026, 8, 12))
        assert daily["date"] == "2026-08-12"

        # Monthly Report
        monthly = AttendanceService.monthly_report(2026, 8, str(self.subject.id))
        assert monthly["year"] == 2026
        assert monthly["month"] == 8

    def test_qr_token_and_biometric_interface(self):
        token = generate_qr_attendance_token("session-12345")
        assert len(token) == 64

        parsed = process_biometric_event_payload(
            {"device_id": "BIO-ROOM-101", "user_identifier": "EMP-2026-00001", "timestamp": "2026-08-12T09:00:00Z"}
        )
        assert parsed["status"] == "valid"
