from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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
from apps.payroll.serializers import (
    SalaryStructureSerializer,
    SalaryComponentSerializer,
    EmployeeSalaryAssignmentSerializer,
    PayrollCycleSerializer,
    PayrollRunSerializer,
    PayslipSerializer,
    AllowanceSerializer,
    DeductionSerializer,
    BonusSerializer,
    OvertimeSerializer,
    LoanSerializer,
    LoanRepaymentSerializer,
    TaxSlabSerializer,
    PayrollAdjustmentSerializer,
    PayrollAuditLogSerializer,
)
from apps.payroll.services.payroll_service import PayrollService
from apps.payroll.permissions import IsPayrollAdminOrManager


class SalaryStructureViewSet(viewsets.ModelViewSet):
    queryset = SalaryStructure.objects.filter(is_deleted=False)
    serializer_class = SalaryStructureSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class SalaryComponentViewSet(viewsets.ModelViewSet):
    queryset = SalaryComponent.objects.all()
    serializer_class = SalaryComponentSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class EmployeeSalaryAssignmentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeSalaryAssignment.objects.all()
    serializer_class = EmployeeSalaryAssignmentSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class PayrollCycleViewSet(viewsets.ModelViewSet):
    queryset = PayrollCycle.objects.all()
    serializer_class = PayrollCycleSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]

    @action(detail=True, methods=["post"])
    def process_cycle(self, request, pk=None):
        cycle = PayrollService.process_payroll_cycle(pk, performed_by=request.user)
        return Response(PayrollCycleSerializer(cycle).data)


class PayrollRunViewSet(viewsets.ModelViewSet):
    queryset = PayrollRun.objects.all()
    serializer_class = PayrollRunSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class PayslipViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]


class AllowanceViewSet(viewsets.ModelViewSet):
    queryset = Allowance.objects.all()
    serializer_class = AllowanceSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class DeductionViewSet(viewsets.ModelViewSet):
    queryset = Deduction.objects.all()
    serializer_class = DeductionSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class BonusViewSet(viewsets.ModelViewSet):
    queryset = Bonus.objects.all()
    serializer_class = BonusSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class OvertimeViewSet(viewsets.ModelViewSet):
    queryset = Overtime.objects.all()
    serializer_class = OvertimeSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class TaxSlabViewSet(viewsets.ModelViewSet):
    queryset = TaxSlab.objects.all()
    serializer_class = TaxSlabSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class PayrollAdjustmentViewSet(viewsets.ModelViewSet):
    queryset = PayrollAdjustment.objects.all()
    serializer_class = PayrollAdjustmentSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


class PayrollAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PayrollAuditLog.objects.all()
    serializer_class = PayrollAuditLogSerializer
    permission_classes = [IsAuthenticated, IsPayrollAdminOrManager]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payroll_dashboard_kpis(request):
    kpis = PayrollService.get_payroll_dashboard_kpis()
    return Response(kpis, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPayrollAdminOrManager])
def payroll_reports(request):
    report_type = request.query_params.get("type", "general")
    if report_type == "tax":
        slabs = TaxSlab.objects.all()
        return Response(TaxSlabSerializer(slabs, many=True).data)
    elif report_type == "loans":
        loans = Loan.objects.all()
        return Response(LoanSerializer(loans, many=True).data)
    elif report_type == "allowances":
        allowances = Allowance.objects.all()
        return Response(AllowanceSerializer(allowances, many=True).data)
    elif report_type == "deductions":
        deductions = Deduction.objects.all()
        return Response(DeductionSerializer(deductions, many=True).data)
    else:
        runs = PayrollRun.objects.select_related("employee", "cycle").all()
        return Response(PayrollRunSerializer(runs, many=True).data)
