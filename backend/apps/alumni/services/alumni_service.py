"""
Enterprise Alumni Management System Service Layer
===================================================
Core business logic for Alumni registration, Membership management, Employment tracking,
Mentorship matching, Event registrations, Fundraising donations, Newsletter publishing,
Job referrals, Networking requests, Success stories, and Audit logging.
"""

import decimal
import datetime
from django.db import transaction
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from apps.students.models import Student
from apps.alumni.models import (
    AlumniProfile,
    AlumniMembership,
    AlumniEmployment,
    AlumniAchievement,
    AlumniHigherEducation,
    AlumniBusiness,
    MentorshipProgram,
    MentorAssignment,
    AlumniEvent,
    EventRegistration,
    AlumniChapter,
    Donation,
    FundraisingCampaign,
    Newsletter,
    CommunicationLog,
    SuccessStory,
    JobReferral,
    NetworkingRequest,
    AlumniDirectory,
    AlumniAuditLog,
)


class AlumniService:
    @staticmethod
    def log_audit(action, performed_by=None, details=None):
        """Creates an audit log entry for alumni operations."""
        return AlumniAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {}
        )

    @classmethod
    @transaction.atomic
    def register_alumni(cls, data, performed_by=None):
        """Registers a new alumni profile and creates default standard membership."""
        student_id = data["student_id"]
        student = Student.objects.get(id=student_id)
        student.status = "alumni"
        student.save(update_fields=["status"])

        profile, created = AlumniProfile.objects.get_or_create(
            student=student,
            defaults={
                "alumni_id": data.get("alumni_id", f"ALU-{student.student_id}"),
                "graduation_year": int(data.get("graduation_year", 2024)),
                "current_status": data.get("current_status", "Employed"),
                "bio": data.get("bio", "Proud alumni of College ERP."),
                "visibility": data.get("visibility", "Public"),
            }
        )

        # Create Default Membership
        mem_no = f"MEM-{profile.alumni_id}"
        AlumniMembership.objects.get_or_create(
            alumni=profile,
            defaults={
                "membership_number": mem_no,
                "membership_type": data.get("membership_type", "Standard"),
                "join_date": timezone.now().date(),
                "status": "Active",
            }
        )

        # Update Directory Entry
        AlumniDirectory.objects.get_or_create(
            alumni=profile,
            defaults={"search_vector": f"{profile.alumni_id} {student.student_id} {profile.graduation_year}"}
        )

        cls.log_audit(
            action=f"REGISTER_ALUMNI: {profile.alumni_id}",
            performed_by=performed_by,
            details={"alumni_id": str(profile.id), "student_id": str(student.id)}
        )

        return profile

    @classmethod
    @transaction.atomic
    def manage_membership(cls, alumni_id, membership_type="Premium", status="Active", performed_by=None):
        """Updates or renews alumni membership."""
        profile = AlumniProfile.objects.get(id=alumni_id)
        membership, _ = AlumniMembership.objects.get_or_create(
            alumni=profile,
            defaults={
                "membership_number": f"MEM-{profile.alumni_id}",
                "membership_type": membership_type,
                "join_date": timezone.now().date(),
                "status": status
            }
        )

        membership.membership_type = membership_type
        membership.status = status
        if status == "Active":
            membership.expiry_date = timezone.now().date() + datetime.timedelta(days=365)
        membership.save()

        cls.log_audit(
            action=f"MANAGE_MEMBERSHIP: {membership.membership_number} -> {status}",
            performed_by=performed_by,
            details={"alumni_id": str(alumni_id), "type": membership_type}
        )

        return membership

    @classmethod
    @transaction.atomic
    def track_employment(cls, data, performed_by=None):
        """Records an employment entry for an alumni."""
        employment = AlumniEmployment.objects.create(
            alumni_id=data["alumni_id"],
            company=data["company"],
            designation=data["designation"],
            industry=data.get("industry", "Technology"),
            location=data.get("location", "Remote / Global"),
            salary_range=data.get("salary_range", "15.0 LPA - 25.0 LPA"),
            employment_status=data.get("employment_status", "Full-Time"),
            start_date=data.get("start_date", timezone.now().date()),
            is_current=data.get("is_current", True),
        )

        cls.log_audit(
            action=f"TRACK_EMPLOYMENT: {employment.company}",
            performed_by=performed_by,
            details={"employment_id": str(employment.id)}
        )

        return employment

    @classmethod
    @transaction.atomic
    def assign_mentor(cls, program_id, mentor_alumni_id, mentee_student_id, performed_by=None):
        """Assigns an alumni mentor to a student mentee."""
        assignment = MentorAssignment.objects.create(
            program_id=program_id,
            mentor_id=mentor_alumni_id,
            mentee_id=mentee_student_id,
            status="Active",
            start_date=timezone.now().date(),
        )

        cls.log_audit(
            action=f"ASSIGN_MENTOR: Mentor {mentor_alumni_id} -> Mentee {mentee_student_id}",
            performed_by=performed_by,
            details={"assignment_id": str(assignment.id)}
        )

        return assignment

    @classmethod
    @transaction.atomic
    def register_event(cls, event_id, alumni_id, performed_by=None):
        """Registers an alumni for an event."""
        reg, _ = EventRegistration.objects.get_or_create(
            event_id=event_id,
            alumni_id=alumni_id,
            defaults={"attendance_status": "Registered"}
        )

        cls.log_audit(
            action=f"REGISTER_EVENT: Alumni {alumni_id} -> Event {event_id}",
            performed_by=performed_by,
            details={"registration_id": str(reg.id)}
        )

        return reg

    @classmethod
    @transaction.atomic
    def process_donation(cls, data, performed_by=None):
        """Processes a donation and updates campaign collected total."""
        amt = decimal.Decimal(str(data["amount"]))
        donation = Donation.objects.create(
            donor_id=data["donor_id"],
            campaign_id=data.get("campaign_id"),
            amount=amt,
            payment_status=data.get("payment_status", "Completed"),
            receipt_url=data.get("receipt_url", "/media/donations/receipt.pdf"),
        )

        if donation.campaign and donation.payment_status == "Completed":
            campaign = donation.campaign
            campaign.collected_amount += amt
            if campaign.collected_amount >= campaign.goal_amount:
                campaign.status = "Completed"
            campaign.save()

        cls.log_audit(
            action=f"PROCESS_DONATION: ₹{amt} by Donor {data['donor_id']}",
            performed_by=performed_by,
            details={"donation_id": str(donation.id), "amount": str(amt)}
        )

        return donation

    @classmethod
    @transaction.atomic
    def publish_newsletter(cls, data, performed_by=None):
        """Publishes an alumni newsletter and logs communication dispatch."""
        newsletter = Newsletter.objects.create(
            title=data["title"],
            content=data["content"],
            publish_date=data.get("publish_date", timezone.now().date()),
            target_audience=data.get("target_audience", "All Alumni"),
            status="Published",
        )

        CommunicationLog.objects.create(
            channel="Email",
            subject=f"Newsletter: {newsletter.title}",
            content=newsletter.content[:200],
            status="Sent"
        )

        cls.log_audit(
            action=f"PUBLISH_NEWSLETTER: {newsletter.title}",
            performed_by=performed_by,
            details={"newsletter_id": str(newsletter.id)}
        )

        return newsletter

    @classmethod
    @transaction.atomic
    def create_job_referral(cls, data, performed_by=None):
        """Creates an alumni job referral opportunity."""
        referral = JobReferral.objects.create(
            referrer_id=data["referrer_id"],
            company=data["company"],
            role=data["role"],
            openings=int(data.get("openings", 1)),
            expiry_date=data.get("expiry_date", timezone.now().date() + datetime.timedelta(days=30)),
            contact_email=data["contact_email"],
        )

        cls.log_audit(
            action=f"CREATE_JOB_REFERRAL: {referral.role} @ {referral.company}",
            performed_by=performed_by,
            details={"referral_id": str(referral.id)}
        )

        return referral

    @classmethod
    @transaction.atomic
    def send_networking_request(cls, requester_id, receiver_id, message="", performed_by=None):
        """Sends a networking request between alumni."""
        req, _ = NetworkingRequest.objects.get_or_create(
            requester_id=requester_id,
            receiver_id=receiver_id,
            defaults={"status": "Pending", "message": message}
        )

        cls.log_audit(
            action=f"SEND_NETWORKING: {requester_id} -> {receiver_id}",
            performed_by=performed_by,
            details={"request_id": str(req.id)}
        )

        return req

    @classmethod
    @transaction.atomic
    def submit_success_story(cls, data, performed_by=None):
        """Submits an alumni success story."""
        story = SuccessStory.objects.create(
            alumni_id=data["alumni_id"],
            title=data["title"],
            story=data["story"],
            featured=data.get("featured", True)
        )

        cls.log_audit(
            action=f"SUBMIT_SUCCESS_STORY: {story.title}",
            performed_by=performed_by,
            details={"story_id": str(story.id)}
        )

        return story

    @classmethod
    def compute_dashboard_kpis(cls):
        """Calculates Key Performance Indicators for the Alumni module."""
        total_alumni = AlumniProfile.objects.filter(is_deleted=False).count()
        active_members = AlumniMembership.objects.filter(status="Active").count()
        programs_count = MentorshipProgram.objects.filter(status="Active").count()
        events_count = AlumniEvent.objects.filter(status__in=["Upcoming", "Ongoing"]).count()
        
        total_donations = Donation.objects.filter(payment_status="Completed").aggregate(s=Sum("amount"))["s"] or decimal.Decimal("0.00")
        active_campaigns = FundraisingCampaign.objects.filter(status="Active").count()
        job_referrals = JobReferral.objects.count()
        success_stories = SuccessStory.objects.count()

        return {
            "registered_alumni": total_alumni,
            "active_members": active_members,
            "mentorship_programs": programs_count,
            "upcoming_events": events_count,
            "total_donations": float(total_donations),
            "active_campaigns": active_campaigns,
            "job_referrals": job_referrals,
            "success_stories": success_stories,
        }

    @classmethod
    @transaction.atomic
    def soft_delete_alumni(cls, alumni_id, performed_by=None):
        """Soft deletes an alumni profile."""
        profile = AlumniProfile.objects.get(id=alumni_id)
        profile.is_deleted = True
        profile.save(update_fields=["is_deleted"])

        cls.log_audit(
            action=f"SOFT_DELETE_ALUMNI: {profile.alumni_id}",
            performed_by=performed_by,
            details={"alumni_id": str(profile.id)}
        )

        return True
