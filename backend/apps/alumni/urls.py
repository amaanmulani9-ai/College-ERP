from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.alumni.views import (
    AlumniProfileViewSet,
    AlumniMembershipViewSet,
    AlumniEmploymentViewSet,
    AlumniAchievementViewSet,
    AlumniHigherEducationViewSet,
    AlumniBusinessViewSet,
    MentorshipProgramViewSet,
    MentorAssignmentViewSet,
    AlumniEventViewSet,
    EventRegistrationViewSet,
    AlumniChapterViewSet,
    DonationViewSet,
    FundraisingCampaignViewSet,
    NewsletterViewSet,
    CommunicationLogViewSet,
    SuccessStoryViewSet,
    JobReferralViewSet,
    NetworkingRequestViewSet,
    AlumniDirectoryViewSet,
    AlumniAuditLogViewSet,
    alumni_dashboard_kpis,
    alumni_reports,
)

router = DefaultRouter()
router.register(r"profiles", AlumniProfileViewSet, basename="alumni-profile")
router.register(r"memberships", AlumniMembershipViewSet, basename="alumni-membership")
router.register(r"employments", AlumniEmploymentViewSet, basename="alumni-employment")
router.register(r"achievements", AlumniAchievementViewSet, basename="alumni-achievement")
router.register(r"higher-education", AlumniHigherEducationViewSet, basename="alumni-higher-education")
router.register(r"businesses", AlumniBusinessViewSet, basename="alumni-business")
router.register(r"mentorship-programs", MentorshipProgramViewSet, basename="mentorship-program")
router.register(r"mentor-assignments", MentorAssignmentViewSet, basename="mentor-assignment")
router.register(r"events", AlumniEventViewSet, basename="alumni-event")
router.register(r"event-registrations", EventRegistrationViewSet, basename="event-registration")
router.register(r"chapters", AlumniChapterViewSet, basename="alumni-chapter")
router.register(r"campaigns", FundraisingCampaignViewSet, basename="fundraising-campaign")
router.register(r"donations", DonationViewSet, basename="alumni-donation")
router.register(r"newsletters", NewsletterViewSet, basename="alumni-newsletter")
router.register(r"communication-logs", CommunicationLogViewSet, basename="communication-log")
router.register(r"success-stories", SuccessStoryViewSet, basename="success-story")
router.register(r"job-referrals", JobReferralViewSet, basename="job-referral")
router.register(r"networking-requests", NetworkingRequestViewSet, basename="networking-request")
router.register(r"directory", AlumniDirectoryViewSet, basename="alumni-directory")
router.register(r"logs", AlumniAuditLogViewSet, basename="alumni-audit-log")

urlpatterns = [
    path("dashboard/kpis/", alumni_dashboard_kpis, name="alumni-dashboard-kpis"),
    path("reports/", alumni_reports, name="alumni-reports"),
    path("", include(router.urls)),
]
