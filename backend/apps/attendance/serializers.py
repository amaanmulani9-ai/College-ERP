from rest_framework import serializers

from apps.academics.serializers import SubjectSerializer
from apps.staff.serializers import EmployeeSerializer
from apps.students.serializers import StudentSerializer
from apps.timetable.serializers import ClassroomSerializer, TimetableSerializer

from .models import AttendanceAuditLog, AttendanceSession, FacultyAttendance, StudentAttendance


class AttendanceSessionSerializer(serializers.ModelSerializer):
    subject_detail = SubjectSerializer(source="subject", read_only=True)
    faculty_detail = EmployeeSerializer(source="faculty", read_only=True)
    classroom_detail = ClassroomSerializer(source="classroom", read_only=True)
    timetable_detail = TimetableSerializer(source="timetable", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = AttendanceSession
        fields = [
            "id",
            "timetable",
            "timetable_detail",
            "subject",
            "subject_detail",
            "faculty",
            "faculty_detail",
            "classroom",
            "classroom_detail",
            "date",
            "start_time",
            "end_time",
            "status",
            "status_display",
            "qr_token",
            "is_locked",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "qr_token", "is_deleted", "created_at", "updated_at"]


class CreateAttendanceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSession
        fields = [
            "timetable",
            "subject",
            "faculty",
            "classroom",
            "date",
            "start_time",
            "end_time",
            "status",
        ]


class StudentAttendanceSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    session_detail = AttendanceSessionSerializer(source="session", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = StudentAttendance
        fields = [
            "id",
            "session",
            "session_detail",
            "student",
            "student_detail",
            "status",
            "status_display",
            "check_in_time",
            "check_out_time",
            "remarks",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_deleted", "created_at", "updated_at"]


class StudentMarkItemSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    status = serializers.ChoiceField(choices=["present", "absent", "late", "half_day", "excused"], default="present")
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class BulkMarkAttendanceSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    records = StudentMarkItemSerializer(many=True)


class FacultyAttendanceSerializer(serializers.ModelSerializer):
    faculty_detail = EmployeeSerializer(source="faculty", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = FacultyAttendance
        fields = [
            "id",
            "faculty",
            "faculty_detail",
            "date",
            "check_in",
            "check_out",
            "status",
            "status_display",
            "remarks",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_deleted", "created_at", "updated_at"]


class AttendanceAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = AttendanceAuditLog
        fields = ["id", "event_type", "description", "actor", "actor_email", "metadata", "timestamp"]
        read_only_fields = fields
