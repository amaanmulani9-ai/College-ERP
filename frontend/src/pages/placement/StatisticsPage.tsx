import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  StatList,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { TrendingUp, RefreshCw, BarChart2 } from "lucide-react";

interface StatisticsItem {
  id: string;
  academic_year: string;
  placed_students: number;
  highest_package: number;
  average_package: number;
  companies_visited: number;
  offers_made: number;
}

export const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatisticsItem[]>([
    { id: "1", academic_year: "2025-2026", placed_students: 315, highest_package: 4500000, average_package: 850000, companies_visited: 42, offers_made: 380 },
    { id: "2", academic_year: "2024-2025", placed_students: 298, highest_package: 4200000, average_package: 780000, companies_visited: 38, offers_made: 350 },
    { id: "3", academic_year: "2023-2024", placed_students: 275, highest_package: 3600000, average_package: 720000, companies_visited: 35, offers_made: 320 },
  ]);

  const handleComputeStats = () => {
    fetch("/api/placement/statistics/compute/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ academic_year: "2025-2026" }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Computed placement statistics for ${data.academic_year}`);
      })
      .catch((err) => console.error(err));
  };

  const columns: ColumnDef<StatisticsItem>[] = [
    { key: "academic_year", header: "Academic Year", sortable: true },
    { key: "placed_students", header: "Placed Candidates" },
    { key: "highest_package", header: "Highest CTC", accessor: (r) => `₹${(r.highest_package / 100000).toFixed(2)} LPA` },
    { key: "average_package", header: "Average CTC", accessor: (r) => `₹${(r.average_package / 100000).toFixed(2)} LPA` },
    { key: "companies_visited", header: "Companies Visited" },
    { key: "offers_made", header: "Total Offers Issued" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Placement Statistics & Package Analytics"
        subtitle="Annual campus recruitment analytics, CTC distribution, and department benchmarks"
        actions={
          <Button variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleComputeStats}>
            Recalculate Annual Statistics
          </Button>
        }
      />

      <StatList
        stats={[
          { label: "Placed Students (AY 25-26)", value: 315 },
          { label: "Placement Percentage", value: "70.0%" },
          { label: "Highest CTC Package", value: "₹45.00 LPA" },
          { label: "Average CTC Package", value: "₹8.50 LPA" },
          { label: "Recruiting Companies", value: 42 },
          { label: "Total Offers Made", value: 380 },
        ]}
      />

      <DataTable
        title="Historical Annual Placement Statistics Ledger"
        data={stats}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={false}
      />
    </PageContainer>
  );
};
