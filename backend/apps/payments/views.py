import logging

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import (
    PaymentAuditLog,
    PaymentGateway,
    PaymentOrder,
    PaymentTransaction,
    Refund,
    WebhookLog,
)
from .permissions import IsPaymentOfficerOrAdmin, IsStudentOrPaymentOfficer
from .serializers import (
    CreateOrderRequestSerializer,
    PaymentAuditLogSerializer,
    PaymentGatewaySerializer,
    PaymentOrderSerializer,
    PaymentTransactionSerializer,
    RefundRequestSerializer,
    RefundSerializer,
    VerifyPaymentRequestSerializer,
    WebhookLogSerializer,
)
from .services import PaymentService

logger = logging.getLogger(__name__)


class PaymentGatewayViewSet(viewsets.ModelViewSet):
    queryset = PaymentGateway.objects.all()
    serializer_class = PaymentGatewaySerializer
    permission_classes = [IsPaymentOfficerOrAdmin]
    filterset_fields = ["provider", "is_active"]
    search_fields = ["name", "provider"]


class PaymentOrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PaymentOrder.objects.all().select_related("student", "gateway", "student_fee")
    serializer_class = PaymentOrderSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "gateway", "student"]
    search_fields = ["order_id", "student__student_id"]

    @action(detail=False, methods=["post"], url_path="create-order", permission_classes=[IsAuthenticated])
    def create_order(self, request):
        serializer = CreateOrderRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            order = PaymentService.create_order(
                student_id=str(d["student_id"]),
                student_fee_id=str(d["student_fee_id"]),
                gateway_id=str(d["gateway_id"]),
                amount=d["amount"],
                currency=d.get("currency", "INR"),
                actor=request.user,
            )
            return Response(PaymentOrderSerializer(order).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        order = self.get_object()
        logs = order.audit_logs.all()
        return Response(PaymentAuditLogSerializer(logs, many=True).data)


class PaymentTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PaymentTransaction.objects.all().select_related("student", "gateway", "order", "fee_receipt")
    serializer_class = PaymentTransactionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "gateway", "student"]
    search_fields = ["transaction_id", "order_id", "student__student_id"]

    @action(detail=False, methods=["post"], url_path="verify", permission_classes=[IsAuthenticated])
    def verify(self, request):
        """Verify Razorpay payment signature and mark transaction success."""
        serializer = VerifyPaymentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            txn = PaymentService.verify_payment(
                order_id=d["order_id"],
                gateway_payment_id=d["gateway_payment_id"],
                gateway_signature=d["gateway_signature"],
                actor=request.user,
            )
            return Response(PaymentTransactionSerializer(txn).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="history", permission_classes=[IsStudentOrPaymentOfficer])
    def history(self, request):
        """Get payment history for a student."""
        student_id = request.query_params.get("student_id")
        if not student_id:
            return Response({"detail": "student_id query parameter required."}, status=status.HTTP_400_BAD_REQUEST)
        data = PaymentService.payment_history(student_id)
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        txn = self.get_object()
        logs = txn.audit_logs.all()
        return Response(PaymentAuditLogSerializer(logs, many=True).data)


class RefundViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Refund.objects.all().select_related("transaction__gateway", "initiated_by")
    serializer_class = RefundSerializer
    permission_classes = [IsPaymentOfficerOrAdmin]
    filterset_fields = ["status", "transaction"]
    search_fields = ["refund_id", "transaction__transaction_id"]

    @action(detail=False, methods=["post"], url_path="create", permission_classes=[IsPaymentOfficerOrAdmin])
    def create_refund(self, request):
        """Initiate a refund for a completed transaction."""
        serializer = RefundRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            refund = PaymentService.refund(
                transaction_id=d["transaction_id"],
                amount=d["amount"],
                reason=d["reason"],
                actor=request.user,
            )
            return Response(RefundSerializer(refund).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class WebhookViewSet(viewsets.GenericViewSet):
    """Handles inbound payment gateway webhooks."""
    permission_classes = [AllowAny]
    serializer_class = WebhookLogSerializer

    @action(detail=False, methods=["post"], url_path="razorpay")
    def razorpay_webhook(self, request):
        """
        Razorpay webhook endpoint.
        Razorpay sends X-Razorpay-Signature header for verification.
        """
        gateway_id = request.query_params.get("gateway_id")
        if not gateway_id:
            return Response({"detail": "gateway_id query param required."}, status=status.HTTP_400_BAD_REQUEST)

        headers = dict(request.headers)
        raw_body = request.body

        try:
            wh_log = PaymentService.webhook_handler(
                payload=request.data,
                headers=headers,
                gateway_id=gateway_id,
                raw_body=raw_body,
            )
            return Response({"status": "ok", "log_id": str(wh_log.id)}, status=status.HTTP_200_OK)
        except ValueError as exc:
            logger.warning("Webhook handler error: %s", exc)
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.error("Unexpected webhook error: %s", exc)
            return Response({"detail": "Internal error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WebhookLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WebhookLog.objects.all().select_related("gateway")
    serializer_class = WebhookLogSerializer
    permission_classes = [IsPaymentOfficerOrAdmin]
    filterset_fields = ["is_processed", "event_type", "gateway"]
    search_fields = ["event_id", "event_type"]
