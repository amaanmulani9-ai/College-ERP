import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { LogOut, FileText } from "lucide-react";

interface ResignationItem {
  id: string;
  employee_name: string;
  department: string;
  notice_date: string;
  last_working_day: string;
  reason: string;
  status: "submitted" | "accepted" | "rejected" | "completed";
}

export const ResignationExitPage: React.FC = () => {
  const resignations: ResignationItem[] = [
    { id: "1", employee_name: "Amitabh Sen (Lab Asst)", department: "Computer Science", notice_date: "2026-07-10", last_working_day: "2026-08-10", reason: "Higher studies abroad", status: "accepted" },
  ];

  const columns: ColumnDef<ResignationItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "department", header: "Department" },
    { key: "notice_date", header: "Notice Date" },
    { key: "last_working_day", header: "Last Working Day" },
    { key: "reason", header: "Reason" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "accepted" ? "warning" : r.status === "completed" ? "neutral" : "info"}
        />
      ),
    },
    {
      key: "id",
      header: "Action",
      accessor: (r) => (
        <Button size="xs" variant="ghost" leftIcon={<FileText className="w-3.5 h-3.5" />}>
          Exit Clearance
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Resignations & Exit Clearance"
        subtitle="Manage notice periods, departmental exit clearances & exit interview feedback"
      />

      <DataTable data={resignations} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
