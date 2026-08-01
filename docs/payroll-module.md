# Enterprise Payroll Management System — Architecture & Specification

**Version:** v0.23.0  
**Updated:** August 1, 2026  
**Module:** `backend/apps/payroll/` & `frontend/src/pages/payroll/`

---

## 1. Overview

The Enterprise Payroll Management System delivers institutional salary structure configurations, progressive tax slab handling (TDS), automated monthly payroll cycle processing, staff allowances/deductions, performance bonuses, overtime logs, employee loans/salary advance auto-repayments, digital QR-verified payslip generation, and compliance audit logging.

---

## 2. Backend Architecture (`backend/apps/payroll/`)

### Data Models
- **SalaryStructure:** Baseline salary tiers and grade bands (`structure_code`, `structure_name`, `basic_salary`, `grade`).
- **SalaryComponent:** Earning/deduction components (`component_name`, `component_type`, `taxable`, `formula`).
- **EmployeeSalaryAssignment:** Maps `Employee` (from `apps.staff`) to `SalaryStructure`.
- **PayrollCycle:** Monthly periods (`month`, `year`, `start_date`, `end_date`, `status`: Draft, Processing, Completed, Locked).
- **PayrollRun:** Calculated pay per employee (`basic_salary`, `allowances`, `bonuses`, `overtime`, `gross_salary`, `deductions`, `tax`, `loan_deduction`, `net_salary`).
- **Payslip:** Official slip (`payslip_number`, `qr_code_data`, `issue_date`).
- **Allowance:** Employee allowance entries (`allowance_type`, `amount`, `is_recurring`).
- **Deduction:** Statutory & custom deductions (`deduction_type`, `amount`, `is_recurring`).
- **Bonus:** Performance rewards & festival bonuses (`bonus_type`, `amount`, `reason`).
- **Overtime:** Overtime hours & hourly rate log (`hours`, `hourly_rate`, `amount`).
- **Loan & LoanRepayment:** Employee loan management with auto-deduction during payroll runs (`principal`, `monthly_installment`, `outstanding_balance`).
- **TaxSlab:** Income tax slabs & percentage rates (`minimum_income`, `maximum_income`, `percentage`).
- **PayrollAdjustment:** Manual additions/deductions.
- **PayrollAuditLog:** Full module audit trail.

### Service Layer (`services/payroll_service.py`)
- `assign_salary_structure()`, `calculate_tax()`, `process_employee_payroll_run()`, `generate_payslip()`, `process_payroll_cycle()`, `get_payroll_dashboard_kpis()`.

### REST API Endpoints (`/api/payroll/`)
- `/api/payroll/salary-structures/`
- `/api/payroll/salary-components/`
- `/api/payroll/salary-assignments/`
- `/api/payroll/payroll-cycles/` (with `/process_cycle/` action)
- `/api/payroll/payroll-runs/`
- `/api/payroll/payslips/`
- `/api/payroll/allowances/`
- `/api/payroll/deductions/`
- `/api/payroll/bonuses/`
- `/api/payroll/overtime/`
- `/api/payroll/loans/`
- `/api/payroll/tax-slabs/`
- `/api/payroll/adjustments/`
- `/api/payroll/audit-logs/`
- `/api/payroll/dashboard/kpis/`
- `/api/payroll/reports/`

---

## 3. Frontend Pages (`frontend/src/pages/payroll/`)

Built strictly using the Enterprise Design System (`@/design-system`):
- `PayrollDashboardPage.tsx` — KPI summary cards, active payroll runs, tax collected & loan balances
- `SalaryStructurePage.tsx` — Salary structure & pay grade registry
- `SalaryComponentPage.tsx` — Earning & deduction formula definitions
- `EmployeeSalaryPage.tsx` — Employee salary structure mappings
- `PayrollCyclePage.tsx` — Monthly cycle workflow manager
- `PayrollRunPage.tsx` — Itemized payroll calculation run table
- `PayslipPage.tsx` — Payslip register & interactive QR-verified payslip viewer modal
- `AllowancePage.tsx` — Recurring & one-time allowances
- `DeductionPage.tsx` — Statutory & custom deductions
- `BonusPage.tsx` — Performance bonuses & festival incentives
- `OvertimePage.tsx` — Overtime hours & pay logs
- `LoanPage.tsx` — Employee loan management & repayment tracking
- `TaxSlabPage.tsx` — Progressive TDS tax slabs matrix
- `ReportsPage.tsx` — Departmental salary summaries & tax audit reports

---

## 4. Verification & Testing

- **Backend Pytest:** `tests/test_payroll.py` ➔ **All 8 tests passed (100%)**
- **TypeScript Audit:** `npx tsc --noEmit` ➔ **0 Errors**
- **Production Build:** `npm run build` ➔ **Clean Vite production build**
