from django.contrib import admin
from apps.visitor.models import (
    Visitor,
    VisitorDocument,
    VisitorVehicle,
    Appointment,
    VisitPurpose,
    GatePass,
    EntryExitLog,
    Delivery,
    Contractor,
    ContractorPass,
    EmergencyVisitor,
    RestrictedAreaAccess,
    VisitorBlacklist,
    VisitorFeedback,
    SecurityOfficer,
    VisitorNotification,
    VisitorAuditLog,
)
from apps.visitor.services.visitor_service import VisitorService


class VisitorDocumentInline(admin.TabularInline):
    model = VisitorDocument
    extra = 0


class VisitorVehicleInline(admin.TabularInline):
    model = VisitorVehicle
    extra = 0


class ContractorPassInline(admin.TabularInline):
    model = ContractorPass
    extra = 0


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ["visitor_id", "first_name", "last_name", "mobile", "email", "company", "govt_id_type"]
    list_filter = ["govt_id_type", "company"]
    search_fields = ["visitor_id", "first_name", "last_name", "mobile", "email", "govt_id_number"]
    inlines = [VisitorDocumentInline, VisitorVehicleInline]


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ["visitor", "host_employee", "department", "purpose", "scheduled_date", "scheduled_time", "status"]
    list_filter = ["status", "scheduled_date"]
    search_fields = ["visitor__first_name", "visitor__last_name", "purpose"]
    actions = ["action_bulk_approve_appointment"]

    @admin.action(description="Bulk Approve Selected Appointments")
    def action_bulk_approve_appointment(self, request, queryset):
        count = 0
        for appt in queryset.filter(status="Pending"):
            VisitorService.approve_appointment(appointment_id=appt.id, performed_by=request.user)
            count += 1
        self.message_user(request, f"Approved {count} appointment(s).")


@admin.register(VisitPurpose)
class VisitPurposeAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]


@admin.register(GatePass)
class GatePassAdmin(admin.ModelAdmin):
    list_display = ["pass_number", "visitor", "issue_date", "expiry_date", "status"]
    list_filter = ["status"]
    search_fields = ["pass_number", "visitor__first_name", "visitor__last_name"]


@admin.register(EntryExitLog)
class EntryExitLogAdmin(admin.ModelAdmin):
    list_display = ["visitor", "gate", "check_in", "check_out", "security_officer"]
    list_filter = ["gate"]
    search_fields = ["visitor__first_name", "visitor__last_name", "gate"]
    actions = ["action_bulk_checkout"]

    @admin.action(description="Bulk Check-out Active Campus Visitors")
    def action_bulk_checkout(self, request, queryset):
        count = VisitorService.bulk_check_out(performed_by=request.user)
        self.message_user(request, f"Bulk checked out {count} visitor(s).")


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ["tracking_number", "courier_company", "recipient", "department", "delivery_status", "received_at"]
    list_filter = ["delivery_status", "courier_company"]
    search_fields = ["tracking_number", "recipient__email"]


@admin.register(Contractor)
class ContractorAdmin(admin.ModelAdmin):
    list_display = ["company", "supervisor", "start_date", "end_date"]
    search_fields = ["company", "supervisor"]
    inlines = [ContractorPassInline]


@admin.register(ContractorPass)
class ContractorPassAdmin(admin.ModelAdmin):
    list_display = ["pass_number", "contractor", "validity"]


@admin.register(EmergencyVisitor)
class EmergencyVisitorAdmin(admin.ModelAdmin):
    list_display = ["visitor", "hospital_or_dept", "type", "priority"]
    list_filter = ["type", "priority"]


@admin.register(RestrictedAreaAccess)
class RestrictedAreaAccessAdmin(admin.ModelAdmin):
    list_display = ["visitor", "area", "approved_by", "expiry"]


@admin.register(VisitorBlacklist)
class VisitorBlacklistAdmin(admin.ModelAdmin):
    list_display = ["visitor", "reason", "blocked_date", "blocked_by"]
    search_fields = ["visitor__first_name", "visitor__last_name", "reason"]


@admin.register(VisitorFeedback)
class VisitorFeedbackAdmin(admin.ModelAdmin):
    list_display = ["visitor", "rating", "comments"]


@admin.register(SecurityOfficer)
class SecurityOfficerAdmin(admin.ModelAdmin):
    list_display = ["employee", "shift", "gate"]
    list_filter = ["shift", "gate"]


@admin.register(VisitorNotification)
class VisitorNotificationAdmin(admin.ModelAdmin):
    list_display = ["visitor", "status"]


@admin.register(VisitorAuditLog)
class VisitorAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    search_fields = ["action"]
