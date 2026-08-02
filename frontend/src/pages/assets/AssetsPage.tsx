import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Laptop, Plus, QrCode, Search, Filter, History } from "lucide-react";

interface AssetItem {
  id: string;
  asset_code: string;
  asset_name: string;
  category_name: string;
  department_name: string;
  serial_number: string;
  location: string;
  purchase_date: string;
  purchase_cost: number;
  current_value: number;
  status: string;
}

export const AssetsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<AssetItem[]>([
    { id: "1", asset_code: "AST-CS-001", asset_name: "Dell PowerEdge Server R750", category_name: "Computers & IT Hardware", department_name: "Computer Science", serial_number: "SN-998822-CS", location: "Server Room A", purchase_date: "2024-03-15", purchase_cost: 450000, current_value: 380000, status: "Allocated" },
    { id: "2", asset_code: "AST-ME-045", asset_name: "CNC Milling Machine 3-Axis", category_name: "Laboratory Equipment", department_name: "Mechanical Engineering", serial_number: "CNC-ME-1102", location: "Lab 102 Mechanical Block", purchase_date: "2023-01-10", purchase_cost: 1200000, current_value: 950000, status: "Maintenance" },
    { id: "3", asset_code: "AST-AUD-102", asset_name: "Epson 4K Laser Projector 6000L", category_name: "Projectors & Audio Visual", department_name: "Auditorium", serial_number: "EPS-AUD-882", location: "Main Auditorium", purchase_date: "2025-06-20", purchase_cost: 180000, current_value: 140000, status: "Available" },
    { id: "4", asset_code: "AST-ADM-012", asset_name: "HP LaserJet Enterprise Printer", category_name: "Computers & IT Hardware", department_name: "Admissions Office", serial_number: "HP-PRN-3341", location: "Admissions Block", purchase_date: "2024-08-01", purchase_cost: 65000, current_value: 52000, status: "Allocated" },
  ]);

  useEffect(() => {
    fetch("/api/assets/items/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setAssets(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AssetItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "asset_name", header: "Asset Description", sortable: true },
    { key: "category_name", header: "Category" },
    { key: "department_name", header: "Department" },
    { key: "serial_number", header: "Serial Number" },
    { key: "location", header: "Location" },
    { key: "purchase_cost", header: "Cost (₹)", accessor: (r) => `₹${r.purchase_cost.toLocaleString()}` },
    { key: "current_value", header: "Current Value (₹)", accessor: (r) => `₹${r.current_value.toLocaleString()}` },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "Available"
              ? "success"
              : r.status === "Allocated"
              ? "info"
              : r.status === "Maintenance"
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
        title="Asset Master Register"
        subtitle="View, search, filter and manage institutional fixed assets"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register Asset
          </Button>
        }
      />

      <DataTable
        title="Institutional Fixed Asset Inventory"
        data={assets}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
