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
from django.test import RequestFactory
from rest_framework.test import APIClient
from apps.authentication.models import User, TokenRecord, AuditLog

def main():
    print("=== TASK-003 VERIFICATION SUITE ===")
    
    # Run test DB migrations
    try:
        call_command("migrate_schemas", verbosity=0)
    except Exception:
        call_command("migrate", verbosity=0)

    client = APIClient()

    # 1. Test User Registration
    print("\n[1/4] Testing User Registration & Password Validation...")
    res_reg = client.post("/api/auth/register/", {
        "email": "professor@college.edu",
        "password": "EnterprisePassword123!",
        "first_name": "Jane",
        "last_name": "Smith",
        "phone_number": "+1 555 123 4567"
    }, format="json")
    print(f"  [OK] Registration Status: {res_reg.status_code} | User: {res_reg.data.get('user', {}).get('email')}")
    assert res_reg.status_code == 201
    assert "tokens" in res_reg.data

    # 2. Test Login & JWT Tokens
    print("\n[2/4] Testing Login & JWT Token Issuance...")
    res_login = client.post("/api/auth/login/", {
        "email": "professor@college.edu",
        "password": "EnterprisePassword123!"
    }, format="json")
    print(f"  [OK] Login Status: {res_login.status_code} | Tokens Received: {'access' in res_login.data.get('tokens', {})}")
    assert res_login.status_code == 200
    access_token = res_login.data["tokens"]["access"]
    refresh_token = res_login.data["tokens"]["refresh"]

    # 3. Test Account Lockout after 5 Failures
    print("\n[3/4] Testing Account Lockout Protection...")
    User.objects.create_user(email="target@college.edu", password="TargetPassword123!")
    for i in range(5):
        client.post("/api/auth/login/", {"email": "target@college.edu", "password": "WrongPassword!"}, format="json")
    
    user_target = User.objects.get(email="target@college.edu")
    print(f"  [OK] Failed Attempts: {user_target.failed_login_attempts} | Locked Out: {user_target.is_locked_out()}")
    assert user_target.is_locked_out() is True

    # 4. Test Authenticated Profile & Audit Log
    print("\n[4/4] Testing Authenticated Profile & Audit Log Generation...")
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    res_prof = client.get("/api/auth/profile/")
    print(f"  [OK] Profile Endpoint Status: {res_prof.status_code} | Name: {res_prof.data.get('full_name')}")
    assert res_prof.status_code == 200

    audit_count = AuditLog.objects.count()
    print(f"  [OK] Audit Logs Recorded: {audit_count}")
    assert audit_count > 0

    print("\nALL TASK-003 AUTHENTICATION VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    main()
