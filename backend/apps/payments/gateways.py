"""
Payment Gateway Abstraction Layer
==================================
BaseGateway       – abstract interface all providers must implement
RazorpayGateway   – full Razorpay implementation
StripeGateway     – stub (future)
PhonePeGateway    – stub (future)
UPIGateway        – stub (future)

Usage:
    gateway = GatewayFactory.get("razorpay", config)
    order   = gateway.create_order(amount=10000, currency="INR", receipt="RCPT-2026-ABCD")
    ok      = gateway.verify_signature(order_id, payment_id, signature)
    refund  = gateway.refund(payment_id, amount)
"""
import hashlib
import hmac
import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Abstract Base Gateway
# ---------------------------------------------------------------------------

class BaseGateway(ABC):
    """
    All payment providers must implement this interface.
    Methods raise NotImplementedError only for unimplemented stubs.
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config

    @abstractmethod
    def create_order(self, amount: int, currency: str, receipt: str, notes: Optional[Dict] = None) -> Dict:
        """
        Create a payment order on the gateway.
        amount is in smallest currency unit (paise for INR, cents for USD).
        Returns a dict with at least: order_id, amount, currency, status.
        """
        ...

    @abstractmethod
    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """
        Verify the payment signature to confirm authenticity.
        Returns True if valid, False otherwise.
        """
        ...

    @abstractmethod
    def capture_payment(self, payment_id: str, amount: int) -> Dict:
        """
        Capture an authorized payment (where auto-capture is disabled).
        """
        ...

    @abstractmethod
    def refund(self, payment_id: str, amount: int, notes: Optional[Dict] = None) -> Dict:
        """
        Issue a refund. Returns gateway refund response dict.
        """
        ...

    @abstractmethod
    def verify_webhook_signature(self, body: bytes, signature: str, secret: str) -> bool:
        """
        Verify incoming webhook payload authenticity.
        """
        ...

    def get_payment_details(self, payment_id: str) -> Dict:
        """Fetch payment details from gateway. Override if supported."""
        raise NotImplementedError(f"{self.__class__.__name__} does not support get_payment_details.")


# ---------------------------------------------------------------------------
# Razorpay Gateway (full implementation)
# ---------------------------------------------------------------------------

class RazorpayGateway(BaseGateway):
    """
    Full Razorpay implementation.

    Required config keys:
        key_id      – Razorpay Key ID (rzp_live_xxx or rzp_test_xxx)
        key_secret  – Razorpay Key Secret
        webhook_secret – Razorpay Webhook Secret (for webhook verification)
    """

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self._client = None

    def _get_client(self):
        """Lazily initialize Razorpay client."""
        if self._client is None:
            try:
                import razorpay  # type: ignore
                self._client = razorpay.Client(
                    auth=(self.config["key_id"], self.config["key_secret"])
                )
            except ImportError:
                raise RuntimeError("razorpay package not installed. Run: pip install razorpay")
        return self._client

    def create_order(self, amount: int, currency: str = "INR", receipt: str = "", notes: Optional[Dict] = None) -> Dict:
        """
        Create Razorpay order.
        amount must be in paise (multiply rupees × 100).
        """
        client = self._get_client()
        payload = {
            "amount": int(amount),
            "currency": currency,
            "receipt": receipt[:40],  # Razorpay receipt max 40 chars
            "payment_capture": 1,  # Auto-capture
        }
        if notes:
            payload["notes"] = notes

        try:
            order = client.order.create(data=payload)
            logger.info("Razorpay order created: %s", order.get("id"))
            return order
        except Exception as exc:
            logger.error("Razorpay create_order error: %s", exc)
            raise

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """
        Razorpay signature verification:
        expected = HMAC-SHA256(f"{order_id}|{payment_id}", key_secret)
        """
        try:
            message = f"{order_id}|{payment_id}"
            expected = hmac.new(
                self.config["key_secret"].encode("utf-8"),
                message.encode("utf-8"),
                hashlib.sha256,
            ).hexdigest()
            result = hmac.compare_digest(expected, signature)
            logger.info("Signature verification for order %s: %s", order_id, result)
            return result
        except Exception as exc:
            logger.error("Signature verification error: %s", exc)
            return False

    def capture_payment(self, payment_id: str, amount: int) -> Dict:
        """Capture a payment that requires manual capture."""
        client = self._get_client()
        try:
            result = client.payment.capture(payment_id, amount)
            logger.info("Captured payment %s for amount %d", payment_id, amount)
            return result
        except Exception as exc:
            logger.error("Razorpay capture error for %s: %s", payment_id, exc)
            raise

    def refund(self, payment_id: str, amount: int, notes: Optional[Dict] = None) -> Dict:
        """
        Issue Razorpay refund.
        amount in paise.
        """
        client = self._get_client()
        payload = {"amount": int(amount)}
        if notes:
            payload["notes"] = notes
        try:
            result = client.payment.refund(payment_id, payload)
            logger.info("Refund initiated for payment %s: refund_id=%s", payment_id, result.get("id"))
            return result
        except Exception as exc:
            logger.error("Razorpay refund error for %s: %s", payment_id, exc)
            raise

    def verify_webhook_signature(self, body: bytes, signature: str, secret: str) -> bool:
        """
        Razorpay webhook signature:
        expected = HMAC-SHA256(body, webhook_secret)
        """
        try:
            expected = hmac.new(
                secret.encode("utf-8"),
                body,
                hashlib.sha256,
            ).hexdigest()
            return hmac.compare_digest(expected, signature)
        except Exception as exc:
            logger.error("Webhook signature verification error: %s", exc)
            return False

    def get_payment_details(self, payment_id: str) -> Dict:
        """Fetch payment details from Razorpay."""
        client = self._get_client()
        return client.payment.fetch(payment_id)


# ---------------------------------------------------------------------------
# Stripe Gateway (stub — future implementation)
# ---------------------------------------------------------------------------

class StripeGateway(BaseGateway):
    """Stripe integration stub. Implement in TASK-018."""

    def create_order(self, amount: int, currency: str = "USD", receipt: str = "", notes: Optional[Dict] = None) -> Dict:
        raise NotImplementedError("Stripe integration not yet implemented.")

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        raise NotImplementedError("Stripe integration not yet implemented.")

    def capture_payment(self, payment_id: str, amount: int) -> Dict:
        raise NotImplementedError("Stripe integration not yet implemented.")

    def refund(self, payment_id: str, amount: int, notes: Optional[Dict] = None) -> Dict:
        raise NotImplementedError("Stripe integration not yet implemented.")

    def verify_webhook_signature(self, body: bytes, signature: str, secret: str) -> bool:
        raise NotImplementedError("Stripe integration not yet implemented.")


# ---------------------------------------------------------------------------
# PhonePe Gateway (stub — future implementation)
# ---------------------------------------------------------------------------

class PhonePeGateway(BaseGateway):
    """PhonePe integration stub. Implement in TASK-018."""

    def create_order(self, amount: int, currency: str = "INR", receipt: str = "", notes: Optional[Dict] = None) -> Dict:
        raise NotImplementedError("PhonePe integration not yet implemented.")

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        raise NotImplementedError("PhonePe integration not yet implemented.")

    def capture_payment(self, payment_id: str, amount: int) -> Dict:
        raise NotImplementedError("PhonePe integration not yet implemented.")

    def refund(self, payment_id: str, amount: int, notes: Optional[Dict] = None) -> Dict:
        raise NotImplementedError("PhonePe integration not yet implemented.")

    def verify_webhook_signature(self, body: bytes, signature: str, secret: str) -> bool:
        raise NotImplementedError("PhonePe integration not yet implemented.")


# ---------------------------------------------------------------------------
# UPI Gateway (stub — future implementation)
# ---------------------------------------------------------------------------

class UPIGateway(BaseGateway):
    """Generic UPI integration stub. Implement in TASK-018."""

    def create_order(self, amount: int, currency: str = "INR", receipt: str = "", notes: Optional[Dict] = None) -> Dict:
        raise NotImplementedError("UPI integration not yet implemented.")

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        raise NotImplementedError("UPI integration not yet implemented.")

    def capture_payment(self, payment_id: str, amount: int) -> Dict:
        raise NotImplementedError("UPI integration not yet implemented.")

    def refund(self, payment_id: str, amount: int, notes: Optional[Dict] = None) -> Dict:
        raise NotImplementedError("UPI integration not yet implemented.")

    def verify_webhook_signature(self, body: bytes, signature: str, secret: str) -> bool:
        raise NotImplementedError("UPI integration not yet implemented.")


# ---------------------------------------------------------------------------
# Gateway Factory
# ---------------------------------------------------------------------------

GATEWAY_MAP = {
    "razorpay": RazorpayGateway,
    "stripe": StripeGateway,
    "phonepe": PhonePeGateway,
    "upi": UPIGateway,
}


class GatewayFactory:
    @staticmethod
    def get(provider: str, config: Dict[str, Any]) -> BaseGateway:
        """
        Return a gateway instance for the given provider.
        Raises ValueError for unknown providers.
        """
        cls = GATEWAY_MAP.get(provider)
        if cls is None:
            raise ValueError(f"Unknown payment provider: {provider!r}. Supported: {list(GATEWAY_MAP)}")
        return cls(config)
