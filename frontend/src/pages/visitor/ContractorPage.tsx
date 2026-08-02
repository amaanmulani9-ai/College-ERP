import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Wrench, Plus, ShieldCheck, MapPin } from "lucide-react";

interface ContractorItem {
  id: string;
  company: string;
  supervisor: string;
  start_date: string;
  end_date: string;
  areas_allowed: string[];
}

export const ContractorPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contractors, setContractors] = useState<ContractorItem[]>([
    { id: "1", company: "Apex HVAC Maintenance Services", supervisor: "Ramesh Chand", start_date: "2026-06-01", end_date: "2026-11-30", areas_allowed: ["Auditorium AC Plant", "Server Room", "Hostel Block B"] },
    { id: "2", company: "GreenClean Sanitation & Facility Ltd", supervisor: "Mahesh Kumar", start_date: "2026-01-01", end_date: "2026-12-31", areas_allowed: ["All Campus Grounds", "Sports Complex"] },
  ]);

  useEffect(() => {
    fetch("/api/visitor/contractors/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setContractors(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<ContractorItem>[] = [
    { key: "company", header: "Contractor Agency", sortable: true },
    { key: "supervisor", header: "Site Supervisor" },
    { key: "start_date", header: "Contract Start" },
    { key: "end_date", header: "Contract Expiry", sortable: true },
    { key: "areas_allowed", header: "Authorized Campus Zones", accessor: (r) => (Array.isArray(r.areas_allowed) ? r.areas_allowed.join(", ") : "") },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Maintenance Contractors & Security Passes"
        subtitle="Manage facility contractors, agency supervisors, contract validity dates, and authorized campus zones"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register Contractor
          </Button>
        }
      />

      <DataTable
        title="Institutional Contractor Work Force Directory"
        data={contractors}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
