import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
  StatList,
} from "../../design-system";
import { TrendingDown, Calculator, Play } from "lucide-react";

interface DepreciationItem {
  id: string;
  asset_code: string;
  method: "Straight Line" | "Written Down Value";
  annual_percentage: number;
  book_value: number;
  accumulated_depreciation: number;
  depreciation_date: string;
}

export const DepreciationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [depreciations, setDepreciations] = useState<DepreciationItem[]>([
    { id: "1", asset_code: "AST-CS-001", method: "Straight Line", annual_percentage: 15.0, book_value: 380000, accumulated_depreciation: 70000, depreciation_date: "2026-03-31" },
    { id: "2", asset_code: "AST-ME-045", method: "Written Down Value", annual_percentage: 10.0, book_value: 950000, accumulated_depreciation: 250000, depreciation_date: "2026-03-31" },
    { id: "3", asset_code: "AST-AUD-102", method: "Straight Line", annual_percentage: 20.0, book_value: 140000, accumulated_depreciation: 40000, depreciation_date: "2026-03-31" },
  ]);

  const handleRunDepreciation = () => {
    fetch("/api/assets/depreciations/calculate_all/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annual_percentage: 10.0, method: "Straight Line" }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Depreciation calculated for ${data.calculated_count} asset(s).`);
      })
      .catch((err) => console.error(err));
  };

  const columns: ColumnDef<DepreciationItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "method", header: "Depreciation Method" },
    { key: "annual_percentage", header: "Annual Rate (%)", accessor: (r) => `${r.annual_percentage}%` },
    { key: "book_value", header: "Current Book Value (₹)", accessor: (r) => `₹${r.book_value.toLocaleString()}` },
    { key: "accumulated_depreciation", header: "Accumulated Depreciation (₹)", accessor: (r) => `₹${r.accumulated_depreciation.toLocaleString()}` },
    { key: "depreciation_date", header: "Calculation Date" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Depreciation Calculator & Ledger"
        subtitle="Straight Line Method (SLM) & Written Down Value (WDV) annual financial book value calculations"
        actions={
          <Button variant="primary" leftIcon={<Play className="w-4 h-4" />} onClick={handleRunDepreciation}>
            Run Annual Depreciation Engine
          </Button>
        }
      />

      <StatList
        stats={[
          { label: "Total Book Value", value: "₹4.85 Cr" },
          { label: "Total Depreciation Year-to-Date", value: "₹36.50 Lakhs" },
          { label: "SLM Assets", value: 280 },
          { label: "WDV Assets", value: 60 },
        ]}
      />

      <DataTable
        title="Asset Financial Valuation & Depreciation Ledger"
        data={depreciations}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={false}
      />
    </PageContainer>
  );
};
