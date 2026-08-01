import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Percent } from "lucide-react";

interface TaxSlabItem {
  id: string;
  name: string;
  minimum_income: number;
  maximum_income: number | null;
  percentage: number;
}

export const TaxSlabPage: React.FC = () => {
  const slabs: TaxSlabItem[] = [
    { id: "1", name: "FY 2026-27 Tier 1 (Exempt)", minimum_income: 0, maximum_income: 300000, percentage: 0 },
    { id: "2", name: "FY 2026-27 Tier 2 (5%)", minimum_income: 300001, maximum_income: 600000, percentage: 5 },
    { id: "3", name: "FY 2026-27 Tier 3 (10%)", minimum_income: 600001, maximum_income: 900000, percentage: 10 },
    { id: "4", name: "FY 2026-27 Tier 4 (15%)", minimum_income: 900001, maximum_income: 1200000, percentage: 15 },
    { id: "5", name: "FY 2026-27 Tier 5 (20%)", minimum_income: 1200001, maximum_income: 1500000, percentage: 20 },
    { id: "6", name: "FY 2026-27 Top Tier (30%)", minimum_income: 1500001, maximum_income: null, percentage: 30 },
  ];

  const columns: ColumnDef<TaxSlabItem>[] = [
    { key: "name", header: "Tax Regime Slab", sortable: true },
    {
      key: "minimum_income",
      header: "Min Annual Income (₹)",
      accessor: (r) => <span className="font-mono">₹{r.minimum_income.toLocaleString()}</span>,
    },
    {
      key: "maximum_income",
      header: "Max Annual Income (₹)",
      accessor: (r) =>
        r.maximum_income ? (
          <span className="font-mono">₹{r.maximum_income.toLocaleString()}</span>
        ) : (
          <span className="text-slate-400 font-mono">Above ₹{r.minimum_income.toLocaleString()}</span>
        ),
    },
    {
      key: "percentage",
      header: "TDS Tax Rate",
      accessor: (r) => <span className="font-mono font-bold text-amber-400">{r.percentage}%</span>,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Income Tax Slabs & TDS Matrix"
        subtitle="Configure progressive tax slabs, exemption thresholds & annual tax withholding percentages"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Tax Slab
          </Button>
        }
      />

      <DataTable data={slabs} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
