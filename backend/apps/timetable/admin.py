from django.contrib import admin

from .models import Building, Classroom, TimeSlot, Timetable, TimetableAuditLog


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "is_active", "created_at"]
    search_fields = ["name", "code"]
    list_filter = ["is_active"]


@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ["building", "room_number", "capacity", "floor", "room_type", "is_active"]
    search_fields = ["room_number", "building__name", "building__code"]
    list_filter = ["building", "room_type", "is_active", "floor"]


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ["day", "period_number", "start_time", "end_time", "break_after", "is_active"]
    list_filter = ["day", "period_number", "is_active", "break_after"]


class TimetableAuditLogInline(admin.TabularInline):
    model = TimetableAuditLog
    extra = 0
    readonly_fields = ["event_type", "actor", "description", "metadata", "timestamp"]


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ["subject", "program", "semester", "faculty", "classroom", "time_slot", "batch", "status"]
    list_filter = ["academic_session", "program", "semester", "status", "time_slot__day"]
    search_fields = ["subject__name", "subject__code", "faculty__profile__first_name", "classroom__room_number"]
    inlines = [TimetableAuditLogInline]


@admin.register(TimetableAuditLog)
class TimetableAuditLogAdmin(admin.ModelAdmin):
    list_display = ["timetable", "event_type", "actor", "timestamp"]
    list_filter = ["event_type"]
    readonly_fields = ["timetable", "actor", "event_type", "description", "metadata", "timestamp"]
