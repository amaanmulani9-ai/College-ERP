import uuid

from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer_not_to_say", "Prefer not to say"),
    ]

    BLOOD_GROUP_CHOICES = [
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("O+", "O+"),
        ("O-", "O-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    code = models.CharField(max_length=50, blank=True, default="", db_index=True)
    first_name = models.CharField(max_length=150, blank=True, default="")
    middle_name = models.CharField(max_length=150, blank=True, default="")
    last_name = models.CharField(max_length=150, blank=True, default="")
    display_name = models.CharField(max_length=200, blank=True, default="")

    profile_photo = models.FileField(upload_to="avatars/", blank=True, null=True)
    cover_photo = models.FileField(upload_to="covers/", blank=True, null=True)
    signature_image = models.FileField(upload_to="signatures/", blank=True, null=True)

    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default="prefer_not_to_say")
    date_of_birth = models.DateField(blank=True, null=True)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES, blank=True, default="")
    nationality = models.CharField(max_length=100, blank=True, default="American")
    preferred_language = models.CharField(max_length=10, default="en")
    time_zone = models.CharField(max_length=50, default="UTC")
    biography = models.TextField(blank=True, default="")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"Profile for {self.user.email} ({self.get_full_name()})"

    def get_full_name(self):
        parts = [self.first_name, self.middle_name, self.last_name]
        full_name = " ".join([p for p in parts if p]).strip()
        return full_name if full_name else self.display_name or self.user.email


class UserContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="contact")
    primary_email = models.EmailField(blank=True, default="")
    secondary_email = models.EmailField(blank=True, default="")
    mobile_number = models.CharField(max_length=30, blank=True, default="")
    alternate_mobile = models.CharField(max_length=30, blank=True, default="")
    emergency_contact_name = models.CharField(max_length=150, blank=True, default="")
    emergency_contact_number = models.CharField(max_length=30, blank=True, default="")

    def __str__(self):
        return f"Contact info for {self.profile.user.email}"


class UserAddress(models.Model):
    ADDRESS_TYPES = [
        ("current", "Current Address"),
        ("permanent", "Permanent Address"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="addresses")
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default="current")
    address_line1 = models.CharField(max_length=255, blank=True, default="")
    address_line2 = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    state = models.CharField(max_length=100, blank=True, default="")
    country = models.CharField(max_length=100, blank=True, default="United States")
    postal_code = models.CharField(max_length=20, blank=True, default="")
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        unique_together = ("profile", "address_type")

    def __str__(self):
        return f"{self.address_type.title()} Address for {self.profile.user.email}"


class UserPreferences(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="preferences")
    theme = models.CharField(max_length=30, default="dark")
    dark_mode = models.BooleanField(default=True)
    notification_preferences = models.JSONField(default=dict, blank=True)
    time_format = models.CharField(max_length=10, default="12h")
    date_format = models.CharField(max_length=20, default="YYYY-MM-DD")
    language = models.CharField(max_length=10, default="en")
    dashboard_layout = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Preferences for {self.profile.user.email}"


class ProfileActivity(models.Model):
    ACTIVITY_TYPES = [
        ("profile_updated", "Profile Updated"),
        ("photo_changed", "Photo Changed"),
        ("password_changed", "Password Changed"),
        ("email_changed", "Email Changed"),
        ("login", "Login"),
        ("logout", "Logout"),
        ("role_changed", "Role Changed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="activities")
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.CharField(max_length=255)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Profile Activity"
        verbose_name_plural = "Profile Activities"

    def __str__(self):
        return f"[{self.activity_type}] {self.profile.user.email} at {self.timestamp}"
