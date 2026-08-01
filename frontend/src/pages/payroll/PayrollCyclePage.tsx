import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  Modal,
  Select,
  ColumnDef,
} from "../../design-system";
import { Calendar, RefreshCw, Lock } from "lucide-react";

interface CycleItem {
  id: string;
  period: string;
  start_date: string;
  end_date: string;
  status: "draft" | "processing" | "completed" | "locked";
  processed_employees: number;
  total_net_payout: number;
}

export const PayrollCyclePage: React.FC = () => {
  const [cycles] = useState<CycleItem[]>([
    {
      id: "1",
      period: "August 2026",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
      status: "processing",
      processed_employees: 142,
      total_net_payout: 8540000,
    },
    {
      id: "2",
      period: "July 2026",
      start_date: "2026-07-01",
      end_date: "2026-07-31",
      status: "completed",
      processed_employees: 140,
      total_net_payout: 8410000,
    },
    {
      id: "3",
      period: "June 2026",
      start_date: "2026-06-01",
      end_date: "2026-06-30",
      status: "locked",
      processed_employees: 138,
      total_net_payout: 8290000,
    },
  ]);

  const columns: ColumnDef<CycleItem>[] = [
    { key: "period", header: "Payroll Month / Year", sortable: true },
    { key: "start_date", header: "Start Date" },
    { key: "end_date", header: "End Date" },
    { key: "processed_employees", header: "Staff Count" },
    {
      key: "total_net_payout",
      header: "Total Payout (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.total_net_payout.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Cycle Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "completed"
              ? "success"
              : r.status === "processing"
              ? "warning"
              : r.status === "locked"
              ? "danger"
              : "neutral"
          }
        />
      ),
    },
    {
      key: "id",
      header: "Action",
      accessor: (r) => (
        <Button size="xs" variant="ghost" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Process Batch
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Monthly Payroll Cycles"
        subtitle="Initialize, batch process, review & lock monthly institution payroll cycles"
        actions={
          <Button variant="primary" leftIcon={<Calendar className="w-4 h-4" />}>
            New Payroll Cycle
          </Button>
        }
      />

      <DataTable data={cycles} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
