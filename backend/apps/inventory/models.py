"""
Inventory & Store Management System Models
===========================================
Models covering Categories, Warehouses, Suppliers, Inventory Items, Item Stock,
Stock Movements, Purchase Requests, Goods Receipts, Issue Vouchers, Return Vouchers,
Stock Adjustments, Reorder Rules, Stock Audits, and Audit Logs.
"""

import uuid
from django.conf import settings
from django.db import models
from apps.staff.models import Employee
from apps.academics.models import Department


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Category, Warehouse, Supplier
# ---------------------------------------------------------------------------
class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category_code = models.CharField(max_length=50, unique=True, db_index=True)
    category_name = models.CharField(max_length=150)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="subcategories")
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, default="active", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category_code"]
        verbose_name = "Inventory Category"
        verbose_name_plural = "Inventory Categories"

    def __str__(self):
        return f"{self.category_name} ({self.category_code})"


class Warehouse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    warehouse_code = models.CharField(max_length=50, unique=True, db_index=True)
    warehouse_name = models.CharField(max_length=150)
    location = models.CharField(max_length=200)
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="managed_warehouses")
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, default="active", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["warehouse_code"]
        verbose_name = "Warehouse"
        verbose_name_plural = "Warehouses"

    def __str__(self):
        return f"{self.warehouse_name} ({self.warehouse_code})"


class Supplier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    supplier_code = models.CharField(max_length=50, unique=True, db_index=True)
    company_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    gst_number = models.CharField(max_length=50, blank=True, default="27AAAAA0000A1Z5")
    address = models.TextField()
    status = models.CharField(max_length=20, default="active", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["company_name"]
        verbose_name = "Supplier"
        verbose_name_plural = "Suppliers"

    def __str__(self):
        return f"{self.company_name} ({self.supplier_code})"


# ---------------------------------------------------------------------------
# Inventory Item & Stock Tracking
# ---------------------------------------------------------------------------
class InventoryItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item_code = models.CharField(max_length=50, unique=True, db_index=True)
    item_name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="items")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.PROTECT, related_name="items")
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name="supplied_items")
    unit = models.CharField(max_length=30, default="PCS") # PCS, BOX, KG, LTR, PACK
    sku = models.CharField(max_length=100, blank=True, default="")
    barcode = models.CharField(max_length=100, blank=True, default="")
    description = models.TextField(blank=True, default="")
    
    min_stock = models.PositiveIntegerField(default=5)
    max_stock = models.PositiveIntegerField(default=100)
    reorder_level = models.PositiveIntegerField(default=10)
    
    status = models.CharField(max_length=20, default="in_stock", db_index=True) # in_stock, low_stock, out_of_stock
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["item_code"]
        verbose_name = "Inventory Item"
        verbose_name_plural = "Inventory Items"

    def __str__(self):
        return f"{self.item_name} [{self.item_code}]"


class ItemStock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory_item = models.OneToOneField(InventoryItem, on_delete=models.CASCADE, related_name="stock")
    quantity_on_hand = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)
    available_quantity = models.PositiveIntegerField(default=0)
    average_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Item Stock"
        verbose_name_plural = "Item Stocks"

    def __str__(self):
        return f"Stock: {self.inventory_item.item_name} = {self.quantity_on_hand} {self.inventory_item.unit}"


class StockMovement(models.Model):
    TYPE_CHOICES = [
        ("receive", "Receive"),
        ("issue", "Issue"),
        ("transfer", "Transfer"),
        ("adjustment", "Adjustment"),
        ("return", "Return"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    movement_type = models.CharField(max_length=20, choices=TYPE_CHOICES, db_index=True)
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name="movements")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    reference_number = models.CharField(max_length=100, blank=True, default="")
    remarks = models.TextField(blank=True, default="")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Stock Movement"
        verbose_name_plural = "Stock Movements"

    def __str__(self):
        return f"[{self.movement_type.upper()}] {self.inventory_item.item_name} ({self.quantity}) Ref: {self.reference_number}"


# ---------------------------------------------------------------------------
# Purchase Requests & Goods Receipts
# ---------------------------------------------------------------------------
class PurchaseRequest(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("ordered", "Ordered"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_number = models.CharField(max_length=50, unique=True, db_index=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Purchase Request"
        verbose_name_plural = "Purchase Requests"

    def __str__(self):
        return f"PR: {self.request_number} [{self.status}]"


class PurchaseRequestItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name="items")
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.inventory_item.item_name} x {self.quantity}"


class GoodsReceipt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    grn_number = models.CharField(max_length=50, unique=True, db_index=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.SET_NULL, null=True, blank=True)
    received_date = models.DateField()
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Goods Receipt"
        verbose_name_plural = "Goods Receipts"

    def __str__(self):
        return f"GRN: {self.grn_number} from {self.supplier.company_name}"


# ---------------------------------------------------------------------------
# Issue Vouchers & Return Vouchers
# ---------------------------------------------------------------------------
class IssueVoucher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    voucher_number = models.CharField(max_length=50, unique=True, db_index=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    issued_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="issued_vouchers")
    issued_to = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="received_vouchers")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Issue Voucher: {self.voucher_number} -> {self.department.name}"


class IssueItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    issue_voucher = models.ForeignKey(IssueVoucher, on_delete=models.CASCADE, related_name="items")
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"Issued: {self.inventory_item.item_name} x {self.quantity}"


class ReturnVoucher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    return_number = models.CharField(max_length=50, unique=True, db_index=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    reason = models.TextField()
    condition = models.CharField(max_length=50, default="good") # good, damaged, defective
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Return Voucher: {self.return_number}"


class ReturnItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    return_voucher = models.ForeignKey(ReturnVoucher, on_delete=models.CASCADE, related_name="items")
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"Returned: {self.inventory_item.item_name} x {self.quantity}"


# ---------------------------------------------------------------------------
# Adjustments, Reorders & Audit Logs
# ---------------------------------------------------------------------------
class StockAdjustment(models.Model):
    TYPE_CHOICES = [
        ("increase", "Increase"),
        ("decrease", "Decrease"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    adjustment_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    reason = models.TextField()
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Adjustment: {self.adjustment_type} {self.quantity} ({self.inventory_item.item_name})"


class ReorderRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory_item = models.OneToOneField(InventoryItem, on_delete=models.CASCADE, related_name="reorder_rule")
    min_quantity = models.PositiveIntegerField(default=5)
    reorder_quantity = models.PositiveIntegerField(default=50)
    auto_alert = models.BooleanField(default=True)

    def __str__(self):
        return f"Reorder Rule: {self.inventory_item.item_name} (Min: {self.min_quantity})"


class StockAudit(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    system_quantity = models.PositiveIntegerField()
    physical_quantity = models.PositiveIntegerField()
    variance = models.IntegerField()
    audited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stock Audit: {self.inventory_item.item_name} Variance: {self.variance}"


class InventoryAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"[{self.timestamp}] Inventory Action: {self.action}"
