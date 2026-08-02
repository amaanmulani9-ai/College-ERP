import React from "react";
import { BarChart2 } from "lucide-react";
import { ChartPlaceholder } from "./ChartPlaceholder";

const ANALYTICS_CHARTS = [
  { title: "Student Growth & Admissions", subtitle: "Year-on-year enrollment trend across all programs and disciplines" },
  { title: "Attendance Rate Analytics", subtitle: "Daily, weekly, and monthly attendance rates with department breakdown" },
  { title: "Fee Collection & Revenue", subtitle: "Monthly fee collection throughput and payment gateway success rates" },
  { title: "Library Circulation Metrics", subtitle: "Book issue, return, and overdue fine trends over the academic year" },
  { title: "Hostel Occupancy Trends", subtitle: "Bed occupancy rates, block-wise allocation, and seasonal patterns" },
  { title: "Academic Result Distribution", subtitle: "Grade distribution and pass percentage across semesters and subjects" },
];

export const AnalyticsHub: React.FC = () => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-400" /> Institutional Analytics Hub
        </h3>
        <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-[10px] font-mono font-bold">
          Backend Ready
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {ANALYTICS_CHARTS.map((chart, i) => (
          <ChartPlaceholder key={i} title={chart.title} subtitle={chart.subtitle} />
        ))}
      </div>
    </div>
  );
};
