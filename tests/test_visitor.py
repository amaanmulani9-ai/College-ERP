"""
Unit and Integration Tests for Enterprise Visitor Management System
=====================================================================
Tests:
1. Visitor registration & Govt ID verification
2. Appointment creation & approval
3. Gate Pass generation
4. Check-in & Check-out workflow
5. Bulk check-out
6. Vehicle registration & parking allocation
7. Delivery logging
8. Contractor management & passes
9. Visitor Blacklisting & entry denial validation
10. Dashboard KPIs & REST API endpoints
"""

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.academics.models import Department, Faculty
from apps.profiles.models import UserProfile
from apps.staff.models import Employee, Designation
from apps.visitor.models import (
    Visitor,
    VisitorDocument,
    VisitorVehicle,
    Appointment,
    VisitPurpose,
    GatePass,
    EntryExitLog,
    Delivery,
    Contractor,
    ContractorPass,
    EmergencyVisitor,
    RestrictedAreaAccess,
    VisitorBlacklist,
    VisitorFeedback,
    SecurityOfficer,
    VisitorAuditLog,
)
from apps.visitor.services.visitor_service import VisitorService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_visitor_data(db):
    admin_user = User.objects.create_user(
        email="security.admin@example.com",
        password="Password123!",
        first_name="Security",
        last_name="Admin",
        is_staff=True,
        is_superuser=True,
    )

    user_profile, _ = UserProfile.objects.get_or_create(
        user=admin_user,
        defaults={"first_name": "Security", "last_name": "Admin"}
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG-V")
    dept = Department.objects.create(code="CSE-V", name="Computer Science & Security", faculty=faculty)
    designation = Designation.objects.create(code="SEC-OFFICER", name="Security Chief", department=dept)

    employee = Employee.objects.create(
        employee_id="EMP-2026-8899",
        employee_number="EMPN-2026-8899",
        profile=user_profile,
        department=dept,
        designation=designation,
        joining_date="2024-01-01",
        employment_status="active",
    )

    visitor = VisitorService.register_visitor({
        "visitor_id": "VIS-2026-9901",
        "first_name": "Rajesh",
        "last_name": "Sharma",
        "mobile": "9876543210",
        "email": "rajesh@research.org",
        "company": "National Science Foundation",
        "govt_id_type": "Aadhaar",
        "govt_id_number": "1234-5678-9901",
    }, performed_by=admin_user)

    return {
        "admin_user": admin_user,
        "dept": dept,
        "employee": employee,
        "visitor": visitor,
    }


# ===========================================================================
# 1. Visitor Registration & Document Tests
# ===========================================================================

def test_visitor_registration(setup_visitor_data):
    visitor = setup_visitor_data["visitor"]
    assert visitor.visitor_id == "VIS-2026-9901"
    assert visitor.mobile == "9876543210"
    assert VisitorDocument.objects.filter(visitor=visitor).exists()
    assert VisitorAuditLog.objects.filter(action__startswith="REGISTER_VISITOR").exists()


# ===========================================================================
# 2. Appointment & Gate Pass Tests
# ===========================================================================

def test_appointment_and_gate_pass(setup_visitor_data):
    visitor = setup_visitor_data["visitor"]
    employee = setup_visitor_data["employee"]
    admin_user = setup_visitor_data["admin_user"]

    appt = VisitorService.create_appointment({
        "visitor_id": str(visitor.id),
        "host_employee_id": str(employee.id),
        "purpose": "Research Meeting",
        "scheduled_date": "2026-08-02",
        "scheduled_time": "10:00:00",
    }, performed_by=admin_user)

    assert appt.status in ["Approved", "Pending"]

    approved_appt = VisitorService.approve_appointment(str(appt.id), performed_by=admin_user)
    assert approved_appt.status == "Approved"
    assert GatePass.objects.filter(visitor=visitor, appointment=approved_appt).exists()


# ===========================================================================
# 3. Check-In & Check-Out Workflow
# ===========================================================================

def test_check_in_check_out(setup_visitor_data):
    visitor = setup_visitor_data["visitor"]
    admin_user = setup_visitor_data["admin_user"]

    log = VisitorService.check_in_visitor(
        visitor_id=str(visitor.id),
        gate="Main Gate A",
        remarks="Entry permitted with ID check",
        performed_by=admin_user
    )

    assert log.gate == "Main Gate A"
    assert log.check_out is None

    out_log = VisitorService.check_out_visitor(str(log.id), performed_by=admin_user)
    assert out_log.check_out is not None


def test_bulk_check_out(setup_visitor_data):
    visitor = setup_visitor_data["visitor"]
    admin_user = setup_visitor_data["admin_user"]

    VisitorService.check_in_visitor(visitor_id=str(visitor.id), gate="Gate B", performed_by=admin_user)
    count = VisitorService.bulk_check_out(performed_by=admin_user)
    assert count >= 1
    assert EntryExitLog.objects.filter(check_out__isnull=True).count() == 0


# ===========================================================================
# 4. Vehicles, Deliveries & Contractors
# ===========================================================================

def test_vehicle_and_delivery_logging(setup_visitor_data):
    visitor = setup_visitor_data["visitor"]
    admin_user = setup_visitor_data["admin_user"]

    vehicle = VisitorService.register_vehicle({
        "visitor_id": str(visitor.id),
        "vehicle_number": "KA-01-MJ-9901",
        "vehicle_type": "Four-Wheeler",
        "parking_slot": "Visitor Parking V-12",
    }, performed_by=admin_user)

    assert vehicle.vehicle_number == "KA-01-MJ-9901"

    delivery = VisitorService.log_delivery({
        "courier_company": "FedEx Express",
        "tracking_number": "FEDEX-88991100",
        "recipient_id": str(admin_user.id),
    }, performed_by=admin_user)

    assert delivery.tracking_number == "FEDEX-88991100"


def test_contractor_management(setup_visitor_data):
    admin_user = setup_visitor_data["admin_user"]

    contractor = VisitorService.manage_contractor({
        "company": "Apex HVAC Maintenance",
        "supervisor": "Ramesh Singh",
    }, performed_by=admin_user)

    assert contractor.company == "Apex HVAC Maintenance"
    assert ContractorPass.objects.filter(contractor=contractor).exists()


# ===========================================================================
# 5. Blacklist Validation Test
# ===========================================================================

def test_blacklist_denial(setup_visitor_data):
    visitor = setup_visitor_data["visitor"]
    admin_user = setup_visitor_data["admin_user"]

    VisitorService.blacklist_visitor(str(visitor.id), reason="Security Violation", performed_by=admin_user)
    assert VisitorService.is_blacklisted(str(visitor.id)) is True

    with pytest.raises(ValueError, match="blacklisted"):
        VisitorService.check_in_visitor(str(visitor.id), performed_by=admin_user)


# ===========================================================================
# 6. Dashboard KPIs & REST API Tests
# ===========================================================================

def test_visitor_kpis_api(setup_visitor_data):
    client = APIClient()
    client.force_authenticate(user=setup_visitor_data["admin_user"])

    res = client.get("/api/visitor/dashboard/kpis/")
    assert res.status_code == 200
    assert "todays_visitors" in res.data
    assert "visitors_inside_campus" in res.data


def test_visitor_profiles_list_api(setup_visitor_data):
    client = APIClient()
    client.force_authenticate(user=setup_visitor_data["admin_user"])

    res = client.get("/api/visitor/visitors/")
    assert res.status_code == 200
    assert len(res.data.get("results", res.data)) >= 1
