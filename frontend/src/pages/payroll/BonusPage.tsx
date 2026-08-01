import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Award } from "lucide-react";

interface BonusItem {
  id: string;
  employee_name: string;
  bonus_type: string;
  amount: number;
  reason: string;
}

export const BonusPage: React.FC = () => {
  const bonuses: BonusItem[] = [
    { id: "1", employee_name: "Dr. Rajesh Sharma", bonus_type: "Research Publication Bonus", amount: 25000, reason: "Published IEEE Q1 Journal Paper" },
    { id: "2", employee_name: "Prof. Sunita Rao", bonus_type: "Annual Festival Bonus", amount: 15000, reason: "Diwali Institutional Bonus 2026" },
  ];

  const columns: ColumnDef<BonusItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "bonus_type", header: "Bonus Category", sortable: true },
    {
      key: "amount",
      header: "Bonus Amount (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.amount.toLocaleString()}</span>,
    },
    { key: "reason", header: "Justification / Note" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Performance & Festival Bonuses"
        subtitle="Log special performance incentives, research rewards & annual festival bonuses"
        actions={
          <Button variant="primary" leftIcon={<Award className="w-4 h-4" />}>
            Grant Bonus
          </Button>
        }
      />

      <DataTable data={bonuses} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
