from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Exam, ExamAttendance, ExamSchedule, ExamType, HallTicket, InvigilatorAssignment
from .serializers import (
    CreateExamScheduleSerializer,
    CreateExamSerializer,
    ExamAttendanceSerializer,
    ExamAuditLogSerializer,
    ExamScheduleSerializer,
    ExamSerializer,
    ExamTypeSerializer,
    GenerateHallTicketRequestSerializer,
    HallTicketSerializer,
    InvigilatorAssignmentSerializer,
    MarkExamAttendanceRequestSerializer,
)
from .services import ExamService


class ExamTypeViewSet(viewsets.ModelViewSet):
    queryset = ExamType.objects.all()
    serializer_class = ExamTypeSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["category", "is_internal", "is_active"]


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().select_related("academic_session", "program", "semester", "subject", "exam_type")
    permission_classes = [IsAuthenticated]
    search_fields = ["subject__name", "subject__code", "exam_type__name"]
    filterset_fields = ["academic_session", "program", "semester", "subject", "exam_type", "status"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateExamSerializer
        return ExamSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateExamSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        exam = ExamService.create_exam(serializer.validated_data, actor=request.user, request=request)
        return Response(ExamSerializer(exam).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="generate-hall-ticket")
    def generate_hall_ticket(self, request):
        serializer = GenerateHallTicketRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = str(serializer.validated_data["student_id"])
        exam_id = str(serializer.validated_data["exam_id"])

        try:
            ticket = ExamService.generate_hall_ticket(student_id, exam_id, actor=request.user, request=request)
            return Response(HallTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="student/(?P<student_id>[^/.]+)/schedule")
    def student_schedule(self, request, student_id=None):
        try:
            schedules = ExamService.student_schedule(student_id)
            return Response(ExamScheduleSerializer(schedules, many=True).data, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="faculty/(?P<faculty_id>[^/.]+)/duties")
    def faculty_duties(self, request, faculty_id=None):
        duties = ExamService.faculty_duties(faculty_id)
        return Response(InvigilatorAssignmentSerializer(duties, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        exam = self.get_object()
        logs = exam.audit_logs.all()
        return Response(ExamAuditLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)


class ExamScheduleViewSet(viewsets.ModelViewSet):
    queryset = ExamSchedule.objects.all().select_related("exam__subject", "classroom__building", "invigilator__profile")
    permission_classes = [IsAuthenticated]
    search_fields = ["exam__subject__name", "exam__subject__code", "classroom__room_number"]
    filterset_fields = ["exam", "date", "classroom", "invigilator", "is_locked"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateExamScheduleSerializer
        return ExamScheduleSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateExamScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            schedule = ExamService.schedule_exam(serializer.validated_data, actor=request.user, request=request)
            return Response(ExamScheduleSerializer(schedule).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class HallTicketViewSet(viewsets.ModelViewSet):
    queryset = HallTicket.objects.all().select_related("student__profile", "exam__subject")
    serializer_class = HallTicketSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["hall_ticket_number", "student__student_id", "student__profile__first_name"]
    filterset_fields = ["student", "exam", "status"]


class ExamAttendanceViewSet(viewsets.ModelViewSet):
    queryset = ExamAttendance.objects.all().select_related("student__profile", "exam_schedule__exam__subject")
    serializer_class = ExamAttendanceSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["student__student_id", "student__profile__first_name", "remarks"]
    filterset_fields = ["exam_schedule", "student", "status"]

    @action(detail=False, methods=["post"], url_path="mark")
    def mark(self, request):
        serializer = MarkExamAttendanceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule_id = str(serializer.validated_data["exam_schedule_id"])
        student_id = str(serializer.validated_data["student_id"])
        status_val = serializer.validated_data["status"]
        remarks = serializer.validated_data.get("remarks", "")

        try:
            att = ExamService.mark_exam_attendance(schedule_id, student_id, status_val, remarks, actor=request.user, request=request)
            return Response(ExamAttendanceSerializer(att).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class InvigilatorAssignmentViewSet(viewsets.ModelViewSet):
    queryset = InvigilatorAssignment.objects.all().select_related("faculty__profile", "exam_schedule__exam__subject")
    serializer_class = InvigilatorAssignmentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["faculty__employee_id", "faculty__profile__first_name"]
    filterset_fields = ["faculty", "exam_schedule", "duty_status"]

    def create(self, request, *args, **kwargs):
        schedule_id = request.data.get("exam_schedule")
        faculty_id = request.data.get("faculty")
        duty_status_val = request.data.get("duty_status", "assigned")
        remarks = request.data.get("remarks", "")

        if not schedule_id or not faculty_id:
            return Response({"detail": "exam_schedule and faculty are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assignment = ExamService.assign_invigilator(schedule_id, faculty_id, duty_status_val, remarks, actor=request.user, request=request)
            return Response(InvigilatorAssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
