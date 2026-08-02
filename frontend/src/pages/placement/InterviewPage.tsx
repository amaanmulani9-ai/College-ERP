import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Calendar, Plus, UserCheck, Video } from "lucide-react";

interface InterviewItem {
  id: string;
  student_id_code: string;
  drive_code: string;
  company_name: string;
  round: string;
  date: string;
  time: string;
  mode: string;
  panel: string;
}

export const InterviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<InterviewItem[]>([
    { id: "1", student_id_code: "STU-2023-0891", drive_code: "DRV-2026-GOOG", company_name: "Google India Ltd", round: "Round 2 - System Design", date: "2026-08-16", time: "10:30 AM", mode: "Online", panel: "Google Tech Panel B" },
    { id: "2", student_id_code: "STU-2023-0442", drive_code: "DRV-2026-MSFT", company_name: "Microsoft R&D", round: "Round 1 - Coding & DSA", date: "2026-08-21", time: "02:00 PM", mode: "Online", panel: "Microsoft Panel 3" },
  ]);

  useEffect(() => {
    fetch("/api/placement/interviews/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setInterviews(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<InterviewItem>[] = [
    { key: "student_id_code", header: "Student ID", sortable: true },
    { key: "company_name", header: "Recruiting Company" },
    { key: "drive_code", header: "Drive Code" },
    { key: "round", header: "Interview Round" },
    { key: "date", header: "Scheduled Date" },
    { key: "time", header: "Time Slot" },
    { key: "mode", header: "Mode" },
    { key: "panel", header: "Assigned Panel" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Campus Interview Schedules & Panel Feedback"
        subtitle="Manage technical, coding, system design, and HR interview schedules and evaluation ratings"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Schedule Interview Round
          </Button>
        }
      />

      <DataTable
        title="Scheduled Placement Interviews"
        data={interviews}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
