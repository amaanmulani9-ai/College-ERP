import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { FileText, Plus, CheckCircle, Edit, Star } from "lucide-react";

interface ResumeItem {
  id: string;
  student_id_code: string;
  version: string;
  skills: string[];
  projects_count: number;
  approval_status: "Draft" | "Approved" | "Needs Revision";
  created_at: string;
}

export const ResumePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeItem[]>([
    { id: "1", student_id_code: "STU-2023-0891", version: "v2.1 (SDE Focus)", skills: ["React", "Node.js", "Python", "Docker", "AWS"], projects_count: 4, approval_status: "Approved", created_at: "2026-07-10" },
    { id: "2", student_id_code: "STU-2023-0442", version: "v1.0 (Cloud & Data)", skills: ["Python", "PyTorch", "PostgreSQL", "Kubernetes"], projects_count: 3, approval_status: "Needs Revision", created_at: "2026-07-15" },
    { id: "3", student_id_code: "STU-2023-0115", version: "v2.0 (Fullstack)", skills: ["TypeScript", "Java", "Spring Boot", "MySQL"], projects_count: 5, approval_status: "Approved", created_at: "2026-07-18" },
  ]);

  useEffect(() => {
    fetch("/api/placement/resumes/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setResumes(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<ResumeItem>[] = [
    { key: "student_id_code", header: "Student ID", sortable: true },
    { key: "version", header: "Resume Title / Version" },
    { key: "skills", header: "Technical Skills", accessor: (r) => (Array.isArray(r.skills) ? r.skills.join(", ") : "") },
    { key: "projects_count", header: "Projects Count" },
    { key: "created_at", header: "Last Updated" },
    {
      key: "approval_status",
      header: "T&P Review Status",
      accessor: (r) => (
        <StatusBadge
          label={r.approval_status.toUpperCase()}
          variant={r.approval_status === "Approved" ? "success" : r.approval_status === "Needs Revision" ? "warning" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Student Resume Builder & T&P Review"
        subtitle="Resume versioning, skill tags, project showcase, and coordinator approval workflow"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Resume Version
          </Button>
        }
      />

      <DataTable
        title="Institutional Student Resume Directory"
        data={resumes}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
