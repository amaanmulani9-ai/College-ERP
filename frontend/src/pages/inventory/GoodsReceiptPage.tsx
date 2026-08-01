import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, FileCheck } from "lucide-react";

interface GRNItem {
  id: string;
  grn_number: string;
  supplier_name: string;
  purchase_request_num: string;
  received_date: string;
  verified_by_name: string;
}

export const GoodsReceiptPage: React.FC = () => {
  const grns: GRNItem[] = [
    { id: "1", grn_number: "GRN-2026-001", supplier_name: "TechLab Solutions Ltd", purchase_request_num: "PR-2026-0728", received_date: "2026-08-01", verified_by_name: "Store Keeper Ramesh" },
  ];

  const columns: ColumnDef<GRNItem>[] = [
    { key: "grn_number", header: "GRN Number", sortable: true },
    { key: "supplier_name", header: "Supplier", sortable: true },
    { key: "purchase_request_num", header: "Ref PR #" },
    { key: "received_date", header: "Date Received" },
    { key: "verified_by_name", header: "Verified By" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Goods Receipt Notes (GRN)"
        subtitle="Log vendor deliveries, physical verification & stock entry into warehouses"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Goods Receipt Note
          </Button>
        }
      />

      <DataTable data={grns} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
