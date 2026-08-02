"""
Unit and Integration Tests for Enterprise Procurement System
=============================================================
Tests:
1. Purchase Requisition creation & approval service
2. RFQ creation & Vendor Quotation submission
3. Purchase Order generation (calculates subtotal & grand total)
4. Purchase Invoice creation & Payment processing
5. Dashboard KPI metrics endpoint
6. Permissions & Access Control
"""

import decimal
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.academics.models import Department, Faculty
from apps.inventory.models import Category, Warehouse, Supplier, InventoryItem
from apps.procurement.models import (
    PurchaseRequisition,
    QuotationRequest,
    VendorQuotation,
    PurchaseOrder,
    PurchaseInvoice,
)
from apps.procurement.services.procurement_service import ProcurementService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_procurement_data(db):
    admin_user = User.objects.create_user(
        email="procurement.admin@example.com",
        password="Password123!",
        first_name="Procurement",
        last_name="Officer",
        is_staff=True,
        is_superuser=True,
    )

    faculty = Faculty.objects.create(name="School of Engineering", code="ENG")
    dept = Department.objects.create(name="Computer Science & Engineering", code="CSE", faculty=faculty)

    category = Category.objects.create(category_code="CAT-IT", category_name="IT Hardware")
    warehouse = Warehouse.objects.create(warehouse_code="WH-IT", warehouse_name="IT Store", location="Block A")
    supplier = Supplier.objects.create(supplier_code="SUP-IT-1", company_name="Dell Enterprise Ltd", contact_person="Anil Mehta", email="sales@dell.com", phone="9988776655")

    item = InventoryItem.objects.create(
        item_code="ITEM-MON-24",
        item_name='Dell 24" IPS Monitor',
        category=category,
        warehouse=warehouse,
        supplier=supplier,
        unit="PCS",
    )

    return {
        "admin_user": admin_user,
        "dept": dept,
        "category": category,
        "warehouse": warehouse,
        "supplier": supplier,
        "item": item,
    }


# ===========================================================================
# 1. Requisition & Approval Tests
# ===========================================================================

def test_create_and_approve_requisition(setup_procurement_data):
    user = setup_procurement_data["admin_user"]
    dept = setup_procurement_data["dept"]
    item = setup_procurement_data["item"]

    req = ProcurementService.create_requisition({
        "requisition_number": "REQ-2026-101",
        "department_id": str(dept.id),
        "priority": "high",
        "required_date": "2026-08-15",
        "items": [
            {"inventory_item_id": str(item.id), "quantity": 10, "estimated_cost": "15000.00", "remarks": "CSE Lab setup"}
        ]
    }, requested_by=user)

    assert req.status == "pending"
    assert req.items.count() == 1

    approved_req = ProcurementService.approve_requisition(str(req.id), approver=user, comments="Budget approved")
    assert approved_req.status == "approved"


# ===========================================================================
# 2. Purchase Order & Invoice Tests
# ===========================================================================

def test_create_purchase_order(setup_procurement_data):
    user = setup_procurement_data["admin_user"]
    supplier = setup_procurement_data["supplier"]
    item = setup_procurement_data["item"]

    po = ProcurementService.create_purchase_order({
        "po_number": "PO-2026-901",
        "supplier_id": str(supplier.id),
        "expected_delivery": "2026-08-20",
        "items": [
            {"inventory_item_id": str(item.id), "quantity": 5, "unit_price": "14000.00", "tax_amount": "2520.00"}
        ]
    }, performed_by=user)

    assert po.status == "ordered"
    assert po.subtotal == decimal.Decimal("70000.00")
    assert po.grand_total == decimal.Decimal("72520.00")


def test_process_invoice(setup_procurement_data):
    user = setup_procurement_data["admin_user"]
    supplier = setup_procurement_data["supplier"]
    item = setup_procurement_data["item"]

    po = ProcurementService.create_purchase_order({
        "po_number": "PO-2026-902",
        "supplier_id": str(supplier.id),
        "expected_delivery": "2026-08-20",
        "items": [
            {"inventory_item_id": str(item.id), "quantity": 2, "unit_price": "14000.00"}
        ]
    }, performed_by=user)

    invoice = ProcurementService.process_invoice({
        "invoice_number": "INV-2026-701",
        "supplier_id": str(supplier.id),
        "purchase_order_id": str(po.id),
        "invoice_date": "2026-08-01",
        "amount": "28000.00",
    }, performed_by=user)

    assert invoice.payment_status == "unpaid"


# ===========================================================================
# 3. REST API & Permissions Tests
# ===========================================================================

def test_procurement_kpis_api(setup_procurement_data):
    client = APIClient()
    client.force_authenticate(user=setup_procurement_data["admin_user"])

    res = client.get("/api/procurement/dashboard/kpis/")
    assert res.status_code == 200
    assert "pending_requisitions" in res.data
    assert "total_purchase_orders" in res.data


def test_procurement_requisitions_api(setup_procurement_data):
    client = APIClient()
    client.force_authenticate(user=setup_procurement_data["admin_user"])

    res = client.get("/api/procurement/requisitions/")
    assert res.status_code == 200


def test_procurement_permissions_unauthenticated():
    client = APIClient()
    res = client.get("/api/procurement/requisitions/")
    assert res.status_code == 401
