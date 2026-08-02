import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  StatList,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { ShoppingBag, FileText, CheckCircle, CreditCard, Plus } from "lucide-react";

interface RequisitionOverviewItem {
  id: string;
  requisition_number: string;
  department_name: string;
  requested_by_name: string;
  priority: "low" | "medium" | "high" | "urgent";
  required_date: string;
  status: "draft" | "pending" | "approved" | "rejected" | "converted";
}

export const ProcurementDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    pending_requisitions: 5,
    total_purchase_orders: 28,
    active_purchase_orders: 12,
    open_rfqs: 3,
    pending_invoices: 4,
    active_contracts: 15,
    total_procurement_cost: 4850000,
    pending_payments: 650000,
  });

  const [requisitions] = useState<RequisitionOverviewItem[]>([
    { id: "1", requisition_number: "REQ-2026-101", department_name: "Computer Science & Eng", requested_by_name: "Dr. Rajesh Sharma", priority: "high", required_date: "2026-08-15", status: "pending" },
    { id: "2", requisition_number: "REQ-2026-098", department_name: "Chemistry Lab", requested_by_name: "Prof. Sunita Rao", priority: "urgent", required_date: "2026-08-05", status: "approved" },
    { id: "3", requisition_number: "REQ-2026-095", department_name: "Library Services", requested_by_name: "Librarian Anita Roy", priority: "medium", required_date: "2026-08-20", status: "converted" },
  ]);

  useEffect(() => {
    fetch("/api/procurement/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<RequisitionOverviewItem>[] = [
    { key: "requisition_number", header: "Req #", sortable: true },
    { key: "department_name", header: "Department", sortable: true },
    { key: "requested_by_name", header: "Requested By" },
    {
      key: "priority",
      header: "Priority",
      accessor: (r) => (
        <StatusBadge
          label={r.priority.toUpperCase()}
          variant={r.priority === "urgent" || r.priority === "high" ? "danger" : "warning"}
        />
      ),
    },
    { key: "required_date", header: "Required Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "approved" || r.status === "converted" ? "success" : r.status === "pending" ? "warning" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Procurement & Purchase Management"
        subtitle="Manage requisitions, RFQs, vendor quotations, PO approvals & invoice payments"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            New Purchase Requisition
          </Button>
        }
      />

      <StatList
        stats={[
          { label: "Pending Requisitions", value: kpis.pending_requisitions, isPositive: kpis.pending_requisitions === 0 },
          { label: "Active POs Sent", value: kpis.active_purchase_orders },
          { label: "Open RFQs", value: kpis.open_rfqs },
          { label: "Procurement Budget Spent", value: `₹${(kpis.total_procurement_cost / 100000).toFixed(2)} L` },
          { label: "Pending Vendor Invoices", value: `₹${(kpis.pending_payments / 100000).toFixed(2)} L` },
          { label: "Active Vendor Contracts", value: kpis.active_contracts },
        ]}
      />

      <DataTable
        title="Institutional Requisitions & Procurement Pipeline"
        data={requisitions}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
