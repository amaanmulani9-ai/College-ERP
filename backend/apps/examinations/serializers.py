from rest_framework import serializers

from apps.academics.serializers import AcademicSessionSerializer, ProgramSerializer, SemesterSerializer, SubjectSerializer
from apps.staff.serializers import EmployeeSerializer
from apps.students.serializers import StudentSerializer
from apps.timetable.serializers import ClassroomSerializer

from .models import Exam, ExamAttendance, ExamAuditLog, ExamSchedule, ExamType, HallTicket, InvigilatorAssignment


class ExamTypeSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = ExamType
        fields = ["id", "name", "code", "category", "category_display", "is_internal", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ExamSerializer(serializers.ModelSerializer):
    academic_session_detail = AcademicSessionSerializer(source="academic_session", read_only=True)
    program_detail = ProgramSerializer(source="program", read_only=True)
    semester_detail = SemesterSerializer(source="semester", read_only=True)
    subject_detail = SubjectSerializer(source="subject", read_only=True)
    exam_type_detail = ExamTypeSerializer(source="exam_type", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Exam
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
            "exam_type",
            "exam_type_detail",
            "start_date",
            "end_date",
            "status",
            "status_display",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_deleted", "created_at", "updated_at"]


class CreateExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = [
            "academic_session",
            "program",
            "semester",
            "subject",
            "exam_type",
            "start_date",
            "end_date",
            "status",
        ]


class ExamScheduleSerializer(serializers.ModelSerializer):
    exam_detail = ExamSerializer(source="exam", read_only=True)
    classroom_detail = ClassroomSerializer(source="classroom", read_only=True)
    invigilator_detail = EmployeeSerializer(source="invigilator", read_only=True)

    class Meta:
        model = ExamSchedule
        fields = [
            "id",
            "exam",
            "exam_detail",
            "date",
            "start_time",
            "end_time",
            "classroom",
            "classroom_detail",
            "invigilator",
            "invigilator_detail",
            "capacity",
            "is_locked",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_deleted", "created_at", "updated_at"]


class CreateExamScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSchedule
        fields = [
            "exam",
            "date",
            "start_time",
            "end_time",
            "classroom",
            "invigilator",
            "capacity",
            "is_locked",
        ]


class HallTicketSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    exam_detail = ExamSerializer(source="exam", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = HallTicket
        fields = [
            "id",
            "student",
            "student_detail",
            "exam",
            "exam_detail",
            "hall_ticket_number",
            "status",
            "status_display",
            "generated_at",
            "is_deleted",
        ]
        read_only_fields = ["id", "hall_ticket_number", "generated_at", "is_deleted"]


class GenerateHallTicketRequestSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    exam_id = serializers.UUIDField()


class ExamAttendanceSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source="student", read_only=True)
    exam_schedule_detail = ExamScheduleSerializer(source="exam_schedule", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ExamAttendance
        fields = [
            "id",
            "student",
            "student_detail",
            "exam_schedule",
            "exam_schedule_detail",
            "status",
            "status_display",
            "check_in_time",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MarkExamAttendanceRequestSerializer(serializers.Serializer):
    exam_schedule_id = serializers.UUIDField()
    student_id = serializers.UUIDField()
    status = serializers.ChoiceField(choices=["present", "absent", "malpractice", "excused"], default="present")
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class InvigilatorAssignmentSerializer(serializers.ModelSerializer):
    faculty_detail = EmployeeSerializer(source="faculty", read_only=True)
    exam_schedule_detail = ExamScheduleSerializer(source="exam_schedule", read_only=True)
    duty_status_display = serializers.CharField(source="get_duty_status_display", read_only=True)

    class Meta:
        model = InvigilatorAssignment
        fields = [
            "id",
            "faculty",
            "faculty_detail",
            "exam_schedule",
            "exam_schedule_detail",
            "duty_status",
            "duty_status_display",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ExamAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = ExamAuditLog
        fields = ["id", "event_type", "description", "actor", "actor_email", "metadata", "timestamp"]
        read_only_fields = fields
