from rest_framework import serializers
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


class PurchaseRequisitionItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = PurchaseRequisitionItem
        fields = "__all__"


class PurchaseRequisitionSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    requested_by_name = serializers.CharField(source="requested_by.get_full_name", read_only=True)
    items = PurchaseRequisitionItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseRequisition
        fields = "__all__"


class QuotationRequestSerializer(serializers.ModelSerializer):
    requisition_number = serializers.CharField(source="purchase_requisition.requisition_number", read_only=True)

    class Meta:
        model = QuotationRequest
        fields = "__all__"


class VendorQuotationSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.company_name", read_only=True)

    class Meta:
        model = VendorQuotation
        fields = "__all__"


class QuotationComparisonSerializer(serializers.ModelSerializer):
    winning_supplier_name = serializers.CharField(source="winning_supplier.company_name", read_only=True)

    class Meta:
        model = QuotationComparison
        fields = "__all__"


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = PurchaseOrderItem
        fields = "__all__"


class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.company_name", read_only=True)
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = "__all__"


class PurchaseInvoiceSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.company_name", read_only=True)
    po_number = serializers.CharField(source="purchase_order.po_number", read_only=True)

    class Meta:
        model = PurchaseInvoice
        fields = "__all__"


class PurchasePaymentSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(source="invoice.invoice_number", read_only=True)

    class Meta:
        model = PurchasePayment
        fields = "__all__"


class VendorContractSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.company_name", read_only=True)

    class Meta:
        model = VendorContract
        fields = "__all__"


class ContractRenewalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractRenewal
        fields = "__all__"


class ProcurementApprovalSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source="approver.get_full_name", read_only=True)

    class Meta:
        model = ProcurementApproval
        fields = "__all__"


class ProcurementAuditLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source="performed_by.get_full_name", read_only=True)

    class Meta:
        model = ProcurementAuditLog
        fields = "__all__"
