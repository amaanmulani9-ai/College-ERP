import uuid
from datetime import date
from decimal import Decimal
from django.db import transaction
from django.db.models import Sum, Count
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
from apps.staff.models import Employee


class PayrollService:
    @staticmethod
    def log_audit_event(action: str, performed_by=None, details=None):
        return PayrollAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {},
        )

    @staticmethod
    def assign_salary_structure(employee_id: str, salary_structure_id: str, effective_date=None, performed_by=None) -> EmployeeSalaryAssignment:
        assignment, _ = EmployeeSalaryAssignment.objects.update_or_create(
            employee_id=employee_id,
            defaults={
                "salary_structure_id": salary_structure_id,
                "effective_date": effective_date or date.today(),
                "status": "active",
            },
        )
        PayrollService.log_audit_event("assign_salary_structure", performed_by, {"employee_id": employee_id})
        return assignment

    @staticmethod
    def calculate_tax(taxable_income: Decimal) -> Decimal:
        slabs = TaxSlab.objects.all().order_by("minimum_income")
        if not slabs.exists():
            # Default fallback progressive tax estimation
            if taxable_income > 100000:
                return Decimal(str(taxable_income)) * Decimal("0.15")
            return Decimal("0.00")

        total_tax = Decimal("0.00")
        for slab in slabs:
            if taxable_income > slab.minimum_income:
                if slab.maximum_income and taxable_income > slab.maximum_income:
                    taxable_amount = slab.maximum_income - slab.minimum_income
                else:
                    taxable_amount = taxable_income - slab.minimum_income
                total_tax += taxable_amount * (slab.percentage / Decimal("100"))
        return total_tax

    @staticmethod
    @transaction.atomic
    def process_employee_payroll_run(employee: Employee, cycle: PayrollCycle, performed_by=None) -> PayrollRun:
        # Check salary assignment
        assignment = EmployeeSalaryAssignment.objects.filter(employee=employee, status="active").first()
        basic = assignment.salary_structure.basic_salary if assignment else Decimal("35000.00")

        # Sum allowances
        all_allowances = Allowance.objects.filter(employee=employee).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")
        
        # Sum bonuses
        all_bonuses = Bonus.objects.filter(employee=employee).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

        # Sum overtime
        all_overtime = Overtime.objects.filter(employee=employee).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

        # Sum deductions
        all_deductions = Deduction.objects.filter(employee=employee).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

        # Loan deductions
        active_loan = Loan.objects.filter(employee=employee, is_active=True, outstanding_balance__gt=0).first()
        loan_installment = Decimal("0.00")
        if active_loan:
            loan_installment = min(active_loan.monthly_installment, active_loan.outstanding_balance)
            active_loan.outstanding_balance -= loan_installment
            if active_loan.outstanding_balance <= 0:
                active_loan.is_active = False
            active_loan.save()

            LoanRepayment.objects.create(
                loan=active_loan,
                payroll_cycle=cycle,
                amount=loan_installment,
                remaining_balance=active_loan.outstanding_balance,
            )

        # Gross Salary
        gross = basic + Decimal(str(all_allowances)) + Decimal(str(all_bonuses)) + Decimal(str(all_overtime))
        
        # Calculate Tax
        tax_amount = PayrollService.calculate_tax(gross)

        # Net Salary
        net = gross - Decimal(str(all_deductions)) - tax_amount - loan_installment

        payroll_run, _ = PayrollRun.objects.update_or_create(
            employee=employee,
            cycle=cycle,
            defaults={
                "basic_salary": basic,
                "allowances": all_allowances,
                "bonuses": all_bonuses,
                "overtime": all_overtime,
                "gross_salary": gross,
                "deductions": all_deductions,
                "tax": tax_amount,
                "loan_deduction": loan_installment,
                "net_salary": max(Decimal("0.00"), net),
                "status": "calculated",
            },
        )

        PayrollService.generate_payslip(payroll_run, performed_by=performed_by)
        return payroll_run

    @staticmethod
    def generate_payslip(payroll_run: PayrollRun, performed_by=None) -> Payslip:
        payslip_num = f"PAY-{payroll_run.cycle.year}-{payroll_run.cycle.month:02d}-{uuid.uuid4().hex[:6].upper()}"
        qr_data = f"PAYSLIP:{payslip_num}|EMP:{payroll_run.employee.employee_id}|NET:₹{payroll_run.net_salary}"

        payslip, _ = Payslip.objects.update_or_create(
            payroll_run=payroll_run,
            defaults={
                "payslip_number": payslip_num,
                "employee": payroll_run.employee,
                "issue_date": date.today(),
                "qr_code_data": qr_data,
            },
        )
        return payslip

    @staticmethod
    @transaction.atomic
    def process_payroll_cycle(cycle_id: str, performed_by=None) -> PayrollCycle:
        cycle = PayrollCycle.objects.get(id=cycle_id)
        cycle.status = "processing"
        cycle.save()

        employees = Employee.objects.filter(employment_status="active")
        for emp in employees:
            PayrollService.process_employee_payroll_run(emp, cycle, performed_by=performed_by)

        cycle.status = "completed"
        cycle.save()
        PayrollService.log_audit_event("process_payroll_cycle", performed_by, {"cycle_id": cycle_id})
        return cycle

    @staticmethod
    def get_payroll_dashboard_kpis() -> dict:
        total_runs = PayrollRun.objects.count()
        total_payroll_amount = PayrollRun.objects.aggregate(total=Sum("net_salary"))["total"] or Decimal("0.00")
        total_bonuses = Bonus.objects.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")
        total_overtime = Overtime.objects.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")
        total_tax_collected = PayrollRun.objects.aggregate(total=Sum("tax"))["total"] or Decimal("0.00")
        total_loan_balance = Loan.objects.filter(is_active=True).aggregate(total=Sum("outstanding_balance"))["total"] or Decimal("0.00")

        pending_runs = PayrollRun.objects.filter(status="pending").count()
        completed_runs = PayrollRun.objects.filter(status="calculated").count() + PayrollRun.objects.filter(status="approved").count() + PayrollRun.objects.filter(status="paid").count()

        return {
            "employees_processed": total_runs,
            "total_payroll_amount": float(total_payroll_amount),
            "total_bonuses": float(total_bonuses),
            "total_overtime_cost": float(total_overtime),
            "total_tax_collected": float(total_tax_collected),
            "total_loan_balance": float(total_loan_balance),
            "pending_runs": pending_runs,
            "completed_runs": completed_runs,
        }
