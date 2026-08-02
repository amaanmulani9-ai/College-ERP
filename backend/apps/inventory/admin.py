from django.contrib import admin
from apps.inventory.models import (
    Category,
    Warehouse,
    Supplier,
    InventoryItem,
    ItemStock,
    StockMovement,
    PurchaseRequest,
    PurchaseRequestItem,
    GoodsReceipt,
    IssueVoucher,
    IssueItem,
    ReturnVoucher,
    ReturnItem,
    StockAdjustment,
    ReorderRule,
    StockAudit,
    InventoryAuditLog,
)


class PurchaseRequestItemInline(admin.TabularInline):
    model = PurchaseRequestItem
    extra = 1


class IssueItemInline(admin.TabularInline):
    model = IssueItem
    extra = 1


class ReturnItemInline(admin.TabularInline):
    model = ReturnItem
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["category_code", "category_name", "status"]
    search_fields = ["category_code", "category_name"]


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ["warehouse_code", "warehouse_name", "location", "manager", "status"]
    list_filter = ["status"]


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ["supplier_code", "company_name", "contact_person", "phone", "email", "status"]
    list_filter = ["status"]
    search_fields = ["company_name", "supplier_code"]


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ["item_code", "item_name", "category", "warehouse", "unit", "status"]
    list_filter = ["category", "warehouse", "status"]
    search_fields = ["item_code", "item_name", "sku", "barcode"]


@admin.register(ItemStock)
class ItemStockAdmin(admin.ModelAdmin):
    list_display = ["inventory_item", "quantity_on_hand", "reserved_quantity", "available_quantity", "average_cost"]


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ["movement_type", "inventory_item", "warehouse", "quantity", "reference_number", "timestamp"]
    list_filter = ["movement_type", "warehouse", "timestamp"]


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = ["request_number", "department", "requested_by", "status", "created_at"]
    list_filter = ["status", "department"]
    inlines = [PurchaseRequestItemInline]


@admin.register(GoodsReceipt)
class GoodsReceiptAdmin(admin.ModelAdmin):
    list_display = ["grn_number", "supplier", "received_date", "verified_by"]
    list_filter = ["supplier", "received_date"]


@admin.register(IssueVoucher)
class IssueVoucherAdmin(admin.ModelAdmin):
    list_display = ["voucher_number", "department", "issued_by", "issued_to", "created_at"]
    inlines = [IssueItemInline]


@admin.register(ReturnVoucher)
class ReturnVoucherAdmin(admin.ModelAdmin):
    list_display = ["return_number", "department", "condition", "created_at"]
    inlines = [ReturnItemInline]


@admin.register(StockAdjustment)
class StockAdjustmentAdmin(admin.ModelAdmin):
    list_display = ["inventory_item", "adjustment_type", "quantity", "reason", "approved_by"]
    list_filter = ["adjustment_type"]


@admin.register(ReorderRule)
class ReorderRuleAdmin(admin.ModelAdmin):
    list_display = ["inventory_item", "min_quantity", "reorder_quantity", "auto_alert"]


@admin.register(InventoryAuditLog)
class InventoryAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    list_filter = ["action", "timestamp"]
    readonly_fields = ["timestamp"]
