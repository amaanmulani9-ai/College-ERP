import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Sliders } from "lucide-react";

interface AdjustmentItem {
  id: string;
  item_name: string;
  adjustment_type: "increase" | "decrease";
  quantity: number;
  reason: string;
  created_at: string;
}

export const StockAdjustmentPage: React.FC = () => {
  const adjustments: AdjustmentItem[] = [
    { id: "1", item_name: "Hydrochloric Acid 500ml", adjustment_type: "decrease", quantity: 1, reason: "Bottle breakage during physical audit", created_at: "2026-07-28" },
  ];

  const columns: ColumnDef<AdjustmentItem>[] = [
    { key: "item_name", header: "Item Name", sortable: true },
    {
      key: "adjustment_type",
      header: "Adjustment Type",
      accessor: (r) => (
        <StatusBadge label={r.adjustment_type.toUpperCase()} variant={r.adjustment_type === "increase" ? "success" : "danger"} />
      ),
    },
    { key: "quantity", header: "Quantity" },
    { key: "reason", header: "Reason" },
    { key: "created_at", header: "Date" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Stock Adjustments & Audit Reconciliation"
        subtitle="Reconcile physical stock audit variances, damages or stock write-offs"
        actions={
          <Button variant="primary" leftIcon={<Sliders className="w-4 h-4" />}>
            New Stock Adjustment
          </Button>
        }
      />

      <DataTable data={adjustments} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
