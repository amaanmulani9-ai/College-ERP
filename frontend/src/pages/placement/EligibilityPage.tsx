import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { ShieldCheck, Plus, CheckCircle } from "lucide-react";

interface EligibilityItem {
  id: string;
  drive_code: string;
  minimum_cgpa: number;
  backlog_limit: number;
  passing_year: number;
  allowed_departments: string[];
}

export const EligibilityPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [eligibilities, setEligibilities] = useState<EligibilityItem[]>([
    { id: "1", drive_code: "DRV-2026-GOOG", minimum_cgpa: 7.5, backlog_limit: 0, passing_year: 2026, allowed_departments: ["Computer Science", "Information Technology"] },
    { id: "2", drive_code: "DRV-2026-MSFT", minimum_cgpa: 7.0, backlog_limit: 0, passing_year: 2026, allowed_departments: ["Computer Science", "Electrical Engineering"] },
    { id: "3", drive_code: "DRV-2026-AMZN", minimum_cgpa: 6.5, backlog_limit: 1, passing_year: 2026, allowed_departments: ["All Engineering Branches"] },
  ]);

  useEffect(() => {
    fetch("/api/placement/eligibility/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setEligibilities(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<EligibilityItem>[] = [
    { key: "drive_code", header: "Drive Code", sortable: true },
    { key: "minimum_cgpa", header: "Min CGPA Cutoff", accessor: (r) => `${r.minimum_cgpa} / 10.0` },
    { key: "backlog_limit", header: "Active Backlog Limit", accessor: (r) => `Max ${r.backlog_limit} Backlog(s)` },
    { key: "passing_year", header: "Eligible Batch" },
    { key: "allowed_departments", header: "Eligible Departments", accessor: (r) => r.allowed_departments.join(", ") },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Drive Eligibility Rules & CGPA Cutoffs"
        subtitle="Manage academic CGPA thresholds, allowed departments, and backlog criteria"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Set Eligibility Criteria
          </Button>
        }
      />

      <DataTable
        title="Campus Drive Eligibility Matrix"
        data={eligibilities}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
