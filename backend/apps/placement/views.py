import decimal
from django.db.models import Sum, Count, Avg, Max
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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
from apps.placement.serializers import (
    CompanySerializer,
    CompanyContactSerializer,
    CampusDriveSerializer,
    DriveEligibilitySerializer,
    StudentApplicationSerializer,
    ShortlistSerializer,
    InterviewScheduleSerializer,
    InterviewRoundSerializer,
    InterviewFeedbackSerializer,
    OfferLetterSerializer,
    OfferAcceptanceSerializer,
    InternshipSerializer,
    InternshipEvaluationSerializer,
    PlacementRecordSerializer,
    PlacementStatisticsSerializer,
    PlacementEventSerializer,
    CareerCounsellingSerializer,
    ResumeSerializer,
    ResumeReviewSerializer,
    MockInterviewSerializer,
    PlacementAuditLogSerializer,
)
from apps.placement.services.placement_service import PlacementService
from apps.placement.permissions import IsPlacementOfficerOrAdmin


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.filter(is_deleted=False)
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]
    filterset_fields = ["status", "industry"]
    search_fields = ["company_code", "company_name", "industry"]

    def perform_create(self, serializer):
        company = PlacementService.register_company(
            data=serializer.validated_data,
            performed_by=self.request.user
        )
        serializer.instance = company

    def perform_destroy(self, instance):
        PlacementService.soft_delete_company(company_id=instance.id, performed_by=self.request.user)


class CompanyContactViewSet(viewsets.ModelViewSet):
    queryset = CompanyContact.objects.all()
    serializer_class = CompanyContactSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class CampusDriveViewSet(viewsets.ModelViewSet):
    queryset = CampusDrive.objects.filter(is_deleted=False)
    serializer_class = CampusDriveSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]
    filterset_fields = ["status", "mode", "company"]
    search_fields = ["drive_code", "job_role"]

    def perform_create(self, serializer):
        drive = PlacementService.create_campus_drive(
            data=serializer.validated_data,
            performed_by=self.request.user
        )
        serializer.instance = drive

    @action(detail=True, methods=["get", "post"])
    def check_eligibility(self, request, pk=None):
        student_id = request.data.get("student_id") or request.query_params.get("student_id")
        if not student_id:
            return Response({"error": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        is_eligible, reason = PlacementService.check_eligibility(student_id, pk)
        return Response({"is_eligible": is_eligible, "reason": reason})

    @action(detail=True, methods=["post"])
    def apply(self, request, pk=None):
        student_id = request.data.get("student_id")
        resume_id = request.data.get("resume_id")
        if not student_id:
            return Response({"error": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            app = PlacementService.apply_for_drive(
                student_id=student_id,
                drive_id=pk,
                resume_id=resume_id,
                performed_by=request.user
            )
            return Response(StudentApplicationSerializer(app).data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def shortlist(self, request, pk=None):
        student_ids = request.data.get("student_ids", [])
        round_no = request.data.get("round_number", 1)
        shortlists = PlacementService.shortlist_students(
            drive_id=pk,
            student_ids=student_ids,
            round_number=round_no,
            performed_by=request.user
        )
        return Response(ShortlistSerializer(shortlists, many=True).data, status=status.HTTP_200_OK)


class DriveEligibilityViewSet(viewsets.ModelViewSet):
    queryset = DriveEligibility.objects.all()
    serializer_class = DriveEligibilitySerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class StudentApplicationViewSet(viewsets.ModelViewSet):
    queryset = StudentApplication.objects.all()
    serializer_class = StudentApplicationSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]
    filterset_fields = ["status", "campus_drive", "student"]


class ShortlistViewSet(viewsets.ModelViewSet):
    queryset = Shortlist.objects.all()
    serializer_class = ShortlistSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class InterviewScheduleViewSet(viewsets.ModelViewSet):
    queryset = InterviewSchedule.objects.all()
    serializer_class = InterviewScheduleSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]
    filterset_fields = ["mode", "drive", "student"]

    def perform_create(self, serializer):
        interview = PlacementService.schedule_interview(
            data=serializer.validated_data,
            performed_by=self.request.user
        )
        serializer.instance = interview


class InterviewRoundViewSet(viewsets.ModelViewSet):
    queryset = InterviewRound.objects.all()
    serializer_class = InterviewRoundSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class InterviewFeedbackViewSet(viewsets.ModelViewSet):
    queryset = InterviewFeedback.objects.all()
    serializer_class = InterviewFeedbackSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class OfferLetterViewSet(viewsets.ModelViewSet):
    queryset = OfferLetter.objects.all()
    serializer_class = OfferLetterSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]
    filterset_fields = ["offer_status", "company", "student"]

    def perform_create(self, serializer):
        offer = PlacementService.issue_offer(
            data=serializer.validated_data,
            performed_by=self.request.user
        )
        serializer.instance = offer

    @action(detail=True, methods=["post"])
    def respond(self, request, pk=None):
        resp_status = request.data.get("status", "Accepted")
        remarks = request.data.get("remarks", "")
        acceptance = PlacementService.respond_to_offer(
            offer_id=pk,
            status=resp_status,
            remarks=remarks,
            performed_by=request.user
        )
        return Response(OfferAcceptanceSerializer(acceptance).data)


class OfferAcceptanceViewSet(viewsets.ModelViewSet):
    queryset = OfferAcceptance.objects.all()
    serializer_class = OfferAcceptanceSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class InternshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]
    filterset_fields = ["status", "company", "student"]

    def perform_create(self, serializer):
        internship = PlacementService.register_internship(
            data=serializer.validated_data,
            performed_by=self.request.user
        )
        serializer.instance = internship


class InternshipEvaluationViewSet(viewsets.ModelViewSet):
    queryset = InternshipEvaluation.objects.all()
    serializer_class = InternshipEvaluationSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class PlacementRecordViewSet(viewsets.ModelViewSet):
    queryset = PlacementRecord.objects.all()
    serializer_class = PlacementRecordSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class PlacementStatisticsViewSet(viewsets.ModelViewSet):
    queryset = PlacementStatistics.objects.all()
    serializer_class = PlacementStatisticsSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]

    @action(detail=False, methods=["post"])
    def compute(self, request):
        year = request.data.get("academic_year", "2025-2026")
        stats = PlacementService.compute_placement_statistics(academic_year=year)
        return Response(PlacementStatisticsSerializer(stats).data)


