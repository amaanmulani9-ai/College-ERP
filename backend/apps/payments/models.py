"""
Payment Gateway Models
======================
PaymentGateway   – configured gateway instances (Razorpay, Stripe, etc.)
PaymentOrder     – gateway-side order before payment
PaymentTransaction – immutable payment record
WebhookLog       – raw webhook payload for audit & idempotency
Refund           – refund request and status
PaymentAuditLog  – append-only event log
"""
import uuid

from django.conf import settings
from django.db import models

from apps.fees.models import FeeReceipt, StudentFee
from apps.students.models import Student


# ---------------------------------------------------------------------------
# Payment Gateway Configuration
# ---------------------------------------------------------------------------

class PaymentGateway(models.Model):
    PROVIDER_CHOICES = [
        ("razorpay", "Razorpay"),
        ("stripe", "Stripe"),
        ("phonepe", "PhonePe"),
        ("upi", "UPI"),
        ("manual", "Manual / Offline"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    provider = models.CharField(max_length=30, choices=PROVIDER_CHOICES)
    is_active = models.BooleanField(default=True)

    # Credentials stored as config dict (encrypted at deployment level)
    config = models.JSONField(default=dict, blank=True, help_text="Gateway API keys and settings (store secrets via env).")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Payment Gateway"
        verbose_name_plural = "Payment Gateways"

    def __str__(self):
        return f"{self.name} ({self.get_provider_display()})"


# ---------------------------------------------------------------------------
# Payment Order  (created before payment, maps to gateway order_id)
# ---------------------------------------------------------------------------

class PaymentOrder(models.Model):
    STATUS_CHOICES = [
        ("created", "Created"),
        ("attempted", "Attempted"),
        ("paid", "Paid"),
        ("expired", "Expired"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="payment_orders")
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name="payment_orders")
    gateway = models.ForeignKey(PaymentGateway, on_delete=models.PROTECT, related_name="orders")

    # Gateway-assigned order identifier
    order_id = models.CharField(max_length=255, unique=True, db_index=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="created", db_index=True)

    # Raw gateway response stored for debugging
    gateway_response = models.JSONField(default=dict, blank=True)

    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment Order"
        verbose_name_plural = "Payment Orders"

    def __str__(self):
        return f"Order {self.order_id} | {self.amount} {self.currency} | {self.status}"


# ---------------------------------------------------------------------------
# Payment Transaction  (immutable record of completed/failed payment)
# ---------------------------------------------------------------------------

class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ("initiated", "Initiated"),
        ("success", "Success"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
        ("partial_refund", "Partially Refunded"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="payment_transactions")
    order = models.OneToOneField(PaymentOrder, on_delete=models.CASCADE, related_name="transaction", null=True, blank=True)
    fee_receipt = models.ForeignKey(FeeReceipt, on_delete=models.SET_NULL, null=True, blank=True, related_name="payment_transactions")
    gateway = models.ForeignKey(PaymentGateway, on_delete=models.PROTECT, related_name="transactions")

    # Gateway identifiers
    transaction_id = models.CharField(max_length=255, unique=True, db_index=True)
    gateway_order_id = models.CharField(max_length=255, db_index=True)
    gateway_payment_id = models.CharField(max_length=255, blank=True, default="")
    gateway_signature = models.CharField(max_length=512, blank=True, default="")

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="initiated", db_index=True)

    # Raw data for audit
    gateway_response = models.JSONField(default=dict, blank=True)
    failure_reason = models.CharField(max_length=500, blank=True, default="")

    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment Transaction"
        verbose_name_plural = "Payment Transactions"

    def __str__(self):
        return f"Txn {self.transaction_id} | {self.amount} {self.currency} | {self.status}"


# ---------------------------------------------------------------------------
# Webhook Log  (raw webhook payloads — used for idempotency + replay)
# ---------------------------------------------------------------------------

class WebhookLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gateway = models.ForeignKey(PaymentGateway, on_delete=models.SET_NULL, null=True, blank=True, related_name="webhook_logs")
    event_id = models.CharField(max_length=255, db_index=True, blank=True, default="")
    event_type = models.CharField(max_length=100)
    payload = models.JSONField(default=dict)
    headers = models.JSONField(default=dict, blank=True)
    is_processed = models.BooleanField(default=False)
    processing_error = models.CharField(max_length=500, blank=True, default="")
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-received_at"]
        verbose_name = "Webhook Log"
        verbose_name_plural = "Webhook Logs"
        indexes = [
            models.Index(fields=["event_id", "gateway"]),
        ]

    def __str__(self):
        return f"[{self.event_type}] {self.event_id or 'N/A'} at {self.received_at}"


# ---------------------------------------------------------------------------
# Refund
# ---------------------------------------------------------------------------

class Refund(models.Model):
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("processing", "Processing"),
        ("success", "Success"),
        ("failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction = models.ForeignKey(PaymentTransaction, on_delete=models.CASCADE, related_name="refunds")
    refund_id = models.CharField(max_length=255, blank=True, default="", db_index=True, help_text="Gateway-assigned refund ID")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.CharField(max_length=500)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")
    gateway_response = models.JSONField(default=dict, blank=True)
    initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Refund"
        verbose_name_plural = "Refunds"

    def __str__(self):
        return f"Refund {self.refund_id or self.id} | {self.amount} | {self.status}"


# ---------------------------------------------------------------------------
# Payment Audit Log
# ---------------------------------------------------------------------------

class PaymentAuditLog(models.Model):
    EVENT_CHOICES = [
        ("order_created", "Order Created"),
        ("payment_initiated", "Payment Initiated"),
        ("payment_success", "Payment Success"),
        ("payment_failed", "Payment Failed"),
        ("webhook_received", "Webhook Received"),
        ("webhook_duplicate", "Webhook Duplicate"),
        ("refund_requested", "Refund Requested"),
        ("refund_success", "Refund Success"),
        ("refund_failed", "Refund Failed"),
        ("signature_verified", "Signature Verified"),
        ("signature_failed", "Signature Verification Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction = models.ForeignKey(PaymentTransaction, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    order = models.ForeignKey(PaymentOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Payment Audit Log"
        verbose_name_plural = "Payment Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description[:60]} at {self.timestamp}"
