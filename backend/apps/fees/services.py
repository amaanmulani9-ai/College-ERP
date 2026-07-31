"""
Fee Business Services (FeeService).
Handles student fee assignment, waivers & scholarships, installment splitting, fee collection,
automatic fine calculation, receipt generation, outstanding reports, and audit logging.
"""
import datetime
import uuid
from typing import Dict, Any, List
from django.db import transaction
from django.utils import timezone
from apps.authentication.services import log_audit_event
from apps.students.models import Student

from .models import FeeAuditLog, FeeCategory, FeeInstallment, FeeReceipt, FeeStructure, StudentFee
from .validators import calculate_installment_fine, validate_no_duplicate_assignment


class FeeService:
    @staticmethod
    @transaction.atomic
    def assign_fee(
        student_id: str,
        fee_structure_id: str,
        waiver_amount: float = 0.0,
        scholarship_amount: float = 0.0,
        num_installments: int = 1,
        actor=None,
        request=None,
    ) -> StudentFee:
        validate_no_duplicate_assignment(student_id, fee_structure_id)

        fee_struct = FeeStructure.objects.get(pk=fee_structure_id)
        student = Student.objects.get(pk=student_id)

        net_total = max(0.0, fee_struct.amount - waiver_amount - scholarship_amount)

        student_fee = StudentFee.objects.create(
            student=student,
            fee_structure=fee_struct,
            total_amount=fee_struct.amount,
            waiver_amount=waiver_amount,
            scholarship_amount=scholarship_amount,
            paid_amount=0.0,
            due_amount=net_total,
            status="pending" if net_total > 0 else "paid",
        )

        # Create installments
        if num_installments < 1:
            num_installments = 1

        inst_amount = round(net_total / num_installments, 2)
        base_due = datetime.date.today()

        for idx in range(1, num_installments + 1):
            due_date = base_due + datetime.timedelta(days=30 * idx)
            FeeInstallment.objects.create(
                student_fee=student_fee,
                installment_no=idx,
                amount=inst_amount,
                due_date=due_date,
                status="pending" if net_total > 0 else "paid",
            )

        _log_audit(
            student_fee=student_fee,
            actor=actor,
            event_type="fee_assigned",
            description=f"Assigned {fee_struct.category.name} (${fee_struct.amount}) to student {student.student_id}. Net Due: ${net_total}",
            request=request,
        )
        return student_fee

    @staticmethod
    @transaction.atomic
    def collect_fee(
        student_fee_id: str,
        amount: float,
        payment_mode: str = "cash",
        installment_id: str = None,
        remarks: str = "",
        actor=None,
        request=None,
    ) -> FeeReceipt:
        student_fee = StudentFee.objects.get(pk=student_fee_id)

        if amount <= 0:
            raise ValueError("Payment amount must be greater than zero.")

        if amount > student_fee.due_amount:
            raise ValueError(f"Payment amount ${amount} exceeds outstanding due ${student_fee.due_amount}.")

        fine = 0.0
        installment_obj = None
        if installment_id:
            installment_obj = FeeInstallment.objects.get(pk=installment_id)
            fine = calculate_installment_fine(installment_obj.due_date)
            if fine > 0:
                installment_obj.fine_amount = fine
                installment_obj.save(update_fields=["fine_amount", "updated_at"])

        # Create Fee Receipt
        rcpt_number = f"RCPT-{timezone.now().year}-{uuid.uuid4().hex[:8].upper()}"
        receipt = FeeReceipt.objects.create(
            receipt_number=rcpt_number,
            student=student_fee.student,
            student_fee=student_fee,
            installment=installment_obj,
            amount=amount,
            payment_mode=payment_mode,
            status="success",
            remarks=remarks,
        )

        # Update Student Fee balance
        student_fee.paid_amount += amount
        student_fee.due_amount = max(0.0, student_fee.total_amount - student_fee.waiver_amount - student_fee.scholarship_amount - student_fee.paid_amount)

        if student_fee.due_amount <= 0:
            student_fee.status = "paid"
        else:
            student_fee.status = "partial"
        student_fee.save(update_fields=["paid_amount", "due_amount", "status", "updated_at"])

        # Update installment status if applicable
        if installment_obj:
            if amount >= installment_obj.amount:
                installment_obj.status = "paid"
                installment_obj.save(update_fields=["status", "updated_at"])

        _log_audit(
            student_fee=student_fee,
            receipt=receipt,
            actor=actor,
            event_type="payment_collected",
            description=f"Collected ${amount} via {payment_mode} for receipt {rcpt_number}",
            request=request,
        )
        return receipt

    @staticmethod
    def calculate_due(student_id: str) -> Dict[str, float]:
        fees = StudentFee.objects.filter(student_id=student_id, is_deleted=False)
        total_assigned = sum(f.total_amount for f in fees)
        total_waivers = sum(f.waiver_amount + f.scholarship_amount for f in fees)
        total_paid = sum(f.paid_amount for f in fees)
        total_due = sum(f.due_amount for f in fees)

        return {
            "total_assigned": total_assigned,
            "total_waivers": total_waivers,
            "total_paid": total_paid,
            "total_due": total_due,
        }

    @staticmethod
    def calculate_fine(installment_id: str) -> float:
        inst = FeeInstallment.objects.get(pk=installment_id)
        return calculate_installment_fine(inst.due_date)

    @staticmethod
    def student_fee_summary(student_id: str) -> Dict[str, Any]:
        fees = StudentFee.objects.filter(student_id=student_id, is_deleted=False).select_related(
            "fee_structure__category", "fee_structure__academic_session"
        )
        receipts = FeeReceipt.objects.filter(student_id=student_id).order_by("-payment_date")

        due_summary = FeeService.calculate_due(student_id)
        return {
            "student_id": student_id,
            "summary": due_summary,
            "fees": list(fees.values()),
            "receipts": list(receipts.values()),
        }

    @staticmethod
    def _generate_receipt_number() -> str:
        """Generate a unique receipt number in format RCPT-YYYY-XXXXXXXX."""
        return f"RCPT-{timezone.now().year}-{uuid.uuid4().hex[:8].upper()}"


def _log_audit(student_fee=None, receipt=None, actor=None, event_type: str = "", description: str = "", metadata: dict = None, request=None):
    if request:
        try:
            log_audit_event(request, event_type=f"fee_{event_type}", details=description)
        except Exception:
            pass

    return FeeAuditLog.objects.create(
        student_fee=student_fee,
        receipt=receipt,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
    )
