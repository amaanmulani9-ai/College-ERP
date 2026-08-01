import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { UserPlus, CheckSquare } from "lucide-react";

interface OnboardingItem {
  id: string;
  employee_name: string;
  department: string;
  documents_submitted: boolean;
  orientation_completed: boolean;
  completion_status: "in_progress" | "completed";
}

export const OnboardingPage: React.FC = () => {
  const onboardings: OnboardingItem[] = [
    { id: "1", employee_name: "Ananya Deshmukh", department: "Computer Science", documents_submitted: true, orientation_completed: false, completion_status: "in_progress" },
    { id: "2", employee_name: "Karan Patel", department: "Administration", documents_submitted: true, orientation_completed: true, completion_status: "completed" },
  ];

  const columns: ColumnDef<OnboardingItem>[] = [
    { key: "employee_name", header: "New Joiner Name", sortable: true },
    { key: "department", header: "Department" },
    {
      key: "documents_submitted",
      header: "Docs Verified",
      accessor: (r) => (
        <StatusBadge label={r.documents_submitted ? "VERIFIED" : "PENDING"} variant={r.documents_submitted ? "success" : "warning"} />
      ),
    },
    {
      key: "orientation_completed",
      header: "Orientation",
      accessor: (r) => (
        <StatusBadge label={r.orientation_completed ? "DONE" : "PENDING"} variant={r.orientation_completed ? "success" : "neutral"} />
      ),
    },
    {
      key: "completion_status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge label={r.completion_status.toUpperCase()} variant={r.completion_status === "completed" ? "success" : "info"} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Employee Onboarding Pipeline"
        subtitle="Track document verification, IT account provisioning & orientation checklist for new joiners"
        actions={
          <Button variant="primary" leftIcon={<UserPlus className="w-4 h-4" />}>
            Initiate Onboarding
          </Button>
        }
      />

      <DataTable data={onboardings} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
