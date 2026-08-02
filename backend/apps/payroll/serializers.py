from rest_framework import serializers
from apps.payroll.models import (
    SalaryStructure,
    SalaryComponent,
    EmployeeSalaryAssignment,
    PayrollCycle,
    PayrollRun,
    Payslip,
    Allowance,
    Deduction,
    Bonus,
    Overtime,
    Loan,
    LoanRepayment,
    TaxSlab,
    PayrollAdjustment,
    PayrollAuditLog,
)


class SalaryStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryStructure
        fields = "__all__"


class SalaryComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryComponent
        fields = "__all__"


class EmployeeSalaryAssignmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)
    structure_name = serializers.CharField(source="salary_structure.structure_name", read_only=True)

    class Meta:
        model = EmployeeSalaryAssignment
        fields = "__all__"


class PayrollCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollCycle
        fields = "__all__"


class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Payslip
        fields = "__all__"


class PayrollRunSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)
    employee_id_code = serializers.CharField(source="employee.employee_id", read_only=True)
    department_name = serializers.CharField(source="employee.department.name", read_only=True)
    payslip = PayslipSerializer(read_only=True)

    class Meta:
        model = PayrollRun
        fields = "__all__"


class AllowanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Allowance
        fields = "__all__"


class DeductionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Deduction
        fields = "__all__"


class BonusSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Bonus
        fields = "__all__"


class OvertimeSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Overtime
        fields = "__all__"


class LoanSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Loan
        fields = "__all__"


class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = "__all__"


class TaxSlabSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxSlab
        fields = "__all__"


class PayrollAdjustmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = PayrollAdjustment
        fields = "__all__"


class PayrollAuditLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source="performed_by.get_full_name", read_only=True)

    class Meta:
        model = PayrollAuditLog
        fields = "__all__"
