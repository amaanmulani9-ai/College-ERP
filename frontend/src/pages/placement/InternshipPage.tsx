import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Briefcase, Plus, Award } from "lucide-react";

interface InternshipItem {
  id: string;
  student_id_code: string;
  company_name: string;
  title: string;
  mentor: string;
  duration: string;
  stipend: number;
  status: string;
}

export const InternshipPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<InternshipItem[]>([
    { id: "1", student_id_code: "STU-2023-0891", company_name: "Google India Ltd", title: "Software Engineering Intern", mentor: "Vikram Malhotra (Senior Staff SDE)", duration: "6 Months", stipend: 80000, status: "Ongoing" },
    { id: "2", student_id_code: "STU-2023-0442", company_name: "Microsoft R&D", title: "Cloud & AI Intern", mentor: "Ananya Sen (Principal PM)", duration: "6 Months", stipend: 75000, status: "Ongoing" },
    { id: "3", student_id_code: "STU-2023-0115", company_name: "Amazon Web Services", title: "Systems Engineer Intern", mentor: "Siddharth Rao (SDE Manager)", duration: "3 Months", stipend: 60000, status: "Completed" },
  ]);

  useEffect(() => {
    fetch("/api/placement/internships/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setInternships(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<InternshipItem>[] = [
    { key: "student_id_code", header: "Student ID", sortable: true },
    { key: "company_name", header: "Corporate Company", sortable: true },
    { key: "title", header: "Internship Title" },
    { key: "mentor", header: "Industry Mentor" },
    { key: "stipend", header: "Stipend (₹/mo)", accessor: (r) => `₹${r.stipend.toLocaleString()}` },
    { key: "duration", header: "Duration" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Ongoing" ? "info" : r.status === "Completed" ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Corporate Internships & Industry Mentorship"
        subtitle="Track stipend corporate internships, industry mentors, duration, and completion evaluations"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register Internship
          </Button>
        }
      />

      <DataTable
        title="Institutional Corporate Internships Registry"
        data={internships}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
