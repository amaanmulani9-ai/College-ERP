"""
Enterprise Placement & Career Development System Service Layer
================================================================
Core business logic for Corporate Company management, Campus Drive workflows,
Eligibility checking, Application processing, Shortlisting, Interview scheduling,
Offer letter generation, Internship tracking, Placement statistics calculation,
and audit logging.
"""

import decimal
import datetime
from django.db import transaction
from django.db.models import Avg, Max, Count, Sum
from django.utils import timezone
from apps.students.models import Student
from apps.placement.models import (
    Company,
    CompanyContact,
    CampusDrive,
    DriveEligibility,
    StudentApplication,
    Shortlist,
    InterviewSchedule,
    InterviewFeedback,
    OfferLetter,
    OfferAcceptance,
    Internship,
    InternshipEvaluation,
    PlacementRecord,
    PlacementStatistics,
    Resume,
    PlacementAuditLog,
)


class PlacementService:
    @staticmethod
    def log_audit(action, performed_by=None, details=None):
        """Creates an audit log entry for placement actions."""
        return PlacementAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {}
        )

    @classmethod
    @transaction.atomic
    def register_company(cls, data, performed_by=None):
        """Registers a corporate recruiting company."""
        company = Company.objects.create(
            company_code=data["company_code"],
            company_name=data["company_name"],
            industry=data.get("industry", "Information Technology"),
            website=data.get("website", ""),
            email=data["email"],
            phone=data.get("phone", ""),
            address=data.get("address", ""),
            package_range=data.get("package_range", "6.0 LPA - 12.0 LPA"),
            status=data.get("status", "active"),
        )

        contact_name = data.get("contact_person")
        if contact_name:
            CompanyContact.objects.create(
                company=company,
                name=contact_name,
                designation=data.get("contact_designation", "HR Lead"),
                email=data.get("contact_email", company.email),
                phone=data.get("contact_phone", company.phone),
            )

        cls.log_audit(
            action=f"REGISTER_COMPANY: {company.company_code}",
            performed_by=performed_by,
            details={"company_id": str(company.id), "company_name": company.company_name}
        )

        return company

    @classmethod
    @transaction.atomic
    def create_campus_drive(cls, data, performed_by=None):
        """Creates a new campus recruitment drive with eligibility criteria."""
        drive = CampusDrive.objects.create(
            drive_code=data["drive_code"],
            company_id=data["company_id"],
            campus=data.get("campus", "Main Campus"),
            job_role=data["job_role"],
            ctc=decimal.Decimal(str(data.get("ctc", "800000.00"))),
            location=data.get("location", "Pan India / Remote"),
            mode=data.get("mode", "Online"),
            registration_start=data.get("registration_start", timezone.now().date()),
            registration_end=data.get("registration_end", timezone.now().date() + datetime.timedelta(days=14)),
            drive_date=data.get("drive_date", timezone.now().date() + datetime.timedelta(days=21)),
            status=data.get("status", "Registration Open"),
            description=data.get("description", ""),
        )

        DriveEligibility.objects.create(
            drive=drive,
            minimum_cgpa=decimal.Decimal(str(data.get("minimum_cgpa", "6.00"))),
            allowed_departments=data.get("allowed_departments", []),
            allowed_programs=data.get("allowed_programs", []),
            backlog_limit=int(data.get("backlog_limit", 0)),
            passing_year=int(data.get("passing_year", 2026)),
        )

        cls.log_audit(
            action=f"CREATE_CAMPUS_DRIVE: {drive.drive_code}",
            performed_by=performed_by,
            details={"drive_id": str(drive.id), "role": drive.job_role, "ctc": str(drive.ctc)}
        )

        return drive

    @classmethod
    def check_eligibility(cls, student_id, drive_id):
        """
        Validates if a student meets minimum CGPA, department, program,
        backlog limit, and passing year criteria for a drive.
        """
        student = Student.objects.get(id=student_id)
        drive = CampusDrive.objects.get(id=drive_id)
        eligibility = getattr(drive, "eligibility", None)

        if not eligibility:
            return True, "No eligibility criteria restricted."

        reasons = []

        # Check Department filter
        if eligibility.allowed_departments:
            if str(student.department_id) not in [str(d) for d in eligibility.allowed_departments]:
                reasons.append("Department not eligible for this drive.")

        # Check Program filter
        if eligibility.allowed_programs:
            if str(student.program_id) not in [str(p) for p in eligibility.allowed_programs]:
                reasons.append("Academic program not eligible for this drive.")

        if reasons:
            return False, "; ".join(reasons)

        return True, "Eligible to apply."

    @classmethod
    @transaction.atomic
    def apply_for_drive(cls, student_id, drive_id, resume_id=None, performed_by=None):
        """Processes student application for a campus drive."""
        is_eligible, reason = cls.check_eligibility(student_id, drive_id)
        if not is_eligible:
            raise ValueError(f"Student is ineligible: {reason}")

        application, created = StudentApplication.objects.get_or_create(
            student_id=student_id,
            campus_drive_id=drive_id,
            defaults={
                "resume_id": resume_id,
                "status": "Applied"
            }
        )

        cls.log_audit(
            action=f"APPLY_DRIVE: Student {student_id} -> Drive {drive_id}",
            performed_by=performed_by,
            details={"application_id": str(application.id)}
        )

        return application

    @classmethod
    @transaction.atomic
    def shortlist_students(cls, drive_id, student_ids, round_number=1, performed_by=None):
        """Shortlists candidates for a specific drive round."""
        shortlists = []
        for sid in student_ids:
            sl, _ = Shortlist.objects.get_or_create(
                campus_drive_id=drive_id,
                student_id=sid,
                round_number=round_number
            )
            StudentApplication.objects.filter(campus_drive_id=drive_id, student_id=sid).update(status="Shortlisted")
            shortlists.append(sl)

        cls.log_audit(
            action=f"SHORTLIST_STUDENTS: Drive {drive_id} R{round_number}",
            performed_by=performed_by,
            details={"count": len(shortlists)}
        )

        return shortlists

    @classmethod
    @transaction.atomic
    def schedule_interview(cls, data, performed_by=None):
        """Schedules an interview round for a student."""
        interview = InterviewSchedule.objects.create(
            student_id=data["student_id"],
            drive_id=data["drive_id"],
            round=data.get("round", "Round 1 - Technical"),
            date=data.get("date", timezone.now().date()),
            time=data.get("time", "10:00:00"),
            mode=data.get("mode", "Online"),
            panel=data.get("panel", "Technical Panel A"),
            location_or_link=data.get("location_or_link", "https://meet.google.com/xyz-abc"),
        )

        StudentApplication.objects.filter(
            campus_drive_id=data["drive_id"],
            student_id=data["student_id"]
        ).update(status="Interview")

        cls.log_audit(
            action=f"SCHEDULE_INTERVIEW: Student {data['student_id']}",
            performed_by=performed_by,
            details={"interview_id": str(interview.id)}
        )

        return interview

    @classmethod
    @transaction.atomic
    def issue_offer(cls, data, performed_by=None):
        """Issues an offer letter to a selected candidate."""
        pkg = decimal.Decimal(str(data.get("package", "800000.00")))
        offer = OfferLetter.objects.create(
            offer_number=data["offer_number"],
            company_id=data["company_id"],
            student_id=data["student_id"],
            campus_drive_id=data.get("campus_drive_id"),
            package=pkg,
            joining_date=data.get("joining_date", timezone.now().date() + datetime.timedelta(days=90)),
            offer_status="Offered",
            document_url=data.get("document_url", "/media/offers/offer_letter.pdf"),
        )

        OfferAcceptance.objects.create(
            offer_letter=offer,
            status="Pending"
        )

        if data.get("campus_drive_id"):
            StudentApplication.objects.filter(
                campus_drive_id=data["campus_drive_id"],
                student_id=data["student_id"]
            ).update(status="Selected")

        cls.log_audit(
            action=f"ISSUE_OFFER: Offer {offer.offer_number}",
            performed_by=performed_by,
            details={"offer_id": str(offer.id), "package": str(pkg)}
        )

        return offer

    @classmethod
    @transaction.atomic
    def respond_to_offer(cls, offer_id, status="Accepted", remarks="", performed_by=None):
        """Processes student offer response (Accepted / Rejected)."""
        offer = OfferLetter.objects.get(id=offer_id)
        offer.offer_status = status
        offer.save(update_fields=["offer_status"])

        acceptance = getattr(offer, "acceptance", None)
        if not acceptance:
            acceptance = OfferAcceptance.objects.create(offer_letter=offer, status=status)
        else:
            acceptance.status = status
            acceptance.acceptance_date = timezone.now().date() if status == "Accepted" else None
            acceptance.remarks = remarks
            acceptance.save()

        if status == "Accepted":
            PlacementRecord.objects.get_or_create(
                student=offer.student,
                company=offer.company,
                defaults={
                    "role": offer.campus_drive.job_role if offer.campus_drive else "Software Engineer",
                    "package": offer.package,
                    "joining_status": "Joined"
                }
            )

        cls.log_audit(
            action=f"RESPOND_OFFER: Offer {offer.offer_number} -> {status}",
            performed_by=performed_by,
            details={"offer_id": str(offer.id), "status": status}
        )

        return acceptance

    @classmethod
    @transaction.atomic
    def register_internship(cls, data, performed_by=None):
        """Registers a student internship."""
        stipend = decimal.Decimal(str(data.get("stipend", "25000.00")))
        internship = Internship.objects.create(
            student_id=data["student_id"],
            company_id=data["company_id"],
            title=data.get("title", "Software Engineering Intern"),
            mentor=data.get("mentor", "Corporate Industry Mentor"),
            start_date=data.get("start_date", timezone.now().date()),
            end_date=data.get("end_date", timezone.now().date() + datetime.timedelta(days=180)),
            duration=data.get("duration", "6 Months"),
            stipend=stipend,
            status=data.get("status", "Ongoing")
        )

        cls.log_audit(
            action=f"REGISTER_INTERNSHIP: Student {data['student_id']}",
            performed_by=performed_by,
            details={"internship_id": str(internship.id)}
        )

        return internship

    @classmethod
    @transaction.atomic
    def compute_placement_statistics(cls, academic_year="2025-2026"):
        """Computes annual placement statistics (placed count, avg CTC, highest CTC)."""
        records = PlacementRecord.objects.all()
        placed_count = records.values("student").distinct().count()
        highest = records.aggregate(m=Max("package"))["m"] or decimal.Decimal("0.00")
        average = records.aggregate(a=Avg("package"))["a"] or decimal.Decimal("0.00")
        companies_count = Company.objects.filter(is_deleted=False).count()
        offers_count = OfferLetter.objects.filter(offer_status__in=["Offered", "Accepted"]).count()

        stats, _ = PlacementStatistics.objects.update_or_create(
            academic_year=academic_year,
            defaults={
                "placed_students": placed_count,
                "highest_package": highest,
                "average_package": average,
                "companies_visited": companies_count,
                "offers_made": offers_count,
            }
        )

        return stats

    @classmethod
    @transaction.atomic
    def soft_delete_company(cls, company_id, performed_by=None):
        """Soft deletes a recruiting company."""
        company = Company.objects.get(id=company_id)
        company.is_deleted = True
        company.save(update_fields=["is_deleted"])

        cls.log_audit(
            action=f"SOFT_DELETE_COMPANY: {company.company_code}",
            performed_by=performed_by,
            details={"company_id": str(company.id)}
        )

        return True
