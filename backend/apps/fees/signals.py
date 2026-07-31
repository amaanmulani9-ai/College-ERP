import logging

from django.db.models import Sum
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import FeeInstallment, FeeReceipt, StudentFee

logger = logging.getLogger(__name__)


@receiver(post_save, sender=FeeReceipt)
def update_student_fee_on_receipt(sender, instance, created, **kwargs):
    """
    Recalculate paid_amount and due_amount on StudentFee whenever a
    FeeReceipt is saved (new payment or status change).
    """
    if not created:
        return

    student_fee = instance.student_fee
    try:
        paid = (
            FeeReceipt.objects.filter(
                student_fee=student_fee,
                status="success",
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )
        student_fee.paid_amount = paid
        net = student_fee.total_amount - student_fee.waiver_amount - student_fee.scholarship_amount
        student_fee.due_amount = max(net - paid, 0)

        if paid >= net:
            student_fee.status = "paid"
        elif paid > 0:
            student_fee.status = "partial"

        student_fee.save(update_fields=["paid_amount", "due_amount", "status"])
        logger.info(
            "StudentFee %s updated: paid=%.2f, due=%.2f, status=%s",
            student_fee.pk,
            student_fee.paid_amount,
            student_fee.due_amount,
            student_fee.status,
        )
    except Exception as exc:
        logger.error("Error updating StudentFee %s: %s", student_fee.pk, exc)


@receiver(post_save, sender=FeeInstallment)
def update_installment_status(sender, instance, **kwargs):
    """
    When all installments of a StudentFee are PAID, mark the StudentFee PAID.
    """
    student_fee = instance.student_fee
    try:
        all_installments = FeeInstallment.objects.filter(student_fee=student_fee)
        if all_installments.exists() and not all_installments.exclude(status="paid").exists():
            if student_fee.status != "paid":
                student_fee.status = "paid"
                student_fee.save(update_fields=["status"])
                logger.info("StudentFee %s marked PAID via installment signal", student_fee.pk)
    except Exception as exc:
        logger.error("Error in installment signal for StudentFee %s: %s", student_fee.pk, exc)
