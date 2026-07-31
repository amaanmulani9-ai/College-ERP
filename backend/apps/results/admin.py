from django.contrib import admin

from .models import ResultAuditLog, ResultScheme, SemesterResult, StudentResult


class ResultAuditLogInline(admin.TabularInline):
    model = ResultAuditLog
    extra = 0
    readonly_fields = ["event_type", "actor", "description", "metadata", "timestamp"]


@admin.register(ResultScheme)
class ResultSchemeAdmin(admin.ModelAdmin):
    list_display = ["subject", "program", "semester", "max_internal", "max_external", "passing_marks", "is_active"]
    list_filter = ["program", "semester", "is_active"]
    search_fields = ["subject__name", "subject__code", "program__name"]


@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = ["student", "subject", "total_marks", "grade", "grade_point", "credit_point", "status"]
    list_filter = ["grade", "status", "subject"]
    search_fields = ["student__student_id", "student__profile__first_name", "subject__code"]
    inlines = [ResultAuditLogInline]


@admin.register(SemesterResult)
class SemesterResultAdmin(admin.ModelAdmin):
    list_display = ["student", "semester", "sgpa", "cgpa", "rank", "result_status", "is_published"]
    list_filter = ["semester", "result_status", "is_published"]
    search_fields = ["student__student_id", "student__profile__first_name"]
    actions = ["publish_selected_results"]

    @admin.action(description="Publish selected semester results")
    def publish_selected_results(self, request, queryset):
        queryset.update(is_published=True, result_status="published")


@admin.register(ResultAuditLog)
class ResultAuditLogAdmin(admin.ModelAdmin):
    list_display = ["event_type", "actor", "description", "timestamp"]
    list_filter = ["event_type"]
    readonly_fields = ["student_result", "semester_result", "actor", "event_type", "description", "metadata", "timestamp"]
