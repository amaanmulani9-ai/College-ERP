"""
Scholarship Service
===================
Business logic for scholarship applications, approvals, fee adjustments, and renewals.

Methods:
    apply()               – Submit scholarship application with eligibility validation
    approve()             – Approve application, grant Scholarship, auto-update StudentFee
    reject()              – Reject application with reasons
    renew()               – Renew scholarship for a new academic session
    calculate_discount()  – Compute discount amount for a given fee and scholarship
    apply_fee_waiver()    – Manually adjust fee waiver or scholarship on StudentFee
    student_scholarships()– Query list of student's active & past scholarships
"""
import decimal
import logging
from datetime import date, timedelta
from typing import Any, Dict, List, Optional

from django.db import transaction
from django.utils import timezone

from apps.academics.models import AcademicSession
from apps.fees.models import StudentFee
from apps.students.models import Student

from .models import (
    Scholarship,
    ScholarshipApplication,
    ScholarshipAuditLog,
    ScholarshipRenewal,
    ScholarshipType,
)
from .validators import (
    validate_eligibility,
    validate_no_duplicate_application,
    validate_no_duplicate_scholarship,
)

logger = logging.getLogger(__name__)


class ScholarshipService:

    # ------------------------------------------------------------------
    # 1. Apply for Scholarship
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def apply(
        student_id: str,
        scholarship_type_id: str,
        academic_session_id: str,
        requested_amount: decimal.Decimal,
        family_annual_income: Optional[decimal.Decimal] = None,
        current_cgpa: float = 0.0,
        documents: Optional[Dict] = None,
        statement_of_purpose: str = "",
        actor=None,
    ) -> ScholarshipApplication:
        """
        Submit a new scholarship application.
        Validates duplicate applications and eligibility requirements.
        """
        validate_no_duplicate_application(student_id, scholarship_type_id, academic_session_id)

        scholarship_type = ScholarshipType.objects.get(pk=scholarship_type_id, is_active=True)

        # Validate eligibility
        validate_eligibility(
            cgpa=current_cgpa,
            min_cgpa_req=scholarship_type.min_cgpa_requirement,
            family_income=family_annual_income,
            max_income_req=scholarship_type.max_family_income,
        )

        student = Student.objects.get(pk=student_id)
        session = AcademicSession.objects.get(pk=academic_session_id)

        app = ScholarshipApplication.objects.create(
            student=student,
            scholarship_type=scholarship_type,
            academic_session=session,
            requested_amount=requested_amount,
            family_annual_income=family_annual_income,
            current_cgpa=current_cgpa,
            documents=documents or {},
            statement_of_purpose=statement_of_purpose,
            status="submitted",
        )

        _log_audit(
            student=student,
            application=app,
            actor=actor,
            event_type="application_submitted",
            description=f"Scholarship application submitted for {scholarship_type.name} ({session.name})",
        )
        return app

    # ------------------------------------------------------------------
    # 2. Approve Scholarship Application
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def approve(
        application_id: str,
        approved_amount: Optional[decimal.Decimal] = None,
        percentage: float = 0.0,
        actor=None,
    ) -> Scholarship:
        """
        Approve an application:
        1. Set application status to 'approved'
        2. Create active Scholarship record
        3. Auto-update Fee Management (StudentFee.scholarship_amount)
        """
        try:
            app = ScholarshipApplication.objects.select_for_update().get(pk=application_id)
        except ScholarshipApplication.DoesNotExist:
            raise ValueError(f"Application {application_id!r} not found.")

        if app.status == "approved":
            raise ValueError("Application is already approved.")
        if app.status == "rejected":
            raise ValueError("Cannot approve a rejected application.")

        final_amount = approved_amount if approved_amount is not None else app.requested_amount

        validate_no_duplicate_scholarship(
            student_id=str(app.student_id),
            scholarship_type_id=str(app.scholarship_type_id),
            academic_session_id=str(app.academic_session_id),
        )

        # Update application state
        app.status = "approved"
        app.approved_by = actor
        app.approved_at = timezone.now()
        app.save()

        # Create active Scholarship
        today = date.today()
        scholarship = Scholarship.objects.create(
            student=app.student,
            scholarship_type=app.scholarship_type,
            academic_session=app.academic_session,
            amount=final_amount,
            percentage=percentage,
            start_date=today,
            end_date=today + timedelta(days=365),
            status="active",
        )

        # Auto-update Fee Management
        ScholarshipService.apply_scholarship_to_fees(scholarship)

        _log_audit(
            student=app.student,
            scholarship=scholarship,
            application=app,
            actor=actor,
            event_type="application_approved",
            description=f"Application approved. Granted scholarship ₹{final_amount} for {app.scholarship_type.name}",
        )
        return scholarship

    # ------------------------------------------------------------------
    # 3. Reject Scholarship Application
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def reject(application_id: str, reason: str, actor=None) -> ScholarshipApplication:
        """Reject a scholarship application with reason."""
        try:
            app = ScholarshipApplication.objects.select_for_update().get(pk=application_id)
        except ScholarshipApplication.DoesNotExist:
            raise ValueError(f"Application {application_id!r} not found.")

        if app.status == "approved":
            raise ValueError("Cannot reject an already approved application.")

        app.status = "rejected"
        app.rejection_reason = reason
        app.save()

        _log_audit(
            student=app.student,
            application=app,
            actor=actor,
            event_type="application_rejected",
            description=f"Application rejected: {reason}",
        )
        return app

    # ------------------------------------------------------------------
    # 4. Renew Scholarship
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def renew(
        scholarship_id: str,
        new_academic_session_id: str,
        remarks: str = "",
        actor=None,
    ) -> ScholarshipRenewal:
        """
        Request & auto-approve renewal for an existing scholarship for a new session.
        """
        try:
            sch = Scholarship.objects.select_for_update().get(pk=scholarship_id)
        except Scholarship.DoesNotExist:
            raise ValueError(f"Scholarship {scholarship_id!r} not found.")

        if sch.status != "active":
            raise ValueError("Only active scholarships can be renewed.")

        new_session = AcademicSession.objects.get(pk=new_academic_session_id)

        # Check duplicate scholarship in target session
        validate_no_duplicate_scholarship(
            student_id=str(sch.student_id),
            scholarship_type_id=str(sch.scholarship_type_id),
            academic_session_id=str(new_session.id),
        )

        renewal = ScholarshipRenewal.objects.create(
            scholarship=sch,
            academic_session=new_session,
            status="approved",
            remarks=remarks,
            processed_by=actor,
            processed_at=timezone.now(),
        )

        # Create new active Scholarship record for renewed session
        today = date.today()
        new_sch = Scholarship.objects.create(
            student=sch.student,
            scholarship_type=sch.scholarship_type,
            academic_session=new_session,
            amount=sch.amount,
            percentage=sch.percentage,
            start_date=today,
            end_date=today + timedelta(days=365),
            status="active",
        )

        # Apply to new session's fees
        ScholarshipService.apply_scholarship_to_fees(new_sch)

        _log_audit(
            student=sch.student,
            scholarship=new_sch,
            actor=actor,
            event_type="scholarship_renewed",
            description=f"Scholarship {sch.scholarship_type.name} renewed for session {new_session.name}",
        )
        return renewal

    # ------------------------------------------------------------------
    # 5. Fee Integration: Apply Scholarship to Student Fees
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def apply_scholarship_to_fees(scholarship: Scholarship) -> List[StudentFee]:
        """
        Deducts scholarship amount / waiver from StudentFee records matching
        the student and academic session.
        """
        fees = StudentFee.objects.filter(
            student=scholarship.student,
            fee_structure__academic_session=scholarship.academic_session,
        )

        updated_fees = []
        for fee in fees:
            # Calculate discount
            discount = float(scholarship.amount)
            if scholarship.percentage > 0:
                discount = max(discount, fee.total_amount * (scholarship.percentage / 100.0))

            fee.scholarship_amount = float(fee.scholarship_amount) + discount
            net_total = fee.total_amount - fee.waiver_amount - fee.scholarship_amount
            fee.due_amount = max(0.0, net_total - fee.paid_amount)

            if fee.due_amount == 0.0 and fee.paid_amount > 0:
                fee.status = "paid"
            elif fee.scholarship_amount >= fee.total_amount:
                fee.status = "waived"

            fee.save()
            updated_fees.append(fee)

            _log_audit(
                student=scholarship.student,
                scholarship=scholarship,
                event_type="scholarship_applied",
                description=f"Applied scholarship ₹{discount} to StudentFee #{str(fee.id)[:8]}",
            )

        return updated_fees

    # ------------------------------------------------------------------
    # 6. Apply Direct Fee Waiver
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def apply_fee_waiver(student_fee_id: str, waiver_amount: decimal.Decimal, actor=None) -> StudentFee:
        """Directly adjust waiver_amount on a StudentFee."""
        try:
            fee = StudentFee.objects.select_for_update().get(pk=student_fee_id)
        except StudentFee.DoesNotExist:
            raise ValueError(f"StudentFee {student_fee_id!r} not found.")

        fee.waiver_amount = float(waiver_amount)
        net = fee.total_amount - fee.waiver_amount - fee.scholarship_amount
        fee.due_amount = max(0.0, net - fee.paid_amount)
        if fee.due_amount == 0.0:
            fee.status = "waived" if fee.paid_amount == 0 else "paid"
        fee.save()

        _log_audit(
            student=fee.student,
            actor=actor,
            event_type="scholarship_applied",
            description=f"Direct fee waiver ₹{waiver_amount} applied to StudentFee #{str(fee.id)[:8]}",
        )
        return fee

    # ------------------------------------------------------------------
    # 7. Calculate Discount Helper
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_discount(fee_amount: float, amount: float = 0.0, percentage: float = 0.0) -> float:
        """Compute maximum discount from flat amount and percentage."""
        discount = amount
        if percentage > 0:
            pct_discount = fee_amount * (percentage / 100.0)
            discount = max(discount, pct_discount)
        return min(discount, fee_amount)

    # ------------------------------------------------------------------
    # 8. Student Scholarships Query
    # ------------------------------------------------------------------

    @staticmethod
    def student_scholarships(student_id: str) -> List[Dict[str, Any]]:
        """Return list of active and historical scholarships for a student."""
        schs = (
            Scholarship.objects.filter(student_id=student_id)
            .select_related("scholarship_type", "academic_session")
            .order_by("-created_at")
        )
        return list(schs.values(
            "id", "scholarship_type__name", "scholarship_type__code",
            "scholarship_type__provider", "academic_session__name",
            "amount", "percentage", "start_date", "end_date", "status",
        ))


def _log_audit(student, scholarship=None, application=None, actor=None, event_type="", description=""):
    return ScholarshipAuditLog.objects.create(
        student=student,
        scholarship=scholarship,
        application=application,
        actor=actor,
        event_type=event_type,
        description=description,
    )
