import pytest
from apps.academics.models import (
    AcademicSession,
    Department,
    Faculty,
    Program,
    Semester,
    Subject,
    SubjectOffering,
)
from apps.authentication.models import User
from django.core.exceptions import ValidationError
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_academic_hierarchy_creation():
    """Verifies creation of full academic hierarchy (Faculty -> Department -> Program -> Semester -> Subject -> Offering)."""
    faculty = Faculty.objects.create(name="Faculty of Science", code="FSC")
    dept = Department.objects.create(faculty=faculty, name="Computer Science", code="CS")
    prog = Program.objects.create(
        department=dept, name="Bachelor of Computer Applications", code="BCA", degree_level="UG"
    )
    sem = Semester.objects.create(program=prog, semester_number=1, name="Semester 1")
    subject = Subject.objects.create(semester=sem, code="CS101", name="Programming in C", credits=4)
    session = AcademicSession.objects.create(
        name="2025–2026", start_date="2025-08-01", end_date="2026-05-31", is_current=True
    )
    offering = SubjectOffering.objects.create(subject=subject, session=session, department=dept, capacity=60)

    assert faculty.departments.count() == 1
    assert dept.programs.count() == 1
    assert prog.semesters.count() == 1
    assert sem.subjects.count() == 1
    assert offering.subject.code == "CS101"


@pytest.mark.django_db
def test_academic_session_single_current_rule():
    """Verifies that setting a new session as current automatically unsets all other current sessions."""
    s1 = AcademicSession.objects.create(
        name="2024–2025", start_date="2024-08-01", end_date="2025-05-31", is_current=True
    )
    assert s1.is_current is True

    s2 = AcademicSession.objects.create(
        name="2025–2026", start_date="2025-08-01", end_date="2026-05-31", is_current=True
    )
    s1.refresh_from_db()

    assert s2.is_current is True
    assert s1.is_current is False


@pytest.mark.django_db
def test_soft_delete_and_child_protection():
    """Verifies that parent entities with active child entities cannot be soft deleted."""
    faculty = Faculty.objects.create(name="Faculty of Technology", code="FTECH")
    dept = Department.objects.create(faculty=faculty, name="Information Technology", code="IT")

    with pytest.raises(ValidationError):
        faculty.soft_delete()

    # Soft delete child department first
    dept.soft_delete()
    assert dept.is_deleted is True

    # Now faculty soft delete should succeed
    faculty.soft_delete()
    assert faculty.is_deleted is True


@pytest.mark.django_db
def test_academics_rest_api_crud():
    """Verifies REST API endpoints for Faculties, Departments, and Programs."""
    client = APIClient()
    user = User.objects.create_superuser(email="academic_admin@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=user)

    # 1. Create Faculty
    res_f = client.post(
        reverse("academics:faculty-list"), {"name": "Faculty of Commerce", "code": "FCOM"}, format="json"
    )
    assert res_f.status_code == 201
    faculty_id = res_f.data["id"]

    # 2. Create Department
    res_d = client.post(
        reverse("academics:department-list"),
        {"faculty": faculty_id, "name": "Accounting & Finance", "code": "AF"},
        format="json",
    )
    assert res_d.status_code == 201
    dept_id = res_d.data["id"]

    # 3. Create Program
    res_p = client.post(
        reverse("academics:program-list"),
        {"department": dept_id, "name": "Bachelor of Commerce", "code": "BCom", "degree_level": "UG"},
        format="json",
    )
    assert res_p.status_code == 201
    assert res_p.data["code"] == "BCom"
