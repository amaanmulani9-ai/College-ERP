import os
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.test"

import django
django.setup()

from django.core.management import call_command
from rest_framework.test import APIClient
from apps.authentication.models import User
from apps.profiles.models import UserProfile
from apps.academics.models import Faculty, Department
from apps.staff.models import Designation, Employee, EmployeeStatusHistory
from apps.staff.services import generate_employee_code, suspend_employee, reinstate_employee, retire_employee, soft_delete_employee, restore_employee

def main():
    print("=== TASK-008 STAFF & EMPLOYEE MANAGEMENT VERIFICATION SUITE ===")
    
    try:
        call_command("migrate_schemas", verbosity=0)
    except Exception:
        call_command("migrate", verbosity=0)

    # 1. Setup Academic & Organizational Foundations
    print("\n[1/5] Setting up Organizational Foundations...")
    faculty = Faculty.objects.create(name="School of Business", code="SOB")
    dept = Department.objects.create(faculty=faculty, name="Finance & Accounting", code="FA")
    desig = Designation.objects.create(name="Professor & Head", code="PROF_HOD", department=dept, category="teaching")
    print("  [OK] Department & Designation initialized.")

    # 2. Test Employee Code Generator
    print("\n[2/5] Testing Auto Employee ID Generator...")
    code1 = generate_employee_code()
    print(f"  [OK] Generated Employee Code 1: {code1}")
    assert code1.startswith("EMP-")
    assert code1.endswith("00001")

    # 3. Create Employee & User Profile Binding
    print("\n[3/5] Testing Staff Onboarding & Profile Binding...")
    user = User.objects.create_user(email="prof.clark@college.edu", password="Password123!")
    profile = UserProfile.objects.get(user=user)

    emp = Employee.objects.create(
        employee_id=code1,
        employee_number="EMPN101",
        profile=profile,
        department=dept,
        designation=desig,
        joining_date="2018-09-01",
        qualification="Ph.D. in Finance",
        experience_years=12.5,
        work_email="clark@college.edu",
    )
    print(f"  [OK] Employee Created: {emp.employee_id} | Profile: {emp.profile.user.email} | Rank: {emp.designation.name}")
    assert emp.profile.user.email == "prof.clark@college.edu"

    # 4. Test Lifecycle Transitions & History Auditing
    print("\n[4/5] Testing Lifecycle Transitions (Suspend -> Reinstate -> Retire)...")
    suspend_employee(emp, reason="Pending inquiry")
    emp.refresh_from_db()
    assert emp.employment_status == "suspended"

    reinstate_employee(emp)
    emp.refresh_from_db()
    assert emp.employment_status == "active"

    retire_employee(emp)
    emp.refresh_from_db()
    assert emp.employment_status == "retired"

    history_count = EmployeeStatusHistory.objects.filter(employee=emp).count()
    print(f"  [OK] Status Transitions Executed. History Records Count: {history_count}")
    assert history_count == 3

    # 5. Test REST APIs & Dashboard Summary
    print("\n[5/5] Testing REST APIs & Dashboard Summary...")
    client = APIClient()
    admin_user = User.objects.create_superuser(email="hr_director@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=admin_user)

    res_list = client.get("/api/staff/employees/")
    res_desig = client.get("/api/staff/designations/")
    res_summary = client.get("/api/staff/dashboard-summary/")
    print(f"  [OK] Staff List API: {res_list.status_code} | Designations API: {res_desig.status_code}")
    print(f"  [OK] Staff Summary API: {res_summary.status_code} | Total Employees: {res_summary.data['total_employees']}")
    assert res_list.status_code == 200
    assert res_desig.status_code == 200
    assert res_summary.status_code == 200

    print("\nALL TASK-008 STAFF & EMPLOYEE MANAGEMENT VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    main()
