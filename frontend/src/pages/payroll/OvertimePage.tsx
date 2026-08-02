import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Clock } from "lucide-react";

interface OvertimeItem {
  id: string;
  employee_name: string;
  hours: number;
  hourly_rate: number;
  amount: number;
  date_logged: string;
}

export const OvertimePage: React.FC = () => {
  const overtimes: OvertimeItem[] = [
    { id: "1", employee_name: "Vikram Malhotra (Admin)", hours: 14.5, hourly_rate: 350, amount: 5075, date_logged: "2026-07-28" },
    { id: "2", employee_name: "Suresh Kumar (Lab Tech)", hours: 8.0, hourly_rate: 250, amount: 2000, date_logged: "2026-07-29" },
  ];

  const columns: ColumnDef<OvertimeItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "date_logged", header: "Date Logged", sortable: true },
    { key: "hours", header: "Overtime Hours" },
    {
      key: "hourly_rate",
      header: "Rate / Hr (₹)",
      accessor: (r) => <span className="font-mono">₹{r.hourly_rate}</span>,
    },
    {
      key: "amount",
      header: "Total OT Pay (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.amount.toLocaleString()}</span>,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Overtime Log Register"
        subtitle="Track additional working hours, hourly rates & calculated overtime pay"
        actions={
          <Button variant="primary" leftIcon={<Clock className="w-4 h-4" />}>
            Log Overtime Hours
          </Button>
        }
      />

      <DataTable data={overtimes} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
