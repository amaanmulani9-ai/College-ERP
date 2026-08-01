"""
Payment Service
===============
Centralised business logic for all payment operations.

PaymentService methods:
    create_order()       – create gateway order, persist PaymentOrder
    verify_payment()     – verify signature, mark transaction success
    capture_payment()    – manually capture authorized payment
    refund()             – initiate refund via gateway
    payment_history()    – paginated transaction history for a student
    webhook_handler()    – process inbound gateway webhooks (idempotent)

All methods are atomic where appropriate.
Receipt auto-generated via FeeService after successful payment.
"""

import decimal
import logging
import uuid
from typing import Any, Dict, List, Optional

from apps.fees.services import FeeService
from apps.students.models import Student
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone

from .gateways import GatewayFactory
from .models import (
    PaymentAuditLog,
    PaymentGateway,
    PaymentOrder,
    PaymentTransaction,
    Refund,
    WebhookLog,
)
from .validators import (
    validate_no_duplicate_order,
    validate_payment_amount,
    validate_refund_amount,
    validate_transaction_success,
    validate_webhook_not_duplicate,
)

logger = logging.getLogger(__name__)


class PaymentService:

    # ------------------------------------------------------------------
    # 1. Create Order
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def create_order(
        student_id: str,
        student_fee_id: str,
        gateway_id: str,
        amount: decimal.Decimal,
        currency: str = "INR",
        actor=None,
    ) -> PaymentOrder:
        """
        Creates a gateway-side order and persists a PaymentOrder.

        Raises:
            ValueError – if amount is invalid or a duplicate active order exists.
        """
        validate_payment_amount(amount)
        validate_no_duplicate_order(student_fee_id)

        student = Student.objects.get(pk=student_id)
        gateway_obj = PaymentGateway.objects.get(pk=gateway_id, is_active=True)

        gw = GatewayFactory.get(gateway_obj.provider, gateway_obj.config)

        # Razorpay / gateway expects amount in smallest unit (paise)
        amount_minor = int(amount * 100)
        receipt = f"FEE-{uuid.uuid4().hex[:10].upper()}"

        try:
            gw_order = gw.create_order(
                amount=amount_minor,
                currency=currency,
                receipt=receipt,
                notes={"student_id": str(student_id), "student_fee_id": str(student_fee_id)},
            )
        except Exception as exc:
            logger.error("Gateway order creation failed: %s", exc)
            raise ValueError(f"Gateway error: {exc}") from exc

        order = PaymentOrder.objects.create(
            student=student,
            student_fee_id=student_fee_id,
            gateway=gateway_obj,
            order_id=gw_order["id"],
            amount=amount,
            currency=currency,
            status="created",
            gateway_response=gw_order,
        )

        _log_audit(
            order=order,
            actor=actor,
            event_type="order_created",
            description=f"Payment order {gw_order['id']} created for ₹{amount}",
        )
        return order

    # ------------------------------------------------------------------
    # 2. Verify Payment & Mark Success
    # ------------------------------------------------------------------

    @staticmethod
    def verify_payment(
        order_id: str,
        gateway_payment_id: str,
        gateway_signature: str,
        actor=None,
    ) -> PaymentTransaction:
        """
        Verify signature, mark PaymentOrder paid, create PaymentTransaction,
        collect fee via FeeService, and generate receipt.

        Raises:
            ValueError – if order not found, signature invalid, or order already paid.
        """
        try:
            order = PaymentOrder.objects.get(order_id=order_id)
        except PaymentOrder.DoesNotExist:
            raise ValueError(f"Payment order {order_id!r} not found.")

        if order.status == "paid":
            # Idempotent — return existing transaction
            try:
                return order.transaction
            except PaymentTransaction.DoesNotExist:
                pass

        gw_obj = order.gateway
        gw = GatewayFactory.get(gw_obj.provider, gw_obj.config)

        # Verify signature
        is_valid = gw.verify_signature(order_id, gateway_payment_id, gateway_signature)

        if not is_valid:
            # Save failure audit & attempted status
            PaymentTransaction.objects.create(
                student=order.student,
                order=order,
                gateway=gw_obj,
                transaction_id=f"FAIL-{uuid.uuid4().hex[:12]}",
                gateway_order_id=order_id,
                gateway_payment_id=gateway_payment_id,
                gateway_signature=gateway_signature,
                amount=order.amount,
                currency=order.currency,
                status="failed",
                failure_reason="Signature verification failed",
            )
            order.status = "attempted"
            order.save(update_fields=["status", "updated_at"])
            _log_audit(
                order=order,
                actor=actor,
                event_type="signature_failed",
                description=f"Signature verification failed for order {order_id}",
            )
            raise ValueError("Payment signature verification failed. Transaction rejected.")

        # Signature valid — mark success atomically
        with transaction.atomic():
            order.status = "paid"
            order.save(update_fields=["status", "updated_at"])

            txn = PaymentTransaction.objects.create(
                student=order.student,
                order=order,
                gateway=gw_obj,
                transaction_id=gateway_payment_id,
                gateway_order_id=order_id,
                gateway_payment_id=gateway_payment_id,
                gateway_signature=gateway_signature,
                amount=order.amount,
                currency=order.currency,
                status="success",
                paid_at=timezone.now(),
            )

            # Auto-generate FeeReceipt via FeeService
            try:
                fee_receipt = FeeService.collect_fee(
                    student_fee_id=str(order.student_fee_id),
                    amount=float(order.amount),
                    payment_mode="online",
                    remarks=f"Online payment — Txn: {gateway_payment_id}",
                    actor=actor,
                )
                txn.fee_receipt = fee_receipt
                txn.save(update_fields=["fee_receipt", "updated_at"])
            except Exception as exc:
                logger.warning("FeeReceipt auto-generation failed for txn %s: %s", txn.pk, exc)

            _log_audit(
                transaction=txn,
                order=order,
                actor=actor,
                event_type="payment_success",
                description=f"Payment {gateway_payment_id} verified. Amount ₹{order.amount}",
            )
            return txn

    # ------------------------------------------------------------------
    # 3. Capture Payment (manual capture mode)
    # ------------------------------------------------------------------

    @staticmethod
    def capture_payment(payment_id: str, amount: decimal.Decimal, actor=None) -> Dict:
        """Manually capture an authorized payment."""
        try:
            txn = PaymentTransaction.objects.select_related("gateway").get(transaction_id=payment_id)
        except PaymentTransaction.DoesNotExist:
            raise ValueError(f"Transaction {payment_id!r} not found.")

        gw = GatewayFactory.get(txn.gateway.provider, txn.gateway.config)
        result = gw.capture_payment(payment_id, int(amount * 100))

        _log_audit(
            transaction=txn,
            actor=actor,
            event_type="payment_success",
            description=f"Payment {payment_id} captured for ₹{amount}",
        )
        return result

    # ------------------------------------------------------------------
    # 4. Refund
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def refund(
        transaction_id: str,
        amount: decimal.Decimal,
        reason: str,
        actor=None,
    ) -> Refund:
        """
        Initiate a refund for a successful transaction.

        Raises:
            ValueError – if transaction not found, not in success state, or refund amount invalid.
        """
        try:
            txn = PaymentTransaction.objects.select_related("gateway").get(transaction_id=transaction_id)
        except PaymentTransaction.DoesNotExist:
            raise ValueError(f"Transaction {transaction_id!r} not found.")

        validate_transaction_success(txn)
        validate_refund_amount(amount, txn.amount)

        gw = GatewayFactory.get(txn.gateway.provider, txn.gateway.config)

        refund_obj = Refund.objects.create(
            transaction=txn,
            amount=amount,
            reason=reason,
            status="processing",
            initiated_by=actor,
        )

        try:
            result = gw.refund(
                payment_id=txn.gateway_payment_id,
                amount=int(amount * 100),
                notes={"reason": reason},
            )
            refund_obj.refund_id = result.get("id", "")
            refund_obj.status = "success"
            refund_obj.gateway_response = result
            refund_obj.processed_at = timezone.now()
            refund_obj.save()

            # Update transaction status
            total_refunded = (
                Refund.objects.filter(transaction=txn, status="success").aggregate(total=Sum("amount"))["total"] or 0
            )
            if total_refunded >= txn.amount:
                txn.status = "refunded"
            else:
                txn.status = "partial_refund"
            txn.save(update_fields=["status", "updated_at"])

            _log_audit(
                transaction=txn,
                actor=actor,
                event_type="refund_success",
                description=f"Refund ₹{amount} processed for txn {transaction_id}. Refund ID: {refund_obj.refund_id}",
            )
        except Exception as exc:
            refund_obj.status = "failed"
            refund_obj.gateway_response = {"error": str(exc)}
            refund_obj.save()
            _log_audit(
                transaction=txn,
                actor=actor,
                event_type="refund_failed",
                description=f"Refund failed for txn {transaction_id}: {exc}",
            )
            raise ValueError(f"Refund failed: {exc}") from exc

        return refund_obj

    # ------------------------------------------------------------------
    # 5. Payment History
    # ------------------------------------------------------------------

    @staticmethod
    def payment_history(student_id: str) -> List[Dict[str, Any]]:
        """Return list of payment transactions for a student."""
        txns = (
            PaymentTransaction.objects.filter(student_id=student_id)
            .select_related("gateway", "order", "fee_receipt")
            .order_by("-created_at")
        )
        return list(
            txns.values(
                "id",
                "transaction_id",
                "gateway_order_id",
                "gateway__name",
                "amount",
                "currency",
                "status",
                "paid_at",
                "created_at",
                "failure_reason",
                "fee_receipt__receipt_number",
            )
        )

    # ------------------------------------------------------------------
    # 6. Webhook Handler
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def webhook_handler(
        payload: Dict,
        headers: Dict,
        gateway_id: str,
        raw_body: bytes,
    ) -> WebhookLog:
        """
        Process an inbound webhook from a payment gateway.

        Steps:
        1. Verify webhook signature.
        2. Check for duplicate (idempotency).
        3. Parse event type.
        4. Update PaymentOrder / PaymentTransaction accordingly.
        5. Mark WebhookLog as processed.
        """
        try:
            gateway_obj = PaymentGateway.objects.get(pk=gateway_id)
        except PaymentGateway.DoesNotExist:
            raise ValueError(f"Gateway {gateway_id!r} not found.")

        event_id = payload.get("id") or payload.get("event_id", "")
        event_type = payload.get("event", "unknown")

        # Idempotency check
        if not validate_webhook_not_duplicate(event_id, gateway_id):
            logger.info("Duplicate webhook %s for gateway %s — ignored.", event_id, gateway_id)
            existing = WebhookLog.objects.filter(event_id=event_id, gateway=gateway_obj, is_processed=True).first()
            return existing

        # Log raw webhook
        wh_log = WebhookLog.objects.create(
            gateway=gateway_obj,
            event_id=event_id,
            event_type=event_type,
            payload=payload,
            headers={k: str(v) for k, v in headers.items()},
        )

        # Verify webhook signature
        webhook_secret = gateway_obj.config.get("webhook_secret", "")
        wh_signature = headers.get("X-Razorpay-Signature", "") or headers.get("stripe-signature", "")

        if webhook_secret and wh_signature:
            gw = GatewayFactory.get(gateway_obj.provider, gateway_obj.config)
            if not gw.verify_webhook_signature(raw_body, wh_signature, webhook_secret):
                wh_log.processing_error = "Signature verification failed"
                wh_log.save(update_fields=["processing_error"])
                logger.warning("Webhook signature invalid for event %s", event_id)
                return wh_log

        # Process event
        try:
            _process_webhook_event(event_type, payload, gateway_obj)
            wh_log.is_processed = True
            wh_log.save(update_fields=["is_processed"])
        except Exception as exc:
            wh_log.processing_error = str(exc)[:499]
            wh_log.save(update_fields=["processing_error"])
            logger.error("Webhook processing error: %s", exc)

        return wh_log


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------


