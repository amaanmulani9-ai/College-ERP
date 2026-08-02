from rest_framework import serializers
from apps.hr.models import (
    Department,
    Designation,
    EmploymentType,
    LeaveType,
    LeaveBalance,
    LeaveRequest,
    HolidayCalendar,
    Shift,
    EmployeeShiftAssignment,
    AttendancePolicy,
    RecruitmentJob,
    JobApplication,
    Interview,
    OfferLetter,
    EmployeeOnboarding,
    EmployeeDocument,
    PerformanceReview,
    PerformanceGoal,
    TrainingProgram,
    TrainingEnrollment,
    Promotion,
    Transfer,
    Resignation,
    ExitInterview,
    DisciplinaryAction,
    HRAnnouncement,
    HRAuditLog,
)


class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source="head_of_department.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Department
        fields = "__all__"


class DesignationSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)

    class Meta:
        model = Designation
        fields = "__all__"


class EmploymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentType
        fields = "__all__"


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = "__all__"


class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)
    leave_type_name = serializers.CharField(source="leave_type.name", read_only=True)

    class Meta:
        model = LeaveBalance
        fields = "__all__"


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)
    leave_type_name = serializers.CharField(source="leave_type.name", read_only=True)

    class Meta:
        model = LeaveRequest
        fields = "__all__"


class HolidayCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HolidayCalendar
        fields = "__all__"


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = "__all__"


class RecruitmentJobSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)

    class Meta:
        model = RecruitmentJob
        fields = "__all__"


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = JobApplication
        fields = "__all__"


class OfferLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferLetter
        fields = "__all__"


class EmployeeOnboardingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = EmployeeOnboarding
        fields = "__all__"


class PerformanceReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = PerformanceReview
        fields = "__all__"


class TrainingProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProgram
        fields = "__all__"


class TrainingEnrollmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)
    program_name = serializers.CharField(source="program.program_name", read_only=True)

    class Meta:
        model = TrainingEnrollment
        fields = "__all__"


class PromotionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Promotion
        fields = "__all__"


class TransferSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Transfer
        fields = "__all__"


class ResignationSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Resignation
        fields = "__all__"


class DisciplinaryActionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = DisciplinaryAction
        fields = "__all__"


class HRAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = HRAnnouncement
        fields = "__all__"


class HRAuditLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source="performed_by.get_full_name", read_only=True)

    class Meta:
        model = HRAuditLog
        fields = "__all__"
