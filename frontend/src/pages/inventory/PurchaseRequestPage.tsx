import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, ShoppingCart } from "lucide-react";

interface PRItem {
  id: string;
  request_number: string;
  department_name: string;
  requested_by_name: string;
  status: "draft" | "pending" | "approved" | "rejected" | "ordered";
  created_at: string;
}

export const PurchaseRequestPage: React.FC = () => {
  const requests: PRItem[] = [
    { id: "1", request_number: "PR-2026-0801", department_name: "Computer Science", requested_by_name: "Dr. Rajesh Sharma", status: "pending", created_at: "2026-08-01" },
    { id: "2", request_number: "PR-2026-0728", department_name: "Chemistry Dept", requested_by_name: "Prof. Sunita Rao", status: "approved", created_at: "2026-07-28" },
  ];

  const columns: ColumnDef<PRItem>[] = [
    { key: "request_number", header: "PR Number", sortable: true },
    { key: "department_name", header: "Department", sortable: true },
    { key: "requested_by_name", header: "Requested By" },
    { key: "created_at", header: "Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "approved" ? "success" : r.status === "pending" ? "warning" : "info"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Departmental Purchase Requests (PR)"
        subtitle="Submit store requisitions, track HOD approvals & PO placement"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            New Purchase Request
          </Button>
        }
      />

      <DataTable data={requests} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
