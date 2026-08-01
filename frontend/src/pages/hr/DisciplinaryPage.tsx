import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { AlertTriangle, Plus } from "lucide-react";

interface DisciplinaryItem {
  id: string;
  employee_name: string;
  category: string;
  reason: string;
  action_taken: string;
  status: "open" | "under_inquiry" | "resolved" | "closed";
}

export const DisciplinaryPage: React.FC = () => {
  const actions: DisciplinaryItem[] = [
    { id: "1", employee_name: "Rakesh Verma", category: "Attendance Non-Compliance", reason: "Repeated unauthorized absence for 4 consecutive days", action_taken: "Show Cause Notice Issued", status: "open" },
  ];

  const columns: ColumnDef<DisciplinaryItem>[] = [
    { key: "employee_name", header: "Employee Name", sortable: true },
    { key: "category", header: "Violation Category", sortable: true },
    { key: "reason", header: "Description / Incident" },
    { key: "action_taken", header: "Action Enforced" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "open" ? "danger" : "success"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Disciplinary Actions & Compliance"
        subtitle="Log policy violations, inquiry hearings, warning letters & disciplinary proceedings"
        actions={
          <Button variant="danger" leftIcon={<AlertTriangle className="w-4 h-4" />}>
            Log Disciplinary Incident
          </Button>
        }
      />

      <DataTable data={actions} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
