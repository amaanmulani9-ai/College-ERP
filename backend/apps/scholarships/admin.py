from django.contrib import admin

from .models import (
    Scholarship,
    ScholarshipApplication,
    ScholarshipAuditLog,
    ScholarshipRenewal,
    ScholarshipType,
)


@admin.register(ScholarshipType)
class ScholarshipTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "provider", "min_cgpa_requirement", "max_family_income", "is_active")
    list_filter = ("provider", "is_active")
    search_fields = ("name", "code")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ("student", "scholarship_type", "academic_session", "amount", "percentage", "status", "created_at")
    list_filter = ("status", "scholarship_type", "academic_session")
    search_fields = ("student__student_id", "scholarship_type__code")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(ScholarshipApplication)
class ScholarshipApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "scholarship_type",
        "academic_session",
        "requested_amount",
        "current_cgpa",
        "status",
        "approved_by",
        "created_at",
    )
    list_filter = ("status", "scholarship_type", "academic_session")
    search_fields = ("student__student_id", "scholarship_type__name")
    readonly_fields = ("id", "approved_by", "approved_at", "created_at", "updated_at")
    actions = ["bulk_approve_applications"]

    @admin.action(description="Bulk Approve selected scholarship applications")
    def bulk_approve_applications(self, request, queryset):
        from .services import ScholarshipService

        count = 0
        for app in queryset.filter(status="submitted"):
            try:
                ScholarshipService.approve(application_id=str(app.id), actor=request.user)
                count += 1
            except Exception as exc:
                self.message_user(request, f"Error approving application {app.id}: {exc}", level="error")
        self.message_user(request, f"Successfully approved {count} scholarship applications.")


@admin.register(ScholarshipRenewal)
class ScholarshipRenewalAdmin(admin.ModelAdmin):
    list_display = ("scholarship", "academic_session", "status", "processed_by", "created_at")
    list_filter = ("status", "academic_session")
    search_fields = ("scholarship__student__student_id",)
    readonly_fields = ("id", "processed_by", "processed_at", "created_at", "updated_at")


@admin.register(ScholarshipAuditLog)
class ScholarshipAuditLogAdmin(admin.ModelAdmin):
    list_display = ("event_type", "student", "description_short", "actor", "timestamp")
    list_filter = ("event_type",)
    search_fields = ("description", "student__student_id")
    readonly_fields = ("id", "student", "scholarship", "application", "actor", "event_type", "description", "timestamp")

    def description_short(self, obj):
        return obj.description[:60]

    description_short.short_description = "Description"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
