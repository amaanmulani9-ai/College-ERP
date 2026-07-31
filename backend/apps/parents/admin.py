from django.contrib import admin
from .models import (
    Parent,
    StudentParentLink,
    ParentDocument,
    ParentCommunicationPreference,
    ParentActivityLog,
)


class StudentParentLinkInline(admin.TabularInline):
    model = StudentParentLink
    extra = 0
    raw_id_fields = ["student"]
    readonly_fields = ["created_at"]


class ParentDocumentInline(admin.TabularInline):
    model = ParentDocument
    extra = 0
    readonly_fields = ["uploaded_at"]


class ParentCommunicationPreferenceInline(admin.StackedInline):
    model = ParentCommunicationPreference
    can_delete = False


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = [
        "parent_code",
        "get_full_name",
        "relationship_type",
        "is_verified",
        "portal_access_enabled",
        "is_deleted",
        "created_at",
    ]
    list_filter = ["relationship_type", "is_verified", "portal_access_enabled", "is_deleted", "education_level"]
    search_fields = ["parent_code", "profile__first_name", "profile__last_name", "profile__user__email"]
    readonly_fields = ["id", "parent_code", "created_at", "updated_at"]
    inlines = [StudentParentLinkInline, ParentDocumentInline, ParentCommunicationPreferenceInline]
    raw_id_fields = ["profile", "verified_by"]

    def get_full_name(self, obj):
        return obj.profile.get_full_name()
    get_full_name.short_description = "Full Name"


@admin.register(StudentParentLink)
class StudentParentLinkAdmin(admin.ModelAdmin):
    list_display = ["student", "parent", "is_primary_contact", "is_emergency_contact", "can_pickup", "created_at"]
    list_filter = ["is_primary_contact", "is_emergency_contact", "can_pickup"]
    raw_id_fields = ["student", "parent"]


@admin.register(ParentDocument)
class ParentDocumentAdmin(admin.ModelAdmin):
    list_display = ["parent", "document_type", "status", "uploaded_at", "expires_at"]
    list_filter = ["document_type", "status"]
    readonly_fields = ["uploaded_at"]
    raw_id_fields = ["parent", "reviewed_by"]


@admin.register(ParentActivityLog)
class ParentActivityLogAdmin(admin.ModelAdmin):
    list_display = ["parent", "activity_type", "actor", "timestamp"]
    list_filter = ["activity_type"]
    readonly_fields = ["id", "parent", "actor", "activity_type", "description", "metadata", "ip_address", "timestamp"]
    raw_id_fields = ["parent", "actor"]
