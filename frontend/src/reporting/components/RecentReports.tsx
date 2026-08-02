import React from "react";
import { Clock } from "lucide-react";
import { useReporting } from "../ReportingContext";
import { ReportCard } from "./ReportCard";

export const RecentReports: React.FC = () => {
  const { recentReports } = useReporting();

  if (!recentReports || recentReports.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
        <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-300">No Recent Reports</h4>
        <p className="text-xs text-slate-500 mt-1">
          Reports you run or open in workspace tabs will automatically appear here for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="region" aria-label="Recent Reports">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-indigo-400" />
        <span>Recently Accessed Reports ({recentReports.length})</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
};
