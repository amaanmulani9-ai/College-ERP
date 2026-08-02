from django.contrib import admin
from apps.alumni.models import (
    AlumniProfile,
    AlumniMembership,
    AlumniEmployment,
    AlumniAchievement,
    AlumniHigherEducation,
    AlumniBusiness,
    MentorshipProgram,
    MentorAssignment,
    AlumniEvent,
    EventRegistration,
    AlumniChapter,
    Donation,
    FundraisingCampaign,
    Newsletter,
    CommunicationLog,
    SuccessStory,
    JobReferral,
    NetworkingRequest,
    AlumniDirectory,
    AlumniAuditLog,
)
from apps.alumni.services.alumni_service import AlumniService


class AlumniMembershipInline(admin.TabularInline):
    model = AlumniMembership
    extra = 0


class AlumniEmploymentInline(admin.TabularInline):
    model = AlumniEmployment
    extra = 0


class AlumniAchievementInline(admin.TabularInline):
    model = AlumniAchievement
    extra = 0


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0


@admin.register(AlumniProfile)
class AlumniProfileAdmin(admin.ModelAdmin):
    list_display = ["alumni_id", "student", "graduation_year", "current_status", "visibility"]
    list_filter = ["graduation_year", "current_status", "visibility"]
    search_fields = ["alumni_id", "student__student_id"]
    inlines = [AlumniMembershipInline, AlumniEmploymentInline, AlumniAchievementInline]


@admin.register(AlumniMembership)
class AlumniMembershipAdmin(admin.ModelAdmin):
    list_display = ["membership_number", "alumni", "membership_type", "join_date", "expiry_date", "status"]
    list_filter = ["membership_type", "status"]
    search_fields = ["membership_number", "alumni__alumni_id"]
    actions = ["action_bulk_renew_membership"]

    @admin.action(description="Bulk Renew Selected Memberships for 1 Year")
    def action_bulk_renew_membership(self, request, queryset):
        count = 0
        for mem in queryset:
            AlumniService.manage_membership(
                alumni_id=mem.alumni.id,
                membership_type=mem.membership_type,
                status="Active",
                performed_by=request.user
            )
            count += 1
        self.message_user(request, f"Renewed {count} alumni membership(s).")


@admin.register(AlumniEmployment)
class AlumniEmploymentAdmin(admin.ModelAdmin):
    list_display = ["alumni", "company", "designation", "industry", "location", "is_current"]
    list_filter = ["is_current", "employment_status", "industry"]
    search_fields = ["company", "designation", "alumni__alumni_id"]


@admin.register(AlumniAchievement)
class AlumniAchievementAdmin(admin.ModelAdmin):
    list_display = ["alumni", "title", "category", "achievement_date"]
    list_filter = ["category"]


@admin.register(AlumniHigherEducation)
class AlumniHigherEducationAdmin(admin.ModelAdmin):
    list_display = ["alumni", "university", "program", "country", "completion_year"]


@admin.register(AlumniBusiness)
class AlumniBusinessAdmin(admin.ModelAdmin):
    list_display = ["business_name", "alumni", "industry", "startup_stage"]


@admin.register(MentorshipProgram)
class MentorshipProgramAdmin(admin.ModelAdmin):
    list_display = ["program_name", "capacity", "status"]


@admin.register(MentorAssignment)
class MentorAssignmentAdmin(admin.ModelAdmin):
    list_display = ["program", "mentor", "mentee", "status", "start_date"]


@admin.register(AlumniEvent)
class AlumniEventAdmin(admin.ModelAdmin):
    list_display = ["event_code", "title", "type", "venue", "start_date", "status"]
    list_filter = ["status", "type"]
    inlines = [EventRegistrationInline]


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ["event", "alumni", "attendance_status"]


@admin.register(AlumniChapter)
class AlumniChapterAdmin(admin.ModelAdmin):
    list_display = ["chapter_name", "city", "state", "country", "coordinator"]


@admin.register(FundraisingCampaign)
class FundraisingCampaignAdmin(admin.ModelAdmin):
    list_display = ["campaign_name", "goal_amount", "collected_amount", "start_date", "status"]


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ["donor", "campaign", "amount", "payment_status", "date"]
    list_filter = ["payment_status"]


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ["title", "publish_date", "target_audience", "status"]
    list_filter = ["status", "target_audience"]
    actions = ["action_bulk_publish_newsletter"]

    @admin.action(description="Bulk Publish Selected Newsletters")
    def action_bulk_publish_newsletter(self, request, queryset):
        count = 0
        for nl in queryset:
            AlumniService.publish_newsletter({
                "title": nl.title,
                "content": nl.content,
                "target_audience": nl.target_audience,
            }, performed_by=request.user)
            count += 1
        self.message_user(request, f"Published {count} newsletter(s).")


@admin.register(CommunicationLog)
class CommunicationLogAdmin(admin.ModelAdmin):
    list_display = ["channel", "subject", "status", "timestamp"]


@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ["title", "alumni", "featured", "date"]


@admin.register(JobReferral)
class JobReferralAdmin(admin.ModelAdmin):
    list_display = ["role", "company", "referrer", "openings", "expiry_date"]


@admin.register(NetworkingRequest)
class NetworkingRequestAdmin(admin.ModelAdmin):
    list_display = ["requester", "receiver", "status"]


@admin.register(AlumniDirectory)
class AlumniDirectoryAdmin(admin.ModelAdmin):
    list_display = ["alumni", "search_vector"]


@admin.register(AlumniAuditLog)
class AlumniAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    search_fields = ["action"]
