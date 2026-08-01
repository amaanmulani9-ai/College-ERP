from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.procurement.views import (
    PurchaseRequisitionViewSet,
    QuotationRequestViewSet,
    VendorQuotationViewSet,
    QuotationComparisonViewSet,
    PurchaseOrderViewSet,
    PurchaseInvoiceViewSet,
    PurchasePaymentViewSet,
    VendorContractViewSet,
    ContractRenewalViewSet,
    ProcurementApprovalViewSet,
    ProcurementAuditLogViewSet,
    procurement_dashboard_kpis,
    procurement_reports,
)

router = DefaultRouter()
router.register(r"requisitions", PurchaseRequisitionViewSet, basename="procurement-requisition")
router.register(r"rfqs", QuotationRequestViewSet, basename="procurement-rfq")
router.register(r"quotations", VendorQuotationViewSet, basename="procurement-quotation")
router.register(r"comparisons", QuotationComparisonViewSet, basename="procurement-comparison")
router.register(r"orders", PurchaseOrderViewSet, basename="procurement-order")
router.register(r"invoices", PurchaseInvoiceViewSet, basename="procurement-invoice")
router.register(r"payments", PurchasePaymentViewSet, basename="procurement-payment")
router.register(r"contracts", VendorContractViewSet, basename="procurement-contract")
router.register(r"renewals", ContractRenewalViewSet, basename="procurement-renewal")
router.register(r"approvals", ProcurementApprovalViewSet, basename="procurement-approval")
router.register(r"audit-logs", ProcurementAuditLogViewSet, basename="procurement-audit-log")

urlpatterns = [
    path("dashboard/kpis/", procurement_dashboard_kpis, name="procurement-kpis"),
    path("reports/", procurement_reports, name="procurement-reports"),
    path("", include(router.urls)),
]
