from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DesignationViewSet,
    EmployeeViewSet,
    StaffBulkExportView,
    StaffBulkImportView,
    StaffDashboardSummaryView,
)

app_name = "staff"

router = DefaultRouter()
router.register(r"designations", DesignationViewSet, basename="designation")
router.register(r"employees", EmployeeViewSet, basename="employee")

urlpatterns = [
    path("dashboard-summary/", StaffDashboardSummaryView.as_view(), name="dashboard_summary"),
    path("bulk-import/", StaffBulkImportView.as_view(), name="bulk_import"),
    path("bulk-export/", StaffBulkExportView.as_view(), name="bulk_export"),
    path("", include(router.urls)),
]
