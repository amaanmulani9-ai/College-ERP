import pytest
from apps.academics.models import Department, Faculty
from apps.authentication.models import User
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee, EmployeeStatusHistory
from apps.staff.services import (
    generate_employee_code,
    reinstate_employee,
    restore_employee,
    retire_employee,
    soft_delete_employee,
    suspend_employee,
)
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.fixture
def setup_staff_foundation(db):
    faculty = Faculty.objects.create(name="School of Engineering", code="SOE")
    dept = Department.objects.create(faculty=faculty, name="Mechanical Engineering", code="ME")
    desig = Designation.objects.create(
        name="Assistant Professor", code="ASST_PROF", department=dept, category="teaching"
    )
    return {"dept": dept, "desig": desig}


@pytest.mark.django_db
def test_employee_code_generator(setup_staff_foundation):
    """Verifies Employee ID pattern EMP-YEAR-SEQUENCE."""
    code1 = generate_employee_code()
    assert code1.startswith("EMP-")
    assert code1.endswith("00001")


@pytest.mark.django_db
def test_employee_creation_and_status_transitions(setup_staff_foundation):
    """Verifies employee onboarding, status transitions, and audit tracking."""
    user = User.objects.create_user(email="prof.wilson@college.edu", password="Password123!")
    profile = UserProfile.objects.get(user=user)

    employee = Employee.objects.create(
        employee_id="EMP-2026-00001",
        employee_number="EMPN001",
        profile=profile,
        department=setup_staff_foundation["dept"],
        designation=setup_staff_foundation["desig"],
        employment_type="full_time",
        joining_date="2020-01-15",
        employment_status="active",
    )

    assert employee.employment_status == "active"
    assert EmployeeStatusHistory.objects.filter(employee=employee).count() == 0

    # Suspend
    suspend_employee(employee, reason="Audit inquiry")
    employee.refresh_from_db()
    assert employee.employment_status == "suspended"

    # Reinstate
    reinstate_employee(employee)
    employee.refresh_from_db()
    assert employee.employment_status == "active"

    # Retire
    retire_employee(employee)
    employee.refresh_from_db()
    assert employee.employment_status == "retired"
    assert EmployeeStatusHistory.objects.filter(employee=employee).count() == 3


@pytest.mark.django_db
def test_employee_soft_delete_and_restore(setup_staff_foundation):
    """Verifies soft deletion and restoration of employee records."""
    user = User.objects.create_user(email="staff.carter@college.edu", password="Password123!")
    profile = UserProfile.objects.get(user=user)

    employee = Employee.objects.create(
        employee_id="EMP-2026-00002",
        employee_number="EMPN002",
        profile=profile,
        department=setup_staff_foundation["dept"],
        designation=setup_staff_foundation["desig"],
        joining_date="2022-05-10",
    )

    soft_delete_employee(employee)
    assert Employee.objects.filter(id=employee.id).count() == 0
    assert Employee.all_objects.filter(id=employee.id).count() == 1

    restore_employee(employee)
    assert Employee.objects.filter(id=employee.id).count() == 1


@pytest.mark.django_db
def test_staff_rest_api_crud(setup_staff_foundation):
    """Verifies REST APIs for Designations, Employee Onboarding, and Dashboard Summary."""
    client = APIClient()
    admin_user = User.objects.create_superuser(email="hr_admin@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=admin_user)

    # 1. Designation List
    res_des = client.get(reverse("staff:designation-list"))
    assert res_des.status_code == 200

    # 2. Employee Onboarding API
    payload = {
        "first_name": "Sarah",
        "last_name": "Connor",
        "email": "sarah.connor@college.edu",
        "employee_number": "EMPN003",
        "department": str(setup_staff_foundation["dept"].id),
        "designation": str(setup_staff_foundation["desig"].id),
        "employment_type": "full_time",
        "joining_date": "2024-03-01",
    }
    res_create = client.post(reverse("staff:employee-list"), payload, format="json")
    assert res_create.status_code == 201
    assert res_create.data["employee_id"].startswith("EMP-")

    # 3. Staff Dashboard Summary
    res_summary = client.get(reverse("staff:dashboard_summary"))
    assert res_summary.status_code == 200
    assert res_summary.data["total_employees"] >= 1
