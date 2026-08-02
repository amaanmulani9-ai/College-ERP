import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus } from "lucide-react";

interface DeductionItem {
  id: string;
  employee_name: string;
  deduction_type: string;
  amount: number;
  is_recurring: boolean;
}

export const DeductionPage: React.FC = () => {
  const deductions: DeductionItem[] = [
    { id: "1", employee_name: "Dr. Rajesh Sharma", deduction_type: "Provident Fund (PF)", amount: 4800, is_recurring: true },
    { id: "2", employee_name: "Prof. Sunita Rao", deduction_type: "Health Insurance Premium", amount: 2200, is_recurring: true },
  ];

  const columns: ColumnDef<DeductionItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "deduction_type", header: "Deduction Type", sortable: true },
    {
      key: "amount",
      header: "Amount (₹)",
      accessor: (r) => <span className="font-mono font-bold text-amber-400">₹{r.amount.toLocaleString()}</span>,
    },
    {
      key: "is_recurring",
      header: "Frequency",
      accessor: (r) => (
        <StatusBadge
          label={r.is_recurring ? "RECURRING" : "ONE-TIME"}
          variant={r.is_recurring ? "warning" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Employee Deductions"
        subtitle="Manage statutory provident fund, professional tax, health insurance & special deductions"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Deduction
          </Button>
        }
      />

      <DataTable data={deductions} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
