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

interface AllowanceItem {
  id: string;
  employee_name: string;
  allowance_type: string;
  amount: number;
  is_recurring: boolean;
}

export const AllowancePage: React.FC = () => {
  const allowances: AllowanceItem[] = [
    { id: "1", employee_name: "Dr. Rajesh Sharma", allowance_type: "House Rent Allowance (HRA)", amount: 32000, is_recurring: true },
    { id: "2", employee_name: "Prof. Sunita Rao", allowance_type: "Research & Travel Grant", amount: 15000, is_recurring: false },
  ];

  const columns: ColumnDef<AllowanceItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "allowance_type", header: "Allowance Type", sortable: true },
    {
      key: "amount",
      header: "Amount (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.amount.toLocaleString()}</span>,
    },
    {
      key: "is_recurring",
      header: "Frequency",
      accessor: (r) => (
        <StatusBadge
          label={r.is_recurring ? "MONTHLY RECURRING" : "ONE-TIME"}
          variant={r.is_recurring ? "success" : "info"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Employee Allowances"
        subtitle="Manage recurring HRA, DA, transport & one-off research or special allowances"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Allowance
          </Button>
        }
      />

      <DataTable data={allowances} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
