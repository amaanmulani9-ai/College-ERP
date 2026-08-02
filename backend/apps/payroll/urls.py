from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.payroll.views import (
    SalaryStructureViewSet,
    SalaryComponentViewSet,
    EmployeeSalaryAssignmentViewSet,
    PayrollCycleViewSet,
    PayrollRunViewSet,
    PayslipViewSet,
    AllowanceViewSet,
    DeductionViewSet,
    BonusViewSet,
    OvertimeViewSet,
    LoanViewSet,
    TaxSlabViewSet,
    PayrollAdjustmentViewSet,
    PayrollAuditLogViewSet,
    payroll_dashboard_kpis,
    payroll_reports,
)

router = DefaultRouter()
router.register(r"salary-structures", SalaryStructureViewSet, basename="salary-structure")
router.register(r"salary-components", SalaryComponentViewSet, basename="salary-component")
router.register(r"salary-assignments", EmployeeSalaryAssignmentViewSet, basename="salary-assignment")
router.register(r"payroll-cycles", PayrollCycleViewSet, basename="payroll-cycle")
router.register(r"payroll-runs", PayrollRunViewSet, basename="payroll-run")
router.register(r"payslips", PayslipViewSet, basename="payslip")
router.register(r"allowances", AllowanceViewSet, basename="allowance")
router.register(r"deductions", DeductionViewSet, basename="deduction")
router.register(r"bonuses", BonusViewSet, basename="bonus")
router.register(r"overtime", OvertimeViewSet, basename="overtime")
router.register(r"loans", LoanViewSet, basename="loan")
router.register(r"tax-slabs", TaxSlabViewSet, basename="tax-slab")
router.register(r"adjustments", PayrollAdjustmentViewSet, basename="payroll-adjustment")
router.register(r"audit-logs", PayrollAuditLogViewSet, basename="payroll-audit-log")

urlpatterns = [
    path("dashboard/kpis/", payroll_dashboard_kpis, name="payroll-kpis"),
    path("reports/", payroll_reports, name="payroll-reports"),
    path("", include(router.urls)),
]
