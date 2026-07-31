from rest_framework import serializers
from apps.profiles.serializers import UserProfileSerializer
from apps.academics.serializers import ProgramSerializer, DepartmentSerializer, SemesterSerializer, AcademicSessionSerializer
from .models import Student, StudentStatusHistory


class StudentStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.get_full_name", read_only=True)

    class Meta:
        model = StudentStatusHistory
        fields = ["id", "previous_status", "new_status", "changed_by", "changed_by_name", "reason", "timestamp"]


class StudentSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    program_name = serializers.CharField(source="program.name", read_only=True)
    program_code = serializers.CharField(source="program.code", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    semester_name = serializers.CharField(source="current_semester.name", read_only=True)
    session_name = serializers.CharField(source="academic_session.name", read_only=True)
    status_history = StudentStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "student_id",
            "enrollment_number",
            "roll_number",
            "profile",
            "program",
            "program_name",
            "program_code",
            "department",
            "department_name",
            "current_semester",
            "semester_name",
            "academic_session",
            "session_name",
            "admission_date",
            "expected_graduation_date",
            "status",
            "category",
            "blood_group",
            "nationality",
            "father_name",
            "father_phone",
            "mother_name",
            "mother_phone",
            "guardian_name",
            "guardian_phone",
            "emergency_contact",
            "status_history",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "student_id", "created_at", "updated_at"]


class CreateStudentSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=False, default="StudentPassword123!")

    class Meta:
        model = Student
        fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "enrollment_number",
            "roll_number",
            "program",
            "department",
            "current_semester",
            "academic_session",
            "admission_date",
            "expected_graduation_date",
            "category",
            "father_name",
            "father_phone",
            "mother_name",
            "guardian_name",
            "guardian_phone",
            "emergency_contact",
        ]


class StatusTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Student.STATUS_CHOICES, required=True)
    reason = serializers.CharField(required=False, allow_blank=True, default="")
