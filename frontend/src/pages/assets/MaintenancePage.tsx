import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Wrench, Plus, Calendar, ShieldCheck } from "lucide-react";

interface MaintenanceItem {
  id: string;
  asset_code: string;
  asset_name: string;
  maintenance_type: "Preventive" | "Corrective" | "Emergency";
  vendor_name: string;
  cost: number;
  service_date: string;
  next_service_date?: string;
  status: string;
}

export const MaintenancePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [maintenances, setMaintenances] = useState<MaintenanceItem[]>([
    { id: "1", asset_code: "AST-ME-045", asset_name: "CNC Milling Machine 3-Axis", maintenance_type: "Preventive", vendor_name: "Precision Tech Services", cost: 25000, service_date: "2026-08-01", next_service_date: "2026-11-01", status: "In Progress" },
    { id: "2", asset_code: "AST-AC-018", asset_name: "Daikin VRV Air Conditioner 10TR", maintenance_type: "Corrective", vendor_name: "Cooling Care Ltd", cost: 14500, service_date: "2026-07-20", next_service_date: "2026-10-20", status: "Completed" },
    { id: "3", asset_code: "AST-GEN-001", asset_name: "Kirloskar 125 KVA DG Set", maintenance_type: "Emergency", vendor_name: "Power Systems India", cost: 48000, service_date: "2026-06-10", next_service_date: "2026-09-10", status: "Completed" },
  ]);

  useEffect(() => {
    fetch("/api/assets/maintenances/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setMaintenances(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<MaintenanceItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    { key: "asset_name", header: "Asset Description", sortable: true },
    {
      key: "maintenance_type",
      header: "Maintenance Type",
      accessor: (r) => (
        <StatusBadge
          label={r.maintenance_type.toUpperCase()}
          variant={r.maintenance_type === "Preventive" ? "info" : r.maintenance_type === "Corrective" ? "warning" : "danger"}
        />
      ),
    },
    { key: "vendor_name", header: "Servicing Vendor" },
    { key: "cost", header: "Cost (₹)", accessor: (r) => `₹${r.cost.toLocaleString()}` },
    { key: "service_date", header: "Service Date" },
    { key: "next_service_date", header: "Next Service Due", accessor: (r) => r.next_service_date || "N/A" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Completed" ? "success" : r.status === "In Progress" ? "warning" : "info"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Maintenance, AMC & Service Logs"
        subtitle="Preventive, Corrective, and Emergency service records with AMC vendor tracking"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Schedule Maintenance
          </Button>
        }
      />

      <DataTable
        title="Institutional Asset Maintenance Register"
        data={maintenances}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
