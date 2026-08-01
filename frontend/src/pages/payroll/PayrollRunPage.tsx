import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Play, Download } from "lucide-react";

interface PayrollRunDetail {
  id: string;
  employee_code: string;
  employee_name: string;
  basic: number;
  allowances: number;
  bonuses: number;
  overtime: number;
  gross: number;
  deductions: number;
  tax: number;
  loan_deduction: number;
  net: number;
  status: "calculated" | "approved" | "paid";
}

export const PayrollRunPage: React.FC = () => {
  const runs: PayrollRunDetail[] = [
    {
      id: "1",
      employee_code: "EMP-1001",
      employee_name: "Dr. Rajesh Sharma",
      basic: 80000,
      allowances: 32000,
      bonuses: 10000,
      overtime: 3000,
      gross: 125000,
      deductions: 6200,
      tax: 18500,
      loan_deduction: 0,
      net: 100300,
      status: "paid",
    },
    {
      id: "2",
      employee_code: "EMP-1002",
      employee_name: "Prof. Sunita Rao",
      basic: 65000,
      allowances: 23000,
      bonuses: 5000,
      overtime: 5000,
      gross: 98000,
      deductions: 4800,
      tax: 12400,
      loan_deduction: 0,
      net: 80800,
      status: "approved",
    },
  ];

  const columns: ColumnDef<PayrollRunDetail>[] = [
    { key: "employee_code", header: "Emp ID", sortable: true },
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "basic", header: "Basic (₹)" },
    { key: "allowances", header: "Allowances (₹)" },
    { key: "bonuses", header: "Bonus (₹)" },
    { key: "overtime", header: "OT (₹)" },
    {
      key: "gross",
      header: "Gross Pay (₹)",
      accessor: (r) => <span className="font-mono text-slate-200">₹{r.gross.toLocaleString()}</span>,
    },
    { key: "tax", header: "Tax (₹)" },
    { key: "loan_deduction", header: "Loan (₹)" },
    {
      key: "net",
      header: "Net Salary (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.net.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "paid" ? "success" : "info"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Payroll Calculation Runs"
        subtitle="Itemized breakdown of earnings, statutory deductions, TDS & net disbursements per staff member"
        actions={
          <Button variant="primary" leftIcon={<Play className="w-4 h-4" />}>
            Run Calculation Batch
          </Button>
        }
      />

      <DataTable data={runs} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
