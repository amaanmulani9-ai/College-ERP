import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Warehouse as WarehouseIcon } from "lucide-react";

interface WarehouseItem {
  id: string;
  warehouse_code: string;
  warehouse_name: string;
  location: string;
  manager_name: string;
  status: "active" | "inactive";
}

export const WarehousePage: React.FC = () => {
  const warehouses: WarehouseItem[] = [
    { id: "1", warehouse_code: "WH-MAIN", warehouse_name: "Central Main Store", location: "Ground Floor Block C", manager_name: "Store Keeper Ramesh", status: "active" },
    { id: "2", warehouse_code: "WH-CHEM", warehouse_name: "Chemical & Bio Store", location: "Science Block Basement", manager_name: "Lab Admin Suresh", status: "active" },
    { id: "3", warehouse_code: "WH-IT", warehouse_name: "IT Infrastructure Store", location: "Admin Block 2nd Floor", manager_name: "System Admin Vikram", status: "active" },
  ];

  const columns: ColumnDef<WarehouseItem>[] = [
    { key: "warehouse_code", header: "Code", sortable: true },
    { key: "warehouse_name", header: "Warehouse Store Name", sortable: true },
    { key: "location", header: "Physical Location" },
    { key: "manager_name", header: "Store Manager" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "active" ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Institutional Warehouses & Stores"
        subtitle="Manage central stores, department stockrooms & storage locations"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Warehouse Store
          </Button>
        }
      />

      <DataTable data={warehouses} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
