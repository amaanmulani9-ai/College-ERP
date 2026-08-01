"""
Payroll Management System Models
===============================
SalaryStructure           – Salary grades and basic pay rules
SalaryComponent           – Earnings & Deduction component definitions
EmployeeSalaryAssignment  – Employee salary structure assignment
PayrollCycle              – Monthly payroll period tracking (Draft, Processing, Completed, Locked)
PayrollRun                – Individual employee calculated gross/net pay
Payslip                   – Official payslips with QR validation
Allowance                 – Recurring/One-off employee allowances
Deduction                 – Recurring/One-off employee deductions
Bonus                     – Performance bonuses
Overtime                  – Overtime hours & rate logs
Loan                      – Employee loans & advances
LoanRepayment             – Monthly installment repayment history
TaxSlab                   – Tax slabs & percentage tiers
PayrollAdjustment         – Manual salary additions or deductions
PayrollAuditLog           – Payroll module audit trails
"""

import uuid
from django.conf import settings
from django.db import models
from apps.staff.models import Employee


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Salary Structure & Components
# ---------------------------------------------------------------------------
class SalaryStructure(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    structure_code = models.CharField(max_length=50, unique=True, db_index=True)
    structure_name = models.CharField(max_length=150)
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
    grade = models.CharField(max_length=50, blank=True, default="Grade A")
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["structure_code"]
        verbose_name = "Salary Structure"
        verbose_name_plural = "Salary Structures"

    def __str__(self):
        return f"{self.structure_name} ({self.structure_code})"


class SalaryComponent(models.Model):
    TYPE_CHOICES = [
        ("earning", "Earning"),
        ("deduction", "Deduction"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    component_name = models.CharField(max_length=100, unique=True)
    component_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="earning")
    taxable = models.BooleanField(default=True)
    formula = models.CharField(max_length=255, blank=True, default="BASIC * 0.10")
    display_order = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "component_name"]
        verbose_name = "Salary Component"
        verbose_name_plural = "Salary Components"

    def __str__(self):
        return f"{self.component_name} [{self.component_type}]"


class EmployeeSalaryAssignment(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("terminated", "Terminated"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name="salary_assignment")
    salary_structure = models.ForeignKey(SalaryStructure, on_delete=models.PROTECT, related_name="assignments")
    effective_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-effective_date"]
        verbose_name = "Employee Salary Assignment"
        verbose_name_plural = "Employee Salary Assignments"

    def __str__(self):
        return f"Salary Assignment: {self.employee.employee_id} -> {self.salary_structure.structure_name}"


# ---------------------------------------------------------------------------
# Payroll Cycle & Runs
# ---------------------------------------------------------------------------
class PayrollCycle(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("locked", "Locked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    month = models.PositiveIntegerField() # 1-12
    year = models.PositiveIntegerField() # e.g. 2026
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-month"]
        unique_together = ("month", "year")
        verbose_name = "Payroll Cycle"
        verbose_name_plural = "Payroll Cycles"

    def __str__(self):
        return f"Payroll Cycle {self.month}/{self.year} [{self.status}]"


class PayrollRun(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("calculated", "Calculated"),
        ("approved", "Approved"),
        ("paid", "Paid"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payroll_runs")
    cycle = models.ForeignKey(PayrollCycle, on_delete=models.CASCADE, related_name="payroll_runs")
    
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    bonuses = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    overtime = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    loan_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="calculated", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-cycle__year", "-cycle__month"]
        unique_together = ("employee", "cycle")
        verbose_name = "Payroll Run"
        verbose_name_plural = "Payroll Runs"

    def __str__(self):
        return f"PayrollRun: {self.employee.employee_id} ({self.cycle.month}/{self.cycle.year}) = ₹{self.net_salary}"


class Payslip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payslip_number = models.CharField(max_length=50, unique=True, db_index=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payslips")
    payroll_run = models.OneToOneField(PayrollRun, on_delete=models.CASCADE, related_name="payslip")
    issue_date = models.DateField(auto_now_add=True)
    payment_date = models.DateField(null=True, blank=True)
    qr_code_data = models.TextField(blank=True, default="")
    pdf_file_url = models.CharField(max_length=255, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-issue_date"]
        verbose_name = "Payslip"
        verbose_name_plural = "Payslips"

    def __str__(self):
        return f"Payslip {self.payslip_number} - {self.employee.employee_id}"


# ---------------------------------------------------------------------------
# Allowances, Deductions, Bonuses & Overtime
# ---------------------------------------------------------------------------
class Allowance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="allowances")
    allowance_type = models.CharField(max_length=100) # e.g. HRA, Medical, Transport
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_recurring = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Allowance"
        verbose_name_plural = "Allowances"

    def __str__(self):
        return f"{self.allowance_type}: ₹{self.amount} for {self.employee.employee_id}"


class Deduction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="deductions")
    deduction_type = models.CharField(max_length=100) # e.g. Provident Fund, Health Insurance
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_recurring = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Deduction"
        verbose_name_plural = "Deductions"

    def __str__(self):
        return f"{self.deduction_type}: ₹{self.amount} for {self.employee.employee_id}"


class Bonus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="bonuses")
    bonus_type = models.CharField(max_length=100) # e.g. Performance, Festival
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Bonus"
        verbose_name_plural = "Bonuses"

    def __str__(self):
        return f"Bonus: ₹{self.amount} ({self.bonus_type}) -> {self.employee.employee_id}"


class Overtime(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="overtime_records")
    hours = models.DecimalField(max_digits=6, decimal_places=2)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date_logged = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_logged"]
        verbose_name = "Overtime"
        verbose_name_plural = "Overtimes"

    def __str__(self):
        return f"Overtime: {self.hours} hrs @ ₹{self.hourly_rate}/hr ({self.employee.employee_id})"


# ---------------------------------------------------------------------------
# Loans & Repayment
# ---------------------------------------------------------------------------
class Loan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="loans")
    loan_type = models.CharField(max_length=100, default="Personal Advance")
    principal = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    installments = models.PositiveIntegerField(default=12)
    monthly_installment = models.DecimalField(max_digits=12, decimal_places=2)
    outstanding_balance = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Loan"
        verbose_name_plural = "Loans"

    def __str__(self):
        return f"Loan: ₹{self.principal} ({self.employee.employee_id}) - Bal: ₹{self.outstanding_balance}"


class LoanRepayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name="repayments")
    payroll_cycle = models.ForeignKey(PayrollCycle, on_delete=models.CASCADE, related_name="loan_repayments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    remaining_balance = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Loan Repayment"
        verbose_name_plural = "Loan Repayments"

    def __str__(self):
        return f"Repayment: ₹{self.amount} for Loan {self.loan.id}"


# ---------------------------------------------------------------------------
# Tax Slabs & Adjustments & Audit Logs
# ---------------------------------------------------------------------------
class TaxSlab(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100) # e.g. Slabs FY2026-27
    minimum_income = models.DecimalField(max_digits=12, decimal_places=2)
    maximum_income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["minimum_income"]
        verbose_name = "Tax Slab"
        verbose_name_plural = "Tax Slabs"

    def __str__(self):
        return f"Tax Slab: {self.name} ({self.percentage}%)"


class PayrollAdjustment(models.Model):
    TYPE_CHOICES = [
        ("addition", "Addition"),
        ("deduction", "Deduction"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payroll_adjustments")
    reason = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    adjustment_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="addition")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Payroll Adjustment"
        verbose_name_plural = "Payroll Adjustments"

    def __str__(self):
        return f"Adjustment: {self.adjustment_type} ₹{self.amount} ({self.reason})"


class PayrollAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Payroll Audit Log"
        verbose_name_plural = "Payroll Audit Logs"

    def __str__(self):
        return f"[{self.timestamp}] {self.action}"
