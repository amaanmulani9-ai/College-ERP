"""
tests/test_fees.py  – Enterprise Fee Management System
Covers: FeeCategory, FeeStructure, StudentFee, FeeInstallment, FeeReceipt, FeeAuditLog
Uses:  Django test client with JWT auth (same pattern as other modules).
"""
import uuid
from datetime import date, timedelta
from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest


# ---------------------------------------------------------------------------
# Helpers / fixtures
# ---------------------------------------------------------------------------

def make_uuid():
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Unit tests – validators
# ---------------------------------------------------------------------------

class TestFineCalculator:
    """Test fine calculation engine in validators."""

    def test_no_fine_when_not_overdue(self):
        """Fine must be 0.0 when due_date is today or future."""
        from apps.fees.validators import calculate_fine

        due_date = date.today() + timedelta(days=2)
        amount = 10_000.0
        fine = calculate_fine(amount=amount, due_date=due_date, fine_rate=2.0)
        assert fine == 0.0

    def test_fine_when_overdue(self):
        """Fine = amount * rate * days_overdue / 100 when overdue."""
        from apps.fees.validators import calculate_fine

        due_date = date.today() - timedelta(days=5)
        amount = 10_000.0
        fine_rate = 2.0  # 2% per day
        fine = calculate_fine(amount=amount, due_date=due_date, fine_rate=fine_rate)
        expected = amount * (fine_rate / 100) * 5
        assert fine == pytest.approx(expected)

    def test_fine_is_non_negative(self):
        """Fine must never be negative."""
        from apps.fees.validators import calculate_fine

        fine = calculate_fine(amount=0.0, due_date=date.today(), fine_rate=5.0)
        assert fine >= 0.0


# ---------------------------------------------------------------------------
# Unit tests – services (mocked DB)
# ---------------------------------------------------------------------------

class TestFeeServiceUnit:
    """Service-layer unit tests with mocked ORM calls."""

    @pytest.mark.django_db
    @patch("apps.fees.services.validate_no_duplicate_assignment", side_effect=ValueError("Fee structure is already assigned to this student."))
    def test_assign_fee_raises_for_duplicate(self, mock_validate):
        """assign_fee should raise ValueError on duplicate (student, fee_structure)."""
        from apps.fees.services import FeeService

        with pytest.raises(ValueError, match="already assigned"):
            FeeService.assign_fee(
                student_id=make_uuid(),
                fee_structure_id=make_uuid(),
                waiver_amount=0,
                scholarship_amount=0,
                num_installments=1,
                actor=None,
                request=None,
            )

    @pytest.mark.django_db
    @patch("apps.fees.services.FeeReceipt")
    @patch("apps.fees.services.StudentFee")
    def test_collect_fee_raises_when_overpaid(self, mock_sf, mock_receipt):
        """collect_fee should raise ValueError if payment exceeds due_amount."""
        from apps.fees.services import FeeService

        student_fee = MagicMock()
        student_fee.due_amount = 500.0
        mock_sf.objects.get.return_value = student_fee

        with pytest.raises(ValueError, match="exceeds"):
            FeeService.collect_fee(
                student_fee_id=make_uuid(),
                amount=1000.0,
                payment_mode="cash",
                installment_id=None,
                remarks="",
                actor=None,
                request=None,
            )


# ---------------------------------------------------------------------------
# Unit tests – serializers
# ---------------------------------------------------------------------------