class PlacementEventViewSet(viewsets.ModelViewSet):
    queryset = PlacementEvent.objects.all()
    serializer_class = PlacementEventSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class CareerCounsellingViewSet(viewsets.ModelViewSet):
    queryset = CareerCounselling.objects.all()
    serializer_class = CareerCounsellingSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class ResumeReviewViewSet(viewsets.ModelViewSet):
    queryset = ResumeReview.objects.all()
    serializer_class = ResumeReviewSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class MockInterviewViewSet(viewsets.ModelViewSet):
    queryset = MockInterview.objects.all()
    serializer_class = MockInterviewSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


class PlacementAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlacementAuditLog.objects.all()
    serializer_class = PlacementAuditLogSerializer
    permission_classes = [IsAuthenticated, IsPlacementOfficerOrAdmin]


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPlacementOfficerOrAdmin])
def placement_dashboard_kpis(request):
    """Returns Key Performance Indicators for Enterprise Placement System."""
    companies_count = Company.objects.filter(is_deleted=False).count()
    active_drives = CampusDrive.objects.filter(is_deleted=False, status__in=["Upcoming", "Registration Open", "In Progress"]).count()
    total_applications = StudentApplication.objects.count()
    selected_students = StudentApplication.objects.filter(status="Selected").values("student").distinct().count()
    
    placed_records = PlacementRecord.objects.all()
    highest_ctc = placed_records.aggregate(m=Max("package"))["m"] or decimal.Decimal("0.00")
    avg_ctc = placed_records.aggregate(a=Avg("package"))["a"] or decimal.Decimal("0.00")
    internships_count = Internship.objects.count()

    total_eligible = 450 # Default baseline pool of final year students
    placement_pct = round((selected_students / total_eligible) * 100, 1) if total_eligible > 0 else 0.0

    return Response({
        "registered_companies": companies_count,
        "active_campus_drives": active_drives,
        "eligible_students": total_eligible,
        "total_applications": total_applications,
        "selected_students": selected_students,
        "placement_percentage": placement_pct,
        "highest_package": float(highest_ctc),
        "average_package": float(avg_ctc),
        "total_internships": internships_count,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPlacementOfficerOrAdmin])
def placement_reports(request):
    """Generates structured data for Placement Reports suite."""
    report_type = request.query_params.get("type", "placement_report")

    if report_type == "company_report":
        data = list(
            Company.objects.filter(is_deleted=False)
            .values("industry")
            .annotate(company_count=Count("id"))
        )
    elif report_type == "package_analysis":
        data = list(
            PlacementRecord.objects.values("company__company_name")
            .annotate(max_pkg=Max("package"), avg_pkg=Avg("package"), count=Count("id"))
        )
    elif report_type == "internship_report":
        data = list(
            Internship.objects.values("status")
            .annotate(count=Count("id"), avg_stipend=Avg("stipend"))
        )
    elif report_type == "offer_report":
        data = list(
            OfferLetter.objects.values("offer_status")
            .annotate(count=Count("id"), total_value=Sum("package"))
        )
    else: # placement_report
        data = PlacementRecordSerializer(PlacementRecord.objects.all()[:50], many=True).data

    return Response({
        "report_type": report_type,
        "data": data
    })
