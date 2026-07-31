from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ScholarshipApplicationViewSet,
    ScholarshipAuditLogViewSet,
    ScholarshipRenewalViewSet,
    ScholarshipTypeViewSet,
    ScholarshipViewSet,
)

router = DefaultRouter()
router.register(r"types", ScholarshipTypeViewSet, basename="scholarship-type")
router.register(r"scholarships", ScholarshipViewSet, basename="scholarship")
router.register(r"applications", ScholarshipApplicationViewSet, basename="scholarship-application")
router.register(r"renewals", ScholarshipRenewalViewSet, basename="scholarship-renewal")
router.register(r"audit-logs", ScholarshipAuditLogViewSet, basename="scholarship-audit-log")

urlpatterns = [
    # Aliased convenience paths
    path("apply/", ScholarshipApplicationViewSet.as_view({"post": "apply"}), name="scholarship-apply"),
    path("approve/", ScholarshipApplicationViewSet.as_view({"post": "approve"}), name="scholarship-approve"),
    path("reject/", ScholarshipApplicationViewSet.as_view({"post": "reject"}), name="scholarship-reject"),
    path("renew/", ScholarshipRenewalViewSet.as_view({"post": "renew"}), name="scholarship-renew"),
    path("student/<uuid:student_id>/", ScholarshipViewSet.as_view({"get": "student_scholarships"}), name="student-scholarships"),

    # Router URLs
    path("", include(router.urls)),
]
