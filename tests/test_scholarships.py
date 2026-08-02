"""
Unit and Integration Tests for Scholarship Management System
============================================================
Tests:
1. ScholarshipType Catalog CRUD
2. Scholarship Application & Eligibility Checking (min CGPA, family income cap, duplicate prevention)
3. Application Approval Workflow & Auto-Update of StudentFee.scholarship_amount
4. Application Rejection Workflow
5. Scholarship Renewal Workflow
6. Direct Fee Waiver Application
7. Student Scholarships Query
8. REST API Permissions & Tenant Isolation
"""

import decimal
from datetime import date

import pytest
from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.fees.models import FeeCategory, FeeStructure, StudentFee
from apps.profiles.models import UserProfile
from apps.scholarships.models import (
    Scholarship,
    ScholarshipAuditLog,
    ScholarshipType,
)
from apps.scholarships.services import ScholarshipService
from apps.students.models import Student
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_sch_data(db):
    user = User.objects.create_user(
        email="student.sch@example.com",
        password="Password123!",
        first_name="Sch",
        last_name="Student",
    )
    staff_user = User.objects.create_user(
        email="staff.sch@example.com",
        password="Password123!",
        first_name="Sch",
        last_name="Staff",
        is_staff=True,
    )

    faculty = Faculty.objects.create(name="Science", code="SCI-SCH")
    department = Department.objects.create(name="Math", code="MATH-SCH", faculty=faculty)
    program = Program.objects.create(name="B.Sc Math", code="BSCM-SCH", department=department)
    session_1 = AcademicSession.objects.create(name="2026-2027", start_date="2026-08-01", end_date="2027-05-31")
    session_2 = AcademicSession.objects.create(name="2027-2028", start_date="2027-08-01", end_date="2028-05-31")
    semester = Semester.objects.create(program=program, semester_number=1, name="Sem 1 SCH")

    profile, _ = UserProfile.objects.get_or_create(user=user)
    student = Student.objects.create(
        student_id="STU-SCH-001",
        enrollment_number="ENR-SCH-001",
        profile=profile,
        program=program,
        department=department,
        current_semester=semester,
        academic_session=session_1,
        admission_date=date.today(),
    )

    fee_cat = FeeCategory.objects.create(name="Tuition Fee Sch", code="TUITION-SCH")
    fee_struct = FeeStructure.objects.create(
        academic_session=session_1,
        program=program,
        semester=semester,
        category=fee_cat,
        amount=20000.0,
    )

    student_fee = StudentFee.objects.create(
        student=student,
        fee_structure=fee_struct,
        total_amount=20000.0,
        due_amount=20000.0,
        paid_amount=0.0,
        status="pending",
    )

    sch_type = ScholarshipType.objects.create(
        name="Merit Excellence Scholarship",
        code="MERIT-100",
        provider="merit",
        min_cgpa_requirement=8.0,
        max_family_income=decimal.Decimal("500000.00"),
        is_active=True,
    )

    return {
        "user": user,
        "staff_user": staff_user,
        "student": student,
        "session_1": session_1,
        "session_2": session_2,
        "student_fee": student_fee,
        "sch_type": sch_type,
    }


# ===========================================================================
# 1. ScholarshipType Unit Tests
# ===========================================================================


def test_scholarship_type_creation(setup_sch_data):
    st = setup_sch_data["sch_type"]
    assert str(st) == "Merit Excellence Scholarship (Merit Based)"
    assert st.code == "MERIT-100"
    assert st.is_active is True


# ===========================================================================
# 2. Service Unit Tests: Apply & Eligibility Validation
# ===========================================================================


