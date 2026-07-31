"""
Payment Validators
==================
- Amount validation (positive, within limits)
- Duplicate order prevention
- Refund amount validation (cannot exceed original payment)
"""
import decimal
import logging

logger = logging.getLogger(__name__)

MAX_PAYMENT_AMOUNT = decimal.Decimal("500000.00")  # ₹5,00,000 per transaction
MIN_PAYMENT_AMOUNT = decimal.Decimal("1.00")


def validate_payment_amount(amount: decimal.Decimal) -> None:
    """Raise ValueError if amount is outside acceptable range."""
    if amount < MIN_PAYMENT_AMOUNT:
        raise ValueError(f"Payment amount must be at least {MIN_PAYMENT_AMOUNT}.")
    if amount > MAX_PAYMENT_AMOUNT:
        raise ValueError(f"Payment amount cannot exceed {MAX_PAYMENT_AMOUNT}.")


def validate_refund_amount(refund_amount: decimal.Decimal, original_amount: decimal.Decimal) -> None:
    """Raise ValueError if refund amount exceeds original payment."""
    if refund_amount <= 0:
        raise ValueError("Refund amount must be greater than zero.")
    if refund_amount > original_amount:
        raise ValueError(
            f"Refund amount ({refund_amount}) cannot exceed original payment ({original_amount})."
        )


def validate_no_duplicate_order(student_fee_id: str) -> None:
    """
    Ensure there is no active (created/attempted) order for the same StudentFee.
    Prevents duplicate payment orders for the same fee slot.
    """
    from .models import PaymentOrder
    exists = PaymentOrder.objects.filter(
        student_fee_id=student_fee_id,
        status__in=["created", "attempted"],
    ).exists()
    if exists:
        raise ValueError("An active payment order already exists for this fee. Complete or cancel it first.")


def validate_transaction_success(transaction) -> None:
    """Raise ValueError if transaction is not in a refundable state."""
    if transaction.status != "success":
        raise ValueError(
            f"Only successful transactions can be refunded. Current status: {transaction.status!r}."
        )


def validate_webhook_not_duplicate(event_id: str, gateway_id) -> bool:
    """
    Returns True if this is a NEW webhook event (not seen before).
    Returns False if it's a duplicate (already processed).
    """
    if not event_id:
        return True  # No event_id means we can't deduplicate — allow processing
    from .models import WebhookLog
    return not WebhookLog.objects.filter(event_id=event_id, gateway_id=gateway_id, is_processed=True).exists()
