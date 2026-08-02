import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Users, Plus, Award } from "lucide-react";

interface MockItem {
  id: string;
  student_id_code: string;
  faculty_name: string;
  technical_score: number;
  hr_score: number;
  date: string;
  remarks: string;
}

export const MockInterviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [mocks, setMocks] = useState<MockItem[]>([
    { id: "1", student_id_code: "STU-2023-0891", faculty_name: "Dr. Suresh Kumar", technical_score: 9.0, hr_score: 8.5, date: "2026-07-05", remarks: "Strong DSA & System Design foundations. Good confidence." },
    { id: "2", student_id_code: "STU-2023-0442", faculty_name: "Prof. Meenakshi Rao", technical_score: 7.5, hr_score: 8.0, date: "2026-07-08", remarks: "Needs practice on SQL query optimization." },
  ]);

  useEffect(() => {
    fetch("/api/placement/mock-interviews/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setMocks(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<MockItem>[] = [
    { key: "student_id_code", header: "Student ID", sortable: true },
    { key: "faculty_name", header: "Evaluating Faculty" },
    { key: "technical_score", header: "Technical Score", accessor: (r) => `${r.technical_score} / 10` },
    { key: "hr_score", header: "HR / Soft Skills Score", accessor: (r) => `${r.hr_score} / 10` },
    { key: "date", header: "Mock Date" },
    { key: "remarks", header: "Faculty Feedback" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Faculty Mock Interviews & Practice Evaluations"
        subtitle="Technical and HR mock interview scorecards to prepare candidates for campus drives"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Schedule Mock Interview
          </Button>
        }
      />

      <DataTable
        title="Mock Interview Evaluation Scorecard"
        data={mocks}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
