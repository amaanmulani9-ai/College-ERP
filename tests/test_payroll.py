"""
Unit and Integration Tests for Payroll Management System
=========================================================
Tests:
1. SalaryStructure & SalaryComponent CRUD
2. EmployeeSalaryAssignment Service
3. Progressive Tax Slab Calculation
4. Payroll Cycle & Automated Payroll Run Processing
5. Loan Creation & Automatic Installment Deduction
6. Payslip Generation & QR Validation Payload
7. Payroll REST API ViewSets & Dashboard KPIs Endpoint
8. Permissions & Access Control
"""

import decimal
from datetime import date
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.academics.models import Department, Faculty
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.payroll.models import (
    SalaryStructure,
    SalaryComponent,
    EmployeeSalaryAssignment,
    PayrollCycle,
    PayrollRun,
    Payslip,
    Allowance,
    Deduction,
    Bonus,
    Overtime,
    Loan,
    TaxSlab,
)
from apps.payroll.services.payroll_service import PayrollService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_payroll_data(db):
    admin_user = User.objects.create_user(
        email="admin.payroll@example.com",
        password="Password123!",
        first_name="Payroll",
        last_name="Admin",
        is_staff=True,
        is_superuser=True,
    )
    emp_user = User.objects.create_user(
        email="emp.payroll@example.com",
        password="Password123!",
        first_name="Faculty",
        last_name="Staff",
        is_staff=True,
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG-PAY")
    department = Department.objects.create(name="Computer Science", code="CS-PAY", faculty=faculty)
    desig = Designation.objects.create(name="Assistant Professor", code="AP-PAY", category="teaching")

    emp_profile, _ = UserProfile.objects.get_or_create(user=emp_user)
    employee = Employee.objects.create(
        employee_id="EMP-PAY-001",
        employee_number="EMPN-PAY-001",
        profile=emp_profile,
        department=department,
        designation=desig,
        joining_date=date.today(),
        employment_status="active",
    )

    structure = SalaryStructure.objects.create(
        structure_code="GRADE-A1",
        structure_name="Senior Assistant Professor Pay Scale",
        basic_salary=decimal.Decimal("50000.00"),
        grade="Grade A",
    )

    assignment = PayrollService.assign_salary_structure(
        employee_id=str(employee.id),
        salary_structure_id=str(structure.id),
        performed_by=admin_user,
    )

    cycle = PayrollCycle.objects.create(
        month=8,
        year=2026,
        start_date="2026-08-01",
        end_date="2026-08-31",
        status="draft",
    )

    # Tax slabs
    TaxSlab.objects.create(name="Standard Tax Slab", minimum_income=decimal.Decimal("30000.00"), percentage=decimal.Decimal("10.00"))

    return {
        "admin_user": admin_user,
        "emp_user": emp_user,
        "employee": employee,
        "structure": structure,
        "assignment": assignment,
        "cycle": cycle,
    }


# ===========================================================================
# 1. Salary & Tax Calculation Tests
# ===========================================================================

def test_salary_assignment(setup_payroll_data):
    assignment = setup_payroll_data["assignment"]
    assert assignment.status == "active"
    assert assignment.salary_structure.basic_salary == 50000.00


def test_tax_calculation(setup_payroll_data):
    taxable = decimal.Decimal("60000.00")
    tax = PayrollService.calculate_tax(taxable)
    assert tax > 0


def test_process_payroll_run(setup_payroll_data):
    employee = setup_payroll_data["employee"]
    cycle = setup_payroll_data["cycle"]

    Allowance.objects.create(employee=employee, allowance_type="HRA", amount=decimal.Decimal("10000.00"))
    Bonus.objects.create(employee=employee, bonus_type="Performance", amount=decimal.Decimal("5000.00"))
    Overtime.objects.create(employee=employee, hours=decimal.Decimal("10.00"), hourly_rate=decimal.Decimal("200.00"), amount=decimal.Decimal("2000.00"), date_logged=date.today())
    Deduction.objects.create(employee=employee, deduction_type="PF", amount=decimal.Decimal("3000.00"))

    run = PayrollService.process_employee_payroll_run(employee, cycle, performed_by=setup_payroll_data["admin_user"])

    assert run.gross_salary == 67000.00 # 50k basic + 10k HRA + 5k bonus + 2k OT
    assert run.net_salary < run.gross_salary
    assert hasattr(run, "payslip")
    assert "PAYSLIP:" in run.payslip.qr_code_data


def test_loan_deduction_in_payroll_run(setup_payroll_data):
    employee = setup_payroll_data["employee"]
    cycle = setup_payroll_data["cycle"]

    loan = Loan.objects.create(
        employee=employee,
        loan_type="Advance Salary",
        principal=decimal.Decimal("24000.00"),
        monthly_installment=decimal.Decimal("2000.00"),
        outstanding_balance=decimal.Decimal("24000.00"),
        is_active=True,
    )

    run = PayrollService.process_employee_payroll_run(employee, cycle, performed_by=setup_payroll_data["admin_user"])

    assert run.loan_deduction == 2000.00
    loan.refresh_from_db()
    assert loan.outstanding_balance == 22000.00


def test_process_payroll_cycle(setup_payroll_data):
    cycle = setup_payroll_data["cycle"]
    completed_cycle = PayrollService.process_payroll_cycle(str(cycle.id), performed_by=setup_payroll_data["admin_user"])

    assert completed_cycle.status == "completed"
    assert PayrollRun.objects.filter(cycle=completed_cycle).count() >= 1


# ===========================================================================
# 2. REST API & Permissions Tests
# ===========================================================================

def test_payroll_kpis_api(setup_payroll_data):
    client = APIClient()
    client.force_authenticate(user=setup_payroll_data["admin_user"])

    res = client.get("/api/payroll/dashboard/kpis/")
    assert res.status_code == 200
    assert "employees_processed" in res.data
    assert "total_payroll_amount" in res.data


def test_payroll_runs_api(setup_payroll_data):
    client = APIClient()
    client.force_authenticate(user=setup_payroll_data["admin_user"])

    res = client.get("/api/payroll/payroll-runs/")
    assert res.status_code == 200


def test_payroll_permissions_unauthenticated():
    client = APIClient()
    res = client.get("/api/payroll/salary-structures/")
    assert res.status_code == 401
