from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    BulkExportView,
    BulkImportView,
    BulkStatusUpdateView,
    StudentDashboardSummaryView,
    StudentViewSet,
)

app_name = "students"

router = DefaultRouter()
router.register(r"", StudentViewSet, basename="student")

urlpatterns = [
    path("dashboard-summary/", StudentDashboardSummaryView.as_view(), name="dashboard_summary"),
    path("bulk-import/", BulkImportView.as_view(), name="bulk_import"),
    path("bulk-export/", BulkExportView.as_view(), name="bulk_export"),
    path("bulk-status-update/", BulkStatusUpdateView.as_view(), name="bulk_status_update"),
    path("", include(router.urls)),
]
