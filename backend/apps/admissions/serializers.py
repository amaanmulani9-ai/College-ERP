from apps.academics.serializers import AcademicSessionSerializer, DepartmentSerializer, ProgramSerializer
from apps.students.serializers import StudentSerializer
from rest_framework import serializers

from .models import (
    AdmissionApplication,
    AdmissionAuditLog,
    AdmissionDocument,
    ApplicationStatusHistory,
    SeatMatrix,
)


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.get_full_name", read_only=True, default="")

    class Meta:
        model = ApplicationStatusHistory
        fields = ["id", "previous_status", "new_status", "changed_by", "changed_by_name", "remarks", "timestamp"]
        read_only_fields = fields


class AdmissionDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source="get_document_type_display", read_only=True)
    review_status_display = serializers.CharField(source="get_review_status_display", read_only=True)
    reviewed_by_name = serializers.CharField(source="reviewed_by.get_full_name", read_only=True, default="")

    class Meta:
        model = AdmissionDocument
        fields = [
            "id",
            "application",
            "document_type",
            "document_type_display",
            "file",
            "original_filename",
            "version",
            "checksum",
            "review_status",
            "review_status_display",
            "reviewed_by",
            "reviewed_by_name",
            "review_remarks",
            "uploaded_at",
            "reviewed_at",
        ]
        read_only_fields = ["id", "uploaded_at", "reviewed_at", "reviewed_by"]


class AdmissionAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = AdmissionAuditLog
        fields = ["id", "event_type", "description", "actor", "actor_email", "metadata", "ip_address", "timestamp"]
        read_only_fields = fields


class AdmissionApplicationSerializer(serializers.ModelSerializer):
    academic_session_detail = AcademicSessionSerializer(source="academic_session", read_only=True)
    program_detail = ProgramSerializer(source="program", read_only=True)
    department_detail = DepartmentSerializer(source="department", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    reviewer_name = serializers.CharField(source="reviewer.get_full_name", read_only=True, default="")
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)
    documents = AdmissionDocumentSerializer(many=True, read_only=True)
    enrolled_student_detail = StudentSerializer(source="enrolled_student", read_only=True)

    class Meta:
        model = AdmissionApplication
        fields = [
            "id",
            "application_number",
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "mobile",
            "date_of_birth",
            "gender",
            "nationality",
            "category",
            "academic_session",
            "academic_session_detail",
            "program",
            "program_detail",
            "department",
            "department_detail",
            "previous_qualification",
            "percentage_cgpa",
            "entrance_score",
            "previous_student_id",
            "address",
            "application_source",
            "status",
            "status_display",
            "reviewer",
            "reviewer_name",
            "guardian_name",
            "guardian_email",
            "guardian_phone",
            "guardian_relationship",
            "enrolled_student",
            "enrolled_student_detail",
            "remarks",
            "status_history",
            "documents",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "application_number", "enrolled_student", "is_deleted", "created_at", "updated_at"]


class CreateAdmissionApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionApplication
        fields = [
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "mobile",
            "date_of_birth",
            "gender",
            "nationality",
            "category",
            "academic_session",
            "program",
            "department",
            "previous_qualification",
            "percentage_cgpa",
            "entrance_score",
            "previous_student_id",
            "address",
            "application_source",
            "guardian_name",
            "guardian_email",
            "guardian_phone",
            "guardian_relationship",
            "remarks",
        ]


class ApplicationWorkflowTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=AdmissionApplication.STATUS_CHOICES)
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class DocumentReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["approved", "rejected"])
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class SeatMatrixSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source="program.name", read_only=True)
    program_code = serializers.CharField(source="program.code", read_only=True)
    session_name = serializers.CharField(source="academic_session.name", read_only=True)
    available_seats = serializers.IntegerField(read_only=True)

    class Meta:
        model = SeatMatrix
        fields = [
            "id",
            "program",
            "program_name",
            "program_code",
            "academic_session",
            "session_name",
            "category",
            "total_seats",
            "occupied_seats",
            "reserved_seats",
            "waitlist_count",
            "available_seats",
        ]
        read_only_fields = ["id", "available_seats"]
