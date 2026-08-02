from django.contrib import admin

from .models import (
    Bed,
    Block,
    Floor,
    Hostel,
    HostelAllocation,
    HostelAuditLog,
    MaintenanceRequest,
    Room,
    Visitor,
    Warden,
)


@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "gender_type", "is_active", "created_at")
    list_filter = ("gender_type", "is_active")
    search_fields = ("name", "code")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "hostel")
    list_filter = ("hostel",)
    search_fields = ("name", "code")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ("floor_number", "block")
    list_filter = ("block",)
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("room_number", "floor", "room_type", "capacity", "occupied_beds", "status")
    list_filter = ("status", "room_type")
    search_fields = ("room_number",)
    readonly_fields = ("id", "occupied_beds", "created_at", "updated_at")


@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = ("bed_number", "room", "status")
    list_filter = ("status",)
    search_fields = ("bed_number", "room__room_number")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Warden)
class WardenAdmin(admin.ModelAdmin):
    list_display = ("employee", "hostel", "contact_number")
    list_filter = ("hostel",)
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(HostelAllocation)
class HostelAllocationAdmin(admin.ModelAdmin):
    list_display = ("student", "bed", "academic_session", "check_in_date", "check_out_date", "status")
    list_filter = ("status", "academic_session")
    search_fields = ("student__student_id", "bed__bed_number")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ("visitor_name", "relation", "student", "visit_date", "check_in_time", "check_out_time")
    list_filter = ("visit_date",)
    search_fields = ("visitor_name", "student__student_id")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "room", "status", "assigned_to", "created_at")
    list_filter = ("status",)
    search_fields = ("title", "description", "room__room_number")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(HostelAuditLog)
class HostelAuditLogAdmin(admin.ModelAdmin):
    list_display = ("event_type", "hostel", "description_short", "actor", "timestamp")
    list_filter = ("event_type",)
    search_fields = ("description",)
    readonly_fields = ("id", "hostel", "allocation", "actor", "event_type", "description", "timestamp")

    def description_short(self, obj):
        return obj.description[:60]

    description_short.short_description = "Description"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
