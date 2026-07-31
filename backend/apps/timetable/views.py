from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Building, Classroom, TimeSlot, Timetable
from .serializers import (
    BuildingSerializer,
    CheckConflictRequestSerializer,
    ClassroomSerializer,
    CreateTimetableSerializer,
    TimeSlotSerializer,
    TimetableAuditLogSerializer,
    TimetableSerializer,
)
from .services import TimetableService


class BuildingViewSet(viewsets.ModelViewSet):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code", "address"]
    filterset_fields = ["is_active"]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted", "updated_at"])


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all().select_related("building")
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["room_number", "building__name", "building__code"]
    filterset_fields = ["building", "room_type", "is_active", "floor"]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted", "updated_at"])


class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["day"]
    filterset_fields = ["day", "period_number", "is_active", "break_after"]


class TimetableViewSet(viewsets.ModelViewSet):
    queryset = (
        Timetable.objects.all()
        .select_related(
            "academic_session",
            "program",
            "semester",
            "subject",
            "faculty__profile",
            "classroom__building",
            "time_slot",
        )
        .prefetch_related("audit_logs")
    )
    permission_classes = [IsAuthenticated]
    search_fields = [
        "subject__name",
        "subject__code",
        "faculty__profile__first_name",
        "faculty__profile__last_name",
        "classroom__room_number",
        "program__name",
    ]
    filterset_fields = ["academic_session", "program", "semester", "faculty", "classroom", "time_slot", "batch", "status"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateTimetableSerializer
        return TimetableSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateTimetableSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            entry = TimetableService.create(serializer.validated_data, actor=request.user, request=request)
            return Response(TimetableSerializer(entry).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = CreateTimetableSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            updated = TimetableService.update(instance, serializer.validated_data, actor=request.user, request=request)
            return Response(TimetableSerializer(updated).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        TimetableService.delete(instance, actor=self.request.user, request=self.request)

    # ------------------------------------------------------------------
    # Custom Action Endpoints
    # ------------------------------------------------------------------

    @action(detail=False, methods=["post"], url_path="check-conflicts")
    def check_conflicts(self, request):
        serializer = CheckConflictRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        conflicts = TimetableService.check_conflicts(
            time_slot_id=str(data["time_slot"]),
            classroom_id=str(data["classroom"]),
            faculty_id=str(data["faculty"]),
            program_id=str(data["program"]),
            semester_id=str(data["semester"]),
            batch=data.get("batch", "all"),
            exclude_id=str(data["exclude_id"]) if data.get("exclude_id") else None,
        )
        return Response({"has_conflicts": len(conflicts) > 0, "conflicts": conflicts}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="faculty/(?P<faculty_id>[^/.]+)")
    def faculty_schedule(self, request, faculty_id=None):
        entries = TimetableService.faculty_schedule(faculty_id)
        return Response(TimetableSerializer(entries, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="student")
    def student_schedule(self, request):
        program_id = request.query_params.get("program")
        semester_id = request.query_params.get("semester")
        batch = request.query_params.get("batch")
        entries = TimetableService.student_schedule(program_id, semester_id, batch)
        return Response(TimetableSerializer(entries, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="room/(?P<classroom_id>[^/.]+)")
    def room_schedule(self, request, classroom_id=None):
        entries = TimetableService.room_schedule(classroom_id)
        return Response(TimetableSerializer(entries, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="weekly")
    def weekly_schedule(self, request):
        session_id = request.query_params.get("session")
        entries = TimetableService.weekly_schedule(session_id)
        return Response(TimetableSerializer(entries, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        timetable = self.get_object()
        logs = timetable.audit_logs.all()
        return Response(TimetableAuditLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)
