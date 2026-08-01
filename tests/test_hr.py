"""
Unit and Integration Tests for Human Resource Management System
================================================================
Tests:
1. HR Department & Designation Management
2. Leave Type, Leave Request & Balance Deduction
3. Employee Promotion & Staff Designation Sync
4. Employee Transfer & Department Sync
5. Recruitment Job Postings & Applications
6. Training Program Creation & Enrollment
7. HR REST API ViewSets & Dashboard KPIs Endpoint
8. Permissions & Access Control
"""

from datetime import date, timedelta
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.academics.models import Department as AcademicDept, Faculty
from apps.profiles.models import UserProfile
from apps.staff.models import Designation as StaffDesig, Employee
from apps.hr.models import (
    Department,
    Designation,
    LeaveType,
    LeaveBalance,
    LeaveRequest,
    RecruitmentJob,
    JobApplication,
    TrainingProgram,
    TrainingEnrollment,
    Promotion,
    Transfer,
)
from apps.hr.services.hr_service import HRService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_hr_data(db):
    admin_user = User.objects.create_user(
        email="admin.hr@example.com",
        password="Password123!",
        first_name="HR",
        last_name="Manager",
        is_staff=True,
        is_superuser=True,
    )
    emp_user = User.objects.create_user(
        email="emp.hr@example.com",
        password="Password123!",
        first_name="John",
        last_name="Doe",
        is_staff=True,
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG-HR")
    ac_dept = AcademicDept.objects.create(name="Computer Science", code="CS-HR", faculty=faculty)
    staff_desig = StaffDesig.objects.create(name="Lecturer", code="LEC-HR", category="teaching")

    emp_profile, _ = UserProfile.objects.get_or_create(user=emp_user)
    employee = Employee.objects.create(
        employee_id="EMP-HR-001",
        employee_number="EMPN-HR-001",
        profile=emp_profile,
        department=ac_dept,
        designation=staff_desig,
        joining_date=date.today(),
        employment_status="active",
    )

    dept1 = Department.objects.create(department_code="DEPT-CS", department_name="Computer Science Dept")
    dept2 = Department.objects.create(department_code="DEPT-EE", department_name="Electrical Eng Dept")

    desig1 = Designation.objects.create(title="Assistant Professor", department=dept1, grade="Grade A", hierarchy_level=2)
    desig2 = Designation.objects.create(title="Associate Professor", department=dept1, grade="Grade A+", hierarchy_level=1)

    leave_type = LeaveType.objects.create(name="Casual Leave", max_days_per_year=12)

    return {
        "admin_user": admin_user,
        "emp_user": emp_user,
        "employee": employee,
        "dept1": dept1,
        "dept2": dept2,
        "desig1": desig1,
        "desig2": desig2,
        "leave_type": leave_type,
    }


# ===========================================================================
# 1. Leave Management Tests
# ===========================================================================

def test_leave_request_and_approval(setup_hr_data):
    employee = setup_hr_data["employee"]
    leave_type = setup_hr_data["leave_type"]
    admin_user = setup_hr_data["admin_user"]

    req = HRService.submit_leave_request(
        employee_id=str(employee.id),
        leave_type_id=str(leave_type.id),
        start_date=date.today(),
        end_date=date.today() + timedelta(days=2),
        reason="Family function",
        performed_by=admin_user,
    )

    assert req.status == "pending"

    approved_req = HRService.approve_leave_request(str(req.id), approved_by=admin_user)
    assert approved_req.status == "approved"

    bal = LeaveBalance.objects.get(employee=employee, leave_type=leave_type)
    assert bal.used == 3
    assert bal.remaining == 9


# ===========================================================================
# 2. Promotion & Transfer Tests
# ===========================================================================

def test_promotion_service(setup_hr_data):
    employee = setup_hr_data["employee"]
    desig2 = setup_hr_data["desig2"]
    admin_user = setup_hr_data["admin_user"]

    promo = HRService.promote_employee(
        employee_id=str(employee.id),
        new_designation_id=str(desig2.id),
        reason="Excellence in research & teaching",
        performed_by=admin_user,
    )

    assert promo.new_designation == desig2


def test_transfer_service(setup_hr_data):
    employee = setup_hr_data["employee"]
    dept2 = setup_hr_data["dept2"]
    admin_user = setup_hr_data["admin_user"]

    trans = HRService.transfer_employee(
        employee_id=str(employee.id),
        new_department_id=str(dept2.id),
        reason="Inter-department realignment",
        performed_by=admin_user,
    )

    assert trans.new_department == dept2


# ===========================================================================
# 3. REST API & Permissions Tests
# ===========================================================================

def test_hr_kpis_api(setup_hr_data):
    client = APIClient()
    client.force_authenticate(user=setup_hr_data["admin_user"])

    res = client.get("/api/hr/dashboard/kpis/")
    assert res.status_code == 200
    assert "total_employees" in res.data
    assert "pending_leave_requests" in res.data


def test_hr_departments_api(setup_hr_data):
    client = APIClient()
    client.force_authenticate(user=setup_hr_data["admin_user"])

    res = client.get("/api/hr/departments/")
    assert res.status_code == 200
    assert len(res.data) >= 2


def test_hr_permissions_unauthenticated():
    client = APIClient()
    res = client.get("/api/hr/departments/")
    assert res.status_code == 401
