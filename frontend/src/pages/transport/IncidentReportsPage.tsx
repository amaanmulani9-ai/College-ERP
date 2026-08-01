import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { AlertTriangle, Plus } from "lucide-react";

interface IncidentRecord {
  id: string;
  vehicle_name: string;
  driver_name: string;
  date: string;
  category: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
}

export const IncidentReportsPage: React.FC = () => {
  const incidents: IncidentRecord[] = [
    {
      id: "1",
      vehicle_name: "Yellow School Bus #1 (BUS-101)",
      driver_name: "Ramesh Sharma",
      date: "2026-07-25 08:45 AM",
      category: "Tire Flat",
      description: "Rear left tire flat near City Station stop. Backup shuttle dispatched.",
      severity: "low",
      resolved: true,
    },
    {
      id: "2",
      vehicle_name: "North Route Bus (BUS-103)",
      driver_name: "Suresh Patil",
      date: "2026-07-29 05:15 PM",
      category: "Engine Overheating",
      description: "Engine temperature spike. Vehicle towed for radiator service.",
      severity: "high",
      resolved: false,
    },
  ];

  const columns: ColumnDef<IncidentRecord>[] = [
    { key: "date", header: "Date & Time", sortable: true },
    { key: "vehicle_name", header: "Vehicle", sortable: true },
    { key: "driver_name", header: "Driver" },
    { key: "category", header: "Category" },
    { key: "description", header: "Description" },
    {
      key: "severity",
      header: "Severity",
      accessor: (r) => (
        <StatusBadge
          label={r.severity.toUpperCase()}
          variant={
            r.severity === "critical" || r.severity === "high"
              ? "danger"
              : r.severity === "medium"
              ? "warning"
              : "info"
          }
        />
      ),
    },
    {
      key: "resolved",
      header: "Resolution",
      accessor: (r) => (
        <StatusBadge
          label={r.resolved ? "RESOLVED" : "OPEN"}
          variant={r.resolved ? "success" : "danger"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Transport Incident Logs"
        subtitle="Log breakdowns, minor accidents, delays & fleet safety resolutions"
        actions={
          <Button variant="danger" leftIcon={<AlertTriangle className="w-4 h-4" />}>
            Report Incident
          </Button>
        }
      />

      <DataTable data={incidents} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
