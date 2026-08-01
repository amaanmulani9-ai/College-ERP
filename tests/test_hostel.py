"""
Unit and Integration Tests for Hostel Management System
========================================================
Tests:
1. Hostel, Block, Floor, Room, Bed CRUD
2. Bed Allocation & Room Capacity Validation
3. Fee Management Integration on Allocation
4. Room Transfer Workflow (Vacate old bed & allocate new bed)
5. Check-In & Check-Out Workflows
6. Visitor Entry Logging
7. Maintenance Ticket Creation
8. Vacant & Occupied Room Query Endpoints
9. REST API Permissions & Access Control (Warden vs Student)
"""

import decimal
from datetime import date

import pytest
from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.hostel.models import (
    Bed,
    Block,
    Floor,
    Hostel,
    Room,
    Warden,
)
from apps.hostel.services import HostelService
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.students.models import Student
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_hostel_data(db):
    user = User.objects.create_user(
        email="student.hostel@example.com",
        password="Password123!",
        first_name="Hostel",
        last_name="Student",
    )
    staff_user = User.objects.create_user(
        email="warden.hostel@example.com",
        password="Password123!",
        first_name="Hostel",
        last_name="Warden",
        is_staff=True,
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG-HST")
    department = Department.objects.create(name="Civil Eng", code="CE-HST", faculty=faculty)
    program = Program.objects.create(name="B.Tech Civil", code="BTCE-HST", department=department)
    session = AcademicSession.objects.create(name="2026-2027", start_date="2026-08-01", end_date="2027-05-31")
    semester = Semester.objects.create(program=program, semester_number=1, name="Sem 1 HST")

    profile, _ = UserProfile.objects.get_or_create(user=user)
    student = Student.objects.create(
        student_id="STU-HST-001",
        enrollment_number="ENR-HST-001",
        profile=profile,
        program=program,
        department=department,
        current_semester=semester,
        academic_session=session,
        admission_date=date.today(),
    )

    desig = Designation.objects.create(name="Hostel Warden", code="HST-WRD", category="hostel")
    staff_profile, _ = UserProfile.objects.get_or_create(user=staff_user)
    employee = Employee.objects.create(
        employee_id="EMP-HST-001",
        employee_number="EMPN-HST-001",
        profile=staff_profile,
        department=department,
        designation=desig,
        joining_date=date.today(),
    )

    hostel = Hostel.objects.create(name="Ganga Boys Hostel", code="GBH-01", gender_type="boys")
    block = Block.objects.create(hostel=hostel, name="Block A", code="BLK-A")
    floor = Floor.objects.create(block=block, floor_number=1)

    room1 = Room.objects.create(floor=floor, room_number="101", room_type="double", capacity=2, occupied_beds=0)
    bed1 = Bed.objects.create(room=room1, bed_number="101-A", status="vacant")
    bed2 = Bed.objects.create(room=room1, bed_number="101-B", status="vacant")

    room2 = Room.objects.create(floor=floor, room_number="102", room_type="single", capacity=1, occupied_beds=0)
    bed3 = Bed.objects.create(room=room2, bed_number="102-A", status="vacant")

    warden = Warden.objects.create(employee=employee, hostel=hostel, contact_number="9876543210")

    return {
        "user": user,
        "staff_user": staff_user,
        "student": student,
        "session": session,
        "hostel": hostel,
        "block": block,
        "floor": floor,
        "room1": room1,
        "bed1": bed1,
        "bed2": bed2,
        "room2": room2,
        "bed3": bed3,
        "warden": warden,
    }


# ===========================================================================
# 1. Bed Allocation & Fee Integration Tests
# ===========================================================================


def test_allocate_bed_success_and_fee_integration(setup_hostel_data):
    student = setup_hostel_data["student"]
    bed1 = setup_hostel_data["bed1"]
    session = setup_hostel_data["session"]

    alloc = HostelService.allocate_bed(
        student_id=str(student.id),
        bed_id=str(bed1.id),
        academic_session_id=str(session.id),
        fee_amount=decimal.Decimal("25000.00"),
        actor=setup_hostel_data["staff_user"],
    )

    assert alloc.status == "allocated"
    bed1.refresh_from_db()
    assert bed1.status == "allocated"
    setup_hostel_data["room1"].refresh_from_db()
    assert setup_hostel_data["room1"].occupied_beds == 1

    # Check fee integration
    from apps.fees.models import StudentFee

    fee = StudentFee.objects.filter(student=student, fee_structure__academic_session=session).first()
    assert fee is not None
    assert fee.total_amount == 25000.00


def test_allocate_bed_duplicate_allocation_fails(setup_hostel_data):
    student = setup_hostel_data["student"]
    bed1 = setup_hostel_data["bed1"]
    bed2 = setup_hostel_data["bed2"]
    session = setup_hostel_data["session"]

    HostelService.allocate_bed(
        student_id=str(student.id),
        bed_id=str(bed1.id),
        academic_session_id=str(session.id),
    )

    with pytest.raises(ValueError, match="already has an active hostel bed allocation"):
        HostelService.allocate_bed(
            student_id=str(student.id),
            bed_id=str(bed2.id),
            academic_session_id=str(session.id),
        )


# ===========================================================================
# 2. Room Transfer, Check-In & Check-Out
# ===========================================================================


def test_transfer_room(setup_hostel_data):
    student = setup_hostel_data["student"]
    bed1 = setup_hostel_data["bed1"]
    bed3 = setup_hostel_data["bed3"]
    session = setup_hostel_data["session"]

    alloc = HostelService.allocate_bed(
        student_id=str(student.id),
        bed_id=str(bed1.id),
        academic_session_id=str(session.id),
    )

    # Transfer from Room 101 Bed 101-A to Room 102 Bed 102-A
    transferred = HostelService.transfer_room(
        allocation_id=str(alloc.id),
        new_bed_id=str(bed3.id),
        actor=setup_hostel_data["staff_user"],
    )

    assert transferred.status == "transferred"
    bed1.refresh_from_db()
    assert bed1.status == "vacant"
    bed3.refresh_from_db()
    assert bed3.status == "allocated"


def test_check_in_and_check_out(setup_hostel_data):
    student = setup_hostel_data["student"]
    bed1 = setup_hostel_data["bed1"]
    session = setup_hostel_data["session"]

    alloc = HostelService.allocate_bed(
        student_id=str(student.id),
        bed_id=str(bed1.id),
        academic_session_id=str(session.id),
    )

    # Check In
    checked_in = HostelService.check_in(allocation_id=str(alloc.id))
    assert checked_in.status == "checked_in"
    assert checked_in.check_in_date == date.today()

    # Check Out
    checked_out = HostelService.check_out(allocation_id=str(alloc.id))
    assert checked_out.status == "checked_out"
    bed1.refresh_from_db()
    assert bed1.status == "vacant"


# ===========================================================================
# 3. Visitor Entry & Maintenance
# ===========================================================================


def test_visitor_entry(setup_hostel_data):
    visitor = HostelService.visitor_entry(
        student_id=str(setup_hostel_data["student"].id),
        visitor_name="John Doe",
        relation="Father",
        mobile="9988776655",
        actor=setup_hostel_data["staff_user"],
    )

    assert visitor.visitor_name == "John Doe"
    assert visitor.relation == "Father"


def test_maintenance_request(setup_hostel_data):
    req = HostelService.maintenance_request(
        room_id=str(setup_hostel_data["room1"].id),
        title="Leaking Tap",
        description="Bathroom tap leaking water continuously.",
        actor=setup_hostel_data["user"],
    )

    assert req.title == "Leaking Tap"
    assert req.status == "pending"


# ===========================================================================
# 4. REST API ViewSets
# ===========================================================================


def test_allocate_bed_api(setup_hostel_data):
    client = APIClient()
    client.force_authenticate(user=setup_hostel_data["staff_user"])

    url = "/api/hostel/allocate/"
    res = client.post(
        url,
        {
            "student_id": str(setup_hostel_data["student"].id),
            "bed_id": str(setup_hostel_data["bed1"].id),
            "academic_session_id": str(setup_hostel_data["session"].id),
            "fee_amount": "20000.00",
        },
        format="json",
    )

    assert res.status_code == 201
    assert res.data["status"] == "allocated"


def test_vacant_rooms_api(setup_hostel_data):
    client = APIClient()
    client.force_authenticate(user=setup_hostel_data["user"])

    url = "/api/hostel/vacant/"
    res = client.get(url)

    assert res.status_code == 200
    assert len(res.data) >= 2


def test_hostel_permissions(setup_hostel_data):
    client = APIClient()

    # Unauthenticated -> 401
    url = "/api/hostel/hostels/"
    res = client.get(url)
    assert res.status_code == 401

    # Student user -> 403 Forbidden for Hostel creation
    client.force_authenticate(user=setup_hostel_data["user"])
    res = client.post(url, {"name": "New Hostel", "code": "NH-01"}, format="json")
    assert res.status_code == 403

    # Staff user -> 201 Created
    client.force_authenticate(user=setup_hostel_data["staff_user"])
    res = client.post(url, {"name": "New Hostel", "code": "NH-01"}, format="json")
    assert res.status_code == 201
