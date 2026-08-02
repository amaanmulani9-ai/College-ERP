import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, ShoppingCart, Printer } from "lucide-react";

interface POItem {
  id: string;
  po_number: string;
  supplier_name: string;
  order_date: string;
  expected_delivery: string;
  grand_total: number;
  status: "draft" | "approved" | "ordered" | "partially_received" | "completed" | "cancelled";
}

export const PurchaseOrderPage: React.FC = () => {
  const pos: POItem[] = [
    { id: "1", po_number: "PO-2026-901", supplier_name: "Dell Enterprise Ltd", order_date: "2026-08-01", expected_delivery: "2026-08-20", grand_total: 72520, status: "ordered" },
    { id: "2", po_number: "PO-2026-880", supplier_name: "National Stationery Mart", order_date: "2026-07-20", expected_delivery: "2026-07-28", grand_total: 18500, status: "completed" },
  ];

  const columns: ColumnDef<POItem>[] = [
    { key: "po_number", header: "PO Number", sortable: true },
    { key: "supplier_name", header: "Vendor Supplier", sortable: true },
    { key: "order_date", header: "Order Date" },
    { key: "expected_delivery", header: "Expected Delivery" },
    {
      key: "grand_total",
      header: "PO Total (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.grand_total.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "completed" ? "success" : r.status === "ordered" ? "warning" : "info"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Purchase Orders (PO)"
        subtitle="Generate, issue & track institutional purchase orders to suppliers"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Purchase Order
          </Button>
        }
      />

      <DataTable data={pos} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
