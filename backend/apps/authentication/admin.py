from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import AuditLog, TokenRecord, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "username", "first_name", "last_name", "is_email_verified", "is_active", "is_staff")
    list_filter = ("is_active", "is_staff", "is_email_verified", "created_at")
    search_fields = ("email", "username", "first_name", "last_name", "phone_number")
    ordering = ("-created_at",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "username",
                    "phone_number",
                    "profile_photo",
                    "date_of_birth",
                    "gender",
                    "preferred_language",
                    "time_zone",
                )
            },
        ),
        (
            "Permissions & Status",
            {
                "fields": (
                    "is_active",
                    "is_email_verified",
                    "is_staff",
                    "is_superuser",
                    "failed_login_attempts",
                    "lockout_until",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Timestamps", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    readonly_fields = ("last_login", "created_at", "updated_at")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "event_type", "user", "tenant_schema", "ip_address")
    list_filter = ("event_type", "tenant_schema", "timestamp")
    search_fields = ("user__email", "tenant_schema", "ip_address", "event_type")
    readonly_fields = ("id", "user", "event_type", "tenant_schema", "ip_address", "user_agent", "details", "timestamp")


@admin.register(TokenRecord)
class TokenRecordAdmin(admin.ModelAdmin):
    list_display = ("user", "token_type", "is_used", "expires_at", "created_at")
    list_filter = ("token_type", "is_used", "expires_at")
    search_fields = ("user__email", "token")
