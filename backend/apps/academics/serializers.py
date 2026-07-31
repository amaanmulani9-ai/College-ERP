from rest_framework import serializers
from apps.authentication.serializers import UserSerializer
from .models import (
    AcademicSession,
    Department,
    Faculty,
    Program,
    Semester,
    Subject,
    SubjectOffering,
)


class FacultySerializer(serializers.ModelSerializer):
    dean_details = UserSerializer(source="dean", read_only=True)
    departments_count = serializers.IntegerField(source="departments.count", read_only=True)

    class Meta:
        model = Faculty
        fields = ["id", "name", "code", "description", "dean", "dean_details", "departments_count", "is_active", "display_order", "is_deleted", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class DepartmentSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source="faculty.name", read_only=True)
    hod_details = UserSerializer(source="hod", read_only=True)
    programs_count = serializers.IntegerField(source="programs.count", read_only=True)

    class Meta:
        model = Department
        fields = ["id", "faculty", "faculty_name", "name", "code", "description", "hod", "hod_details", "email", "phone", "programs_count", "is_active", "display_order", "is_deleted", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProgramSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    semesters_count = serializers.IntegerField(source="semesters.count", read_only=True)

    class Meta:
        model = Program
        fields = ["id", "department", "department_name", "name", "code", "degree_level", "duration_years", "total_credits", "semesters_count", "is_active", "is_deleted", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AcademicSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicSession
        fields = ["id", "name", "start_date", "end_date", "is_active", "is_current", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class SemesterSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source="program.name", read_only=True)
    subjects_count = serializers.IntegerField(source="subjects.count", read_only=True)

    class Meta:
        model = Semester
        fields = ["id", "program", "program_name", "semester_number", "name", "credits", "subjects_count", "is_active", "is_deleted", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class SubjectSerializer(serializers.ModelSerializer):
    semester_name = serializers.CharField(source="semester.name", read_only=True)
    program_name = serializers.CharField(source="semester.program.name", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "code",
            "name",
            "description",
            "semester",
            "semester_name",
            "program_name",
            "credits",
            "theory_hours",
            "practical_hours",
            "internal_marks",
            "external_marks",
            "passing_marks",
            "is_elective",
            "is_active",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class SubjectOfferingSerializer(serializers.ModelSerializer):
    subject_code = serializers.CharField(source="subject.code", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    session_name = serializers.CharField(source="session.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = SubjectOffering
        fields = ["id", "subject", "subject_code", "subject_name", "session", "session_name", "department", "department_name", "capacity", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
