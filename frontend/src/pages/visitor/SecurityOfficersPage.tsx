import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Shield, Plus, Clock, MapPin } from "lucide-react";

interface OfficerItem {
  id: string;
  employee_id_code: string;
  officer_name: string;
  shift: string;
  gate: string;
}

export const SecurityOfficersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState<OfficerItem[]>([
    { id: "1", employee_id_code: "EMP-2023-0901", officer_name: "Subedar Vikram Singh", shift: "Morning Shift (06:00 - 14:00)", gate: "Main Gate A" },
    { id: "2", employee_id_code: "EMP-2023-0902", officer_name: "Havildar Ramesh Yadav", shift: "Afternoon Shift (14:00 - 22:00)", gate: "Service Gate C" },
  ]);

  useEffect(() => {
    fetch("/api/visitor/security-officers/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setOfficers(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<OfficerItem>[] = [
    { key: "employee_id_code", header: "Officer Employee ID", sortable: true },
    { key: "officer_name", header: "Security Officer Name", sortable: true },
    { key: "shift", header: "Assigned Shift Slot" },
    { key: "gate", header: "Gate Duty Assignment" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Security Officers Roster & Gate Duty"
        subtitle="Manage campus security guard rosters, shift schedules, assigned gates, and duty logs"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Assign Shift Duty
          </Button>
        }
      />

      <DataTable
        title="Institutional Security Officer Roster"
        data={officers}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
