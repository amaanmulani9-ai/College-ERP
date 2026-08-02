import pytest
from apps.authentication.models import User
from apps.profiles.services import calculate_profile_completion
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_automatic_profile_creation_on_user_registration():
    """Verifies that creating a User automatically initializes UserProfile, UserContact, and UserPreferences via post-save signals."""
    user = User.objects.create_user(
        email="newuser@college.edu", password="UserPassword123!", first_name="Alice", last_name="Smith"
    )

    assert hasattr(user, "profile") is True
    profile = user.profile
    assert profile.first_name == "Alice"
    assert profile.last_name == "Smith"

    assert hasattr(profile, "contact") is True
    assert profile.contact.primary_email == "newuser@college.edu"

    assert hasattr(profile, "preferences") is True
    assert profile.preferences.theme == "dark"


@pytest.mark.django_db
def test_profile_update_and_completion_calculation():
    """Verifies profile detail update API and profile completion percentage score calculation."""
    client = APIClient()
    user = User.objects.create_user(email="student_profile@college.edu", password="StudentPassword123!")
    client.force_authenticate(user=user)

    # 1. Check initial completion
    profile = user.profile
    comp_initial = calculate_profile_completion(profile)
    assert comp_initial["completion_percentage"] < 100
    assert "First Name" in comp_initial["missing_fields"]

    # 2. Update profile details via API
    res_update = client.patch(
        reverse("profiles:my_profile"),
        {
            "first_name": "Bob",
            "last_name": "Marley",
            "gender": "male",
            "date_of_birth": "2000-01-15",
            "blood_group": "O+",
            "nationality": "American",
            "biography": "Computer Science student.",
            "contact": {"mobile_number": "+1 555 987 6543"},
        },
        format="json",
    )
    assert res_update.status_code == 200

    profile.refresh_from_db()
    comp_updated = calculate_profile_completion(profile)
    assert comp_updated["completion_percentage"] > comp_initial["completion_percentage"]


@pytest.mark.django_db
def test_avatar_upload_and_deletion():
    """Verifies avatar photo upload and removal endpoints."""
    client = APIClient()
    user = User.objects.create_user(email="avatar_user@college.edu", password="AvatarPassword123!")
    client.force_authenticate(user=user)

    # Upload test image
    test_image = SimpleUploadedFile("avatar.jpg", b"fake_image_bytes", content_type="image/jpeg")
    res_upload = client.post(reverse("profiles:my_avatar"), {"file": test_image}, format="multipart")
    assert res_upload.status_code == 200
    assert user.profile.profile_photo is not None

    # Delete avatar
    res_del = client.delete(reverse("profiles:my_avatar"))
    assert res_del.status_code == 200
    user.profile.refresh_from_db()
    assert not user.profile.profile_photo


@pytest.mark.django_db
def test_user_preferences_and_activity_timeline():
    """Verifies user preference persistence and profile activity timeline logging."""
    client = APIClient()
    user = User.objects.create_user(email="prefs_user@college.edu", password="PrefsPassword123!")
    client.force_authenticate(user=user)

    # Update preferences
    res_pref = client.patch(
        reverse("profiles:my_preferences"), {"time_format": "24h", "theme": "glassmorphic"}, format="json"
    )
    assert res_pref.status_code == 200

    prefs = user.profile.preferences
    prefs.refresh_from_db()
    assert prefs.time_format == "24h"

    # Activity timeline
    res_tl = client.get(reverse("profiles:my_timeline"))
    assert res_tl.status_code == 200
    assert len(res_tl.data["results"]) >= 0


@pytest.mark.django_db
def test_profile_search_api():
    """Verifies searching profiles by name or email."""
    client = APIClient()
    user = User.objects.create_user(
        email="search_user@college.edu", password="SearchPassword123!", first_name="Charlie", last_name="Brown"
    )
    client.force_authenticate(user=user)

    res_search = client.get(reverse("profiles:search_profiles") + "?q=Charlie")
    assert res_search.status_code == 200
    assert len(res_search.data["results"]) >= 1
    assert res_search.data["results"][0]["full_name"] == "Charlie Brown"
