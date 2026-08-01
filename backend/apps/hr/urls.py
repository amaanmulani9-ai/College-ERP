from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.hr.views import (
    DepartmentViewSet,
    DesignationViewSet,
    LeaveTypeViewSet,
    LeaveBalanceViewSet,
    LeaveRequestViewSet,
    RecruitmentJobViewSet,
    JobApplicationViewSet,
    OfferLetterViewSet,
    EmployeeOnboardingViewSet,
    PerformanceReviewViewSet,
    TrainingProgramViewSet,
    TrainingEnrollmentViewSet,
    PromotionViewSet,
    TransferViewSet,
    ResignationViewSet,
    DisciplinaryActionViewSet,
    HRAnnouncementViewSet,
    HRAuditLogViewSet,
    hr_dashboard_kpis,
    hr_reports,
)

router = DefaultRouter()
router.register(r"departments", DepartmentViewSet, basename="hr-department")
router.register(r"designations", DesignationViewSet, basename="hr-designation")
router.register(r"leave-types", LeaveTypeViewSet, basename="hr-leave-type")
router.register(r"leave-balances", LeaveBalanceViewSet, basename="hr-leave-balance")
router.register(r"leave-requests", LeaveRequestViewSet, basename="hr-leave-request")
router.register(r"recruitment-jobs", RecruitmentJobViewSet, basename="hr-recruitment-job")
router.register(r"job-applications", JobApplicationViewSet, basename="hr-job-application")
router.register(r"offer-letters", OfferLetterViewSet, basename="hr-offer-letter")
router.register(r"onboarding", EmployeeOnboardingViewSet, basename="hr-onboarding")
router.register(r"performance-reviews", PerformanceReviewViewSet, basename="hr-performance-review")
router.register(r"training-programs", TrainingProgramViewSet, basename="hr-training-program")
router.register(r"training-enrollments", TrainingEnrollmentViewSet, basename="hr-training-enrollment")
router.register(r"promotions", PromotionViewSet, basename="hr-promotion")
router.register(r"transfers", TransferViewSet, basename="hr-transfer")
router.register(r"resignations", ResignationViewSet, basename="hr-resignation")
router.register(r"disciplinary-actions", DisciplinaryActionViewSet, basename="hr-disciplinary")
router.register(r"announcements", HRAnnouncementViewSet, basename="hr-announcement")
router.register(r"audit-logs", HRAuditLogViewSet, basename="hr-audit-log")

urlpatterns = [
    path("dashboard/kpis/", hr_dashboard_kpis, name="hr-kpis"),
    path("reports/", hr_reports, name="hr-reports"),
    path("", include(router.urls)),
]
