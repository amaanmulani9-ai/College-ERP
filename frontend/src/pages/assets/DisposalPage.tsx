import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Trash2, Plus } from "lucide-react";

interface DisposalItem {
  id: string;
  asset_code: string;
  asset_name: string;
  reason: string;
  disposed_date: string;
  disposal_value: number;
  method: "Auction" | "Scrap" | "Donation";
  status: string;
}

export const DisposalPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [disposals, setDisposals] = useState<DisposalItem[]>([
    { id: "1", asset_code: "AST-OLD-01", asset_name: "Dell OptiPlex 3020 Desktop", reason: "Outdated hardware, end of 7-year life cycle", disposed_date: "2026-05-10", disposal_value: 3500, method: "Scrap", status: "Disposed" },
    { id: "2", asset_code: "AST-BUS-03", asset_name: "Tata Starbus 2012 Model", reason: "Vehicle age limit reached", disposed_date: "2026-06-01", disposal_value: 180000, method: "Auction", status: "Disposed" },
  ]);

  useEffect(() => {
    fetch("/api/assets/disposals/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setDisposals(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<DisposalItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "asset_name", header: "Asset Description", sortable: true },
    { key: "reason", header: "Disposal Reason" },
    { key: "method", header: "Disposal Method" },
    { key: "disposal_value", header: "Scrap / Sale Value (₹)", accessor: (r) => `₹${r.disposal_value.toLocaleString()}` },
    { key: "disposed_date", header: "Disposed Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Disposed" ? "neutral" : "warning"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Disposal & Decommissioning"
        subtitle="Manage end-of-life asset disposals via Auction, Scrap, or Donation"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            New Asset Disposal
          </Button>
        }
      />

      <DataTable
        title="Decommissioned & Disposed Asset Register"
        data={disposals}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
