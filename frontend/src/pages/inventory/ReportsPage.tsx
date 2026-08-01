import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { FileSpreadsheet, Printer } from "lucide-react";

interface InventoryReportSummary {
  id: string;
  warehouse_name: string;
  total_items: number;
  total_valuation: number;
  low_stock_count: number;
  issued_this_month: number;
}

export const ReportsPage: React.FC = () => {
  const [reports] = useState<InventoryReportSummary[]>([
    { id: "1", warehouse_name: "Central Main Store", total_items: 280, total_valuation: 8500000, low_stock_count: 3, issued_this_month: 145 },
    { id: "2", warehouse_name: "Chemical & Bio Store", total_items: 95, total_valuation: 2400000, low_stock_count: 2, issued_this_month: 60 },
    { id: "3", warehouse_name: "IT Infrastructure Store", total_items: 75, total_valuation: 1950000, low_stock_count: 1, issued_this_month: 25 },
  ]);

  const columns: ColumnDef<InventoryReportSummary>[] = [
    { key: "warehouse_name", header: "Warehouse Store", sortable: true },
    { key: "total_items", header: "Unique SKU Count" },
    {
      key: "total_valuation",
      header: "Valuation (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.total_valuation.toLocaleString()}</span>,
    },
    { key: "low_stock_count", header: "Low Stock Items" },
    { key: "issued_this_month", header: "Disbursed (Month)" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory Valuation & Stock Audit Reports"
        subtitle="Warehouse store utilization, asset valuation, stock movement history & supplier audits"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<Printer className="w-4 h-4" />}>
              Print Audit Summary
            </Button>
            <Button variant="primary" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Export Stock Report (CSV)
            </Button>
          </div>
        }
      />

      <DataTable data={reports} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
