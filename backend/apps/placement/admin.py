from django.contrib import admin
from apps.placement.models import (
    Company,
    CompanyContact,
    CampusDrive,
    DriveEligibility,
    StudentApplication,
    Shortlist,
    InterviewSchedule,
    InterviewRound,
    InterviewFeedback,
    OfferLetter,
    OfferAcceptance,
    Internship,
    InternshipEvaluation,
    PlacementRecord,
    PlacementStatistics,
    PlacementEvent,
    CareerCounselling,
    Resume,
    ResumeReview,
    MockInterview,
    PlacementAuditLog,
)
from apps.placement.services.placement_service import PlacementService


class CompanyContactInline(admin.TabularInline):
    model = CompanyContact
    extra = 0


class DriveEligibilityInline(admin.StackedInline):
    model = DriveEligibility
    extra = 0


class InterviewRoundInline(admin.TabularInline):
    model = InterviewRound
    extra = 0


class OfferAcceptanceInline(admin.StackedInline):
    model = OfferAcceptance
    extra = 0


class InternshipEvaluationInline(admin.StackedInline):
    model = InternshipEvaluation
    extra = 0


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["company_code", "company_name", "industry", "package_range", "email", "status"]
    list_filter = ["status", "industry"]
    search_fields = ["company_code", "company_name", "industry"]
    inlines = [CompanyContactInline]


@admin.register(CampusDrive)
class CampusDriveAdmin(admin.ModelAdmin):
    list_display = ["drive_code", "company", "job_role", "ctc", "mode", "drive_date", "status"]
    list_filter = ["status", "mode", "company"]
    search_fields = ["drive_code", "job_role"]
    inlines = [DriveEligibilityInline, InterviewRoundInline]
    actions = ["action_mark_completed"]

    @admin.action(description="Mark Drive as Completed")
    def action_mark_completed(self, request, queryset):
        updated = queryset.update(status="Completed")
        self.message_user(request, f"Marked {updated} campus drive(s) as Completed.")


@admin.register(StudentApplication)
class StudentApplicationAdmin(admin.ModelAdmin):
    list_display = ["student", "campus_drive", "status", "applied_date"]
    list_filter = ["status", "campus_drive"]
    search_fields = ["student__student_id", "campus_drive__drive_code"]
    actions = ["action_bulk_shortlist", "action_bulk_offer_release"]

    @admin.action(description="Bulk Shortlist Selected Applicants")
    def action_bulk_shortlist(self, request, queryset):
        count = 0
        for app in queryset:
            PlacementService.shortlist_students(
                drive_id=app.campus_drive.id,
                student_ids=[app.student.id],
                round_number=1,
                performed_by=request.user
            )
            count += 1
        self.message_user(request, f"Shortlisted {count} student application(s).")

    @admin.action(description="Bulk Release Offer Letters")
    def action_bulk_offer_release(self, request, queryset):
        count = 0
        for app in queryset:
            offer_no = f"OFF-{app.campus_drive.drive_code}-{app.student.student_id[-4:]}"
            PlacementService.issue_offer({
                "offer_number": offer_no,
                "company_id": app.campus_drive.company.id,
                "student_id": app.student.id,
                "campus_drive_id": app.campus_drive.id,
                "package": str(app.campus_drive.ctc),
            }, performed_by=request.user)
            count += 1
        self.message_user(request, f"Released {count} offer letter(s).")


@admin.register(InterviewSchedule)
class InterviewScheduleAdmin(admin.ModelAdmin):
    list_display = ["student", "drive", "round", "date", "time", "mode", "panel"]
    list_filter = ["mode", "round"]
    search_fields = ["student__student_id", "drive__drive_code"]


@admin.register(OfferLetter)
class OfferLetterAdmin(admin.ModelAdmin):
    list_display = ["offer_number", "company", "student", "package", "joining_date", "offer_status"]
    list_filter = ["offer_status", "company"]
    search_fields = ["offer_number", "student__student_id"]
    inlines = [OfferAcceptanceInline]


@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ["student", "company", "title", "mentor", "stipend", "duration", "status"]
    list_filter = ["status", "company"]
    search_fields = ["student__student_id", "title"]
    inlines = [InternshipEvaluationInline]


@admin.register(PlacementRecord)
class PlacementRecordAdmin(admin.ModelAdmin):
    list_display = ["student", "company", "role", "package", "joining_status"]
    list_filter = ["joining_status", "company"]
    search_fields = ["student__student_id", "role"]


@admin.register(PlacementStatistics)
class PlacementStatisticsAdmin(admin.ModelAdmin):
    list_display = ["academic_year", "placed_students", "highest_package", "average_package", "companies_visited", "offers_made"]
    actions = ["action_recalculate_stats"]

    @admin.action(description="Recalculate Placement Statistics")
    def action_recalculate_stats(self, request, queryset):
        for stat in queryset:
            PlacementService.compute_placement_statistics(academic_year=stat.academic_year)
        self.message_user(request, "Recalculated placement statistics.")


@admin.register(PlacementEvent)
class PlacementEventAdmin(admin.ModelAdmin):
    list_display = ["event_name", "event_type", "date", "venue", "organizer"]
    list_filter = ["event_type"]


@admin.register(CareerCounselling)
class CareerCounsellingAdmin(admin.ModelAdmin):
    list_display = ["student", "counsellor", "session_date", "topic"]
    search_fields = ["student__student_id", "topic"]


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ["student", "version", "approval_status", "created_at"]
    list_filter = ["approval_status"]


@admin.register(ResumeReview)
class ResumeReviewAdmin(admin.ModelAdmin):
    list_display = ["resume", "reviewer", "score"]


@admin.register(MockInterview)
class MockInterviewAdmin(admin.ModelAdmin):
    list_display = ["student", "faculty", "technical_score", "hr_score", "date"]


@admin.register(PlacementAuditLog)
class PlacementAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    search_fields = ["action"]
