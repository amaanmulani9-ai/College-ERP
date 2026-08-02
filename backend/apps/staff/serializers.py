from apps.profiles.serializers import UserProfileSerializer
from rest_framework import serializers

from .models import Designation, Employee, EmployeeStatusHistory


class DesignationSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Designation
        fields = [
            "id",
            "name",
            "code",
            "department",
            "department_name",
            "category",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class EmployeeStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.get_full_name", read_only=True)

    class Meta:
        model = EmployeeStatusHistory
        fields = ["id", "previous_status", "new_status", "changed_by", "changed_by_name", "reason", "timestamp"]


class EmployeeSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    designation_name = serializers.CharField(source="designation.name", read_only=True)
    designation_category = serializers.CharField(source="designation.category", read_only=True)
    reporting_manager_name = serializers.CharField(source="reporting_manager.profile.get_full_name", read_only=True)
    status_history = EmployeeStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_id",
            "employee_number",
            "profile",
            "department",
            "department_name",
            "designation",
            "designation_name",
            "designation_category",
            "employment_type",
            "joining_date",
            "probation_end_date",
            "employment_status",
            "reporting_manager",
            "reporting_manager_name",
            "qualification",
            "experience_years",
            "salary_grade",
            "office_location",
            "work_email",
            "extension_number",
            "status_history",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "employee_id", "created_at", "updated_at"]


class CreateEmployeeSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=False, default="StaffPassword123!")

    class Meta:
        model = Employee
        fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "employee_number",
            "department",
            "designation",
            "employment_type",
            "joining_date",
            "probation_end_date",
            "reporting_manager",
            "qualification",
            "experience_years",
            "salary_grade",
            "office_location",
            "work_email",
            "extension_number",
        ]
