from apps.academics.serializers import AcademicSessionSerializer, ProgramSerializer
from apps.students.serializers import StudentSerializer
from rest_framework import serializers

from .models import Certificate, CertificateAuditLog, CertificateType, Transcript


class CertificateTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateType
        fields = ["id", "name", "code", "template", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class CertificateSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    certificate_type_detail = CertificateTypeSerializer(source="certificate_type", read_only=True)
    academic_session_detail = AcademicSessionSerializer(source="academic_session", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id",
            "student",
            "student_detail",
            "certificate_type",
            "certificate_type_detail",
            "certificate_number",
            "academic_session",
            "academic_session_detail",
            "status",
            "status_display",
            "generated_at",
            "generated_by",
            "metadata",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "certificate_number",
            "generated_at",
            "generated_by",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class GenerateCertificateRequestSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    certificate_type_id = serializers.UUIDField()


class TranscriptSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    program_detail = ProgramSerializer(source="program", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Transcript
        fields = [
            "id",
            "student",
            "student_detail",
            "program",
            "program_detail",
            "total_credits",
            "earned_credits",
            "sgpa",
            "cgpa",
            "status",
            "status_display",
            "generated_at",
            "generated_by",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "generated_at", "generated_by", "is_deleted", "created_at", "updated_at"]


class GenerateTranscriptRequestSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()


class CertificateAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = CertificateAuditLog
        fields = ["id", "event_type", "description", "actor", "actor_email", "metadata", "timestamp"]
        read_only_fields = fields
