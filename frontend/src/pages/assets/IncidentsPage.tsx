import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { AlertOctagon, Plus } from "lucide-react";

interface IncidentItem {
  id: string;
  asset_code: string;
  incident_type: "Damage" | "Loss" | "Theft" | "Repair";
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  resolved: boolean;
  reported_date: string;
}

export const IncidentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<IncidentItem[]>([
    { id: "1", asset_code: "AST-PROJ-12", incident_type: "Damage", description: "Projector lens shattered during class setup", severity: "High", resolved: false, reported_date: "2026-07-28" },
    { id: "2", asset_code: "AST-TAB-05", incident_type: "Theft", description: "Tablet reported missing from Digital Library shelf 4", severity: "Critical", resolved: false, reported_date: "2026-07-29" },
  ]);

  useEffect(() => {
    fetch("/api/assets/incidents/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setIncidents(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<IncidentItem>[] = [
    { key: "asset_code", header: "Asset Code", sortable: true },
    {
      key: "incident_type",
      header: "Incident Type",
      accessor: (r) => (
        <StatusBadge
          label={r.incident_type.toUpperCase()}
          variant={r.incident_type === "Damage" ? "warning" : "danger"}
        />
      ),
    },
    { key: "description", header: "Incident Description" },
    {
      key: "severity",
      header: "Severity",
      accessor: (r) => (
        <StatusBadge
          label={r.severity.toUpperCase()}
          variant={r.severity === "Critical" || r.severity === "High" ? "danger" : "warning"}
        />
      ),
    },
    {
      key: "resolved",
      header: "Resolution State",
      accessor: (r) => (
        <StatusBadge
          label={r.resolved ? "RESOLVED" : "UNRESOLVED"}
          variant={r.resolved ? "success" : "danger"}
        />
      ),
    },
    { key: "reported_date", header: "Reported Date" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Incidents: Damage, Loss & Theft Reports"
        subtitle="Log and resolve asset damage, theft, and emergency repair incidents"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Report Incident
          </Button>
        }
      />

      <DataTable
        title="Institutional Asset Incident Log"
        data={incidents}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
