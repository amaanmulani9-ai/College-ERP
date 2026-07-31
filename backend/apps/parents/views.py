from django.db.models import Count, Q
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.models import User
from apps.profiles.models import UserProfile
from apps.students.models import Student

from .models import Parent, ParentDocument, StudentParentLink
from .serializers import (
    CreateParentSerializer,
    DocumentReviewSerializer,
    LinkStudentSerializer,
    ParentActivityLogSerializer,
    ParentDocumentSerializer,
    ParentSerializer,
    StudentParentLinkSerializer,
)
from .services import (
    create_parent,
    link_student_to_parent,
    restore_parent,
    soft_delete_parent,
    unlink_student_from_parent,
    verify_parent,
)


class ParentViewSet(viewsets.ModelViewSet):
    """
    CRUD + lifecycle actions for Parent/Guardian records.

    GET    /api/parents/              — list all parents
    POST   /api/parents/              — create parent with new user account
    GET    /api/parents/{id}/         — retrieve parent detail
    PUT    /api/parents/{id}/         — update parent
    DELETE /api/parents/{id}/         — soft delete
    POST   /api/parents/{id}/verify/  — mark verified
    POST   /api/parents/{id}/restore/ — restore soft-deleted
    POST   /api/parents/{id}/link-student/   — link a student
    DELETE /api/parents/{id}/unlink-student/ — remove student link
    GET    /api/parents/{id}/activity-log/   — audit trail
    """

    queryset = (
        Parent.objects.all()
        .select_related("profile", "profile__user", "profile__contact", "verified_by")
        .prefetch_related("student_links__student", "documents", "communication_preferences")
    )
    permission_classes = [IsAuthenticated]
    search_fields = [
        "parent_code",
        "profile__first_name",
        "profile__last_name",
        "profile__user__email",
        "occupation",
    ]
    filterset_fields = ["relationship_type", "is_verified", "portal_access_enabled", "education_level"]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateParentSerializer
        return ParentSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateParentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Create auth user
        user = User.objects.create_user(
            email=data["email"],
            password=data.get("password", "ParentPassword123!"),
            first_name=data["first_name"],
            last_name=data["last_name"],
        )

        # Create/fetch profile
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                "first_name": data["first_name"],
                "last_name": data["last_name"],
            },
        )

        parent = create_parent(
            profile=profile,
            relationship_type=data.get("relationship_type", "guardian"),
            occupation=data.get("occupation", ""),
            employer_name=data.get("employer_name", ""),
            annual_income=data.get("annual_income"),
            education_level=data.get("education_level", "bachelor"),
            portal_access_enabled=data.get("portal_access_enabled", True),
            notification_enabled=data.get("notification_enabled", True),
        )

        return Response(ParentSerializer(parent).data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        soft_delete_parent(instance, actor=self.request.user, request=self.request)

    # ------------------------------------------------------------------
    # Lifecycle actions
    # ------------------------------------------------------------------

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        parent = self.get_object()
        verify_parent(parent, actor=request.user, request=request)
        return Response(ParentSerializer(parent).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        parent = Parent.all_objects.get(pk=pk)
        restore_parent(parent, actor=request.user, request=request)
        return Response(ParentSerializer(parent).data, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # Student link actions
    # ------------------------------------------------------------------

    @action(detail=True, methods=["post"], url_path="link-student")
    def link_student(self, request, pk=None):
        parent = self.get_object()
        serializer = LinkStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            student = Student.objects.get(id=data["student_id"])
        except Student.DoesNotExist:
            return Response(
                {"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND
            )

        link = link_student_to_parent(
            parent=parent,
            student=student,
            is_primary=data.get("is_primary_contact", False),
            is_emergency=data.get("is_emergency_contact", False),
            can_pickup=data.get("can_pickup", True),
            notes=data.get("notes", ""),
            actor=request.user,
            request=request,
        )
        return Response(StudentParentLinkSerializer(link).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path="unlink-student")
    def unlink_student(self, request, pk=None):
        parent = self.get_object()
        student_id = request.data.get("student_id")
        if not student_id:
            return Response(
                {"detail": "student_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response(
                {"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND
            )
        unlink_student_from_parent(parent, student, actor=request.user, request=request)
        return Response({"detail": "Student unlinked successfully."}, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # Audit trail
    # ------------------------------------------------------------------

    @action(detail=True, methods=["get"], url_path="activity-log")
    def activity_log(self, request, pk=None):
        parent = self.get_object()
        logs = parent.activity_logs.all()
        return Response(
            ParentActivityLogSerializer(logs, many=True).data,
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Document management
# ---------------------------------------------------------------------------

class ParentDocumentViewSet(viewsets.ModelViewSet):
    """
    Upload, list, retrieve, and review parent documents.

    POST   /api/parents/documents/                — upload document
    GET    /api/parents/documents/?parent=<id>    — list by parent
    GET    /api/parents/documents/{id}/           — retrieve
    POST   /api/parents/documents/{id}/review/    — staff approval/rejection
    """

    queryset = ParentDocument.objects.all().select_related("parent", "reviewed_by")
    serializer_class = ParentDocumentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["parent", "document_type", "status"]

    @action(detail=True, methods=["post"])
    def review(self, request, pk=None):
        document = self.get_object()
        serializer = DocumentReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        document.status = data["status"]
        document.reviewed_by = request.user
        document.review_notes = data.get("review_notes", "")
        document.save(update_fields=["status", "reviewed_by", "review_notes"])

        return Response(ParentDocumentSerializer(document).data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Dashboard summary
# ---------------------------------------------------------------------------

class ParentDashboardSummaryView(generics.GenericAPIView):
    """
    GET /api/parents/dashboard/
    Returns aggregate counts useful for the admin dashboard.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = Parent.objects.count()
        verified = Parent.objects.filter(is_verified=True).count()
        unverified = Parent.objects.filter(is_verified=False).count()
        portal_enabled = Parent.objects.filter(portal_access_enabled=True).count()

        by_relationship = (
            Parent.objects.values("relationship_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        pending_docs = ParentDocument.objects.filter(status="pending").count()

        return Response(
            {
                "total_parents": total,
                "verified_parents": verified,
                "unverified_parents": unverified,
                "portal_access_enabled": portal_enabled,
                "relationship_breakdown": list(by_relationship),
                "pending_documents": pending_docs,
            },
            status=status.HTTP_200_OK,
        )
