import uuid
from decimal import Decimal
from django.db import transaction
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from apps.inventory.models import (
    Category,
    Warehouse,
    Supplier,
    InventoryItem,
    ItemStock,
    StockMovement,
    PurchaseRequest,
    GoodsReceipt,
    IssueVoucher,
    ReturnVoucher,
    StockAdjustment,
    ReorderRule,
    InventoryAuditLog,
)


class InventoryService:
    @staticmethod
    def log_audit_event(action: str, performed_by=None, details=None):
        return InventoryAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {},
        )

    @staticmethod
    @transaction.atomic
    def create_item(data: dict, performed_by=None) -> InventoryItem:
        item = InventoryItem.objects.create(
            item_code=data["item_code"],
            item_name=data["item_name"],
            category_id=data["category_id"],
            warehouse_id=data["warehouse_id"],
            supplier_id=data.get("supplier_id"),
            unit=data.get("unit", "PCS"),
            sku=data.get("sku", ""),
            min_stock=data.get("min_stock", 5),
            reorder_level=data.get("reorder_level", 10),
            status="in_stock",
        )

        ItemStock.objects.create(
            inventory_item=item,
            quantity_on_hand=data.get("initial_quantity", 0),
            available_quantity=data.get("initial_quantity", 0),
            average_cost=Decimal(str(data.get("average_cost", "0.00"))),
        )

        ReorderRule.objects.create(
            inventory_item=item,
            min_quantity=data.get("min_stock", 5),
            reorder_quantity=50,
        )

        InventoryService.log_audit_event("create_item", performed_by, {"item_id": str(item.id)})
        return item

    @staticmethod
    @transaction.atomic
    def receive_stock(item_id: str, quantity: int, reference_number: str = "", cost: Decimal = Decimal("0.00"), performed_by=None) -> ItemStock:
        stock = ItemStock.objects.get(inventory_item_id=item_id)
        stock.quantity_on_hand += quantity
        stock.available_quantity += quantity
        if cost > 0:
            stock.average_cost = cost
        stock.save()

        # Update item status
        item = stock.inventory_item
        if stock.quantity_on_hand > item.min_stock:
            item.status = "in_stock"
            item.save()

        StockMovement.objects.create(
            movement_type="receive",
            inventory_item=item,
            warehouse=item.warehouse,
            quantity=quantity,
            reference_number=reference_number,
        )

        InventoryService.log_audit_event("receive_stock", performed_by, {"item_id": item_id, "quantity": quantity})
        return stock

    @staticmethod
    @transaction.atomic
    def issue_stock(item_id: str, quantity: int, reference_number: str = "", performed_by=None) -> ItemStock:
        stock = ItemStock.objects.get(inventory_item_id=item_id)
        if stock.available_quantity < quantity:
            raise ValueError(f"Insufficient available stock ({stock.available_quantity} available)")

        stock.quantity_on_hand -= quantity
        stock.available_quantity -= quantity
        stock.save()

        item = stock.inventory_item
        if stock.quantity_on_hand == 0:
            item.status = "out_of_stock"
        elif stock.quantity_on_hand <= item.min_stock:
            item.status = "low_stock"
        item.save()

        StockMovement.objects.create(
            movement_type="issue",
            inventory_item=item,
            warehouse=item.warehouse,
            quantity=-quantity,
            reference_number=reference_number,
        )

        InventoryService.log_audit_event("issue_stock", performed_by, {"item_id": item_id, "quantity": quantity})
        return stock

    @staticmethod
    def get_inventory_dashboard_kpis() -> dict:
        total_items = InventoryItem.objects.count()
        low_stock_count = InventoryItem.objects.filter(status="low_stock").count()
        out_of_stock_count = InventoryItem.objects.filter(status="out_of_stock").count()
        pending_pr_count = PurchaseRequest.objects.filter(status="pending").count()
        active_suppliers = Supplier.objects.filter(status="active").count()
        warehouses_count = Warehouse.objects.filter(status="active").count()

        # Calculate Total Inventory Valuation
        total_value = Decimal("0.00")
        for stock in ItemStock.objects.all():
            total_value += Decimal(str(stock.quantity_on_hand)) * stock.average_cost

        return {
            "total_items": total_items,
            "total_stock_value": float(total_value),
            "low_stock_items": low_stock_count,
            "out_of_stock_items": out_of_stock_count,
            "pending_purchase_requests": pending_pr_count,
            "active_suppliers": active_suppliers,
            "active_warehouses": warehouses_count,
        }
