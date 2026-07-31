from django.contrib import admin

from .models import AttendanceAuditLog, AttendanceSession, FacultyAttendance, StudentAttendance


class StudentAttendanceInline(admin.TabularInline):
    model = StudentAttendance
    extra = 0
    readonly_fields = ["student", "status", "check_in_time", "check_out_time", "remarks"]


class AttendanceAuditLogInline(admin.TabularInline):
    model = AttendanceAuditLog
    extra = 0
    readonly_fields = ["event_type", "actor", "description", "metadata", "timestamp"]


@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ["subject", "faculty", "date", "start_time", "end_time", "status", "is_locked"]
    list_filter = ["date", "status", "is_locked", "subject"]
    search_fields = ["subject__name", "subject__code", "faculty__profile__first_name"]
    inlines = [StudentAttendanceInline, AttendanceAuditLogInline]
    actions = ["lock_sessions"]

    @admin.action(description="Lock selected attendance sessions")
    def lock_sessions(self, request, queryset):
        queryset.update(is_locked=True, status="locked")


@admin.register(StudentAttendance)
class StudentAttendanceAdmin(admin.ModelAdmin):
    list_display = ["student", "session", "status", "check_in_time", "remarks"]
    list_filter = ["status", "session__date"]
    search_fields = ["student__student_id", "student__profile__first_name", "student__profile__last_name"]


@admin.register(FacultyAttendance)
class FacultyAttendanceAdmin(admin.ModelAdmin):
    list_display = ["faculty", "date", "status", "check_in", "check_out", "remarks"]
    list_filter = ["date", "status"]
    search_fields = ["faculty__employee_id", "faculty__profile__first_name"]


@admin.register(AttendanceAuditLog)
class AttendanceAuditLogAdmin(admin.ModelAdmin):
    list_display = ["session", "event_type", "actor", "timestamp"]
    list_filter = ["event_type"]
    readonly_fields = ["session", "actor", "event_type", "description", "metadata", "timestamp"]
