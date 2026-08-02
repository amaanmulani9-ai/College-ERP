from rest_framework import serializers
from apps.alumni.models import (
    AlumniProfile,
    AlumniMembership,
    AlumniEmployment,
    AlumniAchievement,
    AlumniHigherEducation,
    AlumniBusiness,
    MentorshipProgram,
    MentorAssignment,
    AlumniEvent,
    EventRegistration,
    AlumniChapter,
    Donation,
    FundraisingCampaign,
    Newsletter,
    CommunicationLog,
    SuccessStory,
    JobReferral,
    NetworkingRequest,
    AlumniDirectory,
    AlumniAuditLog,
)


class AlumniMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniMembership
        fields = "__all__"


class AlumniEmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniEmployment
        fields = "__all__"


class AlumniAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniAchievement
        fields = "__all__"


class AlumniHigherEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniHigherEducation
        fields = "__all__"


class AlumniBusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniBusiness
        fields = "__all__"


class AlumniProfileSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)
    student_name = serializers.SerializerMethodField()
    department_name = serializers.CharField(source="student.department.name", read_only=True)
    program_name = serializers.CharField(source="student.program.name", read_only=True)
    memberships = AlumniMembershipSerializer(many=True, read_only=True)
    employments = AlumniEmploymentSerializer(many=True, read_only=True)
    achievements = AlumniAchievementSerializer(many=True, read_only=True)

    class Meta:
        model = AlumniProfile
        fields = [
            "id",
            "alumni_id",
            "student",
            "student_id_code",
            "student_name",
            "department_name",
            "program_name",
            "graduation_year",
            "current_status",
            "profile_photo",
            "bio",
            "visibility",
            "memberships",
            "employments",
            "achievements",
            "is_deleted",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        if obj.student and hasattr(obj.student, "profile"):
            return obj.student.profile.get_full_name()
        return "Alumni Student"


class MentorshipProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorshipProgram
        fields = "__all__"


class MentorAssignmentSerializer(serializers.ModelSerializer):
    mentor_alumni_id = serializers.CharField(source="mentor.alumni_id", read_only=True)
    mentee_student_id = serializers.CharField(source="mentee.student_id", read_only=True)

    class Meta:
        model = MentorAssignment
        fields = "__all__"


class AlumniEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniEvent
        fields = "__all__"


class EventRegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)
    alumni_id_code = serializers.CharField(source="alumni.alumni_id", read_only=True)

    class Meta:
        model = EventRegistration
        fields = "__all__"


class AlumniChapterSerializer(serializers.ModelSerializer):
    coordinator_name = serializers.SerializerMethodField()

    class Meta:
        model = AlumniChapter
        fields = "__all__"

    def get_coordinator_name(self, obj):
        if obj.coordinator:
            return obj.coordinator.get_full_name() or obj.coordinator.email
        return "T&P Coordinator"


class FundraisingCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundraisingCampaign
        fields = "__all__"


class DonationSerializer(serializers.ModelSerializer):
    donor_id_code = serializers.CharField(source="donor.alumni_id", read_only=True)
    campaign_name = serializers.CharField(source="campaign.campaign_name", read_only=True)

    class Meta:
        model = Donation
        fields = "__all__"


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = "__all__"


class CommunicationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunicationLog
        fields = "__all__"


class SuccessStorySerializer(serializers.ModelSerializer):
    alumni_id_code = serializers.CharField(source="alumni.alumni_id", read_only=True)

    class Meta:
        model = SuccessStory
        fields = "__all__"


class JobReferralSerializer(serializers.ModelSerializer):
    referrer_id_code = serializers.CharField(source="referrer.alumni_id", read_only=True)

    class Meta:
        model = JobReferral
        fields = "__all__"


class NetworkingRequestSerializer(serializers.ModelSerializer):
    requester_id_code = serializers.CharField(source="requester.alumni_id", read_only=True)
    receiver_id_code = serializers.CharField(source="receiver.alumni_id", read_only=True)

    class Meta:
        model = NetworkingRequest
        fields = "__all__"


class AlumniDirectorySerializer(serializers.ModelSerializer):
    alumni_detail = AlumniProfileSerializer(source="alumni", read_only=True)

    class Meta:
        model = AlumniDirectory
        fields = "__all__"


class AlumniAuditLogSerializer(serializers.ModelSerializer):
    performed_by_email = serializers.CharField(source="performed_by.email", read_only=True)

    class Meta:
        model = AlumniAuditLog
        fields = "__all__"
