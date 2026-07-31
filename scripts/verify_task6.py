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
from apps.academics.models import (
    AcademicSession,
    Department,
    Faculty,
    Program,
    Semester,
    Subject,
    SubjectOffering,
)

def main():
    print("=== TASK-006 VERIFICATION SUITE ===")
    
    # Run test DB migrations
    try:
        call_command("migrate_schemas", verbosity=0)
    except Exception:
        call_command("migrate", verbosity=0)

    # 1. Test Full Hierarchy Creation
    print("\n[1/4] Testing Academic Hierarchy (Faculty -> Department -> Program -> Semester -> Subject -> Offering)...")
    faculty = Faculty.objects.create(name="School of Computing", code="SOC")
    dept = Department.objects.create(faculty=faculty, name="Software Engineering", code="SE")
    prog = Program.objects.create(department=dept, name="Bachelor of Science in IT", code="BSc IT", degree_level="UG")
    sem = Semester.objects.create(program=prog, semester_number=1, name="Semester 1")
    subject = Subject.objects.create(semester=sem, code="IT101", name="Introduction to Information Technology", credits=4)
    session = AcademicSession.objects.create(name="2025–2026", start_date="2025-08-01", end_date="2026-05-31", is_current=True)
    offering = SubjectOffering.objects.create(subject=subject, session=session, department=dept, capacity=75)

    print(f"  [OK] Hierarchy Built: {faculty.code} -> {dept.code} -> {prog.code} -> {subject.code} Offering Cap: {offering.capacity}")
    assert offering.subject.code == "IT101"

    # 2. Test Academic Session Single Current Rule
    print("\n[2/4] Testing Academic Session Single Current Rule...")
    session2 = AcademicSession.objects.create(name="2026–2027", start_date="2026-08-01", end_date="2027-05-31", is_current=True)
    session.refresh_from_db()
    print(f"  [OK] Session 1 (2025-2026) Current: {session.is_current} | Session 2 (2026-2027) Current: {session2.is_current}")
    assert session2.is_current is True
    assert session.is_current is False

    # 3. Test Soft Delete Protection
    print("\n[3/4] Testing Soft Delete Protection Safeguard...")
    try:
        faculty.soft_delete()
        print("  [FAIL] Faculty soft delete should have been blocked!")
        sys.exit(1)
    except Exception as e:
        print(f"  [OK] Soft Delete Protection Caught: {e}")

    # 4. Test REST APIs
    print("\n[4/4] Testing Academic REST APIs...")
    client = APIClient()
    user = User.objects.create_superuser(email="acad_admin@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=user)

    res_f = client.get("/api/academics/faculties/")
    res_p = client.get("/api/academics/programs/")
    res_s = client.get("/api/academics/subjects/")
    print(f"  [OK] Faculties API: {res_f.status_code} | Programs API: {res_p.status_code} | Subjects API: {res_s.status_code}")
    assert res_f.status_code == 200
    assert res_p.status_code == 200
    assert res_s.status_code == 200

    print("\nALL TASK-006 ACADEMIC STRUCTURE ENGINE VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    main()
