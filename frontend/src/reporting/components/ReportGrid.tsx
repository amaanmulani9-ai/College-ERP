import React from "react";
import { ReportItem } from "../types";
import { ReportCard } from "./ReportCard";
import { ReportEmptyState } from "./ReportEmptyState";

interface ReportGridProps {
  reports: ReportItem[];
}

export const ReportGrid: React.FC<ReportGridProps> = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return <ReportEmptyState />;
  }

  return (
    <div
      role="region"
      aria-label="Report Grid View"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};
