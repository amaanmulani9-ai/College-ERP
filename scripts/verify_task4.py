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
from apps.rbac.models import Permission, Role, UserRole
from apps.rbac.seeders import seed_rbac_defaults
from apps.rbac.services import PermissionResolver, assign_role_to_user

def main():
    print("=== TASK-004 VERIFICATION SUITE ===")
    
    # Run test DB migrations
    try:
        call_command("migrate_schemas", verbosity=0)
    except Exception:
        call_command("migrate", verbosity=0)

    # 1. Seed RBAC Defaults
    print("\n[1/4] Seeding 14 Default Roles & Permission Catalog...")
    seed_rbac_defaults(tenant_schema="public")
    role_count = Role.objects.count()
    perm_count = Permission.objects.count()
    print(f"  [OK] Default Roles Seeded: {role_count} | Permissions Seeded: {perm_count}")
    assert role_count == 14
    assert perm_count >= 20

    # 2. Multi-Role User Assignment (Teacher + Placement Officer)
    print("\n[2/4] Testing Multi-Role User Assignment & Permission Resolution...")
    user = User.objects.create_user(email="teacher_po@college.edu", password="TeacherPassword123!")
    r_teacher = Role.objects.get(name="Teacher")
    r_po = Role.objects.get(name="Placement Officer")

    assign_role_to_user(user, r_teacher)
    assign_role_to_user(user, r_po)

    resolved = PermissionResolver.get_user_permission_codes(user)
    print(f"  [OK] Assigned Roles: Teacher + Placement Officer | Total Permissions Resolved: {len(resolved)}")
    assert "attendance.mark" in resolved
    assert "placement.manage" in resolved

    # 3. Test Role API & Cloning
    print("\n[3/4] Testing Role Management API & Role Cloning...")
    client = APIClient()
    admin_user = User.objects.create_superuser(email="admin_rbac@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=admin_user)

    teacher_role = Role.objects.get(name="Teacher")
    res_clone = client.post(f"/api/rbac/roles/{teacher_role.id}/clone/", {"new_name": "Senior Teacher"}, format="json")
    print(f"  [OK] Role Cloned: {res_clone.data.get('name')} | Granted Perms: {res_clone.data.get('permissions_count')}")
    assert res_clone.status_code == 201

    # 4. Test Matrix APIs
    print("\n[4/4] Testing Permission & Role Matrix Datasets...")
    res_pm = client.get("/api/rbac/matrix/permissions/")
    res_rm = client.get("/api/rbac/matrix/roles/")
    print(f"  [OK] Permission Matrix Status: {res_pm.status_code} | Role Matrix Status: {res_rm.status_code}")
    assert res_pm.status_code == 200
    assert res_rm.status_code == 200

    print("\nALL TASK-004 RBAC VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    main()
