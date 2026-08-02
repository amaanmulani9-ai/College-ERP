import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  Modal,
  TextInput,
  ColumnDef,
} from "../../design-system";
import { Plus, Package } from "lucide-react";

interface ItemDetail {
  id: string;
  item_code: string;
  item_name: string;
  category_name: string;
  warehouse_name: string;
  unit: string;
  min_stock: number;
  reorder_level: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export const InventoryItemsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items] = useState<ItemDetail[]>([
    { id: "1", item_code: "ITEM-RES-101", item_name: "Resistor Pack 10K Ohm", category_name: "Lab Equipment", warehouse_name: "Central Main Store", unit: "BOX", min_stock: 10, reorder_level: 15, status: "in_stock" },
    { id: "2", item_code: "ITEM-CHEM-402", item_name: "Hydrochloric Acid 500ml", category_name: "Chemistry Lab", warehouse_name: "Chemical Store B", unit: "BTL", min_stock: 5, reorder_level: 10, status: "low_stock" },
  ]);

  const columns: ColumnDef<ItemDetail>[] = [
    { key: "item_code", header: "Item Code", sortable: true },
    { key: "item_name", header: "Item Name", sortable: true },
    { key: "category_name", header: "Category" },
    { key: "warehouse_name", header: "Warehouse Store" },
    { key: "unit", header: "Unit" },
    { key: "min_stock", header: "Min Threshold" },
    { key: "reorder_level", header: "Reorder Level" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "in_stock" ? "success" : r.status === "low_stock" ? "warning" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Inventory Item Master Catalog"
        subtitle="Manage stock items, SKU codes, unit definitions & safety thresholds"
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Item
          </Button>
        }
      />

      <DataTable data={items} columns={columns} keyExtractor={(r) => r.id} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Inventory Item"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save Item
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <TextInput label="Item Code" placeholder="e.g. ITEM-MICRO-8085" required />
          <TextInput label="Item Name" placeholder="8085 Microprocessor Trainer Kit" required />
          <TextInput label="Unit" placeholder="PCS / BOX / BTL" required />
          <TextInput label="Minimum Stock Level" type="number" placeholder="5" required />
        </div>
      </Modal>
    </PageContainer>
  );
};
