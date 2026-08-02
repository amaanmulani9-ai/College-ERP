import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StockRecord {
  id: string;
  item_code: string;
  item_name: string;
  warehouse_name: string;
  quantity_on_hand: number;
  reserved_quantity: number;
  available_quantity: number;
  average_cost: number;
  total_value: number;
}

export const StockPage: React.FC = () => {
  const stocks: StockRecord[] = [
    { id: "1", item_code: "ITEM-RES-101", item_name: "Resistor Pack 10K Ohm", warehouse_name: "Central Main Store", quantity_on_hand: 50, reserved_quantity: 5, available_quantity: 45, average_cost: 120, total_value: 6000 },
    { id: "2", item_code: "ITEM-CHEM-402", item_name: "Hydrochloric Acid 500ml", warehouse_name: "Chemical Store B", quantity_on_hand: 4, reserved_quantity: 0, available_quantity: 4, average_cost: 450, total_value: 1800 },
  ];

  const columns: ColumnDef<StockRecord>[] = [
    { key: "item_code", header: "Item Code", sortable: true },
    { key: "item_name", header: "Item Name", sortable: true },
    { key: "warehouse_name", header: "Warehouse" },
    { key: "quantity_on_hand", header: "On Hand" },
    { key: "reserved_quantity", header: "Reserved" },
    { key: "available_quantity", header: "Available" },
    {
      key: "average_cost",
      header: "Avg Cost (₹)",
      accessor: (r) => <span className="font-mono">₹{r.average_cost}</span>,
    },
    {
      key: "total_value",
      header: "Total Value (₹)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">₹{r.total_value.toLocaleString()}</span>,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Live Stock Levels & Valuation"
        subtitle="Real-time quantity balances, reserved stocks, unit valuation & store locations"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<ArrowDownRight className="w-4 h-4" />}>
              Issue Stock
            </Button>
            <Button variant="primary" leftIcon={<ArrowUpRight className="w-4 h-4" />}>
              Receive Stock
            </Button>
          </div>
        }
      />

      <DataTable data={stocks} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
