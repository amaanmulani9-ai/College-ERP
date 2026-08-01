import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, FileSpreadsheet } from "lucide-react";

interface QuotationItem {
  id: string;
  rfq_number: string;
  supplier_name: string;
  quoted_amount: number;
  delivery_days: number;
  warranty_months: number;
  status: "submitted" | "shortlisted" | "selected" | "rejected";
}

export const QuotationPage: React.FC = () => {
  const quotations: QuotationItem[] = [
    { id: "1", rfq_number: "RFQ-2026-044", supplier_name: "TechLab Solutions Ltd", quoted_amount: 142000, delivery_days: 7, warranty_months: 12, status: "submitted" },
    { id: "2", rfq_number: "RFQ-2026-044", supplier_name: "National Electronics Mart", quoted_amount: 138000, delivery_days: 10, warranty_months: 24, status: "shortlisted" },
  ];

  const columns: ColumnDef<QuotationItem>[] = [
    { key: "rfq_number", header: "RFQ #", sortable: true },
    { key: "supplier_name", header: "Bidding Supplier", sortable: true },
    {
      key: "quoted_amount",
      header: "Quoted Amount (₹)",
      accessor: (r) => <span className="font-mono font-bold">₹{r.quoted_amount.toLocaleString()}</span>,
    },
    { key: "delivery_days", header: "Delivery Lead (Days)" },
    { key: "warranty_months", header: "Warranty (Months)" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge label={r.status.toUpperCase()} variant={r.status === "shortlisted" || r.status === "selected" ? "success" : "neutral"} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Vendor Bids & Quotations"
        subtitle="Log received vendor bids, price breakdowns, warranties & delivery lead times"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Log Vendor Quotation
          </Button>
        }
      />

      <DataTable data={quotations} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
