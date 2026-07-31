import secrets
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.db import connection
from .models import AuditLog, TokenRecord


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


def log_audit_event(request, event_type, user=None, details=None):
    schema_name = getattr(connection, "schema_name", "public")
    ip_address = get_client_ip(request) if request else None
    user_agent = request.META.get("HTTP_USER_AGENT", "") if request else ""

    return AuditLog.objects.create(
        user=user if (user and user.is_authenticated) else (user if user else None),
        event_type=event_type,
        tenant_schema=schema_name,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details or {},
    )


def create_token_record(user, token_type, expires_in_hours=24):
    raw_token = secrets.token_urlsafe(32)
    expires_at = timezone.now() + timedelta(hours=expires_in_hours)
    token_record = TokenRecord.objects.create(
        user=user,
        token=raw_token,
        token_type=token_type,
        expires_at=expires_at,
    )
    return token_record.token


def send_verification_email(user, token):
    subject = "Verify Your College ERP Email Address"
    verify_url = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/verify-email?token={token}"
    message = f"Hello {user.get_full_name()},\n\nPlease verify your email address by clicking the link below:\n{verify_url}\n\nThis link will expire in 24 hours."
    send_mail(
        subject=subject,
        message=message,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
        recipient_list=[user.email],
        fail_silently=True,
    )


def send_password_reset_email(user, token):
    subject = "Reset Your College ERP Password"
    reset_url = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/reset-password?token={token}"
    message = f"Hello {user.get_full_name()},\n\nYou requested a password reset. Click the link below to set a new password:\n{reset_url}\n\nThis link will expire in 1 hour."
    send_mail(
        subject=subject,
        message=message,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
        recipient_list=[user.email],
        fail_silently=True,
    )
