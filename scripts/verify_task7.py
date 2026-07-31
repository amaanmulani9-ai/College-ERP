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
from apps.academics.models import Faculty, Department, Program, Semester, AcademicSession
from apps.students.models import Student, StudentStatusHistory
from apps.students.services import generate_student_code, suspend_student, reinstate_student, graduate_student, soft_delete_student, restore_student

def main():
    print("=== TASK-007 STUDENT MANAGEMENT SYSTEM VERIFICATION SUITE ===")
    
    try:
        call_command("migrate_schemas", verbosity=0)
    except Exception:
        call_command("migrate", verbosity=0)

    # 1. Setup Academic Foundations
    print("\n[1/5] Setting up Academic Foundations...")
    faculty = Faculty.objects.create(name="Faculty of Science", code="FSC")
    dept = Department.objects.create(faculty=faculty, name="Computer Science", code="CS")
    prog = Program.objects.create(department=dept, name="BSc Computer Science", code="BSCCS", degree_level="UG")
    sem = Semester.objects.create(program=prog, semester_number=1, name="Semester 1")
    session = AcademicSession.objects.create(name="2025–2026", start_date="2025-08-01", end_date="2026-05-31", is_current=True)
    print("  [OK] Academic entities initialized.")

    # 2. Test Student Code Generator
    print("\n[2/5] Testing Auto Student ID Generator...")
    code1 = generate_student_code(prog.code)
    code2 = generate_student_code(prog.code)
    print(f"  [OK] Generated Student Code 1: {code1}")
    assert code1.startswith("ERP-")
    assert "BSCCS" in code1

    # 3. Create Student & Verify User Profile Binding
    print("\n[3/5] Testing Student Onboarding & Profile Binding...")
    user = User.objects.create_user(email="david.miller@college.edu", password="Password123!")
    profile = UserProfile.objects.get(user=user)

    student = Student.objects.create(
        student_id=code1,
        enrollment_number="ENR999",
        profile=profile,
        program=prog,
        department=dept,
        current_semester=sem,
        academic_session=session,
        admission_date="2025-08-01",
        father_name="Robert Miller",
        guardian_name="Robert Miller",
        guardian_phone="+1234567890",
        emergency_contact="+1234567890",
    )
    print(f"  [OK] Student Created: {student.student_id} | Profile: {student.profile.user.email}")
    assert student.profile.user.email == "david.miller@college.edu"

    # 4. Test Lifecycle & Status History Auditing
    print("\n[4/5] Testing Lifecycle Transitions (Suspend -> Reinstate -> Graduate)...")
    suspend_student(student, reason="Library book overdue penalty")
    student.refresh_from_db()
    assert student.status == "suspended"

    reinstate_student(student)
    student.refresh_from_db()
    assert student.status == "active"

    graduate_student(student)
    student.refresh_from_db()
    assert student.status == "graduated"

    history_count = StudentStatusHistory.objects.filter(student=student).count()
    print(f"  [OK] Lifecycle Transitions Executed Successfully. Audit Logs Count: {history_count}")
    assert history_count == 3

    # 5. Test REST APIs & Dashboard Summary
    print("\n[5/5] Testing REST APIs & Dashboard Summary...")
    client = APIClient()
    admin_user = User.objects.create_superuser(email="super_admin@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=admin_user)

    res_list = client.get("/api/students/")
    res_summary = client.get("/api/students/dashboard-summary/")
    print(f"  [OK] Student List API: {res_list.status_code} | Total Students in List: {len(res_list.data['results'] if 'results' in res_list.data else res_list.data)}")
    print(f"  [OK] Dashboard Summary API: {res_summary.status_code} | Total: {res_summary.data['total_students']} | Graduated: {res_summary.data['graduated_students']}")
    assert res_list.status_code == 200
    assert res_summary.status_code == 200

    print("\nALL TASK-007 STUDENT MANAGEMENT SYSTEM VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    main()
