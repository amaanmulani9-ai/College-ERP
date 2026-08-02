from django.contrib import admin

from .models import Exam, ExamAttendance, ExamAuditLog, ExamSchedule, ExamType, HallTicket, InvigilatorAssignment


class ExamScheduleInline(admin.TabularInline):
    model = ExamSchedule
    extra = 0


class HallTicketInline(admin.TabularInline):
    model = HallTicket
    extra = 0
    readonly_fields = ["hall_ticket_number", "student", "status", "generated_at"]


class ExamAuditLogInline(admin.TabularInline):
    model = ExamAuditLog
    extra = 0
    readonly_fields = ["event_type", "actor", "description", "metadata", "timestamp"]


@admin.register(ExamType)
class ExamTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "category", "is_internal", "is_active"]
    list_filter = ["category", "is_internal", "is_active"]
    search_fields = ["name", "code"]


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ["subject", "exam_type", "program", "semester", "start_date", "end_date", "status"]
    list_filter = ["academic_session", "program", "semester", "exam_type", "status"]
    search_fields = ["subject__name", "subject__code", "exam_type__name"]
    inlines = [ExamScheduleInline, HallTicketInline, ExamAuditLogInline]


@admin.register(ExamSchedule)
class ExamScheduleAdmin(admin.ModelAdmin):
    list_display = ["exam", "date", "start_time", "end_time", "classroom", "invigilator", "is_locked"]
    list_filter = ["date", "classroom", "is_locked"]
    search_fields = ["exam__subject__name", "classroom__room_number"]


@admin.register(HallTicket)
class HallTicketAdmin(admin.ModelAdmin):
    list_display = ["hall_ticket_number", "student", "exam", "status", "generated_at"]
    list_filter = ["status", "exam"]
    search_fields = ["hall_ticket_number", "student__student_id"]


@admin.register(ExamAttendance)
class ExamAttendanceAdmin(admin.ModelAdmin):
    list_display = ["student", "exam_schedule", "status", "check_in_time"]
    list_filter = ["status", "exam_schedule__date"]
    search_fields = ["student__student_id", "student__profile__first_name"]


@admin.register(InvigilatorAssignment)
class InvigilatorAssignmentAdmin(admin.ModelAdmin):
    list_display = ["faculty", "exam_schedule", "duty_status"]
    list_filter = ["duty_status", "exam_schedule__date"]
    search_fields = ["faculty__employee_id", "faculty__profile__first_name"]


@admin.register(ExamAuditLog)
class ExamAuditLogAdmin(admin.ModelAdmin):
    list_display = ["exam", "event_type", "actor", "timestamp"]
    list_filter = ["event_type"]
    readonly_fields = ["exam", "actor", "event_type", "description", "metadata", "timestamp"]
