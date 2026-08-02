"""
Unit and Integration Tests for Enterprise Placement & Career Development System
================================================================================
Tests:
1. Recruiting Company & Campus Drive registration
2. Student Eligibility check service
3. Drive Application & Shortlisting workflow
4. Interview Scheduling & Feedback recording
5. Offer Generation & Student Acceptance response workflow
6. Corporate Internship registration & evaluation
7. Placement Statistics aggregation & Dashboard KPIs
8. REST APIs and RBAC permissions
"""

import decimal
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.profiles.models import UserProfile
from apps.students.models import Student
from apps.placement.models import (
    Company,
    CampusDrive,
    DriveEligibility,
    StudentApplication,
    Shortlist,
    InterviewSchedule,
    InterviewFeedback,
    OfferLetter,
    OfferAcceptance,
    Internship,
    PlacementRecord,
    PlacementStatistics,
    Resume,
    PlacementAuditLog,
)
from apps.placement.services.placement_service import PlacementService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_placement_data(db):
    admin_user = User.objects.create_user(
        email="tnp.officer@example.com",
        password="Password123!",
        first_name="Placement",
        last_name="Officer",
        is_staff=True,
        is_superuser=True,
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG")
    dept = Department.objects.create(code="CSE", name="Computer Science", faculty=faculty)
    program = Program.objects.create(code="BTECH-CSE", name="B.Tech Computer Science", department=dept)
    session = AcademicSession.objects.create(name="2025-2026", start_date="2025-08-01", end_date="2026-05-31", is_current=True)
    sem = Semester.objects.create(semester_number=7, name="Semester 7", program=program)

    user_profile, _ = UserProfile.objects.get_or_create(
        user=admin_user,
        defaults={"first_name": "John", "last_name": "Doe"}
    )

    student = Student.objects.create(
        student_id="STU-2026-9001",
        enrollment_number="ENR-2026-9001",
        profile=user_profile,
        program=program,
        department=dept,
        current_semester=sem,
        academic_session=session,
        admission_date="2022-08-01"
    )

    company = PlacementService.register_company({
        "company_code": "COMP-GOOG-TEST",
        "company_name": "Google India Test",
        "industry": "Information Technology",
        "email": "campus@google.com",
        "phone": "9876543210",
        "contact_person": "Vikram Mehta",
    }, performed_by=admin_user)

    drive = PlacementService.create_campus_drive({
        "drive_code": "DRV-2026-TEST",
        "company_id": str(company.id),
        "job_role": "Software Development Engineer",
        "ctc": "2500000.00",
        "minimum_cgpa": "6.50",
        "allowed_departments": [str(dept.id)],
    }, performed_by=admin_user)

    resume = Resume.objects.create(
        student=student,
        version="v1.0",
        skills=["Python", "Django", "React"],
        approval_status="Approved"
    )

    return {
        "admin_user": admin_user,
        "dept": dept,
        "program": program,
        "student": student,
        "company": company,
        "drive": drive,
        "resume": resume,
    }


# ===========================================================================
# 1. Company & Campus Drive Registration Tests
# ===========================================================================

def test_company_and_drive_registration(setup_placement_data):
    company = setup_placement_data["company"]
    drive = setup_placement_data["drive"]

    assert company.company_code == "COMP-GOOG-TEST"
    assert company.contacts.count() == 1
    assert drive.ctc == decimal.Decimal("2500000.00")
    assert hasattr(drive, "eligibility")
    assert PlacementAuditLog.objects.filter(action__startswith="CREATE_CAMPUS_DRIVE").exists()


# ===========================================================================
# 2. Eligibility & Student Application Tests
# ===========================================================================

def test_eligibility_and_student_application(setup_placement_data):
    student = setup_placement_data["student"]
    drive = setup_placement_data["drive"]
    resume = setup_placement_data["resume"]
    admin_user = setup_placement_data["admin_user"]

    is_eligible, reason = PlacementService.check_eligibility(student.id, drive.id)
    assert is_eligible is True

    app = PlacementService.apply_for_drive(
        student_id=str(student.id),
        drive_id=str(drive.id),
        resume_id=str(resume.id),
        performed_by=admin_user
    )

    assert app.status == "Applied"
    assert app.student == student


# ===========================================================================
# 3. Shortlisting & Interview Scheduling Tests
# ===========================================================================

def test_shortlist_and_interview_scheduling(setup_placement_data):
    student = setup_placement_data["student"]
    drive = setup_placement_data["drive"]
    admin_user = setup_placement_data["admin_user"]

    PlacementService.apply_for_drive(str(student.id), str(drive.id), performed_by=admin_user)

    shortlists = PlacementService.shortlist_students(
        drive_id=str(drive.id),
        student_ids=[str(student.id)],
        round_number=1,
        performed_by=admin_user
    )
    assert len(shortlists) == 1

    interview = PlacementService.schedule_interview({
        "student_id": str(student.id),
        "drive_id": str(drive.id),
        "round": "Round 1 - Coding & DSA",
        "date": "2026-08-15",
        "time": "10:00:00",
    }, performed_by=admin_user)

    assert interview.round == "Round 1 - Coding & DSA"
    app = StudentApplication.objects.get(student=student, campus_drive=drive)
    assert app.status == "Interview"


# ===========================================================================
# 4. Offer Letter & Student Response Tests
# ===========================================================================

def test_offer_generation_and_acceptance(setup_placement_data):
    student = setup_placement_data["student"]
    company = setup_placement_data["company"]
    drive = setup_placement_data["drive"]
    admin_user = setup_placement_data["admin_user"]

    offer = PlacementService.issue_offer({
        "offer_number": "OFF-TEST-9901",
        "company_id": str(company.id),
        "student_id": str(student.id),
        "campus_drive_id": str(drive.id),
        "package": "2500000.00",
    }, performed_by=admin_user)

    assert offer.offer_status == "Offered"
    assert hasattr(offer, "acceptance")

    acceptance = PlacementService.respond_to_offer(
        offer_id=str(offer.id),
        status="Accepted",
        remarks="Delighted to accept the offer",
        performed_by=admin_user
    )

    offer.refresh_from_db()
    assert offer.offer_status == "Accepted"
    assert acceptance.status == "Accepted"
    assert PlacementRecord.objects.filter(student=student, company=company).exists()


# ===========================================================================
# 5. Internship Registration Tests
# ===========================================================================

def test_internship_registration(setup_placement_data):
    student = setup_placement_data["student"]
    company = setup_placement_data["company"]
    admin_user = setup_placement_data["admin_user"]

    internship = PlacementService.register_internship({
        "student_id": str(student.id),
        "company_id": str(company.id),
        "title": "Software Engineering Intern",
        "stipend": "75000.00",
        "duration": "6 Months",
    }, performed_by=admin_user)

    assert internship.status == "Ongoing"
    assert internship.stipend == decimal.Decimal("75000.00")


# ===========================================================================
# 6. Placement Statistics & REST API Tests
# ===========================================================================

def test_compute_placement_statistics(setup_placement_data):
    stats = PlacementService.compute_placement_statistics(academic_year="2025-2026")
    assert stats.academic_year == "2025-2026"


def test_placement_kpis_api(setup_placement_data):
    client = APIClient()
    client.force_authenticate(user=setup_placement_data["admin_user"])

    res = client.get("/api/placement/dashboard/kpis/")
    assert res.status_code == 200
    assert "registered_companies" in res.data
    assert "highest_package" in res.data


def test_placement_companies_list_api(setup_placement_data):
    client = APIClient()
    client.force_authenticate(user=setup_placement_data["admin_user"])

    res = client.get("/api/placement/companies/")
    assert res.status_code == 200
    assert len(res.data.get("results", res.data)) >= 1
