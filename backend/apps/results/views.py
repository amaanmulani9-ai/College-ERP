from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ResultScheme, SemesterResult, StudentResult
from .serializers import (
    EnterMarksRequestSerializer,
    PublishResultRequestSerializer,
    ResultAuditLogSerializer,
    ResultSchemeSerializer,
    SemesterResultSerializer,
    StudentResultSerializer,
)
from .services import ResultService


class ResultSchemeViewSet(viewsets.ModelViewSet):
    queryset = ResultScheme.objects.all().select_related("program", "semester", "subject")
    serializer_class = ResultSchemeSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["subject__name", "subject__code", "program__name"]
    filterset_fields = ["program", "semester", "subject", "is_active"]


class StudentResultViewSet(viewsets.ModelViewSet):
    queryset = StudentResult.objects.all().select_related("student__profile", "subject", "exam")
    serializer_class = StudentResultSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["student__student_id", "student__profile__first_name", "subject__code"]
    filterset_fields = ["student", "subject", "exam", "grade", "status"]

    def create(self, request, *args, **kwargs):
        serializer = EnterMarksRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            res = ResultService.enter_marks(serializer.validated_data, actor=request.user, request=request)
            return Response(StudentResultSerializer(res).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="calculate")
    def calculate(self, request):
        student_id = request.data.get("student")
        semester_id = request.data.get("semester")

        if not student_id or not semester_id:
            return Response(
                {"detail": "student and semester parameters are required."}, status=status.HTTP_400_BAD_REQUEST
            )

        sem_res = ResultService.calculate_sgpa(student_id, semester_id)
        return Response(SemesterResultSerializer(sem_res).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="student/(?P<student_id>[^/.]+)")
    def student_history(self, request, student_id=None):
        results = ResultService.student_result(student_id)
        return Response(StudentResultSerializer(results, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="transcript-preview")
    def transcript_preview(self, request):
        student_id = request.query_params.get("student")
        if not student_id:
            return Response({"detail": "student parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        subject_results = ResultService.student_result(student_id)
        sem_results = ResultService.semester_result(student_id)
        cgpa = ResultService.calculate_cgpa(student_id)

        return Response(
            {
                "student_id": student_id,
                "cgpa": cgpa,
                "semester_results": SemesterResultSerializer(sem_results, many=True).data,
                "subject_results": StudentResultSerializer(subject_results, many=True).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        res = self.get_object()
        logs = res.audit_logs.all()
        return Response(ResultAuditLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)


class SemesterResultViewSet(viewsets.ModelViewSet):
    queryset = SemesterResult.objects.all().select_related("student__profile", "semester")
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["student__student_id", "student__profile__first_name"]
    filterset_fields = ["student", "semester", "result_status", "is_published"]

    @action(detail=False, methods=["post"], url_path="publish")
    def publish(self, request):
        serializer = PublishResultRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        semester_id = str(serializer.validated_data["semester_id"])

        count = ResultService.publish_result(semester_id, actor=request.user, request=request)
        return Response(
            {"published_count": count, "message": f"Successfully published results for {count} students."},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="rank")
    def rank_generation(self, request):
        semester_id = request.data.get("semester_id")
        if not semester_id:
            return Response({"detail": "semester_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        ranks = ResultService.generate_rank(semester_id)
        return Response(SemesterResultSerializer(ranks, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="semester/(?P<semester_id>[^/.]+)")
    def semester_summary(self, request, semester_id=None):
        results = SemesterResult.objects.filter(semester_id=semester_id, is_deleted=False).select_related(
            "student__profile"
        )
        return Response(SemesterResultSerializer(results, many=True).data, status=status.HTTP_200_OK)
