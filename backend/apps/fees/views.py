from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import FeeCategory, FeeInstallment, FeeReceipt, FeeStructure, StudentFee
from .serializers import (
    AssignFeeRequestSerializer,
    CollectFeeRequestSerializer,
    FeeAuditLogSerializer,
    FeeCategorySerializer,
    FeeInstallmentSerializer,
    FeeReceiptSerializer,
    FeeStructureSerializer,
    StudentFeeSerializer,
)
from .services import FeeService


class FeeCategoryViewSet(viewsets.ModelViewSet):
    queryset = FeeCategory.objects.all()
    serializer_class = FeeCategorySerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["is_active"]


class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all().select_related("academic_session", "program", "semester", "category")
    serializer_class = FeeStructureSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["category__name", "program__name", "academic_session__name"]
    filterset_fields = ["academic_session", "program", "semester", "category", "is_active"]


class StudentFeeViewSet(viewsets.ModelViewSet):
    queryset = (
        StudentFee.objects.all()
        .select_related("student__profile", "fee_structure__category")
        .prefetch_related("installments")
    )
    serializer_class = StudentFeeSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["student__student_id", "student__profile__first_name", "fee_structure__category__name"]
    filterset_fields = ["student", "fee_structure", "status"]

    @action(detail=False, methods=["post"], url_path="assign")
    def assign(self, request):
        serializer = AssignFeeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            student_fee = FeeService.assign_fee(
                student_id=str(serializer.validated_data["student_id"]),
                fee_structure_id=str(serializer.validated_data["fee_structure_id"]),
                waiver_amount=serializer.validated_data.get("waiver_amount", 0.0),
                scholarship_amount=serializer.validated_data.get("scholarship_amount", 0.0),
                num_installments=serializer.validated_data.get("num_installments", 1),
                actor=request.user,
                request=request,
            )
            return Response(StudentFeeSerializer(student_fee).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="student/(?P<student_id>[^/.]+)")
    def student_summary(self, request, student_id=None):
        summary = FeeService.student_fee_summary(student_id)
        return Response(summary, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="outstanding")
    def outstanding_report(self, request):
        overdue_fees = StudentFee.objects.filter(due_amount__gt=0, is_deleted=False).select_related(
            "student__profile", "fee_structure__category"
        )
        return Response(StudentFeeSerializer(overdue_fees, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        fee = self.get_object()
        logs = fee.audit_logs.all()
        return Response(FeeAuditLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)


class FeeInstallmentViewSet(viewsets.ModelViewSet):
    queryset = FeeInstallment.objects.all().select_related("student_fee__student__profile")
    serializer_class = FeeInstallmentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["student_fee__student__student_id"]
    filterset_fields = ["student_fee", "status"]


class FeeReceiptViewSet(viewsets.ModelViewSet):
    queryset = FeeReceipt.objects.all().select_related("student__profile", "student_fee__fee_structure__category")
    serializer_class = FeeReceiptSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["receipt_number", "student__student_id", "student__profile__first_name"]
    filterset_fields = ["student", "payment_mode", "status"]

    @action(detail=False, methods=["post"], url_path="pay")
    def pay(self, request):
        serializer = CollectFeeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            receipt = FeeService.collect_fee(
                student_fee_id=str(serializer.validated_data["student_fee_id"]),
                amount=serializer.validated_data["amount"],
                payment_mode=serializer.validated_data.get("payment_mode", "cash"),
                installment_id=(
                    str(serializer.validated_data["installment_id"])
                    if serializer.validated_data.get("installment_id")
                    else None
                ),
                remarks=serializer.validated_data.get("remarks", ""),
                actor=request.user,
                request=request,
            )
            return Response(FeeReceiptSerializer(receipt).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="receipt/(?P<receipt_id>[^/.]+)")
    def get_receipt(self, request, receipt_id=None):
        try:
            rcpt = FeeReceipt.objects.get(pk=receipt_id)
            return Response(FeeReceiptSerializer(rcpt).data, status=status.HTTP_200_OK)
        except FeeReceipt.DoesNotExist:
            return Response({"detail": "Receipt not found."}, status=status.HTTP_404_NOT_FOUND)
