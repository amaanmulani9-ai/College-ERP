from apps.academics.serializers import (
    AcademicSessionSerializer,
    ProgramSerializer,
    SemesterSerializer,
    SubjectSerializer,
)
from apps.staff.serializers import EmployeeSerializer
from rest_framework import serializers

from .models import Building, Classroom, TimeSlot, Timetable, TimetableAuditLog


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = ["id", "name", "code", "address", "is_active", "is_deleted", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ClassroomSerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(source="building.name", read_only=True)
    building_code = serializers.CharField(source="building.code", read_only=True)
    room_type_display = serializers.CharField(source="get_room_type_display", read_only=True)

    class Meta:
        model = Classroom
        fields = [
            "id",
            "building",
            "building_name",
            "building_code",
            "room_number",
            "capacity",
            "floor",
            "room_type",
            "room_type_display",
            "is_active",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = [
            "id",
            "day",
            "start_time",
            "end_time",
            "period_number",
            "break_after",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TimetableAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = TimetableAuditLog
        fields = ["id", "event_type", "description", "actor", "actor_email", "metadata", "timestamp"]
        read_only_fields = fields


class TimetableSerializer(serializers.ModelSerializer):
    academic_session_detail = AcademicSessionSerializer(source="academic_session", read_only=True)
    program_detail = ProgramSerializer(source="program", read_only=True)
    semester_detail = SemesterSerializer(source="semester", read_only=True)
    subject_detail = SubjectSerializer(source="subject", read_only=True)
    faculty_detail = EmployeeSerializer(source="faculty", read_only=True)
    classroom_detail = ClassroomSerializer(source="classroom", read_only=True)
    time_slot_detail = TimeSlotSerializer(source="time_slot", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Timetable
        fields = [
            "id",
            "academic_session",
            "academic_session_detail",
            "program",
            "program_detail",
            "semester",
            "semester_detail",
            "subject",
            "subject_detail",
            "faculty",
            "faculty_detail",
            "classroom",
            "classroom_detail",
            "time_slot",
            "time_slot_detail",
            "batch",
            "effective_from",
            "effective_to",
            "status",
            "status_display",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_deleted", "created_at", "updated_at"]


class CreateTimetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timetable
        fields = [
            "academic_session",
            "program",
            "semester",
            "subject",
            "faculty",
            "classroom",
            "time_slot",
            "batch",
            "effective_from",
            "effective_to",
            "status",
        ]


class CheckConflictRequestSerializer(serializers.Serializer):
    time_slot = serializers.UUIDField()
    classroom = serializers.UUIDField()
    faculty = serializers.UUIDField()
    program = serializers.UUIDField()
    semester = serializers.UUIDField()
    batch = serializers.CharField(required=False, default="all")
    exclude_id = serializers.UUIDField(required=False, allow_null=True, default=None)
