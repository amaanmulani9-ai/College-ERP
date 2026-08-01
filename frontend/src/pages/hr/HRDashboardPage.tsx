import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  StatList,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Users, Briefcase, Calendar, Award, UserPlus, AlertCircle, Plus } from "lucide-react";

interface HRActivityOverview {
  id: string;
  type: string;
  subject: string;
  employee: string;
  date: string;
  status: "pending" | "approved" | "completed" | "open";
}

export const HRDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total_employees: 245,
    active_job_openings: 8,
    pending_leave_requests: 12,
    onboarding_in_progress: 5,
    open_disciplinary_actions: 2,
    trainings_conducted: 14,
  });

  const [activities] = useState<HRActivityOverview[]>([
    { id: "1", type: "Leave Request", subject: "Annual Vacation (5 Days)", employee: "Dr. Rajesh Sharma", date: "2026-08-01", status: "pending" },
    { id: "2", type: "Onboarding", subject: "Document Verification & IT Setup", employee: "Ananya Deshmukh (Asst Prof)", date: "2026-08-01", status: "open" },
    { id: "3", type: "Recruitment", subject: "Senior Dean - Engineering Position", employee: "Candidate Shortlisting", date: "2026-07-30", status: "approved" },
    { id: "4", type: "Training Program", subject: "Outcome Based Education Workshop", employee: "42 Faculty Members", date: "2026-07-28", status: "completed" },
  ]);

  useEffect(() => {
    fetch("/api/hr/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<HRActivityOverview>[] = [
    { key: "type", header: "Category", sortable: true },
    { key: "subject", header: "Activity Subject", sortable: true },
    { key: "employee", header: "Employee / Target" },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "completed" || r.status === "approved"
              ? "success"
              : r.status === "pending"
              ? "warning"
              : "info"
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Human Resource Management"
        subtitle="Manage institutional staff lifecycle, recruitment pipelines, leave approvals & performance"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" leftIcon={<UserPlus className="w-4 h-4" />}>
              Onboard Staff
            </Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Post Job Opening
            </Button>
          </div>
        }
      />

      <StatList
        stats={[
          { label: "Total Institutional Staff", value: kpis.total_employees },
          { label: "Active Job Openings", value: kpis.active_job_openings },
          { label: "Pending Leave Approvals", value: kpis.pending_leave_requests, isPositive: false },
          { label: "Staff Onboarding", value: kpis.onboarding_in_progress },
          { label: "Trainings Conducted", value: kpis.trainings_conducted },
          { label: "Open Disciplinary Cases", value: kpis.open_disciplinary_actions, isPositive: kpis.open_disciplinary_actions === 0 },
        ]}
      />

      <DataTable
        title="Recent HR Lifecycle Events"
        data={activities}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
