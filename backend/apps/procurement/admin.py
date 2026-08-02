from django.contrib import admin
from apps.procurement.models import (
    PurchaseRequisition,
    PurchaseRequisitionItem,
    QuotationRequest,
    VendorQuotation,
    QuotationComparison,
    PurchaseOrder,
    PurchaseOrderItem,
    PurchaseInvoice,
    PurchasePayment,
    VendorContract,
    ContractRenewal,
    ProcurementApproval,
    ProcurementAuditLog,
)


class PurchaseRequisitionItemInline(admin.TabularInline):
    model = PurchaseRequisitionItem
    extra = 1


class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 1


@admin.register(PurchaseRequisition)
class PurchaseRequisitionAdmin(admin.ModelAdmin):
    list_display = ["requisition_number", "department", "requested_by", "priority", "status", "required_date"]
    list_filter = ["priority", "status", "department"]
    search_fields = ["requisition_number"]
    inlines = [PurchaseRequisitionItemInline]


@admin.register(QuotationRequest)
class QuotationRequestAdmin(admin.ModelAdmin):
    list_display = ["rfq_number", "purchase_requisition", "issue_date", "closing_date", "status"]
    list_filter = ["status"]


@admin.register(VendorQuotation)
class VendorQuotationAdmin(admin.ModelAdmin):
    list_display = ["supplier", "rfq", "quoted_amount", "delivery_days", "warranty_months", "status"]
    list_filter = ["status"]


@admin.register(QuotationComparison)
class QuotationComparisonAdmin(admin.ModelAdmin):
    list_display = ["rfq", "winning_supplier"]


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ["po_number", "supplier", "order_date", "expected_delivery", "grand_total", "status"]
    list_filter = ["status", "supplier"]
    search_fields = ["po_number"]
    inlines = [PurchaseOrderItemInline]


@admin.register(PurchaseInvoice)
class PurchaseInvoiceAdmin(admin.ModelAdmin):
    list_display = ["invoice_number", "supplier", "purchase_order", "invoice_date", "amount", "payment_status"]
    list_filter = ["payment_status", "supplier"]


@admin.register(PurchasePayment)
class PurchasePaymentAdmin(admin.ModelAdmin):
    list_display = ["invoice", "payment_date", "payment_method", "reference_number", "amount", "status"]


@admin.register(VendorContract)
class VendorContractAdmin(admin.ModelAdmin):
    list_display = ["contract_number", "supplier", "start_date", "end_date", "status"]
    list_filter = ["status"]


@admin.register(ContractRenewal)
class ContractRenewalAdmin(admin.ModelAdmin):
    list_display = ["contract", "renewal_date"]


@admin.register(ProcurementApproval)
class ProcurementApprovalAdmin(admin.ModelAdmin):
    list_display = ["object_type", "object_id", "approver", "level", "status", "approved_at"]
    list_filter = ["object_type", "status"]


@admin.register(ProcurementAuditLog)
class ProcurementAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    list_filter = ["action", "timestamp"]
    readonly_fields = ["timestamp"]
