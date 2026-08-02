from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.hr.models import (
    Department,
    Designation,
    EmploymentType,
    LeaveType,
    LeaveBalance,
    LeaveRequest,
    HolidayCalendar,
    Shift,
    EmployeeShiftAssignment,
    AttendancePolicy,
    RecruitmentJob,
    JobApplication,
    Interview,
    OfferLetter,
    EmployeeOnboarding,
    EmployeeDocument,
    PerformanceReview,
    PerformanceGoal,
    TrainingProgram,
    TrainingEnrollment,
    Promotion,
    Transfer,
    Resignation,
    ExitInterview,
    DisciplinaryAction,
    HRAnnouncement,
    HRAuditLog,
)
from apps.hr.serializers import (
    DepartmentSerializer,
    DesignationSerializer,
    EmploymentTypeSerializer,
    LeaveTypeSerializer,
    LeaveBalanceSerializer,
    LeaveRequestSerializer,
    HolidayCalendarSerializer,
    ShiftSerializer,
    RecruitmentJobSerializer,
    JobApplicationSerializer,
    OfferLetterSerializer,
    EmployeeOnboardingSerializer,
    PerformanceReviewSerializer,
    TrainingProgramSerializer,
    TrainingEnrollmentSerializer,
    PromotionSerializer,
    TransferSerializer,
    ResignationSerializer,
    DisciplinaryActionSerializer,
    HRAnnouncementSerializer,
    HRAuditLogSerializer,
)
from apps.hr.services.hr_service import HRService
from apps.hr.permissions import IsHRAdminOrManager


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.filter(is_deleted=False)
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class LeaveBalanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAuthenticated]


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        leave_req = HRService.approve_leave_request(pk, approved_by=request.user)
        return Response(LeaveRequestSerializer(leave_req).data)


class RecruitmentJobViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentJob.objects.all()
    serializer_class = RecruitmentJobSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class OfferLetterViewSet(viewsets.ModelViewSet):
    queryset = OfferLetter.objects.all()
    serializer_class = OfferLetterSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class EmployeeOnboardingViewSet(viewsets.ModelViewSet):
    queryset = EmployeeOnboarding.objects.all()
    serializer_class = EmployeeOnboardingSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class TrainingProgramViewSet(viewsets.ModelViewSet):
    queryset = TrainingProgram.objects.all()
    serializer_class = TrainingProgramSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class TrainingEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = TrainingEnrollment.objects.all()
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class ResignationViewSet(viewsets.ModelViewSet):
    queryset = Resignation.objects.all()
    serializer_class = ResignationSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class DisciplinaryActionViewSet(viewsets.ModelViewSet):
    queryset = DisciplinaryAction.objects.all()
    serializer_class = DisciplinaryActionSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


class HRAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = HRAnnouncement.objects.all()
    serializer_class = HRAnnouncementSerializer
    permission_classes = [IsAuthenticated]


class HRAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HRAuditLog.objects.all()
    serializer_class = HRAuditLogSerializer
    permission_classes = [IsAuthenticated, IsHRAdminOrManager]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def hr_dashboard_kpis(request):
    kpis = HRService.get_hr_dashboard_kpis()
    return Response(kpis, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsHRAdminOrManager])
def hr_reports(request):
    report_type = request.query_params.get("type", "general")
    if report_type == "leave":
        leaves = LeaveRequest.objects.all()
        return Response(LeaveRequestSerializer(leaves, many=True).data)
    elif report_type == "recruitment":
        jobs = RecruitmentJob.objects.all()
        return Response(RecruitmentJobSerializer(jobs, many=True).data)
    elif report_type == "promotions":
        promotions = Promotion.objects.all()
        return Response(PromotionSerializer(promotions, many=True).data)
    else:
        depts = Department.objects.filter(is_deleted=False)
        return Response(DepartmentSerializer(depts, many=True).data)
