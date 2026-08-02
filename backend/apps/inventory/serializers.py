from rest_framework import serializers
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


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class WarehouseSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source="manager.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Warehouse
        fields = "__all__"


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class ItemStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemStock
        fields = "__all__"


class InventoryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    warehouse_name = serializers.CharField(source="warehouse.warehouse_name", read_only=True)
    supplier_name = serializers.CharField(source="supplier.company_name", read_only=True)
    stock = ItemStockSerializer(read_only=True)

    class Meta:
        model = InventoryItem
        fields = "__all__"


class StockMovementSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = StockMovement
        fields = "__all__"


class PurchaseRequestItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = PurchaseRequestItem
        fields = "__all__"


class PurchaseRequestSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    requested_by_name = serializers.CharField(source="requested_by.get_full_name", read_only=True)
    items = PurchaseRequestItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = "__all__"


class GoodsReceiptSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.company_name", read_only=True)

    class Meta:
        model = GoodsReceipt
        fields = "__all__"


class IssueItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = IssueItem
        fields = "__all__"


class IssueVoucherSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    issued_to_name = serializers.CharField(source="issued_to.profile.user.get_full_name", read_only=True)
    items = IssueItemSerializer(many=True, read_only=True)

    class Meta:
        model = IssueVoucher
        fields = "__all__"


class ReturnVoucherSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = ReturnVoucher
        fields = "__all__"


class StockAdjustmentSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = StockAdjustment
        fields = "__all__"


class ReorderRuleSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = ReorderRule
        fields = "__all__"


class InventoryAuditLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source="performed_by.get_full_name", read_only=True)

    class Meta:
        model = InventoryAuditLog
        fields = "__all__"
