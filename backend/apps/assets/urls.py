from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.assets.views import (
    AssetCategoryViewSet,
    MaintenanceVendorViewSet,
    AssetViewSet,
    AssetAllocationViewSet,
    AssetTransferViewSet,
    AssetMaintenanceViewSet,
    MaintenanceScheduleViewSet,
    WarrantyViewSet,
    AssetDepreciationViewSet,
    AssetAuditViewSet,
    AssetDisposalViewSet,
    AssetIncidentViewSet,
    AssetDocumentViewSet,
    QRCodeLabelViewSet,
    AssetAuditLogViewSet,
    assets_dashboard_kpis,
    assets_reports,
)

router = DefaultRouter()
router.register(r"categories", AssetCategoryViewSet, basename="asset-category")
router.register(r"vendors", MaintenanceVendorViewSet, basename="maintenance-vendor")
router.register(r"items", AssetViewSet, basename="asset-item")
router.register(r"allocations", AssetAllocationViewSet, basename="asset-allocation")
router.register(r"transfers", AssetTransferViewSet, basename="asset-transfer")
router.register(r"maintenances", AssetMaintenanceViewSet, basename="asset-maintenance")
router.register(r"schedules", MaintenanceScheduleViewSet, basename="maintenance-schedule")
router.register(r"warranties", WarrantyViewSet, basename="asset-warranty")
router.register(r"depreciations", AssetDepreciationViewSet, basename="asset-depreciation")
router.register(r"audits", AssetAuditViewSet, basename="asset-audit")
router.register(r"disposals", AssetDisposalViewSet, basename="asset-disposal")
router.register(r"incidents", AssetIncidentViewSet, basename="asset-incident")
router.register(r"documents", AssetDocumentViewSet, basename="asset-document")
router.register(r"qr-labels", QRCodeLabelViewSet, basename="qr-code-label")
router.register(r"logs", AssetAuditLogViewSet, basename="asset-audit-log")

urlpatterns = [
    path("dashboard/kpis/", assets_dashboard_kpis, name="assets-dashboard-kpis"),
    path("reports/", assets_reports, name="assets-reports"),
    path("", include(router.urls)),
]
