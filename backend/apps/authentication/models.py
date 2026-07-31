import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer_not_to_say", "Prefer not to say"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, default="")
    last_name = models.CharField(max_length=150, blank=True, default="")
    phone_number = models.CharField(max_length=30, blank=True, default="")
    profile_photo = models.FileField(upload_to="profile_photos/", blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default="prefer_not_to_say")
    preferred_language = models.CharField(max_length=10, default="en")
    time_zone = models.CharField(max_length=50, default="UTC")

    is_email_verified = models.BooleanField(default=False)
    failed_login_attempts = models.IntegerField(default=0)
    lockout_until = models.DateTimeField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "User Account"
        verbose_name_plural = "User Accounts"

    def __str__(self):
        return f"{self.email} ({self.get_full_name() or 'User'})"

    def get_full_name(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.email

    def is_locked_out(self):
        if self.lockout_until and timezone.now() < self.lockout_until:
            return True
        return False


class AuditLog(models.Model):
    EVENT_TYPES = [
        ("login_success", "Login Success"),
        ("login_failure", "Login Failure"),
        ("logout", "Logout"),
        ("password_change", "Password Change"),
        ("password_reset_request", "Password Reset Request"),
        ("password_reset_confirm", "Password Reset Confirmation"),
        ("email_change", "Email Change"),
        ("email_verified", "Email Verified"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    tenant_schema = models.CharField(max_length=100, default="public")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.user or 'Anonymous'} at {self.timestamp}"


class TokenRecord(models.Model):
    TOKEN_TYPES = [
        ("email_verification", "Email Verification"),
        ("password_reset", "Password Reset"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tokens")
    token = models.CharField(max_length=128, unique=True, db_index=True)
    token_type = models.CharField(max_length=30, choices=TOKEN_TYPES)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at
