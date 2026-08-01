import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  StatList,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { DollarSign, FileText, Calendar, Plus, RefreshCw, Layers } from "lucide-react";

interface PayrollRunOverview {
  id: string;
  employee_id_code: string;
  employee_name: string;
  department_name: string;
  gross_salary: number;
  tax: number;
  deductions: number;
  net_salary: number;
  status: "pending" | "calculated" | "approved" | "paid";
}

export const PayrollDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    employees_processed: 142,
    total_payroll_amount: 8540000,
    total_bonuses: 350000,
    total_overtime_cost: 125000,
    total_tax_collected: 980000,
    total_loan_balance: 450000,
    pending_runs: 5,
    completed_runs: 137,
  });

  const [recentRuns, setRecentRuns] = useState<PayrollRunOverview[]>([
    {
      id: "1",
      employee_id_code: "EMP-1001",
      employee_name: "Dr. Rajesh Sharma",
      department_name: "Computer Science",
      gross_salary: 125000,
      tax: 18500,
      deductions: 6200,
      net_salary: 100300,
      status: "paid",
    },
    {
      id: "2",
      employee_id_code: "EMP-1002",
      employee_name: "Prof. Sunita Rao",
      department_name: "Electrical Eng",
      gross_salary: 98000,
      tax: 12400,
      deductions: 4800,
      net_salary: 80800,
      status: "approved",
    },
    {
      id: "3",
      employee_id_code: "EMP-1003",
      employee_name: "Vikram Malhotra",
      department_name: "Administration",
      gross_salary: 55000,
      tax: 4200,
      deductions: 2500,
      net_salary: 48300,
      status: "calculated",
    },
  ]);

  useEffect(() => {
    fetch("/api/payroll/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<PayrollRunOverview>[] = [
    { key: "employee_id_code", header: "Emp ID", sortable: true },
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "department_name", header: "Department" },
    {
      key: "gross_salary",
      header: "Gross Salary (₹)",
      accessor: (r) => <span className="font-mono text-slate-300">₹{r.gross_salary.toLocaleString()}</span>,
    },
    {
      key: "tax",
      header: "Tax (₹)",
      accessor: (r) => <span className="font-mono text-amber-400">₹{r.tax.toLocaleString()}</span>,
    },
    {
      key: "net_salary",
      header: "Net Payable (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.net_salary.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "paid"
              ? "success"
              : r.status === "approved"
              ? "info"
              : r.status === "calculated"
              ? "warning"
              : "neutral"
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Enterprise Payroll System"
        subtitle="Manage salary structures, monthly payroll runs, automated tax slabs, loans & payslips"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Process Cycle
            </Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              New Payroll Run
            </Button>
          </div>
        }
      />

      <StatList
        stats={[
          { label: "Employees Processed", value: `${kpis.completed_runs} / ${kpis.employees_processed}` },
          { label: "Total Net Payroll", value: `₹${(kpis.total_payroll_amount / 100000).toFixed(2)} Lakhs` },
          { label: "Tax Collected (TDS)", value: `₹${(kpis.total_tax_collected / 100000).toFixed(2)} Lakhs` },
          { label: "Bonuses Disbursed", value: `₹${kpis.total_bonuses.toLocaleString()}` },
          { label: "Overtime Cost", value: `₹${kpis.total_overtime_cost.toLocaleString()}` },
          { label: "Active Loan Balances", value: `₹${kpis.total_loan_balance.toLocaleString()}` },
        ]}
      />

      <DataTable
        title="Recent Monthly Payroll Calculations"
        data={recentRuns}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
