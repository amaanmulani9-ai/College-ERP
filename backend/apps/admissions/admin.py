from django.contrib import admin

from .models import (
    AdmissionApplication,
    AdmissionAuditLog,
    AdmissionDocument,
    ApplicationStatusHistory,
    SeatMatrix,
)


class ApplicationStatusHistoryInline(admin.TabularInline):
    model = ApplicationStatusHistory
    extra = 0
    readonly_fields = ["previous_status", "new_status", "changed_by", "remarks", "timestamp"]


class AdmissionDocumentInline(admin.TabularInline):
    model = AdmissionDocument
    extra = 0
    readonly_fields = ["uploaded_at", "reviewed_at"]


class AdmissionAuditLogInline(admin.TabularInline):
    model = AdmissionAuditLog
    extra = 0
    readonly_fields = ["event_type", "actor", "description", "metadata", "ip_address", "timestamp"]


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = [
        "application_number",
        "first_name",
        "last_name",
        "email",
        "program",
        "status",
        "created_at",
    ]
    list_filter = ["status", "category", "program", "department", "academic_session"]
    search_fields = ["application_number", "first_name", "last_name", "email", "mobile"]
    readonly_fields = ["id", "application_number", "created_at", "updated_at"]
    inlines = [ApplicationStatusHistoryInline, AdmissionDocumentInline, AdmissionAuditLogInline]
    actions = ["bulk_approve", "bulk_reject"]

    @admin.action(description="Approve selected applications")
    def bulk_approve(self, request, queryset):
        from .services import approve_application
        count = 0
        for app in queryset:
            try:
                approve_application(app, actor=request.user, remarks="Bulk approved via Admin", request=request)
                count += 1
            except Exception:
                pass
        self.message_user(request, f"Successfully approved {count} applications.")

    @admin.action(description="Reject selected applications")
    def bulk_reject(self, request, queryset):
        from .services import reject_application
        count = 0
        for app in queryset:
            try:
                reject_application(app, actor=request.user, remarks="Bulk rejected via Admin", request=request)
                count += 1
            except Exception:
                pass
        self.message_user(request, f"Successfully rejected {count} applications.")


@admin.register(SeatMatrix)
class SeatMatrixAdmin(admin.ModelAdmin):
    list_display = ["program", "academic_session", "category", "total_seats", "occupied_seats", "available_seats"]
    list_filter = ["program", "academic_session", "category"]


@admin.register(AdmissionDocument)
class AdmissionDocumentAdmin(admin.ModelAdmin):
    list_display = ["application", "document_type", "review_status", "uploaded_at"]
    list_filter = ["document_type", "review_status"]
    readonly_fields = ["uploaded_at", "reviewed_at"]


@admin.register(AdmissionAuditLog)
class AdmissionAuditLogAdmin(admin.ModelAdmin):
    list_display = ["application", "event_type", "actor", "timestamp"]
    list_filter = ["event_type"]
    readonly_fields = ["id", "application", "actor", "event_type", "description", "metadata", "ip_address", "timestamp"]
