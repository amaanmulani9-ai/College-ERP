import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Briefcase, Plus, Building2, MapPin } from "lucide-react";

interface EmploymentItem {
  id: string;
  alumni_id_code: string;
  company: string;
  designation: string;
  industry: string;
  location: string;
  salary_range: string;
  employment_status: string;
  is_current: boolean;
}

export const EmploymentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [employments, setEmployments] = useState<EmploymentItem[]>([
    { id: "1", alumni_id_code: "ALU-2022-0192", company: "Google LLC", designation: "Senior Staff Software Engineer", industry: "Cloud / Artificial Intelligence", location: "Mountain View, CA, USA", salary_range: "150k - 220k USD", employment_status: "Full-Time", is_current: true },
    { id: "2", alumni_id_code: "ALU-2023-0401", company: "PayTech Solutions", designation: "Co-Founder & CEO", industry: "Fintech Startup", location: "Bangalore, India", salary_range: "Executive Equity", employment_status: "Self-Employed", is_current: true },
  ]);

  useEffect(() => {
    fetch("/api/alumni/employments/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setEmployments(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<EmploymentItem>[] = [
    { key: "alumni_id_code", header: "Alumni ID", sortable: true },
    { key: "company", header: "Organization", sortable: true },
    { key: "designation", header: "Designation / Role" },
    { key: "industry", header: "Industry Sector" },
    { key: "location", header: "Location" },
    { key: "salary_range", header: "Compensation Tier" },
    {
      key: "is_current",
      header: "Active Role",
      accessor: (r) => (
        <StatusBadge
          label={r.is_current ? "CURRENT" : "PAST"}
          variant={r.is_current ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni Employment & Career Timeline Tracker"
        subtitle="Track corporate employment history, designations, industry sectors, and startup leadership"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Employment History
          </Button>
        }
      />

      <DataTable
        title="Institutional Alumni Career Matrix"
        data={employments}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
