from rest_framework import serializers
from apps.placement.models import (
    Company,
    CompanyContact,
    CampusDrive,
    DriveEligibility,
    StudentApplication,
    Shortlist,
    InterviewSchedule,
    InterviewRound,
    InterviewFeedback,
    OfferLetter,
    OfferAcceptance,
    Internship,
    InternshipEvaluation,
    PlacementRecord,
    PlacementStatistics,
    PlacementEvent,
    CareerCounselling,
    Resume,
    ResumeReview,
    MockInterview,
    PlacementAuditLog,
)


class CompanyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyContact
        fields = "__all__"


class CompanySerializer(serializers.ModelSerializer):
    contacts = CompanyContactSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = [
            "id",
            "company_code",
            "company_name",
            "industry",
            "website",
            "email",
            "phone",
            "address",
            "package_range",
            "status",
            "contacts",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class DriveEligibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveEligibility
        fields = "__all__"


class CampusDriveSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.company_name", read_only=True)
    eligibility = DriveEligibilitySerializer(read_only=True)

    class Meta:
        model = CampusDrive
        fields = [
            "id",
            "drive_code",
            "company",
            "company_name",
            "campus",
            "job_role",
            "ctc",
            "location",
            "mode",
            "registration_start",
            "registration_end",
            "drive_date",
            "status",
            "description",
            "eligibility",
            "is_deleted",
            "created_at",
        ]


class ResumeSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)

    class Meta:
        model = Resume
        fields = [
            "id",
            "student",
            "student_id_code",
            "version",
            "skills",
            "projects",
            "certifications",
            "approval_status",
            "created_at",
        ]


class StudentApplicationSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)
    student_name = serializers.SerializerMethodField()
    drive_code = serializers.CharField(source="campus_drive.drive_code", read_only=True)
    job_role = serializers.CharField(source="campus_drive.job_role", read_only=True)
    company_name = serializers.CharField(source="campus_drive.company.company_name", read_only=True)

    class Meta:
        model = StudentApplication
        fields = [
            "id",
            "student",
            "student_id_code",
            "student_name",
            "campus_drive",
            "drive_code",
            "job_role",
            "company_name",
            "resume",
            "status",
            "applied_date",
        ]

    def get_student_name(self, obj):
        if obj.student and hasattr(obj.student, "profile"):
            return obj.student.profile.get_full_name()
        return "Student"


class ShortlistSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)

    class Meta:
        model = Shortlist
        fields = "__all__"


class InterviewScheduleSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)
    drive_code = serializers.CharField(source="drive.drive_code", read_only=True)
    company_name = serializers.CharField(source="drive.company.company_name", read_only=True)

    class Meta:
        model = InterviewSchedule
        fields = "__all__"


class InterviewRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewRound
        fields = "__all__"


class InterviewFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewFeedback
        fields = "__all__"


class OfferAcceptanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferAcceptance
        fields = "__all__"


class OfferLetterSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.company_name", read_only=True)
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)
    student_name = serializers.SerializerMethodField()
    acceptance = OfferAcceptanceSerializer(read_only=True)

    class Meta:
        model = OfferLetter
        fields = [
            "id",
            "offer_number",
            "company",
            "company_name",
            "student",
            "student_id_code",
            "student_name",
            "campus_drive",
            "package",
            "joining_date",
            "offer_status",
            "document_url",
            "acceptance",
            "created_at",
        ]

    def get_student_name(self, obj):
        if obj.student and hasattr(obj.student, "profile"):
            return obj.student.profile.get_full_name()
        return "Student"


class InternshipEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipEvaluation
        fields = "__all__"


class InternshipSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.company_name", read_only=True)
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)
    evaluation = InternshipEvaluationSerializer(read_only=True)

    class Meta:
        model = Internship
        fields = [
            "id",
            "student",
            "student_id_code",
            "company",
            "company_name",
            "title",
            "mentor",
            "start_date",
            "end_date",
            "duration",
            "stipend",
            "status",
            "evaluation",
        ]


class PlacementRecordSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.company_name", read_only=True)
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)

    class Meta:
        model = PlacementRecord
        fields = "__all__"


class PlacementStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStatistics
        fields = "__all__"


class PlacementEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementEvent
        fields = "__all__"


class CareerCounsellingSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)

    class Meta:
        model = CareerCounselling
        fields = "__all__"


class ResumeReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeReview
        fields = "__all__"


class MockInterviewSerializer(serializers.ModelSerializer):
    student_id_code = serializers.CharField(source="student.student_id", read_only=True)

    class Meta:
        model = MockInterview
        fields = "__all__"


class PlacementAuditLogSerializer(serializers.ModelSerializer):
    performed_by_email = serializers.CharField(source="performed_by.email", read_only=True)

    class Meta:
        model = PlacementAuditLog
        fields = "__all__"
