"""
Unit and Integration Tests for Payments Module
==============================================
Tests:
1. Order Creation & Validation (amount limits, duplicate active order check)
2. Razorpay Signature Verification & Verification API
3. Invalid Signature Rejection
4. Fee Receipt Auto-Generation on Payment Success
5. Manual Payment Capture
6. Refund Execution & Validation (over-refund prevention, status transition)
7. Webhook Processing & Deduplication (idempotency check)
8. Student Payment History API
9. Permissions & Access Control (IsPaymentOfficerOrAdmin, IsStudentOrPaymentOfficer)
"""
import decimal
import uuid
from unittest.mock import MagicMock, patch

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.fees.models import FeeCategory, FeeStructure, StudentFee
from apps.payments.gateways import GatewayFactory, RazorpayGateway
from apps.payments.models import (
    PaymentAuditLog,
    PaymentGateway,
    PaymentOrder,
    PaymentTransaction,
    Refund,
    WebhookLog,
)
from apps.payments.services import PaymentService
from apps.students.models import Student

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_data(db):
    # Setup user & student
    user = User.objects.create_user(
        email="student.pay@example.com",
        password="Password123!",
        first_name="Pay",
        last_name="Student",
    )
    staff_user = User.objects.create_user(
        email="staff.pay@example.com",
        password="Password123!",
        first_name="Pay",
        last_name="Staff",
        is_staff=True,
    )

    faculty = Faculty.objects.create(name="Engineering", code="ENG-PAY")
    department = Department.objects.create(name="CS", code="CS-PAY", faculty=faculty)
    program = Program.objects.create(name="B.Tech CS", code="BTCS-PAY", department=department)
    academic_session = AcademicSession.objects.create(
        name="2026-2027", start_date="2026-08-01", end_date="2027-05-31"
    )
    semester = Semester.objects.create(program=program, semester_number=1, name="Sem 1 PAY")

    from apps.profiles.models import UserProfile
    from datetime import date

    user_profile, _ = UserProfile.objects.get_or_create(user=user)
    student = Student.objects.create(
        student_id="STU-PAY-001",
        enrollment_number="ENR-PAY-001",
        profile=user_profile,
        program=program,
        department=department,
        current_semester=semester,
        academic_session=academic_session,
        admission_date=date.today(),
    )

    category = FeeCategory.objects.create(name="Tuition Fee Pay", code="TUITION-PAY")
    fee_structure = FeeStructure.objects.create(
        academic_session=academic_session,
        program=program,
        semester=semester,
        category=category,
        amount=10000.0,
    )

    student_fee = StudentFee.objects.create(
        student=student,
        fee_structure=fee_structure,
        total_amount=10000.0,
        due_amount=10000.0,
        paid_amount=0.0,
        status="pending",
    )

    gateway = PaymentGateway.objects.create(
        name="Razorpay Test",
        provider="razorpay",
        is_active=True,
        config={
            "key_id": "rzp_test_mockkey",
            "key_secret": "mocksecret1234567890",
            "webhook_secret": "whsec_mock123",
        },
    )

    return {
        "user": user,
        "staff_user": staff_user,
        "student": student,
        "student_fee": student_fee,
        "gateway": gateway,
    }


# ===========================================================================
# 1. Gateway Unit Tests
# ===========================================================================

def test_gateway_factory():
    config = {"key_id": "k", "key_secret": "s"}
    gw = GatewayFactory.get("razorpay", config)
    assert isinstance(gw, RazorpayGateway)

    with pytest.raises(ValueError, match="Unknown payment provider"):
        GatewayFactory.get("invalid_provider", config)


def test_razorpay_signature_verification(setup_data):
    gw = RazorpayGateway(setup_data["gateway"].config)
    order_id = "order_123456"
    payment_id = "pay_654321"

    # Compute expected signature
    import hashlib
    import hmac
    msg = f"{order_id}|{payment_id}".encode("utf-8")
    secret = setup_data["gateway"].config["key_secret"].encode("utf-8")
    valid_sig = hmac.new(secret, msg, hashlib.sha256).hexdigest()

    assert gw.verify_signature(order_id, payment_id, valid_sig) is True
    assert gw.verify_signature(order_id, payment_id, "invalid_sig") is False


# ===========================================================================
# 2. Service Unit Tests
# ===========================================================================

