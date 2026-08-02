import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus, Award } from "lucide-react";

interface ReviewItem {
  id: string;
  employee_name: string;
  reviewer_name: string;
  review_cycle: string;
  rating: number;
  remarks: string;
}

export const PerformancePage: React.FC = () => {
  const reviews: ReviewItem[] = [
    { id: "1", employee_name: "Dr. Rajesh Sharma", reviewer_name: "Principal Academic Council", review_cycle: "Annual 2026", rating: 4.8, remarks: "Outstanding research publications & student feedback" },
    { id: "2", employee_name: "Prof. Sunita Rao", reviewer_name: "HOD Electrical Eng", review_cycle: "Annual 2026", rating: 4.5, remarks: "Exceeds performance benchmarks in lab instruction" },
  ];

  const columns: ColumnDef<ReviewItem>[] = [
    { key: "employee_name", header: "Faculty / Staff Name", sortable: true },
    { key: "reviewer_name", header: "Reviewer" },
    { key: "review_cycle", header: "Cycle" },
    {
      key: "rating",
      header: "Rating (out of 5)",
      accessor: (r) => <span className="font-mono font-bold text-emerald-400">{r.rating} / 5.0</span>,
    },
    { key: "remarks", header: "Remarks" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Performance Appraisal & Reviews"
        subtitle="Manage annual performance evaluations, KPI goals & academic appraisal scores"
        actions={
          <Button variant="primary" leftIcon={<Award className="w-4 h-4" />}>
            New Appraisal Review
          </Button>
        }
      />

      <DataTable data={reviews} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
