from decimal import Decimal

from rest_framework import serializers

from .models import (
    Scholarship,
    ScholarshipApplication,
    ScholarshipAuditLog,
    ScholarshipRenewal,
    ScholarshipType,
)


class ScholarshipTypeSerializer(serializers.ModelSerializer):
    provider_display = serializers.CharField(source="get_provider_display", read_only=True)

    class Meta:
        model = ScholarshipType
        fields = [
            "id",
            "name",
            "code",
            "provider",
            "provider_display",
            "description",
            "min_cgpa_requirement",
            "max_family_income",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ScholarshipSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    scholarship_type_name = serializers.CharField(source="scholarship_type.name", read_only=True)
    academic_session_name = serializers.CharField(source="academic_session.name", read_only=True)

    class Meta:
        model = Scholarship
        fields = [
            "id",
            "student",
            "scholarship_type",
            "scholarship_type_name",
            "academic_session",
            "academic_session_name",
            "amount",
            "percentage",
            "start_date",
            "end_date",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ScholarshipApplicationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    scholarship_type_name = serializers.CharField(source="scholarship_type.name", read_only=True)
    scholarship_type_code = serializers.CharField(source="scholarship_type.code", read_only=True)
    academic_session_name = serializers.CharField(source="academic_session.name", read_only=True)
    approved_by_email = serializers.CharField(source="approved_by.email", read_only=True, default="")

    class Meta:
        model = ScholarshipApplication
        fields = [
            "id",
            "student",
            "scholarship_type",
            "scholarship_type_name",
            "scholarship_type_code",
            "academic_session",
            "academic_session_name",
            "requested_amount",
            "family_annual_income",
            "current_cgpa",
            "documents",
            "statement_of_purpose",
            "status",
            "status_display",
            "rejection_reason",
            "approved_by_email",
            "approved_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "rejection_reason",
            "approved_by_email",
            "approved_at",
            "created_at",
            "updated_at",
        ]


class ScholarshipRenewalSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    scholarship_name = serializers.CharField(source="scholarship.scholarship_type.name", read_only=True)
    academic_session_name = serializers.CharField(source="academic_session.name", read_only=True)

    class Meta:
        model = ScholarshipRenewal
        fields = [
            "id",
            "scholarship",
            "scholarship_name",
            "academic_session",
            "academic_session_name",
            "status",
            "status_display",
            "remarks",
            "processed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "processed_at", "created_at", "updated_at"]


class ScholarshipAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = ScholarshipAuditLog
        fields = [
            "id",
            "student",
            "scholarship",
            "application",
            "actor",
            "actor_email",
            "event_type",
            "description",
            "timestamp",
        ]
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Request / Action Serializers
# ---------------------------------------------------------------------------


class ApplyScholarshipRequestSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    scholarship_type_id = serializers.UUIDField()
    academic_session_id = serializers.UUIDField()
    requested_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    family_annual_income = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    current_cgpa = serializers.FloatField(default=0.0)
    documents = serializers.JSONField(required=False, default=dict)
    statement_of_purpose = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_requested_amount(self, value):
        if value < Decimal("0.00"):
            raise serializers.ValidationError("Requested amount cannot be negative.")
        return value


class ApproveApplicationRequestSerializer(serializers.Serializer):
    application_id = serializers.UUIDField()
    approved_amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    percentage = serializers.FloatField(default=0.0)


class RejectApplicationRequestSerializer(serializers.Serializer):
    application_id = serializers.UUIDField()
    reason = serializers.CharField(max_length=500)


class RenewScholarshipRequestSerializer(serializers.Serializer):
    scholarship_id = serializers.UUIDField()
    new_academic_session_id = serializers.UUIDField()
    remarks = serializers.CharField(required=False, allow_blank=True, default="")
