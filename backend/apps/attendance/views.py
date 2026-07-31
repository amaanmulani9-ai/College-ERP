import datetime
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import AttendanceSession, FacultyAttendance, StudentAttendance
from .serializers import (
    AttendanceAuditLogSerializer,
    AttendanceSessionSerializer,
    BulkMarkAttendanceSerializer,
    CreateAttendanceSessionSerializer,
    FacultyAttendanceSerializer,
    StudentAttendanceSerializer,
)
from .services import AttendanceService


class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = (
        AttendanceSession.objects.all()
        .select_related("timetable", "subject", "faculty__profile", "classroom__building")
        .prefetch_related("student_attendances")
    )
    permission_classes = [IsAuthenticated]
    search_fields = ["subject__name", "subject__code", "faculty__profile__first_name", "faculty__profile__last_name"]
    filterset_fields = ["date", "subject", "faculty", "status", "is_locked"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateAttendanceSessionSerializer
        return AttendanceSessionSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateAttendanceSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = AttendanceService.create_session(serializer.validated_data, actor=request.user, request=request)
        return Response(AttendanceSessionSerializer(session).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="mark")
    def mark(self, request, pk=None):
        session = self.get_object()
        student_id = request.data.get("student_id")
        status_val = request.data.get("status", "present")
        remarks = request.data.get("remarks", "")
        
        if not student_id:
            return Response({"detail": "student_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            att = AttendanceService.mark_attendance(session, student_id, status_val, remarks, actor=request.user, request=request)
            return Response(StudentAttendanceSerializer(att).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="bulk")
    def bulk(self, request):
        serializer = BulkMarkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = serializer.validated_data["session_id"]
        records = serializer.validated_data["records"]

        try:
            session = AttendanceSession.objects.get(pk=session_id)
            marked = AttendanceService.bulk_mark(session, records, actor=request.user, request=request)
            return Response(StudentAttendanceSerializer(marked, many=True).data, status=status.HTTP_200_OK)
        except AttendanceSession.DoesNotExist:
            return Response({"detail": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="lock")
    def lock(self, request, pk=None):
        session = self.get_object()
        locked_session = AttendanceService.lock_session(session, actor=request.user, request=request)
        return Response(AttendanceSessionSerializer(locked_session).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        session = self.get_object()
        logs = session.audit_logs.all()
        return Response(AttendanceAuditLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)


class StudentAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StudentAttendance.objects.all().select_related("session__subject", "student__profile")
    serializer_class = StudentAttendanceSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["student__student_id", "student__profile__first_name", "student__profile__last_name"]
    filterset_fields = ["session", "student", "status"]

    @action(detail=False, methods=["get"], url_path="student/(?P<student_id>[^/.]+)")
    def student_history(self, request, student_id=None):
        subject_id = request.query_params.get("subject")
        qs = StudentAttendance.objects.filter(student_id=student_id, is_deleted=False)
        if subject_id:
            qs = qs.filter(session__subject_id=subject_id)
        return Response(StudentAttendanceSerializer(qs, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="percentage")
    def percentage(self, request):
        student_id = request.query_params.get("student")
        subject_id = request.query_params.get("subject")
        if not student_id:
            return Response({"detail": "student parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        result = AttendanceService.attendance_percentage(student_id, subject_id)
        return Response(result, status=status.HTTP_200_OK)


class FacultyAttendanceViewSet(viewsets.ModelViewSet):
    queryset = FacultyAttendance.objects.all().select_related("faculty__profile")
    serializer_class = FacultyAttendanceSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["faculty__employee_id", "faculty__profile__first_name", "faculty__profile__last_name"]
    filterset_fields = ["faculty", "date", "status"]

    @action(detail=False, methods=["post"], url_path="mark")
    def mark_faculty(self, request):
        faculty_id = request.data.get("faculty_id")
        date_str = request.data.get("date", str(datetime.date.today()))
        status_val = request.data.get("status", "present")
        check_in = request.data.get("check_in")
        check_out = request.data.get("check_out")
        remarks = request.data.get("remarks", "")

        if not faculty_id:
            return Response({"detail": "faculty_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        rec = AttendanceService.faculty_attendance(faculty_id, date_obj, status_val, check_in, check_out, remarks, actor=request.user, request=request)
        return Response(FacultyAttendanceSerializer(rec).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="faculty/(?P<faculty_id>[^/.]+)")
    def faculty_history(self, request, faculty_id=None):
        records = FacultyAttendance.objects.filter(faculty_id=faculty_id, is_deleted=False)
        return Response(FacultyAttendanceSerializer(records, many=True).data, status=status.HTTP_200_OK)


class AttendanceReportViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"], url_path="daily")
    def daily_report(self, request):
        date_str = request.query_params.get("date", str(datetime.date.today()))
        try:
            target_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        report = AttendanceService.daily_report(target_date)
        return Response(report, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="monthly")
    def monthly_report(self, request):
        now = datetime.date.today()
        year = int(request.query_params.get("year", now.year))
        month = int(request.query_params.get("month", now.month))
        subject_id = request.query_params.get("subject")

        report = AttendanceService.monthly_report(year, month, subject_id)
        return Response(report, status=status.HTTP_200_OK)
