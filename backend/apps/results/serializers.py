from rest_framework import serializers

from apps.academics.serializers import ProgramSerializer, SemesterSerializer, SubjectSerializer
from apps.examinations.serializers import ExamSerializer
from apps.students.serializers import StudentSerializer

from .models import ResultAuditLog, ResultScheme, SemesterResult, StudentResult


class ResultSchemeSerializer(serializers.ModelSerializer):
    program_detail = ProgramSerializer(source="program", read_only=True)
    semester_detail = SemesterSerializer(source="semester", read_only=True)
    subject_detail = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = ResultScheme
        fields = [
            "id",
            "program",
            "program_detail",
            "semester",
            "semester_detail",
            "subject",
            "subject_detail",
            "max_internal",
            "max_external",
            "max_practical",
            "max_viva",
            "max_assignment",
            "passing_marks",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class StudentResultSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    subject_detail = SubjectSerializer(source="subject", read_only=True)
    exam_detail = ExamSerializer(source="exam", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = StudentResult
        fields = [
            "id",
            "student",
            "student_detail",
            "subject",
            "subject_detail",
            "exam",
            "exam_detail",
            "internal_marks",
            "external_marks",
            "practical_marks",
            "viva_marks",
            "assignment_marks",
            "grace_marks",
            "total_marks",
            "grade",
            "grade_point",
            "credit_point",
            "status",
            "status_display",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "total_marks",
            "grade",
            "grade_point",
            "credit_point",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class EnterMarksRequestSerializer(serializers.Serializer):
    student = serializers.UUIDField()
    subject = serializers.UUIDField()
    exam = serializers.UUIDField(required=False, allow_null=True, default=None)
    internal_marks = serializers.FloatField(default=0.0)
    external_marks = serializers.FloatField(default=0.0)
    practical_marks = serializers.FloatField(default=0.0)
    viva_marks = serializers.FloatField(default=0.0)
    assignment_marks = serializers.FloatField(default=0.0)
    grace_marks = serializers.FloatField(default=0.0)


class SemesterResultSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    semester_detail = SemesterSerializer(source="semester", read_only=True)
    result_status_display = serializers.CharField(source="get_result_status_display", read_only=True)

    class Meta:
        model = SemesterResult
        fields = [
            "id",
            "student",
            "student_detail",
            "semester",
            "semester_detail",
            "sgpa",
            "cgpa",
            "credits_earned",
            "total_credits",
            "rank",
            "result_status",
            "result_status_display",
            "is_published",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "rank", "is_deleted", "created_at", "updated_at"]


class PublishResultRequestSerializer(serializers.Serializer):
    semester_id = serializers.UUIDField()


class ResultAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = ResultAuditLog
        fields = ["id", "event_type", "description", "actor", "actor_email", "metadata", "timestamp"]
        read_only_fields = fields
