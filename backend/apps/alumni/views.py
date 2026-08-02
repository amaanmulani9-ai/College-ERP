import decimal
from django.db.models import Sum, Count, Avg, Max
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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
from apps.alumni.serializers import (
    AlumniProfileSerializer,
    AlumniMembershipSerializer,
    AlumniEmploymentSerializer,
    AlumniAchievementSerializer,
    AlumniHigherEducationSerializer,
    AlumniBusinessSerializer,
    MentorshipProgramSerializer,
    MentorAssignmentSerializer,
    AlumniEventSerializer,
    EventRegistrationSerializer,
    AlumniChapterSerializer,
    DonationSerializer,
    FundraisingCampaignSerializer,
    NewsletterSerializer,
    CommunicationLogSerializer,
    SuccessStorySerializer,
    JobReferralSerializer,
    NetworkingRequestSerializer,
    AlumniDirectorySerializer,
    AlumniAuditLogSerializer,
)
from apps.alumni.services.alumni_service import AlumniService
from apps.alumni.permissions import IsAlumniAdminOrCoordinator


class AlumniProfileViewSet(viewsets.ModelViewSet):
    queryset = AlumniProfile.objects.filter(is_deleted=False)
    serializer_class = AlumniProfileSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]
    filterset_fields = ["graduation_year", "current_status", "visibility"]
    search_fields = ["alumni_id", "student__student_id", "student__profile__first_name", "student__profile__last_name"]

    def perform_create(self, serializer):
        profile = AlumniService.register_alumni(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = profile

    def perform_destroy(self, instance):
        AlumniService.soft_delete_alumni(alumni_id=instance.id, performed_by=self.request.user)


class AlumniMembershipViewSet(viewsets.ModelViewSet):
    queryset = AlumniMembership.objects.all()
    serializer_class = AlumniMembershipSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]
    filterset_fields = ["membership_type", "status"]

    @action(detail=True, methods=["post"])
    def renew(self, request, pk=None):
        mem_type = request.data.get("membership_type", "Premium")
        status_val = request.data.get("status", "Active")
        membership = AlumniService.manage_membership(
            alumni_id=pk,
            membership_type=mem_type,
            status=status_val,
            performed_by=request.user
        )
        return Response(AlumniMembershipSerializer(membership).data)


class AlumniEmploymentViewSet(viewsets.ModelViewSet):
    queryset = AlumniEmployment.objects.all()
    serializer_class = AlumniEmploymentSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]
    filterset_fields = ["is_current", "employment_status", "industry"]
    search_fields = ["company", "designation", "location"]

    def perform_create(self, serializer):
        emp = AlumniService.track_employment(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = emp


class AlumniAchievementViewSet(viewsets.ModelViewSet):
    queryset = AlumniAchievement.objects.all()
    serializer_class = AlumniAchievementSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]
    filterset_fields = ["category"]


class AlumniHigherEducationViewSet(viewsets.ModelViewSet):
    queryset = AlumniHigherEducation.objects.all()
    serializer_class = AlumniHigherEducationSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


class AlumniBusinessViewSet(viewsets.ModelViewSet):
    queryset = AlumniBusiness.objects.all()
    serializer_class = AlumniBusinessSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


class MentorshipProgramViewSet(viewsets.ModelViewSet):
    queryset = MentorshipProgram.objects.all()
    serializer_class = MentorshipProgramSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


class MentorAssignmentViewSet(viewsets.ModelViewSet):
    queryset = MentorAssignment.objects.all()
    serializer_class = MentorAssignmentSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]

    def perform_create(self, serializer):
        assignment = AlumniService.assign_mentor(
            program_id=self.request.data["program"],
            mentor_alumni_id=self.request.data["mentor"],
            mentee_student_id=self.request.data["mentee"],
            performed_by=self.request.user
        )
        serializer.instance = assignment


class AlumniEventViewSet(viewsets.ModelViewSet):
    queryset = AlumniEvent.objects.all()
    serializer_class = AlumniEventSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]
    filterset_fields = ["status", "type"]
    search_fields = ["event_code", "title", "venue"]


