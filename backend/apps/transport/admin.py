from django.contrib import admin
from apps.transport.models import (
    Vehicle,
    Route,
    Stop,
    Driver,
    VehicleAssignment,
    StudentTransportAllocation,
    TransportPass,
    VehicleMaintenance,
    FuelLog,
    TransportAttendance,
    TransportIncident,
    TransportAuditLog,
)


class StopInline(admin.TabularInline):
    model = Stop
    extra = 1


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ["vehicle_code", "registration_number", "vehicle_name", "vehicle_type", "capacity", "status", "gps_enabled"]
    list_filter = ["status", "vehicle_type", "gps_enabled"]
    search_fields = ["vehicle_code", "registration_number", "vehicle_name"]
    actions = ["mark_active", "mark_maintenance"]

    @admin.action(description="Mark selected vehicles as Active")
    def mark_active(self, request, queryset):
        queryset.update(status="active")

    @admin.action(description="Mark selected vehicles as Under Maintenance")
    def mark_maintenance(self, request, queryset):
        queryset.update(status="maintenance")


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ["route_code", "route_name", "source", "destination", "distance_km", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["route_code", "route_name", "source", "destination"]
    inlines = [StopInline]


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ["employee", "license_number", "phone", "license_expiry", "status"]
    list_filter = ["status"]
    search_fields = ["license_number", "phone"]


@admin.register(VehicleAssignment)
class VehicleAssignmentAdmin(admin.ModelAdmin):
    list_display = ["vehicle", "route", "driver", "academic_session", "is_active"]
    list_filter = ["is_active"]


@admin.register(StudentTransportAllocation)
class StudentTransportAllocationAdmin(admin.ModelAdmin):
    list_display = ["student", "pass_number", "route", "vehicle", "boarding_stop", "is_active"]
    list_filter = ["is_active", "fee_plan"]
    search_fields = ["pass_number", "student__first_name", "student__student_id"]


@admin.register(TransportPass)
class TransportPassAdmin(admin.ModelAdmin):
    list_display = ["allocation", "expiry_date", "status"]
    list_filter = ["status"]


@admin.register(VehicleMaintenance)
class VehicleMaintenanceAdmin(admin.ModelAdmin):
    list_display = ["vehicle", "service_date", "cost", "vendor", "next_service_date"]
    list_filter = ["service_date"]


@admin.register(FuelLog)
class FuelLogAdmin(admin.ModelAdmin):
    list_display = ["vehicle", "fuel_date", "litres", "cost", "mileage_kml"]
    list_filter = ["fuel_date"]


@admin.register(TransportAttendance)
class TransportAttendanceAdmin(admin.ModelAdmin):
    list_display = ["allocation", "date", "trip_type", "status", "marked_by"]
    list_filter = ["date", "trip_type", "status"]


@admin.register(TransportIncident)
class TransportIncidentAdmin(admin.ModelAdmin):
    list_display = ["vehicle", "category", "severity", "date", "resolved"]
    list_filter = ["severity", "resolved"]


@admin.register(TransportAuditLog)
class TransportAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    list_filter = ["action", "timestamp"]
    readonly_fields = ["timestamp"]
