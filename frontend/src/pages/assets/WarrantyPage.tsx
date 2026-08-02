import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Shield, Plus } from "lucide-react";

interface WarrantyItem {
  id: string;
  asset_code: string;
  warranty_number: string;
  provider: string;
  start_date: string;
  end_date: string;
  coverage: string;
  status: string;
}

export const WarrantyPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [warranties, setWarranties] = useState<WarrantyItem[]>([
    { id: "1", asset_code: "AST-CS-001", warranty_number: "WRN-DELL-9901", provider: "Dell India Pvt Ltd", start_date: "2024-03-15", end_date: "2027-03-14", coverage: "3-Year On-Site ProSupport Plus", status: "Active" },
    { id: "2", asset_code: "AST-AUD-102", warranty_number: "WRN-EPS-4421", provider: "Epson India", start_date: "2025-06-20", end_date: "2026-08-20", coverage: "Parts and Laser Unit Replacement", status: "Active" },
    { id: "3", asset_code: "AST-ADM-012", warranty_number: "WRN-HP-1102", provider: "HP India Ltd", start_date: "2024-08-01", end_date: "2025-07-31", coverage: "Standard 1-Year Warranty", status: "Expired" },
  ]);

  useEffect(() => {
    fetch("/api/assets/warranties/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setWarranties(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<WarrantyItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "warranty_number", header: "Warranty Card / Policy No" },
    { key: "provider", header: "Warranty Provider" },
    { key: "start_date", header: "Start Date" },
    { key: "end_date", header: "Expiry Date", sortable: true },
    { key: "coverage", header: "Coverage Terms" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Active" ? "success" : r.status === "Expired" ? "danger" : "warning"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Warranties & Guarantee Contracts"
        subtitle="Track warranty cards, OEM coverage terms, and upcoming expiration alerts"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Warranty Card
          </Button>
        }
      />

      <DataTable
        title="Active & Expired Asset Warranties"
        data={warranties}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
