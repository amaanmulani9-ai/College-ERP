import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Briefcase } from "lucide-react";

interface JobItem {
  id: string;
  title: string;
  department_name: string;
  status: "open" | "closed" | "on_hold";
  posted_date: string;
  applicants_count: number;
}

export const RecruitmentPage: React.FC = () => {
  const jobs: JobItem[] = [
    { id: "1", title: "Assistant Professor - AI & Data Science", department_name: "Computer Science", status: "open", posted_date: "2026-07-15", applicants_count: 24 },
    { id: "2", title: "Lab Technician - VLSI Design", department_name: "Electrical Eng", status: "open", posted_date: "2026-07-20", applicants_count: 12 },
  ];

  const columns: ColumnDef<JobItem>[] = [
    { key: "title", header: "Job Title", sortable: true },
    { key: "department_name", header: "Department", sortable: true },
    { key: "posted_date", header: "Posted Date" },
    { key: "applicants_count", header: "Applications" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "open" ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Recruitment & Job Openings"
        subtitle="Manage faculty & staff job postings, candidate pipelines & selection workflows"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Post New Job
          </Button>
        }
      />

      <DataTable data={jobs} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
