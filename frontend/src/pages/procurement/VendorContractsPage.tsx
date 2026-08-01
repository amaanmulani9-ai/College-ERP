import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, FileText, Calendar } from "lucide-react";

interface ContractItem {
  id: string;
  contract_number: string;
  supplier_name: string;
  start_date: string;
  end_date: string;
  renewal_date: string;
  status: "active" | "expired" | "renewed";
}

export const VendorContractsPage: React.FC = () => {
  const contracts: ContractItem[] = [
    { id: "1", contract_number: "CNT-2026-012", supplier_name: "Dell Enterprise Ltd", start_date: "2026-01-01", end_date: "2026-12-31", renewal_date: "2026-11-30", status: "active" },
  ];

  const columns: ColumnDef<ContractItem>[] = [
    { key: "contract_number", header: "Contract #", sortable: true },
    { key: "supplier_name", header: "Vendor Supplier", sortable: true },
    { key: "start_date", header: "Start Date" },
    { key: "end_date", header: "Expiry Date" },
    { key: "renewal_date", header: "Renewal Notice Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge label={r.status.toUpperCase()} variant={r.status === "active" ? "success" : "danger"} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Vendor Contracts & SLA Agreements"
        subtitle="Track institutional supplier contracts, AMC terms & renewal notices"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Vendor Contract
          </Button>
        }
      />

      <DataTable data={contracts} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