def test_apply_scholarship_success(setup_sch_data):
    app = ScholarshipService.apply(
        student_id=str(setup_sch_data["student"].id),
        scholarship_type_id=str(setup_sch_data["sch_type"].id),
        academic_session_id=str(setup_sch_data["session_1"].id),
        requested_amount=decimal.Decimal("10000.00"),
        family_annual_income=decimal.Decimal("300000.00"),
        current_cgpa=8.5,
        statement_of_purpose="High academic performance",
        actor=setup_sch_data["user"],
    )

    assert app.status == "submitted"
    assert app.requested_amount == decimal.Decimal("10000.00")
    assert ScholarshipAuditLog.objects.filter(application=app, event_type="application_submitted").exists()


def test_apply_scholarship_eligibility_failures(setup_sch_data):
    # Failed CGPA requirement
    with pytest.raises(ValueError, match="CGPA"):
        ScholarshipService.apply(
            student_id=str(setup_sch_data["student"].id),
            scholarship_type_id=str(setup_sch_data["sch_type"].id),
            academic_session_id=str(setup_sch_data["session_1"].id),
            requested_amount=decimal.Decimal("5000.00"),
            current_cgpa=7.0,  # Req is 8.0
        )

    # Failed income cap
    with pytest.raises(ValueError, match="income"):
        ScholarshipService.apply(
            student_id=str(setup_sch_data["student"].id),
            scholarship_type_id=str(setup_sch_data["sch_type"].id),
            academic_session_id=str(setup_sch_data["session_1"].id),
            requested_amount=decimal.Decimal("5000.00"),
            family_annual_income=decimal.Decimal("600000.00"),  # Cap is 500k
            current_cgpa=9.0,
        )


def test_apply_scholarship_duplicate_prevention(setup_sch_data):
    ScholarshipService.apply(
        student_id=str(setup_sch_data["student"].id),
        scholarship_type_id=str(setup_sch_data["sch_type"].id),
        academic_session_id=str(setup_sch_data["session_1"].id),
        requested_amount=decimal.Decimal("5000.00"),
        current_cgpa=8.5,
    )

    with pytest.raises(ValueError, match="already applied"):
        ScholarshipService.apply(
            student_id=str(setup_sch_data["student"].id),
            scholarship_type_id=str(setup_sch_data["sch_type"].id),
            academic_session_id=str(setup_sch_data["session_1"].id),
            requested_amount=decimal.Decimal("5000.00"),
            current_cgpa=8.5,
        )


# ===========================================================================
# 3. Service Unit Tests: Approval & Auto Fee Deduction
# ===========================================================================


def test_approve_application_and_fee_integration(setup_sch_data):
    app = ScholarshipService.apply(
        student_id=str(setup_sch_data["student"].id),
        scholarship_type_id=str(setup_sch_data["sch_type"].id),
        academic_session_id=str(setup_sch_data["session_1"].id),
        requested_amount=decimal.Decimal("5000.00"),
        current_cgpa=8.5,
    )

    sch = ScholarshipService.approve(
        application_id=str(app.id),
        approved_amount=decimal.Decimal("5000.00"),
        actor=setup_sch_data["staff_user"],
    )

    assert sch.status == "active"
    assert sch.amount == decimal.Decimal("5000.00")
    app.refresh_from_db()
    assert app.status == "approved"

    # Verify StudentFee updated
    fee = setup_sch_data["student_fee"]
    fee.refresh_from_db()
    assert fee.scholarship_amount == 5000.0
    assert fee.due_amount == 15000.0


def test_reject_application(setup_sch_data):
    app = ScholarshipService.apply(
        student_id=str(setup_sch_data["student"].id),
        scholarship_type_id=str(setup_sch_data["sch_type"].id),
        academic_session_id=str(setup_sch_data["session_1"].id),
        requested_amount=decimal.Decimal("5000.00"),
        current_cgpa=8.5,
    )

    rejected_app = ScholarshipService.reject(
        application_id=str(app.id),
        reason="Incomplete documents",
        actor=setup_sch_data["staff_user"],
    )

    assert rejected_app.status == "rejected"
    assert rejected_app.rejection_reason == "Incomplete documents"


# ===========================================================================
# 4. Service Unit Tests: Renewal & Waiver
# ===========================================================================


