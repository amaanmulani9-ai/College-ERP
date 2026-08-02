import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { AlertTriangle, ShoppingCart } from "lucide-react";

interface AlertItem {
  id: string;
  item_code: string;
  item_name: string;
  category_name: string;
  quantity_on_hand: number;
  min_stock: number;
  reorder_level: number;
  status: "low_stock" | "out_of_stock";
}

export const ReorderAlertsPage: React.FC = () => {
  const alerts: AlertItem[] = [
    { id: "1", item_code: "ITEM-CHEM-402", item_name: "Hydrochloric Acid 500ml", category_name: "Chemistry Lab", quantity_on_hand: 4, min_stock: 5, reorder_level: 10, status: "low_stock" },
    { id: "2", item_code: "ITEM-PAP-A4", item_name: "A4 Printing Paper Rim", category_name: "Stationery", quantity_on_hand: 0, min_stock: 10, reorder_level: 25, status: "out_of_stock" },
  ];

  const columns: ColumnDef<AlertItem>[] = [
    { key: "item_code", header: "Item Code", sortable: true },
    { key: "item_name", header: "Item Name", sortable: true },
    { key: "category_name", header: "Category" },
    { key: "quantity_on_hand", header: "Current Stock" },
    { key: "min_stock", header: "Min Threshold" },
    { key: "reorder_level", header: "Reorder Trigger" },
    {
      key: "status",
      header: "Alert Level",
      accessor: (r) => (
        <StatusBadge label={r.status.toUpperCase()} variant={r.status === "out_of_stock" ? "danger" : "warning"} />
      ),
    },
    {
      key: "id",
      header: "Action",
      accessor: (r) => (
        <Button size="xs" variant="primary" leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}>
          Generate PR
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Stock Reorder & Low Inventory Alerts"
        subtitle="Automated stock depletion monitoring and purchase requisition triggers"
      />

      <DataTable data={alerts} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
