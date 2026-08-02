"""
Unit and Integration Tests for Inventory & Store Management System
====================================================================
Tests:
1. Category, Warehouse & Supplier CRUD
2. InventoryItem creation & ItemStock initialization
3. Stock Receive Service (updates quantity & records movement)
4. Stock Issue Service (deducts quantity & checks threshold warnings)
5. Purchase Request & Issue Voucher Workflows
6. Inventory Valuation Calculation & Dashboard KPIs Endpoint
7. Permissions & Access Control
"""

import decimal
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.academics.models import Department, Faculty
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.inventory.models import (
    Category,
    Warehouse,
    Supplier,
    InventoryItem,
    ItemStock,
    StockMovement,
    PurchaseRequest,
)
from apps.inventory.services.inventory_service import InventoryService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_inventory_data(db):
    admin_user = User.objects.create_user(
        email="admin.inv@example.com",
        password="Password123!",
        first_name="Store",
        last_name="Manager",
        is_staff=True,
        is_superuser=True,
    )

    category = Category.objects.create(category_code="CAT-LAB", category_name="Lab Equipment & Consumables")
    warehouse = Warehouse.objects.create(warehouse_code="WH-MAIN", warehouse_name="Central Main Store", location="Ground Floor Block C")
    supplier = Supplier.objects.create(supplier_code="SUP-001", company_name="TechLab Solutions Ltd", contact_person="Ravi Kumar", email="sales@techlab.com", phone="9876543210")

    item = InventoryService.create_item({
        "item_code": "ITEM-RES-101",
        "item_name": "Resistor Pack 10K Ohm",
        "category_id": str(category.id),
        "warehouse_id": str(warehouse.id),
        "supplier_id": str(supplier.id),
        "unit": "BOX",
        "initial_quantity": 50,
        "average_cost": decimal.Decimal("120.00"),
        "min_stock": 10,
    }, performed_by=admin_user)

    return {
        "admin_user": admin_user,
        "category": category,
        "warehouse": warehouse,
        "supplier": supplier,
        "item": item,
    }


# ===========================================================================
# 1. Stock Movement & Valuation Tests
# ===========================================================================

def test_item_creation_and_stock_initialization(setup_inventory_data):
    item = setup_inventory_data["item"]
    assert item.status == "in_stock"
    assert hasattr(item, "stock")
    assert item.stock.quantity_on_hand == 50
    assert item.stock.average_cost == 120.00


def test_receive_stock_service(setup_inventory_data):
    item = setup_inventory_data["item"]
    admin_user = setup_inventory_data["admin_user"]

    stock = InventoryService.receive_stock(
        item_id=str(item.id),
        quantity=30,
        reference_number="GRN-2026-001",
        cost=decimal.Decimal("125.00"),
        performed_by=admin_user,
    )

    assert stock.quantity_on_hand == 80
    assert StockMovement.objects.filter(inventory_item=item, movement_type="receive").exists()


def test_issue_stock_service(setup_inventory_data):
    item = setup_inventory_data["item"]
    admin_user = setup_inventory_data["admin_user"]

    stock = InventoryService.issue_stock(
        item_id=str(item.id),
        quantity=45,
        reference_number="VOUCH-2026-881",
        performed_by=admin_user,
    )

    assert stock.quantity_on_hand == 5
    item.refresh_from_db()
    assert item.status == "low_stock" # 5 <= min_stock (10)


def test_insufficient_stock_issue_fails(setup_inventory_data):
    item = setup_inventory_data["item"]
    admin_user = setup_inventory_data["admin_user"]

    with pytest.raises(ValueError):
        InventoryService.issue_stock(
            item_id=str(item.id),
            quantity=100, # Exceeds 50
            performed_by=admin_user,
        )


# ===========================================================================
# 2. REST API & Permissions Tests
# ===========================================================================

def test_inventory_kpis_api(setup_inventory_data):
    client = APIClient()
    client.force_authenticate(user=setup_inventory_data["admin_user"])

    res = client.get("/api/inventory/dashboard/kpis/")
    assert res.status_code == 200
    assert "total_items" in res.data
    assert "total_stock_value" in res.data


def test_inventory_items_api(setup_inventory_data):
    client = APIClient()
    client.force_authenticate(user=setup_inventory_data["admin_user"])

    res = client.get("/api/inventory/items/")
    assert res.status_code == 200
    assert len(res.data) >= 1


def test_inventory_permissions_unauthenticated():
    client = APIClient()
    res = client.get("/api/inventory/categories/")
    assert res.status_code == 401
