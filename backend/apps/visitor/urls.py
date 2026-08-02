from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.visitor.views import (
    VisitorViewSet,
    VisitorDocumentViewSet,
    VisitorVehicleViewSet,
    AppointmentViewSet,
    VisitPurposeViewSet,
    GatePassViewSet,
    EntryExitLogViewSet,
    DeliveryViewSet,
    ContractorViewSet,
    ContractorPassViewSet,
    EmergencyVisitorViewSet,
    RestrictedAreaAccessViewSet,
    VisitorBlacklistViewSet,
    VisitorFeedbackViewSet,
    SecurityOfficerViewSet,
    VisitorNotificationViewSet,
    VisitorAuditLogViewSet,
    visitor_dashboard_kpis,
    visitor_reports,
)

router = DefaultRouter()
router.register(r"visitors", VisitorViewSet, basename="visitor-profile")
router.register(r"documents", VisitorDocumentViewSet, basename="visitor-document")
router.register(r"vehicles", VisitorVehicleViewSet, basename="visitor-vehicle")
router.register(r"purposes", VisitPurposeViewSet, basename="visit-purpose")
router.register(r"appointments", AppointmentViewSet, basename="visitor-appointment")
router.register(r"gate-passes", GatePassViewSet, basename="gate-pass")
router.register(r"logs", EntryExitLogViewSet, basename="entry-exit-log")
router.register(r"deliveries", DeliveryViewSet, basename="visitor-delivery")
router.register(r"contractors", ContractorViewSet, basename="visitor-contractor")
router.register(r"contractor-passes", ContractorPassViewSet, basename="contractor-pass")
router.register(r"emergency-visitors", EmergencyVisitorViewSet, basename="emergency-visitor")
router.register(r"restricted-access", RestrictedAreaAccessViewSet, basename="restricted-access")
router.register(r"blacklist", VisitorBlacklistViewSet, basename="visitor-blacklist")
router.register(r"feedbacks", VisitorFeedbackViewSet, basename="visitor-feedback")
router.register(r"security-officers", SecurityOfficerViewSet, basename="security-officer")
router.register(r"notifications", VisitorNotificationViewSet, basename="visitor-notification")
router.register(r"audit-logs", VisitorAuditLogViewSet, basename="visitor-audit-log")

urlpatterns = [
    path("dashboard/kpis/", visitor_dashboard_kpis, name="visitor-dashboard-kpis"),
    path("reports/", visitor_reports, name="visitor-reports"),
    path("", include(router.urls)),
]
