import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, CreditCard } from "lucide-react";

interface LoanItem {
  id: string;
  employee_name: string;
  loan_type: string;
  principal: number;
  monthly_installment: number;
  outstanding_balance: number;
  is_active: boolean;
}

export const LoanPage: React.FC = () => {
  const loans: LoanItem[] = [
    {
      id: "1",
      employee_name: "Dr. Rajesh Sharma",
      loan_type: "Housing Advance",
      principal: 300000,
      monthly_installment: 15000,
      outstanding_balance: 180000,
      is_active: true,
    },
    {
      id: "2",
      employee_name: "Vikram Malhotra",
      loan_type: "Festival Salary Advance",
      principal: 50000,
      monthly_installment: 5000,
      outstanding_balance: 15000,
      is_active: true,
    },
  ];

  const columns: ColumnDef<LoanItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "loan_type", header: "Loan Type", sortable: true },
    {
      key: "principal",
      header: "Principal (₹)",
      accessor: (r) => <span className="font-mono text-slate-300">₹{r.principal.toLocaleString()}</span>,
    },
    {
      key: "monthly_installment",
      header: "Monthly Deduction (₹)",
      accessor: (r) => <span className="font-mono font-bold text-amber-400">₹{r.monthly_installment.toLocaleString()}</span>,
    },
    {
      key: "outstanding_balance",
      header: "Remaining Balance (₹)",
      accessor: (r) => <span className="font-mono font-bold text-rose-400">₹{r.outstanding_balance.toLocaleString()}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.is_active ? "REPAYING" : "CLOSED"}
          variant={r.is_active ? "warning" : "success"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Employee Loans & Salary Advances"
        subtitle="Issue institutional loans, track monthly auto-deductions & outstanding balances"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Issue New Loan
          </Button>
        }
      />

      <DataTable data={loans} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