class EventRegistrationViewSet(viewsets.ModelViewSet):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]

    def perform_create(self, serializer):
        reg = AlumniService.register_event(
            event_id=self.request.data["event"],
            alumni_id=self.request.data["alumni"],
            performed_by=self.request.user
        )
        serializer.instance = reg


class AlumniChapterViewSet(viewsets.ModelViewSet):
    queryset = AlumniChapter.objects.all()
    serializer_class = AlumniChapterSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


class FundraisingCampaignViewSet(viewsets.ModelViewSet):
    queryset = FundraisingCampaign.objects.all()
    serializer_class = FundraisingCampaignSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]
    filterset_fields = ["payment_status", "campaign"]

    def perform_create(self, serializer):
        donation = AlumniService.process_donation(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = donation


class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        newsletter = Newsletter.objects.get(id=pk)
        newsletter.status = "Published"
        newsletter.save()
        AlumniService.log_audit(f"PUBLISH_NEWSLETTER: {newsletter.title}", performed_by=request.user)
        return Response(NewsletterSerializer(newsletter).data)


class CommunicationLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CommunicationLog.objects.all()
    serializer_class = CommunicationLogSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


class SuccessStoryViewSet(viewsets.ModelViewSet):
    queryset = SuccessStory.objects.all()
    serializer_class = SuccessStorySerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]

    def perform_create(self, serializer):
        story = AlumniService.submit_success_story(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = story


class JobReferralViewSet(viewsets.ModelViewSet):
    queryset = JobReferral.objects.all()
    serializer_class = JobReferralSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]

    def perform_create(self, serializer):
        ref = AlumniService.create_job_referral(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = ref


class NetworkingRequestViewSet(viewsets.ModelViewSet):
    queryset = NetworkingRequest.objects.all()
    serializer_class = NetworkingRequestSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]

    @action(detail=True, methods=["post"])
    def respond(self, request, pk=None):
        req_obj = NetworkingRequest.objects.get(id=pk)
        req_obj.status = request.data.get("status", "Accepted")
        req_obj.save()
        return Response(NetworkingRequestSerializer(req_obj).data)


class AlumniDirectoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AlumniDirectory.objects.all()
    serializer_class = AlumniDirectorySerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


class AlumniAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AlumniAuditLog.objects.all()
    serializer_class = AlumniAuditLogSerializer
    permission_classes = [IsAuthenticated, IsAlumniAdminOrCoordinator]


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAlumniAdminOrCoordinator])
def alumni_dashboard_kpis(request):
    """Returns Key Performance Indicators for Enterprise Alumni System."""
    kpis = AlumniService.compute_dashboard_kpis()
    return Response(kpis)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAlumniAdminOrCoordinator])
def alumni_reports(request):
    """Generates structured data for Alumni Reports suite."""
    report_type = request.query_params.get("type", "alumni_report")

    if report_type == "employment_report":
        data = list(
            AlumniEmployment.objects.values("industry")
            .annotate(count=Count("id"))
        )
    elif report_type == "donation_report":
        data = list(
            Donation.objects.values("payment_status")
            .annotate(total_amount=Sum("amount"), count=Count("id"))
        )
    elif report_type == "event_report":
        data = list(
            AlumniEvent.objects.values("type")
            .annotate(event_count=Count("id"))
        )
    elif report_type == "mentorship_report":
        data = list(
            MentorAssignment.objects.values("status")
            .annotate(count=Count("id"))
        )
    elif report_type == "chapter_report":
        data = list(
            AlumniChapter.objects.values("country")
            .annotate(chapter_count=Count("id"))
        )
    elif report_type == "job_referral_report":
        data = list(
            JobReferral.objects.values("company")
            .annotate(total_openings=Sum("openings"), count=Count("id"))
        )
    else: # alumni_report
        data = AlumniProfileSerializer(AlumniProfile.objects.filter(is_deleted=False)[:50], many=True).data

    return Response({
        "report_type": report_type,
        "data": data
    })