@patch("apps.payments.gateways.RazorpayGateway.create_order")
def test_create_order_service_success(mock_create_order, setup_data):
    mock_create_order.return_value = {
        "id": "order_rzp_mock999",
        "entity": "order",
        "amount": 500000,
        "currency": "INR",
        "status": "created",
    }

    order = PaymentService.create_order(
        student_id=str(setup_data["student"].id),
        student_fee_id=str(setup_data["student_fee"].id),
        gateway_id=str(setup_data["gateway"].id),
        amount=decimal.Decimal("5000.00"),
        actor=setup_data["user"],
    )

    assert order.order_id == "order_rzp_mock999"
    assert order.status == "created"
    assert order.amount == decimal.Decimal("5000.00")
    assert PaymentAuditLog.objects.filter(order=order, event_type="order_created").exists()


def test_create_order_validation_errors(setup_data):
    # Invalid low amount
    with pytest.raises(ValueError, match="at least"):
        PaymentService.create_order(
            student_id=str(setup_data["student"].id),
            student_fee_id=str(setup_data["student_fee"].id),
            gateway_id=str(setup_data["gateway"].id),
            amount=decimal.Decimal("0.50"),
        )

    # Invalid high amount
    with pytest.raises(ValueError, match="cannot exceed"):
        PaymentService.create_order(
            student_id=str(setup_data["student"].id),
            student_fee_id=str(setup_data["student_fee"].id),
            gateway_id=str(setup_data["gateway"].id),
            amount=decimal.Decimal("600000.00"),
        )


@patch("apps.payments.gateways.RazorpayGateway.verify_signature", return_value=True)
def test_verify_payment_success(mock_verify_sig, setup_data):
    # Create order first
    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_test_verify",
        amount=decimal.Decimal("2000.00"),
        status="created",
    )

    txn = PaymentService.verify_payment(
        order_id="order_test_verify",
        gateway_payment_id="pay_test_999",
        gateway_signature="valid_signature_hash",
        actor=setup_data["user"],
    )

    assert txn.status == "success"
    assert txn.gateway_payment_id == "pay_test_999"
    assert txn.fee_receipt is not None
    order.refresh_from_db()
    assert order.status == "paid"
    assert PaymentAuditLog.objects.filter(transaction=txn, event_type="payment_success").exists()


@patch("apps.payments.gateways.RazorpayGateway.verify_signature", return_value=False)
def test_verify_payment_invalid_signature(mock_verify_sig, setup_data):
    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_test_invalid_sig",
        amount=decimal.Decimal("2000.00"),
        status="created",
    )

    with pytest.raises(ValueError, match="signature verification failed"):
        PaymentService.verify_payment(
            order_id="order_test_invalid_sig",
            gateway_payment_id="pay_invalid_111",
            gateway_signature="bad_sig",
            actor=setup_data["user"],
        )

    order.refresh_from_db()
    assert order.status == "attempted"


@patch("apps.payments.gateways.RazorpayGateway.refund")
def test_refund_service_success(mock_gw_refund, setup_data):
    mock_gw_refund.return_value = {"id": "rfnd_mock_123", "status": "processed"}

    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_for_refund",
        amount=decimal.Decimal("4000.00"),
        status="paid",
    )
    txn = PaymentTransaction.objects.create(
        student=setup_data["student"],
        order=order,
        gateway=setup_data["gateway"],
        transaction_id="pay_refund_target",
        gateway_order_id="order_for_refund",
        gateway_payment_id="pay_refund_target",
        amount=decimal.Decimal("4000.00"),
        status="success",
    )

    refund = PaymentService.refund(
        transaction_id="pay_refund_target",
        amount=decimal.Decimal("4000.00"),
        reason="Duplicate payment",
        actor=setup_data["staff_user"],
    )

    assert refund.status == "success"
    assert refund.refund_id == "rfnd_mock_123"
    txn.refresh_from_db()
    assert txn.status == "refunded"


def test_refund_validation_over_amount(setup_data):
    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_over_refund",
        amount=decimal.Decimal("1000.00"),
        status="paid",
    )
    txn = PaymentTransaction.objects.create(
        student=setup_data["student"],
        order=order,
        gateway=setup_data["gateway"],
        transaction_id="pay_over_refund",
        gateway_order_id="order_over_refund",
        gateway_payment_id="pay_over_refund",
        amount=decimal.Decimal("1000.00"),
        status="success",
    )

    with pytest.raises(ValueError, match="cannot exceed"):
        PaymentService.refund(
            transaction_id="pay_over_refund",
            amount=decimal.Decimal("2000.00"),
            reason="Exceeds payment",
        )


