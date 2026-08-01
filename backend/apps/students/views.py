from apps.authentication.models import User
from apps.profiles.models import UserProfile
from django.db.models import Count
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Student
from .serializers import (
    CreateStudentSerializer,
    StudentSerializer,
    StudentStatusHistorySerializer,
)
from .services import (
    generate_student_code,
    graduate_student,
    reinstate_student,
    restore_student,
    soft_delete_student,
    suspend_student,
    transition_student_status,
    withdraw_student,
)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().select_related(
        "profile", "program", "department", "current_semester", "academic_session"
    )
    permission_classes = [IsAuthenticated]
    search_fields = [
        "student_id",
        "enrollment_number",
        "roll_number",
        "profile__first_name",
        "profile__last_name",
        "profile__user__email",
    ]
    filterset_fields = ["program", "department", "current_semester", "academic_session", "status", "category"]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateStudentSerializer
        return StudentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        first_name = data.pop("first_name")
        last_name = data.pop("last_name")
        email = data.pop("email")
        password = data.pop("password", "StudentPassword123!")

        # Create auth user & profile
        user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
        profile, _ = UserProfile.objects.get_or_create(
            user=user, defaults={"first_name": first_name, "last_name": last_name}
        )

        # Generate unique Student ID
        program = data["program"]
        student_code = generate_student_code(program_code=program.code)

        student = Student.objects.create(
            student_id=student_code,
            profile=profile,
            **data,
        )

        return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        soft_delete_student(instance, actor=self.request.user, request=self.request)

    @action(detail=True, methods=["post"])
    def suspend(self, request, pk=None):
        student = self.get_object()
        reason = request.data.get("reason", "Suspended by administrative decision")
        suspend_student(student, reason=reason, actor=request.user, request=request)
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reinstate(self, request, pk=None):
        student = self.get_object()
        reinstate_student(student, actor=request.user, request=request)
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def graduate(self, request, pk=None):
        student = self.get_object()
        graduate_student(student, actor=request.user, request=request)
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def withdraw(self, request, pk=None):
        student = self.get_object()
        reason = request.data.get("reason", "Withdrawn by student request")
        withdraw_student(student, reason=reason, actor=request.user, request=request)
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        student = Student.all_objects.get(pk=pk)
        restore_student(student, actor=request.user, request=request)
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="status-history")
    def status_history(self, request, pk=None):
        student = self.get_object()
        history = student.status_history.all()
        return Response(StudentStatusHistorySerializer(history, many=True).data, status=status.HTTP_200_OK)


class StudentDashboardSummaryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_students = Student.objects.count()
        active_count = Student.objects.filter(status="active").count()
        suspended_count = Student.objects.filter(status="suspended").count()
        graduated_count = Student.objects.filter(status="graduated").count()

        department_breakdown = (
            Student.objects.filter(status="active")
            .values("department__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        return Response(
            {
                "total_students": total_students,
                "active_students": active_count,
                "suspended_students": suspended_count,
                "graduated_students": graduated_count,
                "department_breakdown": department_breakdown,
            },
            status=status.HTTP_200_OK,
        )


class BulkImportView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(
            {"detail": "Bulk import CSV parser placeholder triggered successfully."}, status=status.HTTP_200_OK
        )


class BulkExportView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Bulk export CSV stream placeholder generated."}, status=status.HTTP_200_OK)


class BulkStatusUpdateView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        student_ids = request.data.get("student_ids", [])
        new_status = request.data.get("status")
        reason = request.data.get("reason", "Bulk status update")

        updated_count = 0
        for sid in student_ids:
            try:
                st = Student.objects.get(id=sid)
                transition_student_status(st, new_status, actor=request.user, reason=reason, request=request)
                updated_count += 1
            except Student.DoesNotExist:
                continue

        return Response(
            {"detail": f"Successfully updated status for {updated_count} students."}, status=status.HTTP_200_OK
        )
