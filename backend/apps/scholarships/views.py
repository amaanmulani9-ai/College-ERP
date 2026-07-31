import logging

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    Scholarship,
    ScholarshipApplication,
    ScholarshipAuditLog,
    ScholarshipRenewal,
    ScholarshipType,
)
from .permissions import IsScholarshipOfficerOrAdmin, IsStudentOrScholarshipOfficer
from .serializers import (
    ApplyScholarshipRequestSerializer,
    ApproveApplicationRequestSerializer,
    RejectApplicationRequestSerializer,
    RenewScholarshipRequestSerializer,
    ScholarshipApplicationSerializer,
    ScholarshipAuditLogSerializer,
    ScholarshipRenewalSerializer,
    ScholarshipSerializer,
    ScholarshipTypeSerializer,
)
from .services import ScholarshipService

logger = logging.getLogger(__name__)


class ScholarshipTypeViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipType.objects.all()
    serializer_class = ScholarshipTypeSerializer
    permission_classes = [IsScholarshipOfficerOrAdmin]
    filterset_fields = ["provider", "is_active"]
    search_fields = ["name", "code"]


class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = Scholarship.objects.all().select_related("student", "scholarship_type", "academic_session")
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "scholarship_type", "academic_session", "student"]
    search_fields = ["student__student_id", "scholarship_type__code"]

    @action(detail=False, methods=["get"], url_path="student/(?P<student_id>[^/.]+)", permission_classes=[IsStudentOrScholarshipOfficer])
    def student_scholarships(self, request, student_id=None):
        """Get active & past scholarships for a given student."""
        data = ScholarshipService.student_scholarships(student_id)
        return Response(data, status=status.HTTP_200_OK)


class ScholarshipApplicationViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipApplication.objects.all().select_related("student", "scholarship_type", "academic_session", "approved_by")
    serializer_class = ScholarshipApplicationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "scholarship_type", "academic_session", "student"]
    search_fields = ["student__student_id", "scholarship_type__name"]

    def get_permissions(self):
        if self.action in ["approve", "reject"]:
            return [IsScholarshipOfficerOrAdmin()]
        return super().get_permissions()

    @action(detail=False, methods=["post"], url_path="apply", permission_classes=[IsAuthenticated])
    def apply(self, request):
        """Submit scholarship application."""
        serializer = ApplyScholarshipRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            app = ScholarshipService.apply(
                student_id=str(d["student_id"]),
                scholarship_type_id=str(d["scholarship_type_id"]),
                academic_session_id=str(d["academic_session_id"]),
                requested_amount=d["requested_amount"],
                family_annual_income=d.get("family_annual_income"),
                current_cgpa=d.get("current_cgpa", 0.0),
                documents=d.get("documents", {}),
                statement_of_purpose=d.get("statement_of_purpose", ""),
                actor=request.user,
            )
            return Response(ScholarshipApplicationSerializer(app).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="approve", permission_classes=[IsScholarshipOfficerOrAdmin])
    def approve(self, request):
        """Approve scholarship application & auto-update StudentFee."""
        serializer = ApproveApplicationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            sch = ScholarshipService.approve(
                application_id=str(d["application_id"]),
                approved_amount=d.get("approved_amount"),
                percentage=d.get("percentage", 0.0),
                actor=request.user,
            )
            return Response(ScholarshipSerializer(sch).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="reject", permission_classes=[IsScholarshipOfficerOrAdmin])
    def reject(self, request):
        """Reject scholarship application."""
        serializer = RejectApplicationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            app = ScholarshipService.reject(
                application_id=str(d["application_id"]),
                reason=d["reason"],
                actor=request.user,
            )
            return Response(ScholarshipApplicationSerializer(app).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ScholarshipRenewalViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipRenewal.objects.all().select_related("scholarship__scholarship_type", "academic_session", "processed_by")
    serializer_class = ScholarshipRenewalSerializer
    permission_classes = [IsScholarshipOfficerOrAdmin]
    filterset_fields = ["status", "academic_session", "scholarship"]

    @action(detail=False, methods=["post"], url_path="renew", permission_classes=[IsScholarshipOfficerOrAdmin])
    def renew(self, request):
        """Renew scholarship for a new academic session."""
        serializer = RenewScholarshipRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            ren = ScholarshipService.renew(
                scholarship_id=str(d["scholarship_id"]),
                new_academic_session_id=str(d["new_academic_session_id"]),
                remarks=d.get("remarks", ""),
                actor=request.user,
            )
            return Response(ScholarshipRenewalSerializer(ren).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ScholarshipAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ScholarshipAuditLog.objects.all().select_related("student", "scholarship", "application", "actor")
    serializer_class = ScholarshipAuditLogSerializer
    permission_classes = [IsScholarshipOfficerOrAdmin]
    filterset_fields = ["event_type", "student"]
    search_fields = ["description", "student__student_id"]
