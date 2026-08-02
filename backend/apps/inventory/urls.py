from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.inventory.views import (
    CategoryViewSet,
    WarehouseViewSet,
    SupplierViewSet,
    InventoryItemViewSet,
    ItemStockViewSet,
    StockMovementViewSet,
    PurchaseRequestViewSet,
    GoodsReceiptViewSet,
    IssueVoucherViewSet,
    ReturnVoucherViewSet,
    StockAdjustmentViewSet,
    ReorderRuleViewSet,
    InventoryAuditLogViewSet,
    inventory_dashboard_kpis,
    inventory_reports,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="inventory-category")
router.register(r"warehouses", WarehouseViewSet, basename="inventory-warehouse")
router.register(r"suppliers", SupplierViewSet, basename="inventory-supplier")
router.register(r"items", InventoryItemViewSet, basename="inventory-item")
router.register(r"stocks", ItemStockViewSet, basename="inventory-stock")
router.register(r"movements", StockMovementViewSet, basename="inventory-movement")
router.register(r"purchase-requests", PurchaseRequestViewSet, basename="inventory-purchase-request")
router.register(r"goods-receipts", GoodsReceiptViewSet, basename="inventory-goods-receipt")
router.register(r"issue-vouchers", IssueVoucherViewSet, basename="inventory-issue-voucher")
router.register(r"return-vouchers", ReturnVoucherViewSet, basename="inventory-return-voucher")
router.register(r"adjustments", StockAdjustmentViewSet, basename="inventory-adjustment")
router.register(r"reorder-rules", ReorderRuleViewSet, basename="inventory-reorder-rule")
router.register(r"audit-logs", InventoryAuditLogViewSet, basename="inventory-audit-log")

urlpatterns = [
    path("dashboard/kpis/", inventory_dashboard_kpis, name="inventory-kpis"),
    path("reports/", inventory_reports, name="inventory-reports"),
    path("", include(router.urls)),
]
