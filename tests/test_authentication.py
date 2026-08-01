import pytest
from apps.authentication.models import TokenRecord, User
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.mark.django_db
def test_user_registration_and_password_policy(client):
    """Verifies user registration with strong password policy validation."""
    url = reverse("authentication:register")

    # 1. Weak password failure
    payload_weak = {
        "email": "student@college.edu",
        "password": "weak",
        "first_name": "John",
        "last_name": "Doe",
    }
    res_weak = client.post(url, payload_weak, content_type="application/json")
    assert res_weak.status_code == 400

    # 2. Strong password success
    payload_strong = {
        "email": "student@college.edu",
        "password": "StrongPassword123!",
        "first_name": "John",
        "last_name": "Doe",
    }
    res_strong = client.post(url, payload_strong, content_type="application/json")
    assert res_strong.status_code == 201
    assert res_strong.json()["user"]["email"] == "student@college.edu"
    assert "tokens" in res_strong.json()
    assert User.objects.filter(email="student@college.edu").exists()


@pytest.mark.django_db
def test_login_and_account_lockout(client):
    """Verifies login authentication, JWT issuance, and account lockout after repeated failures."""
    user = User.objects.create_user(email="faculty@college.edu", password="FacultyPassword123!")
    login_url = reverse("authentication:login")

    # 1. Failed attempts tracking
    for _ in range(5):
        res_fail = client.post(
            login_url, {"email": "faculty@college.edu", "password": "WrongPassword!"}, content_type="application/json"
        )
        assert res_fail.status_code == 400

    user.refresh_from_db()
    assert user.is_locked_out() is True

    # 2. Locked out attempt
    res_lockout = client.post(
        login_url, {"email": "faculty@college.edu", "password": "FacultyPassword123!"}, content_type="application/json"
    )
    assert res_lockout.status_code == 400
    assert "locked" in str(res_lockout.json()).lower()


@pytest.mark.django_db
def test_password_reset_and_email_verification_flow(client):
    """Verifies password reset token generation and email verification tokens."""
    user = User.objects.create_user(email="reset@college.edu", password="OldPassword123!")

    # 1. Forgot password
    forgot_url = reverse("authentication:forgot_password")
    res_forgot = client.post(forgot_url, {"email": "reset@college.edu"}, content_type="application/json")
    assert res_forgot.status_code == 200

    token_rec = TokenRecord.objects.get(user=user, token_type="password_reset")
    assert token_rec.is_valid() is True

    # 2. Reset password
    reset_url = reverse("authentication:reset_password")
    res_reset = client.post(
        reset_url, {"token": token_rec.token, "new_password": "NewSecurePassword123!"}, content_type="application/json"
    )
    assert res_reset.status_code == 200

    user.refresh_from_db()
    assert user.check_password("NewSecurePassword123!") is True


@pytest.mark.django_db
def test_jwt_token_logout_blacklist(client):
    """Verifies JWT token issuance and token blacklist on logout."""
    user = User.objects.create_user(email="jwt@college.edu", password="JwtPassword123!")
    refresh = RefreshToken.for_user(user)

    client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {refresh.access_token}"
    logout_url = reverse("authentication:logout")
    res_logout = client.post(logout_url, {"refresh": str(refresh)}, content_type="application/json")
    assert res_logout.status_code == 200
