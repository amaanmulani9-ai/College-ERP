import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, FileText } from "lucide-react";

interface InvoiceItem {
  id: string;
  invoice_number: string;
  supplier_name: string;
  po_number: string;
  invoice_date: string;
  amount: number;
  payment_status: "unpaid" | "partially_paid" | "paid";
}

export const InvoicePage: React.FC = () => {
  const invoices: InvoiceItem[] = [
    { id: "1", invoice_number: "INV-2026-701", supplier_name: "Dell Enterprise Ltd", po_number: "PO-2026-901", invoice_date: "2026-08-01", amount: 72520, payment_status: "unpaid" },
  ];

  const columns: ColumnDef<InvoiceItem>[] = [
    { key: "invoice_number", header: "Invoice #", sortable: true },
    { key: "supplier_name", header: "Supplier", sortable: true },
    { key: "po_number", header: "PO Ref #" },
    { key: "invoice_date", header: "Invoice Date" },
    {
      key: "amount",
      header: "Amount (₹)",
      accessor: (r) => <span className="font-mono font-bold">₹{r.amount.toLocaleString()}</span>,
    },
    {
      key: "payment_status",
      header: "Payment Status",
      accessor: (r) => (
        <StatusBadge label={r.payment_status.toUpperCase()} variant={r.payment_status === "paid" ? "success" : "danger"} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Purchase Invoices"
        subtitle="Log vendor tax invoices, GST verification & Accounts Payable match"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Log Vendor Invoice
          </Button>
        }
      />

      <DataTable data={invoices} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
