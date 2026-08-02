import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { FileCheck, Plus, CheckSquare } from "lucide-react";

interface ApplicationItem {
  id: string;
  student_id_code: string;
  student_name: string;
  drive_code: string;
  company_name: string;
  job_role: string;
  status: "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected";
  applied_date: string;
}

export const ApplicationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationItem[]>([
    { id: "1", student_id_code: "STU-2023-0891", student_name: "Rahul Sharma", drive_code: "DRV-2026-GOOG", company_name: "Google India Ltd", job_role: "SDE-1", status: "Selected", applied_date: "2026-07-21" },
    { id: "2", student_id_code: "STU-2023-0442", student_name: "Priya Patel", drive_code: "DRV-2026-GOOG", company_name: "Google India Ltd", job_role: "SDE-1", status: "Interview", applied_date: "2026-07-22" },
    { id: "3", student_id_code: "STU-2023-0115", student_name: "Aman Verma", drive_code: "DRV-2026-MSFT", company_name: "Microsoft R&D", job_role: "Cloud Architect", status: "Shortlisted", applied_date: "2026-08-01" },
    { id: "4", student_id_code: "STU-2023-0780", student_name: "Neha Gupta", drive_code: "DRV-2026-AMZN", company_name: "Amazon Web Services", job_role: "SDE", status: "Applied", applied_date: "2026-07-25" },
  ]);

  useEffect(() => {
    fetch("/api/placement/applications/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setApplications(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<ApplicationItem>[] = [
    { key: "student_id_code", header: "Student ID", sortable: true },
    { key: "student_name", header: "Candidate Name", sortable: true },
    { key: "company_name", header: "Recruiting Company" },
    { key: "job_role", header: "Applied Role" },
    { key: "drive_code", header: "Drive Code" },
    { key: "applied_date", header: "Applied Date" },
    {
      key: "status",
      header: "Pipeline Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "Selected"
              ? "success"
              : r.status === "Interview" || r.status === "Shortlisted"
              ? "info"
              : r.status === "Applied"
              ? "neutral"
              : "danger"
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Student Placement Applications Tracker"
        subtitle="Track student drive submissions across Applied, Shortlisted, Interview, Selected & Rejected states"
        actions={
          <Button variant="primary" leftIcon={<CheckSquare className="w-4 h-4" />}>
            Bulk Shortlist Candidates
          </Button>
        }
      />

      <DataTable
        title="Institutional Placement Candidate Pipeline"
        data={applications}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
