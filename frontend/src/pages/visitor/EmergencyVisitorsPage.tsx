import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { AlertCircle, Plus, ShieldAlert } from "lucide-react";

interface EmergencyItem {
  id: string;
  visitor_name: string;
  hospital_or_dept: string;
  type: string;
  priority: string;
  details: string;
}

export const EmergencyVisitorsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [emergencies, setEmergencies] = useState<EmergencyItem[]>([
    { id: "1", visitor_name: "Apollo Hospital Ambulance Unit 4", hospital_or_dept: "Apollo Multispecialty Hospital", type: "Hospital", priority: "Critical", details: "Student medical emergency at Hostel Block A." },
    { id: "2", visitor_name: "City Police Patrol Squad 12", hospital_or_dept: "Central Police Station", type: "Police", priority: "High", details: "Routine security inspection." },
  ]);

  useEffect(() => {
    fetch("/api/visitor/emergency-visitors/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setEmergencies(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<EmergencyItem>[] = [
    { key: "visitor_name", header: "Emergency Visitor Unit", sortable: true },
    { key: "hospital_or_dept", header: "Organization / Dept" },
    { key: "type", header: "Emergency Category" },
    {
      key: "priority",
      header: "Priority Level",
      accessor: (r) => (
        <StatusBadge
          label={r.priority.toUpperCase()}
          variant={r.priority === "Critical" ? "danger" : "warning"}
        />
      ),
    },
    { key: "details", header: "Emergency Incident Notes" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Priority Emergency Visitor Access Logs"
        subtitle="Immediate clearance entry logs for medical ambulances, police squads, fire units, and government authorities"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Log Emergency Entry
          </Button>
        }
      />

      <DataTable
        title="Campus High-Priority Emergency Access Ledger"
        data={emergencies}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
