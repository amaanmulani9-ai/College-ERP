from apps.profiles.serializers import UserProfileSerializer
from rest_framework import serializers

from .models import (
    Parent,
    ParentActivityLog,
    ParentCommunicationPreference,
    ParentDocument,
    StudentParentLink,
)


class ParentCommunicationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentCommunicationPreference
        fields = [
            "id",
            "email_notifications",
            "sms_notifications",
            "push_notifications",
            "whatsapp_notifications",
            "attendance_alerts",
            "fee_reminders",
            "exam_results",
            "general_announcements",
            "disciplinary_notices",
            "event_invitations",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]


class ParentDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source="get_document_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    reviewed_by_name = serializers.CharField(source="reviewed_by.get_full_name", read_only=True, default="")

    class Meta:
        model = ParentDocument
        fields = [
            "id",
            "parent",
            "document_type",
            "document_type_display",
            "document_file",
            "document_number",
            "description",
            "status",
            "status_display",
            "reviewed_by",
            "reviewed_by_name",
            "review_notes",
            "uploaded_at",
            "expires_at",
        ]
        read_only_fields = ["id", "uploaded_at", "reviewed_by", "review_notes", "status"]


class ParentActivityLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = ParentActivityLog
        fields = [
            "id",
            "activity_type",
            "description",
            "actor",
            "actor_email",
            "metadata",
            "ip_address",
            "timestamp",
        ]
        read_only_fields = fields


class StudentParentLinkSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)
    student_name = serializers.CharField(source="student.profile.get_full_name", read_only=True)
    parent_code = serializers.CharField(source="parent.parent_code", read_only=True)

    class Meta:
        model = StudentParentLink
        fields = [
            "id",
            "student",
            "student_id_code",
            "student_name",
            "parent",
            "parent_code",
            "is_primary_contact",
            "is_emergency_contact",
            "can_pickup",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ParentSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    relationship_type_display = serializers.CharField(source="get_relationship_type_display", read_only=True)
    education_level_display = serializers.CharField(source="get_education_level_display", read_only=True)
    verified_by_name = serializers.CharField(source="verified_by.get_full_name", read_only=True, default="")
    communication_preferences = ParentCommunicationPreferenceSerializer(read_only=True)
    documents = ParentDocumentSerializer(many=True, read_only=True)
    student_links = StudentParentLinkSerializer(many=True, read_only=True)

    class Meta:
        model = Parent
        fields = [
            "id",
            "parent_code",
            "profile",
            "relationship_type",
            "relationship_type_display",
            "occupation",
            "employer_name",
            "annual_income",
            "education_level",
            "education_level_display",
            "is_verified",
            "verified_at",
            "verified_by",
            "verified_by_name",
            "portal_access_enabled",
            "notification_enabled",
            "communication_preferences",
            "documents",
            "student_links",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "parent_code",
            "is_verified",
            "verified_at",
            "verified_by",
            "created_at",
            "updated_at",
        ]


class CreateParentSerializer(serializers.Serializer):
    """Write-only serializer to create a parent with an associated user account."""

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=False, default="ParentPassword123!", write_only=True)
    relationship_type = serializers.ChoiceField(choices=Parent.RELATIONSHIP_CHOICES, default="guardian")
    occupation = serializers.CharField(required=False, allow_blank=True, default="")
    employer_name = serializers.CharField(required=False, allow_blank=True, default="")
    annual_income = serializers.DecimalField(max_digits=14, decimal_places=2, required=False, allow_null=True)
    education_level = serializers.ChoiceField(choices=Parent.EDUCATION_CHOICES, default="bachelor")
    portal_access_enabled = serializers.BooleanField(default=True)
    notification_enabled = serializers.BooleanField(default=True)


class LinkStudentSerializer(serializers.Serializer):
    """Payload for linking a student to an existing parent."""

    student_id = serializers.UUIDField(required=True)
    is_primary_contact = serializers.BooleanField(default=False)
    is_emergency_contact = serializers.BooleanField(default=False)
    can_pickup = serializers.BooleanField(default=True)
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class DocumentReviewSerializer(serializers.Serializer):
    """Staff payload for reviewing a parent document."""

    status = serializers.ChoiceField(choices=["approved", "rejected", "expired"])
    review_notes = serializers.CharField(required=False, allow_blank=True, default="")
