import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, BookOpen } from "lucide-react";

interface ProgramItem {
  id: string;
  program_name: string;
  trainer: string;
  duration_days: number;
  venue: string;
  enrolled_count: number;
}

export const TrainingPage: React.FC = () => {
  const programs: ProgramItem[] = [
    { id: "1", program_name: "Outcome Based Education (OBE) Pedagogy", trainer: "National Board of Accreditation Expert", duration_days: 3, venue: "Main Seminar Hall", enrolled_count: 45 },
    { id: "2", program_name: "Cybersecurity & Data Privacy Compliance", trainer: "CERT-In Certified Auditor", duration_days: 2, venue: "Computer Lab 4 / Online", enrolled_count: 30 },
  ];

  const columns: ColumnDef<ProgramItem>[] = [
    { key: "program_name", header: "Program Title", sortable: true },
    { key: "trainer", header: "Trainer / Resource Person" },
    { key: "duration_days", header: "Duration (Days)" },
    { key: "venue", header: "Venue" },
    { key: "enrolled_count", header: "Enrolled Staff" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Faculty & Staff Training Programs"
        subtitle="Organize professional development workshops, accreditation seminars & certificate tracking"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Training Program
          </Button>
        }
      />

      <DataTable data={programs} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
