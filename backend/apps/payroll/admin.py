from django.contrib import admin
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


@admin.register(SalaryStructure)
class SalaryStructureAdmin(admin.ModelAdmin):
    list_display = ["structure_code", "structure_name", "basic_salary", "grade", "is_active"]
    list_filter = ["grade", "is_active"]
    search_fields = ["structure_code", "structure_name"]


@admin.register(SalaryComponent)
class SalaryComponentAdmin(admin.ModelAdmin):
    list_display = ["component_name", "component_type", "taxable", "display_order"]
    list_filter = ["component_type", "taxable"]


@admin.register(EmployeeSalaryAssignment)
class EmployeeSalaryAssignmentAdmin(admin.ModelAdmin):
    list_display = ["employee", "salary_structure", "effective_date", "status"]
    list_filter = ["status"]


@admin.register(PayrollCycle)
class PayrollCycleAdmin(admin.ModelAdmin):
    list_display = ["month", "year", "start_date", "end_date", "status"]
    list_filter = ["status", "year"]


@admin.register(PayrollRun)
class PayrollRunAdmin(admin.ModelAdmin):
    list_display = ["employee", "cycle", "gross_salary", "tax", "loan_deduction", "net_salary", "status"]
    list_filter = ["status", "cycle"]
    search_fields = ["employee__employee_id", "employee__profile__user__first_name"]


@admin.register(Payslip)
class PayslipAdmin(admin.ModelAdmin):
    list_display = ["payslip_number", "employee", "issue_date"]
    search_fields = ["payslip_number", "employee__employee_id"]


@admin.register(Allowance)
class AllowanceAdmin(admin.ModelAdmin):
    list_display = ["employee", "allowance_type", "amount", "is_recurring"]
    list_filter = ["is_recurring"]


@admin.register(Deduction)
class DeductionAdmin(admin.ModelAdmin):
    list_display = ["employee", "deduction_type", "amount", "is_recurring"]
    list_filter = ["is_recurring"]


@admin.register(Bonus)
class BonusAdmin(admin.ModelAdmin):
    list_display = ["employee", "bonus_type", "amount", "reason"]


@admin.register(Overtime)
class OvertimeAdmin(admin.ModelAdmin):
    list_display = ["employee", "hours", "hourly_rate", "amount", "date_logged"]
    list_filter = ["date_logged"]


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ["employee", "loan_type", "principal", "monthly_installment", "outstanding_balance", "is_active"]
    list_filter = ["is_active"]


@admin.register(LoanRepayment)
class LoanRepaymentAdmin(admin.ModelAdmin):
    list_display = ["loan", "payroll_cycle", "amount", "remaining_balance"]


@admin.register(TaxSlab)
class TaxSlabAdmin(admin.ModelAdmin):
    list_display = ["name", "minimum_income", "maximum_income", "percentage"]


@admin.register(PayrollAdjustment)
class PayrollAdjustmentAdmin(admin.ModelAdmin):
    list_display = ["employee", "reason", "amount", "adjustment_type"]
    list_filter = ["adjustment_type"]


@admin.register(PayrollAuditLog)
class PayrollAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    list_filter = ["action", "timestamp"]
    readonly_fields = ["timestamp"]
