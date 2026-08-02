from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.placement.views import (
    CompanyViewSet,
    CompanyContactViewSet,
    CampusDriveViewSet,
    DriveEligibilityViewSet,
    StudentApplicationViewSet,
    ShortlistViewSet,
    InterviewScheduleViewSet,
    InterviewRoundViewSet,
    InterviewFeedbackViewSet,
    OfferLetterViewSet,
    OfferAcceptanceViewSet,
    InternshipViewSet,
    InternshipEvaluationViewSet,
    PlacementRecordViewSet,
    PlacementStatisticsViewSet,
    PlacementEventViewSet,
    CareerCounsellingViewSet,
    ResumeViewSet,
    ResumeReviewViewSet,
    MockInterviewViewSet,
    PlacementAuditLogViewSet,
    placement_dashboard_kpis,
    placement_reports,
)

router = DefaultRouter()
router.register(r"companies", CompanyViewSet, basename="placement-company")
router.register(r"contacts", CompanyContactViewSet, basename="company-contact")
router.register(r"drives", CampusDriveViewSet, basename="campus-drive")
router.register(r"eligibility", DriveEligibilityViewSet, basename="drive-eligibility")
router.register(r"applications", StudentApplicationViewSet, basename="student-application")
router.register(r"shortlists", ShortlistViewSet, basename="drive-shortlist")
router.register(r"interviews", InterviewScheduleViewSet, basename="interview-schedule")
router.register(r"rounds", InterviewRoundViewSet, basename="interview-round")
router.register(r"interview-feedback", InterviewFeedbackViewSet, basename="interview-feedback")
router.register(r"offers", OfferLetterViewSet, basename="offer-letter")
router.register(r"acceptances", OfferAcceptanceViewSet, basename="offer-acceptance")
router.register(r"internships", InternshipViewSet, basename="placement-internship")
router.register(r"internship-evaluations", InternshipEvaluationViewSet, basename="internship-evaluation")
router.register(r"records", PlacementRecordViewSet, basename="placement-record")
router.register(r"statistics", PlacementStatisticsViewSet, basename="placement-statistics")
router.register(r"events", PlacementEventViewSet, basename="placement-event")
router.register(r"counselling", CareerCounsellingViewSet, basename="career-counselling")
router.register(r"resumes", ResumeViewSet, basename="student-resume")
router.register(r"resume-reviews", ResumeReviewViewSet, basename="resume-review")
router.register(r"mock-interviews", MockInterviewViewSet, basename="mock-interview")
router.register(r"logs", PlacementAuditLogViewSet, basename="placement-audit-log")

urlpatterns = [
    path("dashboard/kpis/", placement_dashboard_kpis, name="placement-dashboard-kpis"),
    path("reports/", placement_reports, name="placement-reports"),
    path("", include(router.urls)),
]
