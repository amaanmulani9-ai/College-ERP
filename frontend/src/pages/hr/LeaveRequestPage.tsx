import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Calendar, Plus, CheckCircle } from "lucide-react";

interface HRLeaveItem {
  id: string;
  employee_name: string;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

export const LeaveRequestPage: React.FC = () => {
  const requests: HRLeaveItem[] = [
    { id: "1", employee_name: "Dr. Rajesh Sharma", leave_type_name: "Annual Leave", start_date: "2026-08-10", end_date: "2026-08-15", reason: "Family vacation", status: "pending" },
    { id: "2", employee_name: "Prof. Sunita Rao", leave_type_name: "Sick Leave", start_date: "2026-07-28", end_date: "2026-07-30", reason: "Medical recovery", status: "approved" },
  ];

  const columns: ColumnDef<HRLeaveItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "leave_type_name", header: "Leave Type", sortable: true },
    { key: "start_date", header: "Start Date" },
    { key: "end_date", header: "End Date" },
    { key: "reason", header: "Reason" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "approved" ? "success" : r.status === "pending" ? "warning" : "danger"}
        />
      ),
    },
    {
      key: "id",
      header: "Action",
      accessor: (r) =>
        r.status === "pending" ? (
          <Button size="xs" variant="primary" leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>
            Approve
          </Button>
        ) : null,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Leave Requests & Approvals"
        subtitle="Review staff leave applications, entitlement balances & HOD approvals"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Apply for Leave
          </Button>
        }
      />

      <DataTable data={requests} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
