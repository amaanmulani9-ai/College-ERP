import datetime

import pytest
from apps.academics.models import AcademicSession, Department
from apps.academics.models import Faculty as FacultyDept
from apps.academics.models import Program, Semester, Subject
from apps.authentication.models import User
from apps.profiles.models import UserProfile
from apps.results.models import ResultScheme, StudentResult
from apps.results.services import ResultService
from apps.students.models import Student
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestResultsModule:
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
        self.subject1 = Subject.objects.create(name="Data Structures", code="CS101", semester=self.semester1, credits=4)
        self.subject2 = Subject.objects.create(name="Algorithms", code="CS102", semester=self.semester1, credits=3)

        # Result Schemes
        self.scheme1 = ResultScheme.objects.create(
            program=self.program,
            semester=self.semester1,
            subject=self.subject1,
            max_internal=40,
            max_external=60,
            passing_marks=40,
        )
        self.scheme2 = ResultScheme.objects.create(
            program=self.program,
            semester=self.semester1,
            subject=self.subject2,
            max_internal=40,
            max_external=60,
            passing_marks=40,
        )

        # Student 1
        self.std_user1 = User.objects.create_user(
            email="student1@college.edu", password="Password123!", first_name="Alice", last_name="Smith"
        )
        self.std_profile1, _ = UserProfile.objects.get_or_create(
            user=self.std_user1, defaults={"first_name": "Alice", "last_name": "Smith"}
        )
        self.student1 = Student.objects.create(
            student_id="ERP-2026-BSCS-0001",
            enrollment_number="ENR-2026-BSCS-0001",
            profile=self.std_profile1,
            program=self.program,
            department=self.dept,
            academic_session=self.session_academic,
            current_semester=self.semester1,
            roll_number="CS2026001",
            admission_date=datetime.date(2026, 8, 1),
        )

        # Student 2
        self.std_user2 = User.objects.create_user(
            email="student2@college.edu", password="Password123!", first_name="Bob", last_name="Jones"
        )
        self.std_profile2, _ = UserProfile.objects.get_or_create(
            user=self.std_user2, defaults={"first_name": "Bob", "last_name": "Jones"}
        )
        self.student2 = Student.objects.create(
            student_id="ERP-2026-BSCS-0002",
            enrollment_number="ENR-2026-BSCS-0002",
            profile=self.std_profile2,
            program=self.program,
            department=self.dept,
            academic_session=self.session_academic,
            current_semester=self.semester1,
            roll_number="CS2026002",
            admission_date=datetime.date(2026, 8, 1),
        )

    def test_marks_entry_and_grade_calculation(self):
        # Student 1 CS101: 35 internal + 55 external = 90 total -> A+ (10.0 grade point, 40 credit points)
        res1 = ResultService.enter_marks(
            {
                "student": self.student1,
                "subject": self.subject1,
                "internal_marks": 35.0,
                "external_marks": 55.0,
            },
            actor=self.user,
        )
        assert res1.total_marks == 90.0
        assert res1.grade == "A+"
        assert res1.grade_point == 10.0
        assert res1.credit_point == 40.0

        # Attempt exceeding maximum limits -> ValueError
        with pytest.raises(ValueError, match="exceed maximum"):
            ResultService.enter_marks(
                {
                    "student": self.student1,
                    "subject": self.subject1,
                    "internal_marks": 50.0,  # Max is 40
                    "external_marks": 50.0,
                },
                actor=self.user,
            )

    def test_sgpa_cgpa_calculation_and_ranking(self):
        # Student 1 Marks: CS101 = 90 (Grade A+, GP 10.0, Cr 4 -> CP 40.0), CS102 = 80 (Grade A, GP 9.0, Cr 3 -> CP 27.0)
        # Total CP = 67.0, Total Cr = 7 -> SGPA = 67.0/7 = 9.57
        ResultService.enter_marks(
            {"student": self.student1, "subject": self.subject1, "internal_marks": 35.0, "external_marks": 55.0},
            actor=self.user,
        )
        ResultService.enter_marks(
            {"student": self.student1, "subject": self.subject2, "internal_marks": 30.0, "external_marks": 50.0},
            actor=self.user,
        )
        sem_res1 = ResultService.calculate_sgpa(str(self.student1.id), str(self.semester1.id))
        assert sem_res1.sgpa == 9.57
        assert sem_res1.cgpa == 9.57
        assert sem_res1.result_status == "pass"

        # Student 2 Marks (Lower marks for ranking)
        ResultService.enter_marks(
            {"student": self.student2, "subject": self.subject1, "internal_marks": 20.0, "external_marks": 30.0},
            actor=self.user,
        )
        ResultService.enter_marks(
            {"student": self.student2, "subject": self.subject2, "internal_marks": 20.0, "external_marks": 30.0},
            actor=self.user,
        )
        _ = ResultService.calculate_sgpa(str(self.student2.id), str(self.semester1.id))  # Side-effect: populates DB for ranking

        # Generate Ranks
        ranked_list = ResultService.generate_rank(str(self.semester1.id))
        assert ranked_list[0].student == self.student1
        assert ranked_list[0].rank == 1
        assert ranked_list[1].student == self.student2
        assert ranked_list[1].rank == 2

    def test_publish_result_and_transcript(self):
        ResultService.enter_marks(
            {"student": self.student1, "subject": self.subject1, "internal_marks": 35.0, "external_marks": 55.0},
            actor=self.user,
        )
        ResultService.calculate_sgpa(str(self.student1.id), str(self.semester1.id))

        published_count = ResultService.publish_result(str(self.semester1.id), actor=self.user)
        assert published_count >= 1

        res_check = StudentResult.objects.get(student=self.student1, subject=self.subject1)
        assert res_check.status == "published"
