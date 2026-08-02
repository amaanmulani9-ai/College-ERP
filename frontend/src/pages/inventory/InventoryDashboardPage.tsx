import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  StatList,
  DataTable,
  StatusBadge,
  Button,
  InlineAlert,
  ColumnDef,
} from "../../design-system";
import { Package, Warehouse, Truck, AlertTriangle, Plus, QrCode } from "lucide-react";

interface InventoryOverviewItem {
  id: string;
  item_code: string;
  item_name: string;
  category_name: string;
  warehouse_name: string;
  quantity_on_hand: number;
  available_quantity: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export const InventoryDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total_items: 450,
    total_stock_value: 12850000,
    low_stock_items: 6,
    out_of_stock_items: 2,
    pending_purchase_requests: 4,
    active_suppliers: 22,
    active_warehouses: 4,
  });

  const [items] = useState<InventoryOverviewItem[]>([
    { id: "1", item_code: "ITEM-RES-101", item_name: "Resistor Pack 10K Ohm", category_name: "Lab Equipment", warehouse_name: "Central Main Store", quantity_on_hand: 50, available_quantity: 45, status: "in_stock" },
    { id: "2", item_code: "ITEM-CHEM-402", item_name: "Hydrochloric Acid 500ml", category_name: "Chemistry Lab", warehouse_name: "Chemical Store B", quantity_on_hand: 4, available_quantity: 4, status: "low_stock" },
    { id: "3", item_code: "ITEM-PAP-A4", item_name: "A4 Printing Paper Rim (500 Sheets)", category_name: "Stationery", warehouse_name: "Central Main Store", quantity_on_hand: 0, available_quantity: 0, status: "out_of_stock" },
  ]);

  useEffect(() => {
    fetch("/api/inventory/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<InventoryOverviewItem>[] = [
    { key: "item_code", header: "Item Code", sortable: true },
    { key: "item_name", header: "Item Name", sortable: true },
    { key: "category_name", header: "Category" },
    { key: "warehouse_name", header: "Warehouse Store" },
    { key: "quantity_on_hand", header: "On Hand" },
    { key: "available_quantity", header: "Available" },
    {
      key: "status",
      header: "Stock Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "in_stock"
              ? "success"
              : r.status === "low_stock"
              ? "warning"
              : "danger"
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory & Store Management"
        subtitle="Real-time stock tracking, warehouse allocation, purchase requests & reorder alerts"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<QrCode className="w-4 h-4" />}>
              Scan Barcode / QR
            </Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Inventory Item
            </Button>
          </div>
        }
      />

      {kpis.low_stock_items > 0 && (
        <InlineAlert variant="warning" title="Stock Reorder Warnings">
          {kpis.low_stock_items} items have reached low stock thresholds and {kpis.out_of_stock_items} items are completely out of stock.
        </InlineAlert>
      )}

      <StatList
        stats={[
          { label: "Total Catalog Items", value: kpis.total_items },
          { label: "Inventory Valuation", value: `₹${(kpis.total_stock_value / 100000).toFixed(2)} Lakhs` },
          { label: "Low Stock Items", value: kpis.low_stock_items, isPositive: kpis.low_stock_items === 0 },
          { label: "Pending Purchase Requests", value: kpis.pending_purchase_requests },
          { label: "Active Warehouses", value: kpis.active_warehouses },
          { label: "Verified Suppliers", value: kpis.active_suppliers },
        ]}
      />

      <DataTable
        title="Institutional Item Catalog & Live Stock"
        data={items}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
