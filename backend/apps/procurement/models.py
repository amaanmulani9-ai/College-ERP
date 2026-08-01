"""
Procurement & Purchase Management System Models
===============================================
Reuses Inventory models (Supplier, GoodsReceipt, InventoryItem, Warehouse)
Models for Requisitions, RFQs, Vendor Quotations, Quotation Comparisons,
Purchase Orders, Invoices, Vendor Payments, Vendor Contracts, and Audit Logs.
"""

import uuid
from django.conf import settings
from django.db import models
from apps.academics.models import Department
from apps.inventory.models import Supplier, InventoryItem, GoodsReceipt, Warehouse


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Purchase Requisition & Items
# ---------------------------------------------------------------------------
class PurchaseRequisition(models.Model):
    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    ]
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("converted", "Converted to PO"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requisition_number = models.CharField(max_length=50, unique=True, db_index=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    required_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Purchase Requisition"
        verbose_name_plural = "Purchase Requisitions"

    def __str__(self):
        return f"Req: {self.requisition_number} ({self.department.name}) [{self.status}]"


class PurchaseRequisitionItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requisition = models.ForeignKey(PurchaseRequisition, on_delete=models.CASCADE, related_name="items")
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    remarks = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.inventory_item.item_name} x {self.quantity}"


# ---------------------------------------------------------------------------
# RFQ & Vendor Quotations
# ---------------------------------------------------------------------------
class QuotationRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rfq_number = models.CharField(max_length=50, unique=True, db_index=True)
    purchase_requisition = models.ForeignKey(PurchaseRequisition, on_delete=models.CASCADE, related_name="rfqs")
    issue_date = models.DateField(auto_now_add=True)
    closing_date = models.DateField()
    status = models.CharField(max_length=20, default="open", db_index=True) # open, closed, evaluated

    def __str__(self):
        return f"RFQ: {self.rfq_number}"


class VendorQuotation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    rfq = models.ForeignKey(QuotationRequest, on_delete=models.CASCADE, related_name="quotations")
    quoted_amount = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_days = models.PositiveIntegerField(default=7)
    warranty_months = models.PositiveIntegerField(default=12)
    terms = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, default="submitted") # submitted, shortlisted, selected, rejected

    def __str__(self):
        return f"Quotation: {self.supplier.company_name} - ₹{self.quoted_amount}"


class QuotationComparison(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rfq = models.OneToOneField(QuotationRequest, on_delete=models.CASCADE, related_name="comparison")
    winning_supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    comparison_matrix = models.JSONField(default=dict, blank=True)
    approval_notes = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Comparison for RFQ {self.rfq.rfq_number}"


# ---------------------------------------------------------------------------
# Purchase Orders & Items
# ---------------------------------------------------------------------------
class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("approved", "Approved"),
        ("ordered", "Ordered"),
        ("partially_received", "Partially Received"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    po_number = models.CharField(max_length=50, unique=True, db_index=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name="purchase_orders")
    purchase_requisition = models.ForeignKey(PurchaseRequisition, on_delete=models.SET_NULL, null=True, blank=True)
    quotation = models.ForeignKey(VendorQuotation, on_delete=models.SET_NULL, null=True, blank=True)
    order_date = models.DateField(auto_now_add=True)
    expected_delivery = models.DateField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Purchase Order"
        verbose_name_plural = "Purchase Orders"

    def __str__(self):
        return f"PO: {self.po_number} -> {self.supplier.company_name} [₹{self.grand_total}]"


class PurchaseOrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name="items")
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.inventory_item.item_name} x {self.quantity} = ₹{self.total_amount}"


# ---------------------------------------------------------------------------
# Invoices, Payments & Contracts
# ---------------------------------------------------------------------------
class PurchaseInvoice(models.Model):
    STATUS_CHOICES = [
        ("unpaid", "Unpaid"),
        ("partially_paid", "Partially Paid"),
        ("paid", "Paid"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True, db_index=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name="invoices")
    invoice_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="unpaid", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-invoice_date"]

    def __str__(self):
        return f"Invoice: {self.invoice_number} [₹{self.amount}] ({self.payment_status})"


class PurchasePayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(PurchaseInvoice, on_delete=models.CASCADE, related_name="payments")
    payment_date = models.DateField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, default="NEFT / Bank Transfer")
    reference_number = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default="completed")

    def __str__(self):
        return f"Payment: ₹{self.amount} for Invoice {self.invoice.invoice_number}"


class VendorContract(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="contracts")
    contract_number = models.CharField(max_length=50, unique=True, db_index=True)
    start_date = models.DateField()
    end_date = models.DateField()
    renewal_date = models.DateField()
    status = models.CharField(max_length=20, default="active", db_index=True) # active, expired, renewed

    def __str__(self):
        return f"Contract: {self.contract_number} ({self.supplier.company_name})"


class ContractRenewal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contract = models.ForeignKey(VendorContract, on_delete=models.CASCADE, related_name="renewals")
    renewal_date = models.DateField(auto_now_add=True)
    remarks = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Renewal: {self.contract.contract_number} on {self.renewal_date}"


class ProcurementApproval(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    object_type = models.CharField(max_length=50) # Requisition, PO, Invoice
    object_id = models.CharField(max_length=100)
    approver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    level = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, default="approved")
    comments = models.TextField(blank=True, default="")
    approved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Approval L{self.level}: {self.object_type} by {self.approver.get_full_name()}"


class ProcurementAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"[{self.timestamp}] Procurement Action: {self.action}"
