"""
Unit and Integration Tests for Enterprise Alumni Management System
=====================================================================
Tests:
1. Alumni Profile & Membership registration
2. Alumni Employment tracking service
3. Mentorship program assignment
4. Alumni Event & Registration workflow
5. Fundraising Campaign & Donation processing
6. Newsletter creation & publishing
7. Job Referral creation & Networking requests
8. Dashboard KPIs & REST API endpoints
"""

import decimal
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.profiles.models import UserProfile
from apps.students.models import Student
from apps.alumni.models import (
    AlumniProfile,
    AlumniMembership,
    AlumniEmployment,
    MentorshipProgram,
    MentorAssignment,
    AlumniEvent,
    EventRegistration,
    FundraisingCampaign,
    Donation,
    Newsletter,
    JobReferral,
    NetworkingRequest,
    SuccessStory,
    AlumniAuditLog,
)
from apps.alumni.services.alumni_service import AlumniService

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_alumni_data(db):
    admin_user = User.objects.create_user(
        email="alumni.admin@example.com",
        password="Password123!",
        first_name="Alumni",
        last_name="Admin",
        is_staff=True,
        is_superuser=True,
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG")
    dept = Department.objects.create(code="CSE", name="Computer Science", faculty=faculty)
    program = Program.objects.create(code="BTECH-CSE", name="B.Tech Computer Science", department=dept)
    session = AcademicSession.objects.create(name="2025-2026", start_date="2025-08-01", end_date="2026-05-31", is_current=True)
    sem = Semester.objects.create(semester_number=8, name="Semester 8", program=program)

    user_profile, _ = UserProfile.objects.get_or_create(
        user=admin_user,
        defaults={"first_name": "Alumni", "last_name": "Admin"}
    )

    student = Student.objects.create(
        student_id="STU-2024-8801",
        enrollment_number="ENR-2024-8801",
        profile=user_profile,
        program=program,
        department=dept,
        current_semester=sem,
        academic_session=session,
        admission_date="2020-08-01",
        status="graduated",
    )

    profile = AlumniService.register_alumni({
        "student_id": str(student.id),
        "alumni_id": "ALU-2024-8801",
        "graduation_year": 2024,
        "current_status": "Employed",
        "bio": "Senior Staff Software Engineer at Google",
    }, performed_by=admin_user)

    return {
        "admin_user": admin_user,
        "student": student,
        "profile": profile,
        "dept": dept,
        "program": program,
    }


# ===========================================================================
# 1. Profile & Membership Registration Tests
# ===========================================================================

def test_alumni_profile_and_membership(setup_alumni_data):
    profile = setup_alumni_data["profile"]
    student = setup_alumni_data["student"]

    assert profile.alumni_id == "ALU-2024-8801"
    assert profile.student == student
    assert AlumniMembership.objects.filter(alumni=profile).exists()
    assert AlumniAuditLog.objects.filter(action__startswith="REGISTER_ALUMNI").exists()


# ===========================================================================
# 2. Employment Tracking Tests
# ===========================================================================

def test_employment_tracking(setup_alumni_data):
    profile = setup_alumni_data["profile"]
    admin_user = setup_alumni_data["admin_user"]

    emp = AlumniService.track_employment({
        "alumni_id": str(profile.id),
        "company": "Google LLC",
        "designation": "Staff Software Engineer",
        "industry": "Artificial Intelligence",
        "location": "Mountain View, CA",
    }, performed_by=admin_user)

    assert emp.company == "Google LLC"
    assert emp.is_current is True


# ===========================================================================
# 3. Mentorship Matching Tests
# ===========================================================================

def test_mentorship_assignment(setup_alumni_data):
    profile = setup_alumni_data["profile"]
    student = setup_alumni_data["student"]
    admin_user = setup_alumni_data["admin_user"]

    program = MentorshipProgram.objects.create(program_name="Tech Leadership 2026", capacity=20)
    assignment = AlumniService.assign_mentor(
        program_id=str(program.id),
        mentor_alumni_id=str(profile.id),
        mentee_student_id=str(student.id),
        performed_by=admin_user
    )

    assert assignment.status == "Active"
    assert assignment.mentor == profile


# ===========================================================================
# 4. Event Registration Tests
# ===========================================================================

def test_alumni_event_registration(setup_alumni_data):
    profile = setup_alumni_data["profile"]
    admin_user = setup_alumni_data["admin_user"]

    event = AlumniEvent.objects.create(
        event_code="EVT-2026-REUN",
        title="Global Alumni Reunion 2026",
        start_date="2026-09-15 10:00:00+00:00",
        end_date="2026-09-15 18:00:00+00:00",
        status="Upcoming"
    )

    reg = AlumniService.register_event(str(event.id), str(profile.id), performed_by=admin_user)
    assert reg.attendance_status == "Registered"


# ===========================================================================
# 5. Fundraising & Donation Tests
# ===========================================================================

def test_fundraising_donation_processing(setup_alumni_data):
    profile = setup_alumni_data["profile"]
    admin_user = setup_alumni_data["admin_user"]

    campaign = FundraisingCampaign.objects.create(
        campaign_name="Supercomputer Lab Fund",
        goal_amount=decimal.Decimal("1000000.00"),
        start_date="2026-01-01",
        end_date="2026-12-31",
    )

    donation = AlumniService.process_donation({
        "donor_id": str(profile.id),
        "campaign_id": str(campaign.id),
        "amount": "250000.00",
        "payment_status": "Completed"
    }, performed_by=admin_user)

    campaign.refresh_from_db()
    assert donation.amount == decimal.Decimal("250000.00")
    assert campaign.collected_amount == decimal.Decimal("250000.00")


# ===========================================================================
# 6. Newsletter & Job Referral Tests
# ===========================================================================

def test_newsletter_and_job_referral(setup_alumni_data):
    profile = setup_alumni_data["profile"]
    admin_user = setup_alumni_data["admin_user"]

    newsletter = AlumniService.publish_newsletter({
        "title": "Quarterly Bulletin Q3",
        "content": "Exciting alumni updates across the globe.",
    }, performed_by=admin_user)
    assert newsletter.status == "Published"

    referral = AlumniService.create_job_referral({
        "referrer_id": str(profile.id),
        "company": "Google India",
        "role": "Backend Engineer",
        "openings": 2,
        "contact_email": "ananya@google.com"
    }, performed_by=admin_user)
    assert referral.openings == 2


# ===========================================================================
# 7. Dashboard KPIs & REST API Tests
# ===========================================================================

def test_alumni_kpis_api(setup_alumni_data):
    client = APIClient()
    client.force_authenticate(user=setup_alumni_data["admin_user"])

    res = client.get("/api/alumni/dashboard/kpis/")
    assert res.status_code == 200
    assert "registered_alumni" in res.data
    assert "total_donations" in res.data


def test_alumni_profiles_list_api(setup_alumni_data):
    client = APIClient()
    client.force_authenticate(user=setup_alumni_data["admin_user"])

    res = client.get("/api/alumni/profiles/")
    assert res.status_code == 200
    assert len(res.data.get("results", res.data)) >= 1
