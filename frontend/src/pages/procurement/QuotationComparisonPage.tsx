import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Award, CheckCircle } from "lucide-react";

interface ComparisonSummary {
  id: string;
  rfq_number: string;
  bidders_count: number;
  lowest_bid: number;
  winning_supplier_name: string;
  status: string;
}

export const QuotationComparisonPage: React.FC = () => {
  const comparisons: ComparisonSummary[] = [
    { id: "1", rfq_number: "RFQ-2026-044", bidders_count: 3, lowest_bid: 138000, winning_supplier_name: "National Electronics Mart", status: "evaluated" },
  ];

  const columns: ColumnDef<ComparisonSummary>[] = [
    { key: "rfq_number", header: "RFQ #", sortable: true },
    { key: "bidders_count", header: "Total Bidders" },
    {
      key: "lowest_bid",
      header: "Lowest Bid (L1)",
      accessor: (r) => <span className="font-mono text-emerald-400 font-bold">₹{r.lowest_bid.toLocaleString()}</span>,
    },
    { key: "winning_supplier_name", header: "Awarded L1 Supplier" },
    {
      key: "status",
      header: "Evaluation Status",
      accessor: (r) => <StatusBadge label={r.status.toUpperCase()} variant="success" />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Quotation Comparison & L1 Matrix"
        subtitle="Evaluate vendor bids, L1 price matrix & awarding contract notes"
      />

      <DataTable data={comparisons} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
