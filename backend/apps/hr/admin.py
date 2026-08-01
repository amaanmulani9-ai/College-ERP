from django.contrib import admin
from apps.hr.models import (
    Department,
    Designation,
    EmploymentType,
    LeaveType,
    LeaveBalance,
    LeaveRequest,
    HolidayCalendar,
    Shift,
    EmployeeShiftAssignment,
    AttendancePolicy,
    RecruitmentJob,
    JobApplication,
    Interview,
    OfferLetter,
    EmployeeOnboarding,
    EmployeeDocument,
    PerformanceReview,
    PerformanceGoal,
    TrainingProgram,
    TrainingEnrollment,
    Promotion,
    Transfer,
    Resignation,
    ExitInterview,
    DisciplinaryAction,
    HRAnnouncement,
    HRAuditLog,
)


@admin.register(Department)
class HRDepartmentAdmin(admin.ModelAdmin):
    list_display = ["department_code", "department_name", "head_of_department", "status"]
    list_filter = ["status"]
    search_fields = ["department_code", "department_name"]


@admin.register(Designation)
class HRDesignationAdmin(admin.ModelAdmin):
    list_display = ["title", "department", "grade", "hierarchy_level"]
    list_filter = ["department", "grade"]


@admin.register(LeaveType)
class LeaveTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "max_days_per_year", "is_encashable"]


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ["employee", "leave_type", "start_date", "end_date", "status"]
    list_filter = ["status", "leave_type"]
    actions = ["bulk_approve"]

    @admin.action(description="Approve selected leave requests")
    def bulk_approve(self, request, queryset):
        for req in queryset:
            req.status = "approved"
            req.save()


@admin.register(RecruitmentJob)
class RecruitmentJobAdmin(admin.ModelAdmin):
    list_display = ["title", "department", "status", "posted_date"]
    list_filter = ["status", "department"]


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ["candidate_name", "job", "email", "status"]
    list_filter = ["status"]


@admin.register(PerformanceReview)
class PerformanceReviewAdmin(admin.ModelAdmin):
    list_display = ["employee", "reviewer", "review_cycle", "rating"]
    list_filter = ["review_cycle", "rating"]


@admin.register(TrainingProgram)
class TrainingProgramAdmin(admin.ModelAdmin):
    list_display = ["program_name", "trainer", "duration_days", "venue"]


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ["employee", "old_designation", "new_designation", "effective_date"]


@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
    list_display = ["employee", "old_department", "new_department"]


@admin.register(Resignation)
class ResignationAdmin(admin.ModelAdmin):
    list_display = ["employee", "notice_date", "last_working_day", "status"]
    list_filter = ["status"]


@admin.register(DisciplinaryAction)
class DisciplinaryActionAdmin(admin.ModelAdmin):
    list_display = ["employee", "category", "action_taken", "status"]
    list_filter = ["status", "category"]


@admin.register(HRAuditLog)
class HRAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    list_filter = ["action", "timestamp"]
    readonly_fields = ["timestamp"]
