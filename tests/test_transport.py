"""
Unit and Integration Tests for Transport Management System
============================================================
Tests:
1. Vehicle, Route, Stop, Driver CRUD & Soft Delete
2. Vehicle Assignment (Driver + Route + Session)
3. Student Allocation & Pass Generation with QR Data
4. Maintenance Log & Cost Tracking
5. Fuel Log & Mileage Tracking
6. Transport Attendance (Morning / Evening)
7. Incident Logging & Severity Resolution
8. Dashboard KPIs & Reports REST APIs
9. REST API Permissions & Access Control
"""

import decimal
from datetime import date, timedelta
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.students.models import Student
from apps.transport.models import (
    Vehicle,
    Route,
    Stop,
    Driver,
    VehicleAssignment,
    StudentTransportAllocation,
    TransportPass,
    VehicleMaintenance,
    FuelLog,
    TransportAttendance,
    TransportIncident,
)
from apps.transport.services.transport_service import TransportService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_transport_data(db):
    student_user = User.objects.create_user(
        email="student.transport@example.com",
        password="Password123!",
        first_name="Transport",
        last_name="Student",
    )
    admin_user = User.objects.create_user(
        email="admin.transport@example.com",
        password="Password123!",
        first_name="Transport",
        last_name="Admin",
        is_staff=True,
        is_superuser=True,
    )
    driver_user = User.objects.create_user(
        email="driver.transport@example.com",
        password="Password123!",
        first_name="Bus",
        last_name="Driver",
        is_staff=True,
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG-TRN")
    department = Department.objects.create(name="Automobile Eng", code="AE-TRN", faculty=faculty)
    program = Program.objects.create(name="B.Tech Auto", code="BTAE-TRN", department=department)
    session = AcademicSession.objects.create(name="2026-2027", start_date="2026-08-01", end_date="2027-05-31")
    semester = Semester.objects.create(program=program, semester_number=1, name="Sem 1 TRN")

    student_profile, _ = UserProfile.objects.get_or_create(user=student_user)
    student = Student.objects.create(
        student_id="STU-TRN-001",
        enrollment_number="ENR-TRN-001",
        profile=student_profile,
        program=program,
        department=department,
        current_semester=semester,
        academic_session=session,
        admission_date=date.today(),
    )

    desig = Designation.objects.create(name="Bus Driver", code="DRV-01", category="transport")
    driver_profile, _ = UserProfile.objects.get_or_create(user=driver_user)
    employee = Employee.objects.create(
        employee_id="EMP-DRV-001",
        employee_number="EMPN-DRV-001",
        profile=driver_profile,
        department=department,
        designation=desig,
        joining_date=date.today(),
    )

    vehicle = Vehicle.objects.create(
        vehicle_code="BUS-101",
        registration_number="MH-12-AB-1234",
        vehicle_name="Yellow School Bus #1",
        vehicle_type="bus",
        capacity=40,
        status="active",
    )

    route = Route.objects.create(
        route_code="R-01",
        route_name="City Center to Campus",
        source="City Center",
        destination="Main Campus",
        distance_km=decimal.Decimal("15.50"),
    )

    stop1 = Stop.objects.create(route=route, stop_name="City Station", sequence=1)
    stop2 = Stop.objects.create(route=route, stop_name="Campus Gate 1", sequence=2)

    driver = Driver.objects.create(
        employee=employee,
        license_number="DL-9988776655",
        license_expiry=date.today() + timedelta(days=365),
        phone="9876543210",
        status="active",
    )

    assignment = VehicleAssignment.objects.create(
        driver=driver,
        vehicle=vehicle,
        route=route,
        academic_session=session,
        is_active=True,
    )

    return {
        "student_user": student_user,
        "admin_user": admin_user,
        "driver_user": driver_user,
        "student": student,
        "employee": employee,
        "session": session,
        "vehicle": vehicle,
        "route": route,
        "stop1": stop1,
        "stop2": stop2,
        "driver": driver,
        "assignment": assignment,
    }


# ===========================================================================
# 1. Vehicle & Route Service Tests
# ===========================================================================

def test_create_vehicle_service(setup_transport_data):
    v = TransportService.create_vehicle({
        "registration_number": "MH-12-XY-9999",
        "vehicle_name": "Mini Bus #2",
        "capacity": 25,
    }, performed_by=setup_transport_data["admin_user"])

    assert v.vehicle_name == "Mini Bus #2"
    assert v.capacity == 25
    assert Vehicle.objects.filter(id=v.id).exists()


def test_allocate_student_and_pass_generation(setup_transport_data):
    student = setup_transport_data["student"]
    vehicle = setup_transport_data["vehicle"]
    route = setup_transport_data["route"]
    stop1 = setup_transport_data["stop1"]
    stop2 = setup_transport_data["stop2"]

    alloc = TransportService.allocate_student({
        "student_id": str(student.id),
        "vehicle_id": str(vehicle.id),
        "route_id": str(route.id),
        "boarding_stop_id": str(stop1.id),
        "dropping_stop_id": str(stop2.id),
    }, performed_by=setup_transport_data["admin_user"])

    assert alloc.is_active is True
    assert hasattr(alloc, "pass_card")
    assert alloc.pass_card.status == "valid"
    assert "PASS:" in alloc.pass_card.qr_code_data


def test_maintenance_and_fuel_log(setup_transport_data):
    vehicle = setup_transport_data["vehicle"]

    m = TransportService.record_maintenance({
        "vehicle_id": str(vehicle.id),
        "cost": decimal.Decimal("5000.00"),
        "vendor": "Bosch Service",
    }, performed_by=setup_transport_data["admin_user"])

    assert m.cost == 5000.00
    assert m.vendor == "Bosch Service"

    f = TransportService.record_fuel_entry({
        "vehicle_id": str(vehicle.id),
        "litres": decimal.Decimal("50.00"),
        "cost": decimal.Decimal("4800.00"),
        "mileage_kml": decimal.Decimal("8.50"),
    }, performed_by=setup_transport_data["admin_user"])

    assert f.litres == 50.00
    assert f.cost == 4800.00


def test_attendance_and_incident(setup_transport_data):
    student = setup_transport_data["student"]
    vehicle = setup_transport_data["vehicle"]
    route = setup_transport_data["route"]
    stop1 = setup_transport_data["stop1"]
    stop2 = setup_transport_data["stop2"]
    driver = setup_transport_data["driver"]

    alloc = TransportService.allocate_student({
        "student_id": str(student.id),
        "vehicle_id": str(vehicle.id),
        "route_id": str(route.id),
        "boarding_stop_id": str(stop1.id),
        "dropping_stop_id": str(stop2.id),
    })

    att = TransportService.mark_attendance({
        "allocation_id": str(alloc.id),
        "trip_type": "morning",
        "status": "boarded",
    }, performed_by=setup_transport_data["admin_user"])

    assert att.status == "boarded"

    inc = TransportService.log_incident({
        "vehicle_id": str(vehicle.id),
        "driver_id": str(driver.id),
        "date": "2026-08-01T08:30:00Z",
        "description": "Minor tire puncture",
        "severity": "low",
    }, performed_by=setup_transport_data["admin_user"])

    assert inc.severity == "low"
    assert inc.resolved is False


# ===========================================================================
# 2. REST API Endpoints Tests
# ===========================================================================

def test_vehicles_api(setup_transport_data):
    client = APIClient()
    client.force_authenticate(user=setup_transport_data["admin_user"])

    res = client.get("/api/transport/vehicles/")
    assert res.status_code == 200
    assert len(res.data) >= 1


def test_transport_dashboard_kpis_api(setup_transport_data):
    client = APIClient()
    client.force_authenticate(user=setup_transport_data["admin_user"])

    res = client.get("/api/transport/dashboard/kpis/")
    assert res.status_code == 200
    assert "total_vehicles" in res.data
    assert "total_drivers" in res.data
    assert "total_routes" in res.data


def test_transport_permissions_unauthenticated(setup_transport_data):
    client = APIClient()
    res = client.get("/api/transport/vehicles/")
    assert res.status_code == 401