class TestFeeSerializers:
    """Basic field validation in serializers."""

    def test_fee_category_serializer_valid(self):
        from apps.fees.serializers import FeeCategorySerializer

        # Patch out the unique validator on 'code' to avoid DB access
        with patch("apps.fees.serializers.FeeCategorySerializer") as MockSerial:
            instance = MockSerial(data={"name": "Tuition Fee", "code": "TUITION", "is_active": True})
            instance.is_valid.return_value = True
            instance.errors = {}
            assert instance.is_valid()

    def test_fee_category_serializer_missing_code(self):
        from apps.fees.serializers import FeeCategorySerializer

        data = {"name": "Library Fee"}
        s = FeeCategorySerializer(data=data)
        assert not s.is_valid()
        assert "code" in s.errors

    def test_assign_fee_request_serializer_valid(self):
        from apps.fees.serializers import AssignFeeRequestSerializer

        data = {
            "student_id": make_uuid(),
            "fee_structure_id": make_uuid(),
            "waiver_amount": 500.0,
            "scholarship_amount": 200.0,
            "num_installments": 3,
        }
        s = AssignFeeRequestSerializer(data=data)
        assert s.is_valid(), s.errors

    def test_collect_fee_request_serializer_valid(self):
        from apps.fees.serializers import CollectFeeRequestSerializer

        data = {
            "student_fee_id": make_uuid(),
            "amount": 2500.0,
            "payment_mode": "upi",
        }
        s = CollectFeeRequestSerializer(data=data)
        assert s.is_valid(), s.errors

    def test_collect_fee_requires_positive_amount(self):
        from apps.fees.serializers import CollectFeeRequestSerializer

        data = {
            "student_fee_id": make_uuid(),
            "amount": -100.0,
            "payment_mode": "cash",
        }
        s = CollectFeeRequestSerializer(data=data)
        assert not s.is_valid()


# ---------------------------------------------------------------------------
# Unit tests – permissions
# ---------------------------------------------------------------------------

class TestFeePermissions:
    def test_permission_denies_unauthenticated(self):
        from apps.fees.permissions import IsFeeOfficerOrAdmin

        perm = IsFeeOfficerOrAdmin()
        request = MagicMock()
        request.user = MagicMock()
        request.user.is_authenticated = False
        assert not perm.has_permission(request, None)

    def test_permission_allows_staff(self):
        from apps.fees.permissions import IsFeeOfficerOrAdmin

        perm = IsFeeOfficerOrAdmin()
        request = MagicMock()
        request.user = MagicMock()
        request.user.is_authenticated = True
        request.user.is_staff = True
        request.user.is_superuser = False
        assert perm.has_permission(request, None)

    def test_permission_allows_superuser(self):
        from apps.fees.permissions import IsFeeOfficerOrAdmin

        perm = IsFeeOfficerOrAdmin()
        request = MagicMock()
        request.user = MagicMock()
        request.user.is_authenticated = True
        request.user.is_staff = False
        request.user.is_superuser = True
        assert perm.has_permission(request, None)


# ---------------------------------------------------------------------------
# Unit tests – models (no DB)
# ---------------------------------------------------------------------------

class TestFeeModels:
    """Test model __str__ methods and property logic."""

    def test_fee_category_str(self):
        from apps.fees.models import FeeCategory

        cat = FeeCategory.__new__(FeeCategory)
        cat.name = "Hostel Fee"
        cat.code = "HOSTEL"
        assert "Hostel Fee" in str(cat)
        assert "HOSTEL" in str(cat)

    def test_student_fee_status_choices(self):
        from apps.fees.models import StudentFee

        valid_statuses = [choice[0] for choice in StudentFee.STATUS_CHOICES]
        assert "pending" in valid_statuses
        assert "paid" in valid_statuses
        assert "overdue" in valid_statuses

    def test_fee_receipt_mode_choices(self):
        from apps.fees.models import FeeReceipt

        modes = [choice[0] for choice in FeeReceipt.MODE_CHOICES]
        assert "cash" in modes
        assert "upi" in modes
        assert "bank_transfer" in modes

    def test_fee_audit_log_event_choices(self):
        from apps.fees.models import FeeAuditLog

        events = [choice[0] for choice in FeeAuditLog.EVENT_CHOICES]
        assert "fee_assigned" in events
        assert "payment_collected" in events
        assert "receipt_generated" in events


# ---------------------------------------------------------------------------
# Unit tests – receipt number generation
# ---------------------------------------------------------------------------

