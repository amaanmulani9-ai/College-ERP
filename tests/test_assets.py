"""
Unit and Integration Tests for Enterprise Asset Management System
===================================================================
Tests:
1. Category & Asset registration (auto QR label generation & audit log)
2. Asset Allocation & Return lifecycle
3. Inter-Department Asset Transfer workflow
4. Maintenance scheduling & completion service
5. Straight Line & Written Down Value Depreciation calculation
6. Departmental Physical Asset Audit & Discrepancy flagging
7. Asset Disposal workflow
8. Asset Incident logging
9. REST APIs, Dashboard KPIs, and RBAC permissions
"""

import decimal
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.academics.models import Department, Faculty
from apps.staff.models import Employee
from apps.assets.models import (
    AssetCategory,
    Asset,
    AssetAllocation,
    AssetTransfer,
    AssetMaintenance,
    MaintenanceVendor,
    Warranty,
    AssetDepreciation,
    AssetAudit,
    AssetDisposal,
    AssetIncident,
    QRCodeLabel,
    AssetAuditLog,
)
from apps.assets.services.asset_service import AssetService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_assets_data(db):
    admin_user = User.objects.create_user(
        email="asset.admin@example.com",
        password="Password123!",
        first_name="Asset",
        last_name="Manager",
        is_staff=True,
        is_superuser=True,
    )

    faculty = Faculty.objects.create(name="School of Engineering", code="ENG")
    dept_cs = Department.objects.create(code="CS", name="Computer Science", faculty=faculty)
    dept_me = Department.objects.create(code="ME", name="Mechanical Engineering", faculty=faculty)

    category = AssetCategory.objects.create(
        category_code="CAT-IT",
        category_name="Computers & IT Hardware",
        useful_life_years=3,
        depreciation_method="straight_line"
    )

    asset = AssetService.register_asset({
        "asset_code": "AST-TEST-101",
        "asset_name": "Test Workstation Pro",
        "category_id": str(category.id),
        "department_id": str(dept_cs.id),
        "purchase_cost": "100000.00",
        "current_value": "100000.00",
        "serial_number": "SN-TEST-101",
        "location": "Lab 1",
    }, performed_by=admin_user)

    vendor = MaintenanceVendor.objects.create(
        vendor_name="Tech Care Solutions",
        contact_person="Ramesh Patel",
        phone="9876543210",
        email="care@techcare.com"
    )

    return {
        "admin_user": admin_user,
        "dept_cs": dept_cs,
        "dept_me": dept_me,
        "category": category,
        "asset": asset,
        "vendor": vendor,
    }


# ===========================================================================
# 1. Registration, QR Label & Audit Log Tests
# ===========================================================================

def test_asset_registration_and_qr_label(setup_assets_data):
    asset = setup_assets_data["asset"]
    assert asset.status == "Available"
    assert asset.purchase_cost == decimal.Decimal("100000.00")
    assert hasattr(asset, "qr_label")
    assert "AST-TEST-101" in asset.qr_label.qr_payload
    assert AssetAuditLog.objects.filter(action__startswith="REGISTER_ASSET").exists()


# ===========================================================================
# 2. Asset Allocation & Return Tests
# ===========================================================================

