import datetime

import pytest
from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.admissions.models import SeatMatrix
from apps.admissions.services import (
    approve_application,
    create_application,
    enroll_application,
    generate_application_number,
    submit_application,
    transition_application,
)
from apps.authentication.models import User
from apps.students.models import Student
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestAdmissionsModule:
    @pytest.fixture(autouse=True)
    def setup_data(self):
        self.user = User.objects.create_superuser(
            email="admin@college.edu", password="AdminPassword123!", first_name="Admin", last_name="User"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.faculty = Faculty.objects.create(name="School of Engineering", code="ENG")
        self.department = Department.objects.create(name="Computer Science", code="CS", faculty=self.faculty)
        self.program = Program.objects.create(
            name="B.Tech Computer Science", code="BSCS", department=self.department, degree_level="bachelor"
        )
        self.semester1 = Semester.objects.create(program=self.program, semester_number=1, name="Semester 1")
        self.session = AcademicSession.objects.create(
            name="2026-2027", start_date=datetime.date(2026, 8, 1), end_date=datetime.date(2027, 5, 31), is_current=True
        )

    def test_generate_application_number(self):
        app_num1 = generate_application_number()
        assert app_num1.startswith(f"ADM-{datetime.date.today().year}-")

    def test_application_crud_and_services(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "mobile": "1234567890",
            "date_of_birth": "2005-05-15",
            "gender": "male",
            "nationality": "American",
            "category": "General",
            "academic_session": self.session,
            "program": self.program,
            "department": self.department,
            "previous_qualification": "High School",
            "percentage_cgpa": 88.5,
            "guardian_name": "Robert Doe",
            "guardian_email": "robert.doe@example.com",
            "guardian_phone": "0987654321",
        }
        app = create_application(data, actor=self.user)
        assert app.status == "draft"
        assert app.application_number.startswith("ADM-")

        # Submit
        submitted_app = submit_application(app, actor=self.user)
        assert submitted_app.status == "submitted"
        assert submitted_app.status_history.count() == 1

        # Direct invalid transition test
        with pytest.raises(ValueError):
            transition_application(submitted_app, "enrolled", actor=self.user)

        # Approved
        transition_application(submitted_app, "under_review", actor=self.user)
        transition_application(submitted_app, "document_verification", actor=self.user)
        approved_app = approve_application(submitted_app, actor=self.user, remarks="Passed all checks")
        assert approved_app.status == "approved"

    def test_seat_matrix_and_enrollment(self):
        seat_matrix = SeatMatrix.objects.create(
            program=self.program, academic_session=self.session, category="General", total_seats=1, occupied_seats=0
        )
        assert seat_matrix.available_seats == 1

        data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane.smith@example.com",
            "mobile": "5551234567",
            "academic_session": self.session,
            "program": self.program,
            "department": self.department,
            "category": "General",
            "guardian_name": "Mary Smith",
            "guardian_email": "mary.smith@example.com",
            "guardian_phone": "5559876543",
        }
        app = create_application(data, actor=self.user)
        submit_application(app, actor=self.user)
        transition_application(app, "under_review", actor=self.user)
        transition_application(app, "document_verification", actor=self.user)
        approve_application(app, actor=self.user)

        student = enroll_application(app, actor=self.user)
        assert isinstance(student, Student)
        assert student.enrollment_number == app.application_number
        assert student.profile.user.email == "jane.smith@example.com"
        assert student.parent_links.count() == 1

        seat_matrix.refresh_from_db()
        assert seat_matrix.occupied_seats == 1
        assert seat_matrix.available_seats == 0

        # Try to enroll second student when 0 seats available
        app2 = create_application({**data, "email": "other@example.com", "first_name": "Bob"}, actor=self.user)
        submit_application(app2, actor=self.user)
        transition_application(app2, "under_review", actor=self.user)
        transition_application(app2, "document_verification", actor=self.user)
        approve_application(app2, actor=self.user)

        with pytest.raises(ValueError, match="No available seats"):
            enroll_application(app2, actor=self.user)

    def test_admissions_api_endpoints(self):
        url = reverse("admission-application-list")
        payload = {
            "first_name": "Alice",
            "last_name": "Wonder",
            "email": "alice@example.com",
            "mobile": "9998887777",
            "academic_session": str(self.session.id),
            "program": str(self.program.id),
            "department": str(self.department.id),
        }
        res = self.client.post(url, payload, format="json")
        assert res.status_code == status.HTTP_201_CREATED
        _ = res.data["id"]  # Validate the field exists

        # Dashboard check
        dash_url = reverse("admissions-dashboard")
        dash_res = self.client.get(dash_url)
        assert dash_res.status_code == status.HTTP_200_OK
        assert dash_res.data["total_applications"] >= 1

    def test_duplicate_application_prevention(self):
        data = {
            "first_name": "Dave",
            "last_name": "Miller",
            "email": "dave.miller@example.com",
            "academic_session": self.session,
            "program": self.program,
            "department": self.department,
        }
        create_application(data, actor=self.user)

        with pytest.raises(ValueError, match="already exists"):
            create_application(data, actor=self.user)

    def test_application_rollback(self):
        from apps.admissions.services import rollback_application

        data = {
            "first_name": "Sam",
            "last_name": "Wilson",
            "email": "sam.wilson@example.com",
            "academic_session": self.session,
            "program": self.program,
            "department": self.department,
        }
        app = create_application(data, actor=self.user)
        submit_application(app, actor=self.user)
        transition_application(app, "under_review", actor=self.user)
        assert app.status == "under_review"

        rolled_back = rollback_application(app, "draft", actor=self.user, remarks="Need edit")
        assert rolled_back.status == "draft"
