import datetime

import pytest
from apps.academics.models import AcademicSession, Department
from apps.academics.models import Faculty as FacultyDept
from apps.academics.models import Program, Semester, Subject
from apps.authentication.models import User
from apps.examinations.models import ExamType
from apps.examinations.services import ExamService
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.students.models import Student
from apps.timetable.models import Building, Classroom
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestExaminationsModule:
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
        self.subject = Subject.objects.create(name="Data Structures", code="CS101", semester=self.semester1, credits=4)

        # Exam Type
        self.exam_type = ExamType.objects.create(
            name="End Semester Exam", code="END_SEM", category="end_semester", is_internal=False
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

        # Building & Classroom
        self.building = Building.objects.create(name="Exam Hall Block", code="EB", address="South Campus")
        self.classroom = Classroom.objects.create(
            building=self.building, room_number="201", capacity=100, floor=2, room_type="seminar_hall"
        )

    def test_exam_creation_and_scheduling_conflict(self):
        exam_data = {
            "academic_session": self.session_academic,
            "program": self.program,
            "semester": self.semester1,
            "subject": self.subject,
            "exam_type": self.exam_type,
            "start_date": datetime.date(2026, 12, 1),
            "end_date": datetime.date(2026, 12, 15),
            "status": "scheduled",
        }
        exam = ExamService.create_exam(exam_data, actor=self.user)
        assert exam.subject == self.subject

        sched_data = {
            "exam": exam,
            "date": datetime.date(2026, 12, 5),
            "start_time": datetime.time(10, 0),
            "end_time": datetime.time(13, 0),
            "classroom": self.classroom,
            "invigilator": self.faculty_emp,
            "capacity": 100,
        }
        schedule = ExamService.schedule_exam(sched_data, actor=self.user)
        assert schedule.classroom == self.classroom

        # Attempt to schedule overlapping exam in same room -> ValueError
        with pytest.raises(ValueError, match="Classroom"):
            ExamService.schedule_exam(sched_data, actor=self.user)

    def test_hall_ticket_and_exam_attendance(self):
        exam = ExamService.create_exam(
            {
                "academic_session": self.session_academic,
                "program": self.program,
                "semester": self.semester1,
                "subject": self.subject,
                "exam_type": self.exam_type,
                "start_date": datetime.date(2026, 12, 1),
                "end_date": datetime.date(2026, 12, 15),
                "status": "scheduled",
            },
            actor=self.user,
        )
        schedule = ExamService.schedule_exam(
            {
                "exam": exam,
                "date": datetime.date(2026, 12, 6),
                "start_time": datetime.time(10, 0),
                "end_time": datetime.time(13, 0),
                "classroom": self.classroom,
                "capacity": 100,
            },
            actor=self.user,
        )

        # Attempt to mark exam attendance without Hall Ticket -> ValueError
        with pytest.raises(ValueError, match="Hall Ticket"):
            ExamService.mark_exam_attendance(str(schedule.id), str(self.student.id), status="present", actor=self.user)

        # Generate Hall Ticket
        ticket = ExamService.generate_hall_ticket(str(self.student.id), str(exam.id), actor=self.user)
        assert ticket.status == "issued"

        # Now marking attendance succeeds
        att = ExamService.mark_exam_attendance(
            str(schedule.id), str(self.student.id), status="present", actor=self.user
        )
        assert att.status == "present"

    def test_invigilator_duties_and_schedules(self):
        exam = ExamService.create_exam(
            {
                "academic_session": self.session_academic,
                "program": self.program,
                "semester": self.semester1,
                "subject": self.subject,
                "exam_type": self.exam_type,
                "start_date": datetime.date(2026, 12, 1),
                "end_date": datetime.date(2026, 12, 15),
                "status": "scheduled",
            },
            actor=self.user,
        )
        schedule = ExamService.schedule_exam(
            {
                "exam": exam,
                "date": datetime.date(2026, 12, 7),
                "start_time": datetime.time(10, 0),
                "end_time": datetime.time(13, 0),
                "classroom": self.classroom,
                "capacity": 100,
            },
            actor=self.user,
        )

        assignment = ExamService.assign_invigilator(str(schedule.id), str(self.faculty_emp.id), actor=self.user)
        assert assignment.duty_status == "assigned"

        duties = ExamService.faculty_duties(str(self.faculty_emp.id))
        assert len(duties) == 1

        std_schedules = ExamService.student_schedule(str(self.student.id))
        assert len(std_schedules) == 1