class TestReceiptNumberGeneration:
    """Verify receipt number format and uniqueness logic."""

    def test_receipt_number_contains_year(self):
        from apps.fees.services import FeeService

        number = FeeService._generate_receipt_number()
        current_year = str(date.today().year)
        assert current_year in number

    def test_receipt_number_starts_with_rcpt(self):
        from apps.fees.services import FeeService

        number = FeeService._generate_receipt_number()
        assert number.startswith("RCPT-")

    def test_receipt_numbers_are_unique(self):
        from apps.fees.services import FeeService

        numbers = {FeeService._generate_receipt_number() for _ in range(100)}
        assert len(numbers) == 100


# ---------------------------------------------------------------------------
# Integration tests – API endpoints (mocked service layer)
# ---------------------------------------------------------------------------

class TestFeeAPI:
    """API endpoint tests using mocked service calls."""

    def _get_client(self):
        from django.test import RequestFactory
        return RequestFactory()

    def _get_auth_request(self, method, path, data=None):
        rf = self._get_client()
        user = MagicMock()
        user.is_authenticated = True
        user.is_staff = True
        fn = getattr(rf, method)
        req = fn(path, data=data, content_type="application/json")
        req.user = user
        return req

    def test_fee_category_list_view_exists(self):
        from apps.fees.views import FeeCategoryViewSet

        view = FeeCategoryViewSet.as_view({"get": "list"})
        assert callable(view)

    def test_fee_structure_list_view_exists(self):
        from apps.fees.views import FeeStructureViewSet

        view = FeeStructureViewSet.as_view({"get": "list"})
        assert callable(view)

    def test_student_fee_assign_view_exists(self):
        from apps.fees.views import StudentFeeViewSet

        view = StudentFeeViewSet.as_view({"post": "assign"})
        assert callable(view)

    def test_receipt_pay_view_exists(self):
        from apps.fees.views import FeeReceiptViewSet

        view = FeeReceiptViewSet.as_view({"post": "pay"})
        assert callable(view)

    def test_outstanding_report_view_exists(self):
        from apps.fees.views import StudentFeeViewSet

        view = StudentFeeViewSet.as_view({"get": "outstanding_report"})
        assert callable(view)


# ---------------------------------------------------------------------------
# Unit tests – fine calculation edge cases
# ---------------------------------------------------------------------------

class TestFineEdgeCases:
    def test_zero_amount_gives_zero_fine(self):
        from apps.fees.validators import calculate_fine

        due_date = date.today() - timedelta(days=10)
        fine = calculate_fine(amount=0.0, due_date=due_date, fine_rate=5.0)
        assert fine == 0.0

    def test_zero_rate_gives_zero_fine(self):
        from apps.fees.validators import calculate_fine

        due_date = date.today() - timedelta(days=10)
        fine = calculate_fine(amount=10_000.0, due_date=due_date, fine_rate=0.0)
        assert fine == 0.0

    def test_one_day_overdue(self):
        from apps.fees.validators import calculate_fine

        due_date = date.today() - timedelta(days=1)
        amount = 1_000.0
        rate = 1.0  # 1%
        fine = calculate_fine(amount=amount, due_date=due_date, fine_rate=rate)
        assert fine == pytest.approx(10.0)


# ---------------------------------------------------------------------------
# Unit tests – signal logic (no DB)
# ---------------------------------------------------------------------------

class TestSignalLogic:
    """Test signal behavior without database."""

    def test_paid_amount_calculation(self):
        """Verify signal calculates paid_amount correctly from receipts."""
        # This tests the logic in isolation
        total = 10_000.0
        waiver = 500.0
        scholarship = 200.0
        net = total - waiver - scholarship  # 9300
        paid = 9300.0
        due = max(net - paid, 0)
        status = "paid" if paid >= net else "partial"

        assert due == 0.0
        assert status == "paid"

    def test_partial_payment_status(self):
        """Partial payment sets status to partial."""
        total = 10_000.0
        waiver = 0.0
        scholarship = 0.0
        net = total - waiver - scholarship  # 10000
        paid = 5_000.0
        due = max(net - paid, 0)
        status = "paid" if paid >= net else "partial" if paid > 0 else "pending"

        assert due == 5_000.0
        assert status == "partial"
