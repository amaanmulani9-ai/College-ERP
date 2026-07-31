from decimal import Decimal

from rest_framework import serializers

from .models import (
    PaymentAuditLog,
    PaymentGateway,
    PaymentOrder,
    PaymentTransaction,
    Refund,
    WebhookLog,
)


class PaymentGatewaySerializer(serializers.ModelSerializer):
    provider_display = serializers.CharField(source="get_provider_display", read_only=True)

    class Meta:
        model = PaymentGateway
        fields = [
            "id", "name", "provider", "provider_display",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PaymentOrderSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    gateway_name = serializers.CharField(source="gateway.name", read_only=True)

    class Meta:
        model = PaymentOrder
        fields = [
            "id", "student", "student_fee", "gateway", "gateway_name",
            "order_id", "amount", "currency", "status", "status_display",
            "expires_at", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "order_id", "status", "gateway_name", "created_at", "updated_at"]


class PaymentTransactionSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    gateway_name = serializers.CharField(source="gateway.name", read_only=True)
    receipt_number = serializers.CharField(source="fee_receipt.receipt_number", read_only=True, default="")

    class Meta:
        model = PaymentTransaction
        fields = [
            "id", "student", "order", "fee_receipt", "gateway", "gateway_name",
            "transaction_id", "gateway_order_id", "gateway_payment_id",
            "amount", "currency", "status", "status_display",
            "failure_reason", "paid_at", "receipt_number",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "transaction_id", "gateway_payment_id", "gateway_signature",
            "status", "paid_at", "created_at", "updated_at",
        ]


class RefundSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    initiated_by_email = serializers.CharField(source="initiated_by.email", read_only=True, default="")

    class Meta:
        model = Refund
        fields = [
            "id", "transaction", "refund_id", "amount", "reason",
            "status", "status_display", "initiated_by_email",
            "processed_at", "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "refund_id", "status", "initiated_by_email",
            "processed_at", "created_at", "updated_at",
        ]


class WebhookLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookLog
        fields = [
            "id", "gateway", "event_id", "event_type",
            "is_processed", "processing_error", "received_at",
        ]
        read_only_fields = fields


class PaymentAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = PaymentAuditLog
        fields = [
            "id", "transaction", "order", "actor", "actor_email",
            "event_type", "description", "metadata", "timestamp",
        ]
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Request / Action Serializers
# ---------------------------------------------------------------------------

class CreateOrderRequestSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    student_fee_id = serializers.UUIDField()
    gateway_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    currency = serializers.CharField(max_length=10, default="INR")

    def validate_amount(self, value):
        if value < Decimal("1.00"):
            raise serializers.ValidationError("Amount must be at least ₹1.")
        return value


class VerifyPaymentRequestSerializer(serializers.Serializer):
    order_id = serializers.CharField(max_length=255)
    gateway_payment_id = serializers.CharField(max_length=255)
    gateway_signature = serializers.CharField(max_length=512)


class RefundRequestSerializer(serializers.Serializer):
    transaction_id = serializers.CharField(max_length=255)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    reason = serializers.CharField(max_length=500)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Refund amount must be greater than zero.")
        return value
