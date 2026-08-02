import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Users, Plus, UserCheck, HeartHandshake } from "lucide-react";

interface MentorshipItem {
  id: string;
  program_name: string;
  mentor_alumni_id: string;
  mentee_student_id: string;
  status: string;
  start_date: string;
}

export const MentorshipPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [mentorships, setMentorships] = useState<MentorshipItem[]>([
    { id: "1", program_name: "Tech Leadership Mentorship 2026", mentor_alumni_id: "ALU-2022-0192", mentee_student_id: "STU-2023-0891", status: "Active", start_date: "2026-01-15" },
    { id: "2", program_name: "Startup & Entrepreneurship Mentorship", mentor_alumni_id: "ALU-2023-0401", mentee_student_id: "STU-2023-0442", status: "Active", start_date: "2026-02-01" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/mentor-assignments/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setMentorships(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<MentorshipItem>[] = [
    { key: "program_name", header: "Mentorship Program", sortable: true },
    { key: "mentor_alumni_id", header: "Alumni Mentor", sortable: true },
    { key: "mentee_student_id", header: "Student Mentee", sortable: true },
    { key: "start_date", header: "Assignment Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "Active" ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni Mentorship Program & Student Matching"
        subtitle="Connect experienced alumni mentors with undergraduate and postgraduate student mentees"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Assign Mentor
          </Button>
        }
      />

      <DataTable
        title="Active Mentorship Matching Registry"
        data={mentorships}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
