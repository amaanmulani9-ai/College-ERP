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
from apps.profiles.models import UserProfile, UserContact, UserPreferences
from apps.profiles.services import calculate_profile_completion

def main():
    print("=== TASK-005 VERIFICATION SUITE ===")
    
    # Run test DB migrations
    try:
        call_command("migrate_schemas", verbosity=0)
    except Exception:
        call_command("migrate", verbosity=0)

    # 1. Test Auto Profile Creation Signal
    print("\n[1/4] Testing Automatic Profile Creation Signal...")
    user = User.objects.create_user(email="dr_smith@college.edu", password="SmithPassword123!", first_name="John", last_name="Smith")
    profile = user.profile
    print(f"  [OK] Profile Auto-Created: {profile.get_full_name()} | Contact Primary Email: {profile.contact.primary_email}")
    assert profile.first_name == "John"
    assert profile.contact.primary_email == "dr_smith@college.edu"
    assert profile.preferences.theme == "dark"

    # 2. Test Profile Completion Calculator
    print("\n[2/4] Testing Profile Completion Score & Missing Fields Calculation...")
    comp_before = calculate_profile_completion(profile)
    print(f"  [OK] Initial Completion Percentage: {comp_before['completion_percentage']}% | Missing: {len(comp_before['missing_fields'])} fields")
    assert comp_before["completion_percentage"] < 100

    profile.gender = "male"
    profile.date_of_birth = "1985-06-20"
    profile.blood_group = "O+"
    profile.nationality = "American"
    profile.biography = "Senior Professor of Mathematics."
    profile.contact.mobile_number = "+1 555 987 6543"
    profile.contact.save()
    profile.save()

    comp_after = calculate_profile_completion(profile)
    print(f"  [OK] Updated Completion Percentage: {comp_after['completion_percentage']}%")
    assert comp_after["completion_percentage"] > comp_before["completion_percentage"]

    # 3. Test Profile API Endpoints & Preferences
    print("\n[3/4] Testing Profile & User Preferences API Endpoints...")
    client = APIClient()
    client.force_authenticate(user=user)

    res_prof = client.get("/api/profiles/me/")
    print(f"  [OK] /api/profiles/me/ Status: {res_prof.status_code} | Name: {res_prof.data.get('full_name')}")
    assert res_prof.status_code == 200

    res_pref = client.patch("/api/profiles/me/preferences/", {"time_format": "24h", "theme": "glassmorphic"}, format="json")
    print(f"  [OK] Preferences Updated: Time Format = {res_pref.data.get('time_format')}")
    assert res_pref.status_code == 200
    assert res_pref.data["time_format"] == "24h"

    # 4. Test Search API
    print("\n[4/4] Testing Profile Search API...")
    res_search = client.get("/api/profiles/search/?q=Smith")
    print(f"  [OK] Search Status: {res_search.status_code} | Matches Found: {len(res_search.data.get('results', []))}")
    assert res_search.status_code == 200
    assert len(res_search.data["results"]) >= 1

    print("\nALL TASK-005 USER PROFILE VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    main()
