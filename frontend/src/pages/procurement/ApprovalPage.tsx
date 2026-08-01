import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { CheckCircle, XCircle } from "lucide-react";

interface PendingApproval {
  id: string;
  requisition_number: string;
  department_name: string;
  requested_by_name: string;
  estimated_total: number;
  priority: string;
}

export const ApprovalPage: React.FC = () => {
  const approvals: PendingApproval[] = [
    { id: "1", requisition_number: "REQ-2026-101", department_name: "Computer Science & Eng", requested_by_name: "Dr. Rajesh Sharma", estimated_total: 150000, priority: "high" },
  ];

  const columns: ColumnDef<PendingApproval>[] = [
    { key: "requisition_number", header: "Req #", sortable: true },
    { key: "department_name", header: "Department", sortable: true },
    { key: "requested_by_name", header: "Requested By" },
    {
      key: "estimated_total",
      header: "Estimated Total (₹)",
      accessor: (r) => <span className="font-mono font-bold">₹{r.estimated_total.toLocaleString()}</span>,
    },
    {
      key: "priority",
      header: "Priority",
      accessor: (r) => (
        <StatusBadge label={r.priority.toUpperCase()} variant={r.priority === "high" ? "danger" : "warning"} />
      ),
    },
    {
      key: "id",
      header: "Actions",
      accessor: (r) => (
        <div className="flex items-center gap-2">
          <Button size="xs" variant="primary" leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>
            Approve
          </Button>
          <Button size="xs" variant="ghost" className="text-red-400" leftIcon={<XCircle className="w-3.5 h-3.5" />}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Procurement Approval Workflow"
        subtitle="Multi-tier approvals for department heads, finance managers & principal"
      />

      <DataTable data={approvals} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
