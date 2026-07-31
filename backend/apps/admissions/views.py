from django.db.models import Count, Q
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.models import User

from .models import AdmissionApplication, AdmissionDocument, SeatMatrix
from .serializers import (
    AdmissionApplicationSerializer,
    AdmissionAuditLogSerializer,
    AdmissionDocumentSerializer,
    ApplicationWorkflowTransitionSerializer,
    CreateAdmissionApplicationSerializer,
    DocumentReviewSerializer,
    SeatMatrixSerializer,
)
from .services import (
    approve_application,
    create_application,
    enroll_application,
    reject_application,
    restore_application,
    review_document,
    soft_delete_application,
    submit_application,
    transition_application,
)


class AdmissionApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Admission Applications.
    Supports CRUD, state transitions (submit, approve, reject, transition),
    enrollment, bulk actions (approve, reject, assign reviewer), and audit history.
    """

    queryset = (
        AdmissionApplication.objects.all()
        .select_related("academic_session", "program", "department", "reviewer", "enrolled_student")
        .prefetch_related("status_history", "documents", "audit_logs")
    )
    permission_classes = [IsAuthenticated]
    search_fields = ["application_number", "first_name", "last_name", "email", "mobile"]
    filterset_fields = ["status", "category", "program", "department", "academic_session", "application_source"]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateAdmissionApplicationSerializer
        return AdmissionApplicationSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateAdmissionApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            application = create_application(serializer.validated_data, actor=request.user, request=request)
            return Response(AdmissionApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        soft_delete_application(instance, actor=self.request.user, request=self.request)

    # ------------------------------------------------------------------
    # State transitions
    # ------------------------------------------------------------------

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        app = self.get_object()
        updated = submit_application(app, actor=request.user, request=request)
        return Response(AdmissionApplicationSerializer(updated).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        app = self.get_object()
        remarks = request.data.get("remarks", "")
        updated = approve_application(app, actor=request.user, remarks=remarks, request=request)
        return Response(AdmissionApplicationSerializer(updated).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        app = self.get_object()
        remarks = request.data.get("remarks", "")
        updated = reject_application(app, actor=request.user, remarks=remarks, request=request)
        return Response(AdmissionApplicationSerializer(updated).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="transition")
    def transition_state(self, request, pk=None):
        app = self.get_object()
        serializer = ApplicationWorkflowTransitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data["status"]
        remarks = serializer.validated_data.get("remarks", "")

        try:
            updated = transition_application(
                app, new_status, actor=request.user, remarks=remarks, request=request
            )
            return Response(AdmissionApplicationSerializer(updated).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    # ------------------------------------------------------------------
    # Enrollment Pipeline
    # ------------------------------------------------------------------

    @action(detail=True, methods=["post"])
    def enroll(self, request, pk=None):
        app = self.get_object()
        try:
            student = enroll_application(app, actor=request.user, request=request)
            return Response(
                {
                    "detail": "Application successfully enrolled.",
                    "student_id": student.student_id,
                    "student_pk": str(student.id),
                    "application": AdmissionApplicationSerializer(app).data,
                },
                status=status.HTTP_200_OK,
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def rollback(self, request, pk=None):
        app = self.get_object()
        target_status = request.data.get("target_status")
        remarks = request.data.get("remarks", "")
        if not target_status:
            return Response({"detail": "target_status is required for rollback."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from .services import rollback_application
            updated = rollback_application(app, target_status, actor=request.user, remarks=remarks, request=request)
            return Response(AdmissionApplicationSerializer(updated).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        app = AdmissionApplication.all_objects.get(pk=pk)
        restored = restore_application(app, actor=request.user, request=request)
        return Response(AdmissionApplicationSerializer(restored).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        app = self.get_object()
        logs = app.audit_logs.all()
        return Response(AdmissionAuditLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # Bulk Admin Actions
    # ------------------------------------------------------------------

    @action(detail=False, methods=["post"], url_path="bulk-approve")
    def bulk_approve(self, request):
        ids = request.data.get("ids", [])
        remarks = request.data.get("remarks", "Bulk approved")
        approved_count = 0
        errors = []

        for app_id in ids:
            try:
                app = AdmissionApplication.objects.get(id=app_id)
                approve_application(app, actor=request.user, remarks=remarks, request=request)
                approved_count += 1
            except Exception as exc:
                errors.append({"id": app_id, "error": str(exc)})

        return Response(
            {"detail": f"Approved {approved_count} applications.", "errors": errors},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="bulk-reject")
    def bulk_reject(self, request):
        ids = request.data.get("ids", [])
        remarks = request.data.get("remarks", "Bulk rejected")
        rejected_count = 0
        errors = []

        for app_id in ids:
            try:
                app = AdmissionApplication.objects.get(id=app_id)
                reject_application(app, actor=request.user, remarks=remarks, request=request)
                rejected_count += 1
            except Exception as exc:
                errors.append({"id": app_id, "error": str(exc)})

        return Response(
            {"detail": f"Rejected {rejected_count} applications.", "errors": errors},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="assign-reviewer")
    def assign_reviewer(self, request):
        ids = request.data.get("ids", [])
        reviewer_id = request.data.get("reviewer_id")

        if not reviewer_id:
            return Response({"detail": "reviewer_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reviewer = User.objects.get(id=reviewer_id)
        except User.DoesNotExist:
            return Response({"detail": "Reviewer user not found."}, status=status.HTTP_404_NOT_FOUND)

        updated_count = AdmissionApplication.objects.filter(id__in=ids).update(reviewer=reviewer)
        return Response(
            {"detail": f"Assigned {reviewer.get_full_name()} as reviewer for {updated_count} applications."},
            status=status.HTTP_200_OK,
        )


class AdmissionDocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for uploading and reviewing admission documents.
    """

    queryset = AdmissionDocument.objects.all().select_related("application", "reviewed_by")
    serializer_class = AdmissionDocumentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["application", "document_type", "review_status"]

    @action(detail=True, methods=["post"])
    def review(self, request, pk=None):
        document = self.get_object()
        serializer = DocumentReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        status_val = serializer.validated_data["status"]
        remarks = serializer.validated_data.get("remarks", "")

        updated = review_document(
            document, status_val, actor=request.user, remarks=remarks, request=request
        )
        return Response(AdmissionDocumentSerializer(updated).data, status=status.HTTP_200_OK)


class SeatMatrixViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Seat Matrices.
    """

    queryset = SeatMatrix.objects.all().select_related("program", "academic_session")
    serializer_class = SeatMatrixSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["program", "academic_session", "category"]


class AdmissionDashboardView(generics.GenericAPIView):
    """
    Dashboard metrics endpoint for Admissions Officers and Admins.
    GET /api/admissions/dashboard/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_apps = AdmissionApplication.objects.count()
        status_counts = (
            AdmissionApplication.objects.values("status")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        program_breakdown = (
            AdmissionApplication.objects.values("program__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        pending_documents = AdmissionDocument.objects.filter(review_status="pending").count()

        total_seats = sum(sm.total_seats for sm in SeatMatrix.objects.all())
        occupied_seats = sum(sm.occupied_seats for sm in SeatMatrix.objects.all())

        return Response(
            {
                "total_applications": total_apps,
                "status_breakdown": list(status_counts),
                "program_breakdown": list(program_breakdown),
                "pending_documents": pending_documents,
                "total_seats": total_seats,
                "occupied_seats": occupied_seats,
                "available_seats": max(total_seats - occupied_seats, 0),
            },
            status=status.HTTP_200_OK,
        )