def _process_webhook_event(event_type: str, payload: Dict, gateway_obj: PaymentGateway) -> None:
    """Dispatch webhook event to appropriate handler."""
    entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
    order_id = entity.get("order_id") or payload.get("order_id", "")

    if not order_id:
        logger.debug("Webhook %s has no order_id — skipping.", event_type)
        return

    try:
        order = PaymentOrder.objects.get(order_id=order_id)
    except PaymentOrder.DoesNotExist:
        logger.warning("Webhook refers to unknown order_id %s", order_id)
        return

    if event_type in ("payment.captured", "payment.authorized"):
        if order.status != "paid":
            order.status = "paid"
            order.save(update_fields=["status", "updated_at"])
            logger.info("Webhook: order %s marked paid via event %s", order_id, event_type)

    elif event_type == "payment.failed":
        order.status = "attempted"
        order.save(update_fields=["status", "updated_at"])
        logger.info("Webhook: order %s marked attempted (failed) via event %s", order_id, event_type)

    elif event_type == "refund.created":
        payment_id = entity.get("id", "")
        refund_id = payload.get("payload", {}).get("refund", {}).get("entity", {}).get("id", "")
        logger.info("Webhook: refund %s for payment %s", refund_id, payment_id)
        try:
            txn = PaymentTransaction.objects.get(gateway_payment_id=payment_id)
            Refund.objects.filter(transaction=txn, status="processing").update(
                refund_id=refund_id, status="success", processed_at=timezone.now()
            )
        except PaymentTransaction.DoesNotExist:
            pass


def _log_audit(
    transaction=None,
    order=None,
    actor=None,
    event_type: str = "",
    description: str = "",
    metadata: Optional[Dict] = None,
) -> PaymentAuditLog:
    return PaymentAuditLog.objects.create(
        transaction=transaction,
        order=order,
        actor=actor,
        event_type=event_type,
        description=description,
        metadata=metadata or {},
    )
