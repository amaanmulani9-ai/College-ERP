from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    PaymentGatewayViewSet,
    PaymentOrderViewSet,
    PaymentTransactionViewSet,
    RefundViewSet,
    WebhookLogViewSet,
    WebhookViewSet,
)

router = DefaultRouter()
router.register(r"gateways", PaymentGatewayViewSet, basename="payment-gateway")
router.register(r"orders", PaymentOrderViewSet, basename="payment-order")
router.register(r"transactions", PaymentTransactionViewSet, basename="payment-transaction")
router.register(r"refunds", RefundViewSet, basename="payment-refund")
router.register(r"webhooks", WebhookViewSet, basename="payment-webhook")
router.register(r"webhook-logs", WebhookLogViewSet, basename="webhook-log")

urlpatterns = [
    # Aliased convenience paths
    path("create-order/", PaymentOrderViewSet.as_view({"post": "create_order"}), name="payment-create-order"),
    path("verify/", PaymentTransactionViewSet.as_view({"post": "verify"}), name="payment-verify"),
    path("history/", PaymentTransactionViewSet.as_view({"get": "history"}), name="payment-history"),
    path("refund/", RefundViewSet.as_view({"post": "create_refund"}), name="payment-refund-create"),
    path("webhook/razorpay/", WebhookViewSet.as_view({"post": "razorpay_webhook"}), name="payment-webhook-razorpay"),

    # Router URLs
    path("", include(router.urls)),
]