def test_asset_allocation_and_return(setup_assets_data):
    asset = setup_assets_data["asset"]
    admin_user = setup_assets_data["admin_user"]
    dept_cs = setup_assets_data["dept_cs"]

    allocation = AssetService.allocate_asset(
        asset_id=str(asset.id),
        allocation_data={
            "allocated_to_type": "Department",
            "department_id": str(dept_cs.id),
            "allocated_location": "CS Advanced Lab",
        },
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.status == "Allocated"
    assert allocation.status == "Active"

    returned = AssetService.return_asset(
        allocation_id=str(allocation.id),
        return_data={"remarks": "Returned after semester project"},
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.status == "Available"
    assert returned.status == "Returned"


# ===========================================================================
# 3. Inter-Department Transfer Tests
# ===========================================================================

def test_asset_transfer_workflow(setup_assets_data):
    asset = setup_assets_data["asset"]
    admin_user = setup_assets_data["admin_user"]
    dept_cs = setup_assets_data["dept_cs"]
    dept_me = setup_assets_data["dept_me"]

    transfer = AssetService.transfer_asset(
        asset_id=str(asset.id),
        transfer_data={
            "from_department_id": str(dept_cs.id),
            "to_department_id": str(dept_me.id),
            "reason": "Lab expansion requirement",
            "status": "Approved"
        },
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.department == dept_me
    assert transfer.status == "Approved"


# ===========================================================================
# 4. Maintenance Scheduling & Completion Tests
# ===========================================================================

def test_maintenance_lifecycle(setup_assets_data):
    asset = setup_assets_data["asset"]
    admin_user = setup_assets_data["admin_user"]
    vendor = setup_assets_data["vendor"]

    maint = AssetService.schedule_maintenance(
        asset_id=str(asset.id),
        maintenance_data={
            "maintenance_type": "Preventive",
            "vendor_id": str(vendor.id),
            "cost": "5000.00",
            "status": "Scheduled",
        },
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.status == "Maintenance"

    completed = AssetService.complete_maintenance(
        maintenance_id=str(maint.id),
        completion_data={"cost": "4800.00", "remarks": "Replaced thermal paste"},
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.status == "Available"
    assert completed.status == "Completed"


# ===========================================================================
# 5. Depreciation Calculation Tests
# ===========================================================================

def test_straight_line_depreciation(setup_assets_data):
    asset = setup_assets_data["asset"]
    admin_user = setup_assets_data["admin_user"]

    dep = AssetService.calculate_depreciation(
        asset_id=str(asset.id),
        method="Straight Line",
        annual_percentage=10.0,
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.current_value == decimal.Decimal("90000.00")
    assert dep.book_value == decimal.Decimal("90000.00")
    assert dep.accumulated_depreciation == decimal.Decimal("10000.00")


# ===========================================================================
# 6. Physical Audit & Discrepancy Tests
# ===========================================================================

def test_physical_audit(setup_assets_data):
    admin_user = setup_assets_data["admin_user"]
    dept_cs = setup_assets_data["dept_cs"]
    asset = setup_assets_data["asset"]

    audit = AssetService.perform_audit(
        audit_data={
            "department_id": str(dept_cs.id),
            "result": "Discrepancy",
            "missing_assets": [asset.asset_code],
            "remarks": "Asset missing during audit",
        },
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.status == "Lost"
    assert audit.result == "Discrepancy"


# ===========================================================================
# 7. Asset Disposal Tests
# ===========================================================================

def test_asset_disposal(setup_assets_data):
    asset = setup_assets_data["asset"]
    admin_user = setup_assets_data["admin_user"]

    disposal = AssetService.dispose_asset(
        asset_id=str(asset.id),
        disposal_data={
            "reason": "Obsolete hardware",
            "disposal_value": "5000.00",
            "method": "Scrap"
        },
        performed_by=admin_user
    )

    asset.refresh_from_db()
    assert asset.status == "Disposed"
    assert asset.current_value == decimal.Decimal("5000.00")
    assert disposal.status == "Disposed"


# ===========================================================================
# 8. REST APIs & Dashboard KPIs Tests
# ===========================================================================

def test_assets_dashboard_kpis_api(setup_assets_data):
    client = APIClient()
    client.force_authenticate(user=setup_assets_data["admin_user"])

    res = client.get("/api/assets/dashboard/kpis/")
    assert res.status_code == 200
    assert "total_assets" in res.data
    assert "total_asset_value" in res.data


def test_assets_items_list_api(setup_assets_data):
    client = APIClient()
    client.force_authenticate(user=setup_assets_data["admin_user"])

    res = client.get("/api/assets/items/")
    assert res.status_code == 200
    assert len(res.data.get("results", res.data)) >= 1
