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
import { Bus, MapPin, Users, Wrench, Fuel, ShieldAlert, AlertTriangle, QrCode } from "lucide-react";

interface VehicleOverview {
  id: string;
  vehicle_code: string;
  registration_number: string;
  vehicle_name: string;
  vehicle_type: string;
  capacity: number;
  status: "active" | "maintenance" | "inactive" | "retired";
  gps_enabled: boolean;
}

export const TransportDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total_vehicles: 18,
    active_vehicles: 15,
    maintenance_vehicles: 2,
    total_drivers: 16,
    total_routes: 12,
    total_allocated_students: 420,
    fuel_cost_total: 124500,
    maintenance_cost_total: 38000,
    open_incidents: 1,
    license_expiring_soon: 2,
    insurance_expiring_soon: 3,
  });

  const [vehicles, setVehicles] = useState<VehicleOverview[]>([
    {
      id: "1",
      vehicle_code: "BUS-101",
      registration_number: "MH-12-AB-1234",
      vehicle_name: "Yellow School Bus #1",
      vehicle_type: "bus",
      capacity: 40,
      status: "active",
      gps_enabled: true,
    },
    {
      id: "2",
      vehicle_code: "BUS-102",
      registration_number: "MH-12-CD-5678",
      vehicle_name: "Express Campus Shuttle",
      vehicle_type: "mini_bus",
      capacity: 25,
      status: "active",
      gps_enabled: true,
    },
    {
      id: "3",
      vehicle_code: "BUS-103",
      registration_number: "MH-12-EF-9012",
      vehicle_name: "North Route Bus",
      vehicle_type: "bus",
      capacity: 50,
      status: "maintenance",
      gps_enabled: false,
    },
  ]);

  useEffect(() => {
    fetch("/api/transport/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<VehicleOverview>[] = [
    { key: "vehicle_code", header: "Vehicle Code", sortable: true },
    { key: "vehicle_name", header: "Vehicle Name", sortable: true },
    { key: "registration_number", header: "Registration #" },
    { key: "capacity", header: "Capacity" },
    {
      key: "gps_enabled",
      header: "GPS Tracking",
      accessor: (r) =>
        r.gps_enabled ? (
          <StatusBadge label="GPS Active" variant="success" size="sm" />
        ) : (
          <StatusBadge label="GPS Offline" variant="warning" size="sm" />
        ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "active"
              ? "success"
              : r.status === "maintenance"
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
        title="Transport Management System"
        subtitle="Real-time fleet monitoring, route allocation, driver safety & maintenance"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<QrCode className="w-4 h-4" />}>
              Scan Transport Pass
            </Button>
            <Button variant="primary" leftIcon={<Bus className="w-4 h-4" />}>
              Add Vehicle
            </Button>
          </div>
        }
      />

      {/* Expiry Alerts */}
      {(kpis.license_expiring_soon > 0 || kpis.insurance_expiring_soon > 0) && (
        <InlineAlert variant="warning" title="Fleet Compliance Warnings">
          {kpis.license_expiring_soon} driver licenses and {kpis.insurance_expiring_soon} vehicle insurance policies are expiring within 30 days.
        </InlineAlert>
      )}

      {/* KPI Stats */}
      <StatList
        stats={[
          { label: "Active Fleet Vehicles", value: `${kpis.active_vehicles} / ${kpis.total_vehicles}` },
          { label: "Active Routes", value: kpis.total_routes },
          { label: "Students Using Transport", value: kpis.total_allocated_students },
          { label: "Maintenance Due", value: kpis.maintenance_vehicles },
          { label: "Fuel Expenses (Monthly)", value: `₹${kpis.fuel_cost_total.toLocaleString()}` },
          { label: "Open Incidents", value: kpis.open_incidents, isPositive: kpis.open_incidents === 0 },
        ]}
      />

      {/* Fleet Overview Table */}
      <DataTable
        title="Fleet Overview & Live Tracking Status"
        data={vehicles}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
