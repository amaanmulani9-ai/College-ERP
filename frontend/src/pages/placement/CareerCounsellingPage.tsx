import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { UserCheck, Plus, MessageSquare } from "lucide-react";

interface CounsellingItem {
  id: string;
  student_id_code: string;
  counsellor_email: string;
  session_date: string;
  topic: string;
  remarks: string;
}

export const CareerCounsellingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<CounsellingItem[]>([
    { id: "1", student_id_code: "STU-2023-0891", counsellor_email: "tnp_officer@college.edu", session_date: "2026-06-20", topic: "Product Company vs Service Company Trajectory", remarks: "Advised to focus on LeetCode Medium & System Design for Tier-1 drives." },
    { id: "2", student_id_code: "STU-2023-0442", counsellor_email: "tnp_officer@college.edu", session_date: "2026-07-02", topic: "Higher Studies vs Campus Placement", remarks: "Guided on GRE/GATE preparation timeline alongside placement drives." },
  ]);

  useEffect(() => {
    fetch("/api/placement/counselling/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setSessions(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<CounsellingItem>[] = [
    { key: "student_id_code", header: "Student ID", sortable: true },
    { key: "counsellor_email", header: "T&P Counsellor" },
    { key: "session_date", header: "Session Date" },
    { key: "topic", header: "Guidance Topic" },
    { key: "remarks", header: "Counselling Notes" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="1-on-1 Career Counselling & Guidance Logs"
        subtitle="Track individual student career guidance sessions, domain alignment, and mentor notes"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Log Counselling Session
          </Button>
        }
      />

      <DataTable
        title="Career Guidance & Mentorship Registry"
        data={sessions}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
