from rest_framework import serializers

from apps.academics.serializers import AcademicSessionSerializer, ProgramSerializer, SemesterSerializer
from apps.students.serializers import StudentSerializer

from .models import FeeAuditLog, FeeCategory, FeeInstallment, FeeReceipt, FeeStructure, StudentFee


class FeeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeCategory
        fields = ["id", "name", "code", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class FeeStructureSerializer(serializers.ModelSerializer):
    academic_session_detail = AcademicSessionSerializer(source="academic_session", read_only=True)
    program_detail = ProgramSerializer(source="program", read_only=True)
    semester_detail = SemesterSerializer(source="semester", read_only=True)
    category_detail = FeeCategorySerializer(source="category", read_only=True)

    class Meta:
        model = FeeStructure
        fields = [
            "id",
            "academic_session",
            "academic_session_detail",
            "program",
            "program_detail",
            "semester",
            "semester_detail",
            "category",
            "category_detail",
            "amount",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class FeeInstallmentSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = FeeInstallment
        fields = [
            "id",
            "student_fee",
            "installment_no",
            "amount",
            "due_date",
            "fine_amount",
            "status",
            "status_display",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_deleted", "created_at", "updated_at"]


class StudentFeeSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    fee_structure_detail = FeeStructureSerializer(source="fee_structure", read_only=True)
    installments = FeeInstallmentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = StudentFee
        fields = [
            "id",
            "student",
            "student_detail",
            "fee_structure",
            "fee_structure_detail",
            "installments",
            "total_amount",
            "waiver_amount",
            "scholarship_amount",
            "paid_amount",
            "due_amount",
            "status",
            "status_display",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "paid_amount", "due_amount", "status", "is_deleted", "created_at", "updated_at"]


class AssignFeeRequestSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    fee_structure_id = serializers.UUIDField()
    waiver_amount = serializers.FloatField(default=0.0)
    scholarship_amount = serializers.FloatField(default=0.0)
    num_installments = serializers.IntegerField(default=1)


class CollectFeeRequestSerializer(serializers.Serializer):
    student_fee_id = serializers.UUIDField()
    amount = serializers.FloatField()
    payment_mode = serializers.ChoiceField(
        choices=["cash", "cheque", "bank_transfer", "upi", "online", "draft"], default="cash"
    )
    installment_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    remarks = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value


class FeeReceiptSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    student_fee_detail = StudentFeeSerializer(source="student_fee", read_only=True)
    installment_detail = FeeInstallmentSerializer(source="installment", read_only=True)
    payment_mode_display = serializers.CharField(source="get_payment_mode_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = FeeReceipt
        fields = [
            "id",
            "receipt_number",
            "student",
            "student_detail",
            "student_fee",
            "student_fee_detail",
            "installment",
            "installment_detail",
            "payment_date",
            "amount",
            "payment_mode",
            "payment_mode_display",
            "status",
            "status_display",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "receipt_number", "payment_date", "created_at", "updated_at"]


class FeeAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = FeeAuditLog
        fields = ["id", "event_type", "description", "actor", "actor_email", "metadata", "timestamp"]
        read_only_fields = fields