def test_renew_scholarship(setup_sch_data):
    app = ScholarshipService.apply(
        student_id=str(setup_sch_data["student"].id),
        scholarship_type_id=str(setup_sch_data["sch_type"].id),
        academic_session_id=str(setup_sch_data["session_1"].id),
        requested_amount=decimal.Decimal("4000.00"),
        current_cgpa=8.5,
    )
    sch = ScholarshipService.approve(application_id=str(app.id), actor=setup_sch_data["staff_user"])

    renewal = ScholarshipService.renew(
        scholarship_id=str(sch.id),
        new_academic_session_id=str(setup_sch_data["session_2"].id),
        remarks="Renewed for year 2",
        actor=setup_sch_data["staff_user"],
    )

    assert renewal.status == "approved"
    assert Scholarship.objects.filter(
        student=setup_sch_data["student"],
        academic_session=setup_sch_data["session_2"],
        status="active",
    ).exists()


def test_apply_direct_fee_waiver(setup_sch_data):
    fee = setup_sch_data["student_fee"]
    updated_fee = ScholarshipService.apply_fee_waiver(
        student_fee_id=str(fee.id),
        waiver_amount=decimal.Decimal("2000.00"),
        actor=setup_sch_data["staff_user"],
    )

    assert updated_fee.waiver_amount == 2000.0
    assert updated_fee.due_amount == 18000.0


# ===========================================================================
# 5. REST API ViewSet Tests
# ===========================================================================


def test_apply_scholarship_api(setup_sch_data):
    client = APIClient()
    client.force_authenticate(user=setup_sch_data["user"])

    url = "/api/scholarships/apply/"
    res = client.post(
        url,
        {
            "student_id": str(setup_sch_data["student"].id),
            "scholarship_type_id": str(setup_sch_data["sch_type"].id),
            "academic_session_id": str(setup_sch_data["session_1"].id),
            "requested_amount": "8000.00",
            "current_cgpa": 8.8,
            "statement_of_purpose": "API test application",
        },
        format="json",
    )

    assert res.status_code == 201
    assert res.data["status"] == "submitted"


def test_approve_and_reject_api_permission(setup_sch_data):
    app = ScholarshipService.apply(
        student_id=str(setup_sch_data["student"].id),
        scholarship_type_id=str(setup_sch_data["sch_type"].id),
        academic_session_id=str(setup_sch_data["session_1"].id),
        requested_amount=decimal.Decimal("6000.00"),
        current_cgpa=8.5,
    )

    client = APIClient()

    # Unauthenticated -> 401
    url = "/api/scholarships/approve/"
    res = client.post(url, {"application_id": str(app.id)}, format="json")
    assert res.status_code == 401

    # Student user -> 403 Forbidden
    client.force_authenticate(user=setup_sch_data["user"])
    res = client.post(url, {"application_id": str(app.id)}, format="json")
    assert res.status_code == 403

    # Staff user -> 200 OK
    client.force_authenticate(user=setup_sch_data["staff_user"])
    res = client.post(url, {"application_id": str(app.id)}, format="json")
    assert res.status_code == 200
    assert res.data["status"] == "active"


def test_student_scholarships_api(setup_sch_data):
    app = ScholarshipService.apply(
        student_id=str(setup_sch_data["student"].id),
        scholarship_type_id=str(setup_sch_data["sch_type"].id),
        academic_session_id=str(setup_sch_data["session_1"].id),
        requested_amount=decimal.Decimal("5000.00"),
        current_cgpa=8.5,
    )
    ScholarshipService.approve(application_id=str(app.id), actor=setup_sch_data["staff_user"])

    client = APIClient()
    client.force_authenticate(user=setup_sch_data["user"])

    url = f"/api/scholarships/student/{setup_sch_data['student'].id}/"
    res = client.get(url)

    assert res.status_code == 200
    assert len(res.data) == 1
    assert res.data[0]["scholarship_type__code"] == "MERIT-100"