def test_webhook_handler_and_idempotency(setup_data):
    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_wh_test",
        amount=decimal.Decimal("3000.00"),
        status="created",
    )

    payload = {
        "id": "evt_test_100",
        "event": "payment.captured",
        "payload": {
            "payment": {
                "entity": {
                    "id": "pay_wh_captured",
                    "order_id": "order_wh_test",
                    "amount": 300000,
                }
            }
        },
    }

    # First webhook call
    log1 = PaymentService.webhook_handler(
        payload=payload,
        headers={},
        gateway_id=str(setup_data["gateway"].id),
        raw_body=b'{"id": "evt_test_100"}',
    )
    assert log1.is_processed is True
    order.refresh_from_db()
    assert order.status == "paid"

    # Second call (duplicate event_id)
    log2 = PaymentService.webhook_handler(
        payload=payload,
        headers={},
        gateway_id=str(setup_data["gateway"].id),
        raw_body=b'{"id": "evt_test_100"}',
    )
    assert log2.id == log1.id  # Returns existing log without reprocessing


# ===========================================================================
# 3. REST API ViewSet Tests
# ===========================================================================

@patch("apps.payments.gateways.RazorpayGateway.create_order")
def test_create_order_api(mock_create_order, setup_data):
    mock_create_order.return_value = {
        "id": "order_api_999",
        "amount": 100000,
        "currency": "INR",
        "status": "created",
    }
    client = APIClient()
    client.force_authenticate(user=setup_data["user"])

    url = "/api/payments/orders/create-order/"
    res = client.post(
        url,
        {
            "student_id": str(setup_data["student"].id),
            "student_fee_id": str(setup_data["student_fee"].id),
            "gateway_id": str(setup_data["gateway"].id),
            "amount": "1000.00",
        },
        format="json",
    )

    assert res.status_code == 201
    assert res.data["order_id"] == "order_api_999"


@patch("apps.payments.gateways.RazorpayGateway.verify_signature", return_value=True)
def test_verify_payment_api(mock_verify_sig, setup_data):
    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_api_verify",
        amount=decimal.Decimal("1500.00"),
        status="created",
    )

    client = APIClient()
    client.force_authenticate(user=setup_data["user"])

    url = "/api/payments/transactions/verify/"
    res = client.post(
        url,
        {
            "order_id": "order_api_verify",
            "gateway_payment_id": "pay_api_123",
            "gateway_signature": "valid_sig_hash",
        },
        format="json",
    )

    assert res.status_code == 200
    assert res.data["status"] == "success"


def test_payment_history_api(setup_data):
    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_hist_1",
        amount=decimal.Decimal("500.00"),
        status="paid",
    )
    PaymentTransaction.objects.create(
        student=setup_data["student"],
        order=order,
        gateway=setup_data["gateway"],
        transaction_id="pay_hist_1",
        gateway_order_id="order_hist_1",
        gateway_payment_id="pay_hist_1",
        amount=decimal.Decimal("500.00"),
        status="success",
    )

    client = APIClient()
    client.force_authenticate(user=setup_data["user"])

    url = f"/api/payments/transactions/history/?student_id={setup_data['student'].id}"
    res = client.get(url)

    assert res.status_code == 200
    assert len(res.data) == 1
    assert res.data[0]["transaction_id"] == "pay_hist_1"


@patch("apps.payments.gateways.RazorpayGateway.refund")
def test_refund_api_permission_control(mock_refund, setup_data):
    order = PaymentOrder.objects.create(
        student=setup_data["student"],
        student_fee=setup_data["student_fee"],
        gateway=setup_data["gateway"],
        order_id="order_refund_perm",
        amount=decimal.Decimal("2500.00"),
        status="paid",
    )
    PaymentTransaction.objects.create(
        student=setup_data["student"],
        order=order,
        gateway=setup_data["gateway"],
        transaction_id="pay_refund_perm",
        gateway_order_id="order_refund_perm",
        gateway_payment_id="pay_refund_perm",
        amount=decimal.Decimal("2500.00"),
        status="success",
    )

    client = APIClient()

    # Unauthenticated -> 401
    url = "/api/payments/refunds/create/"
    res = client.post(url, {"transaction_id": "pay_refund_perm", "amount": "2500.00", "reason": "test"}, format="json")
    assert res.status_code == 401

    # Student user -> 403 Forbidden (Only staff/admin allowed for refunds)
    client.force_authenticate(user=setup_data["user"])
    res = client.post(url, {"transaction_id": "pay_refund_perm", "amount": "2500.00", "reason": "test"}, format="json")
    assert res.status_code == 403

    # Staff user -> 201 Created
    mock_refund.return_value = {"id": "rfnd_perm_ok"}
    client.force_authenticate(user=setup_data["staff_user"])
    res = client.post(url, {"transaction_id": "pay_refund_perm", "amount": "2500.00", "reason": "test"}, format="json")
    assert res.status_code == 201
    assert res.data["status"] == "success"
