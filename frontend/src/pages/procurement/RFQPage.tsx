import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Send } from "lucide-react";

interface RFQItem {
  id: string;
  rfq_number: string;
  requisition_number: string;
  issue_date: string;
  closing_date: string;
  status: "open" | "closed" | "evaluated";
}

export const RFQPage: React.FC = () => {
  const rfqs: RFQItem[] = [
    { id: "1", rfq_number: "RFQ-2026-044", requisition_number: "REQ-2026-098", issue_date: "2026-07-28", closing_date: "2026-08-10", status: "open" },
  ];

  const columns: ColumnDef<RFQItem>[] = [
    { key: "rfq_number", header: "RFQ Number", sortable: true },
    { key: "requisition_number", header: "Ref Req #" },
    { key: "issue_date", header: "Issue Date" },
    { key: "closing_date", header: "Closing Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge label={r.status.toUpperCase()} variant={r.status === "open" ? "warning" : "success"} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Request for Quotations (RFQ)"
        subtitle="Floating RFQs to approved vendor suppliers for competitive bidding"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create RFQ
          </Button>
        }
      />

      <DataTable data={rfqs} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
