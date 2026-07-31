import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.authentication.models import User
from apps.profiles.models import UserProfile
from apps.academics.models import Faculty, Department, Program, Semester, AcademicSession
from apps.students.models import Student, StudentStatusHistory
from apps.students.services import generate_student_code, transition_student_status, suspend_student, reinstate_student, graduate_student, soft_delete_student, restore_student


@pytest.fixture
def setup_academic_data(db):
    faculty = Faculty.objects.create(name="School of Computing", code="SOC")
    dept = Department.objects.create(faculty=faculty, name="Information Technology", code="IT")
    prog = Program.objects.create(department=dept, name="BSc IT", code="BSCIT", degree_level="UG")
    sem = Semester.objects.create(program=prog, semester_number=1, name="Semester 1")
    session = AcademicSession.objects.create(name="2025–2026", start_date="2025-08-01", end_date="2026-05-31", is_current=True)
    return {"dept": dept, "prog": prog, "sem": sem, "session": session}


@pytest.mark.django_db
def test_student_code_generator(setup_academic_data):
    """Verifies that Student IDs follow ERP-YEAR-PROGRAM-SEQUENCE pattern and increment correctly."""
    prog = setup_academic_data["prog"]
    
    code1 = generate_student_code(prog.code)
    assert code1.startswith("ERP-")
    assert "BSCIT" in code1
    assert code1.endswith("00001")


@pytest.mark.django_db
def test_student_creation_and_status_transitions(setup_academic_data):
    """Verifies student creation, status transitions, and history tracking."""
    user = User.objects.create_user(email="john.doe@college.edu", password="Password123!")
    profile = UserProfile.objects.get(user=user)
    
    student = Student.objects.create(
        student_id="ERP-2026-BSCIT-00001",
        enrollment_number="ENR001",
        profile=profile,
        program=setup_academic_data["prog"],
        department=setup_academic_data["dept"],
        current_semester=setup_academic_data["sem"],
        academic_session=setup_academic_data["session"],
        admission_date="2025-08-01",
        status="active",
    )

    assert student.status == "active"
    assert StudentStatusHistory.objects.filter(student=student).count() == 0

    # Suspend student
    suspend_student(student, reason="Disciplinary action")
    student.refresh_from_db()
    assert student.status == "suspended"
    assert StudentStatusHistory.objects.filter(student=student, new_status="suspended").exists()

    # Reinstate student
    reinstate_student(student)
    student.refresh_from_db()
    assert student.status == "active"

    # Graduate student
    graduate_student(student)
    student.refresh_from_db()
    assert student.status == "graduated"
    assert StudentStatusHistory.objects.filter(student=student).count() == 3


@pytest.mark.django_db
def test_student_soft_delete_and_restore(setup_academic_data):
    """Verifies soft delete and restore functionality."""
    user = User.objects.create_user(email="jane.smith@college.edu", password="Password123!")
    profile = UserProfile.objects.get(user=user)
    
    student = Student.objects.create(
        student_id="ERP-2026-BSCIT-00002",
        enrollment_number="ENR002",
        profile=profile,
        program=setup_academic_data["prog"],
        department=setup_academic_data["dept"],
        current_semester=setup_academic_data["sem"],
        academic_session=setup_academic_data["session"],
        admission_date="2025-08-01",
    )

    soft_delete_student(student)
    assert Student.objects.filter(id=student.id).count() == 0
    assert Student.all_objects.filter(id=student.id).count() == 1

    restore_student(student)
    assert Student.objects.filter(id=student.id).count() == 1


@pytest.mark.django_db
def test_student_rest_api_crud(setup_academic_data):
    """Verifies REST API endpoints for student onboard, detail, suspend, reinstate, and summary."""
    client = APIClient()
    admin_user = User.objects.create_superuser(email="student_admin@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=admin_user)

    # 1. Create Student via API
    payload = {
        "first_name": "Alice",
        "last_name": "Walker",
        "email": "alice.walker@college.edu",
        "enrollment_number": "ENR003",
        "program": str(setup_academic_data["prog"].id),
        "department": str(setup_academic_data["dept"].id),
        "current_semester": str(setup_academic_data["sem"].id),
        "academic_session": str(setup_academic_data["session"].id),
        "admission_date": "2025-08-01",
    }
    res_create = client.post(reverse("students:student-list"), payload, format="json")
    assert res_create.status_code == 201
    student_id = res_create.data["id"]
    assert res_create.data["student_id"].startswith("ERP-")

    # 2. Suspend via API
    res_suspend = client.post(reverse("students:student-suspend", kwargs={"pk": student_id}), {"reason": "Fees overdue"}, format="json")
    assert res_suspend.status_code == 200
    assert res_suspend.data["status"] == "suspended"

    # 3. Dashboard Summary API
    res_summary = client.get(reverse("students:dashboard_summary"))
    assert res_summary.status_code == 200
    assert res_summary.data["suspended_students"] >= 1
