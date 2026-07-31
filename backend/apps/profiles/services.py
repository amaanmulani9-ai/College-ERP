from rest_framework.exceptions import ValidationError
from apps.authentication.services import get_client_ip
from .models import ProfileActivity


def calculate_profile_completion(profile):
    """Calculates profile completion percentage (0-100%) and returns missing required fields."""
    fields_to_check = [
        ("first_name", "First Name"),
        ("last_name", "Last Name"),
        ("profile_photo", "Profile Photo"),
        ("gender", "Gender"),
        ("date_of_birth", "Date of Birth"),
        ("blood_group", "Blood Group"),
        ("nationality", "Nationality"),
        ("biography", "Biography"),
    ]

    completed_count = 0
    missing_fields = []

    for attr, label in fields_to_check:
        val = getattr(profile, attr, None)
        if val:
            completed_count += 1
        else:
            missing_fields.append(label)

    # Check contact
    contact = getattr(profile, "contact", None)
    if contact and contact.mobile_number:
        completed_count += 1
    else:
        missing_fields.append("Mobile Number")

    total_fields = len(fields_to_check) + 1  # +1 for mobile
    percentage = int((completed_count / total_fields) * 100)

    return {
        "completion_percentage": percentage,
        "is_complete": percentage == 100,
        "completed_count": completed_count,
        "total_fields": total_fields,
        "missing_fields": missing_fields,
    }


def log_profile_activity(profile, activity_type, description, request=None, details=None):
    ip_address = get_client_ip(request) if request else None
    user_agent = request.META.get("HTTP_USER_AGENT", "") if request else ""

    return ProfileActivity.objects.create(
        profile=profile,
        activity_type=activity_type,
        description=description,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details or {},
    )


def validate_avatar_file(file):
    max_size = 5 * 1024 * 1024  # 5MB
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

    if file.size > max_size:
        raise ValidationError("File size exceeds 5MB limit.")
    if hasattr(file, "content_type") and file.content_type not in allowed_types:
        raise ValidationError("Unsupported file format. Allowed formats: JPEG, PNG, WEBP.")
    return True
