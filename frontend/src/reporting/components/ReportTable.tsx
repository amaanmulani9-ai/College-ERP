import React, { useState } from "react";
import {
  Star,
  Pin,
  ExternalLink,
  Play,
  ArrowUpDown,
  FileSpreadsheet,
} from "lucide-react";
import { ReportItem } from "../types";
import { useReporting } from "../ReportingContext";
import { ReportEmptyState } from "./ReportEmptyState";

interface ReportTableProps {
  reports: ReportItem[];
}

type SortField = "code" | "title" | "category" | "module";

export const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
  const {
    setSelectedReport,
    setViewMode,
    toggleFavorite,
    togglePin,
    openInWorkspaceTab,
    markReportAccessed,
  } = useReporting();

  const [sortField, setSortField] = useState<SortField>("code");
  const [sortAsc, setSortAsc] = useState(true);

  if (!reports || reports.length === 0) {
    return <ReportEmptyState />;
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    const valA = (a[sortField] || "").toString().toLowerCase();
    const valB = (b[sortField] || "").toString().toLowerCase();
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <div
      role="region"
      aria-label="Report Table View"
      className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg"
    >
      <table className="w-full text-left text-sm text-slate-300 border-collapse">
        <thead className="bg-slate-950/90 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
          <tr>
            <th scope="col" className="py-3.5 px-4 w-12 text-center">
              Fav
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-300 transition-colors"
              onClick={() => handleSort("code")}
            >
              <div className="flex items-center gap-1.5">
                <span>Code</span>
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-300 transition-colors"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center gap-1.5">
                <span>Report Title & Description</span>
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-300 transition-colors"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center gap-1.5">
                <span>Category</span>
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </th>
            <th scope="col" className="py-3.5 px-4">
              Formats
            </th>
            <th scope="col" className="py-3.5 px-4 text-right pr-6">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {sortedReports.map((report) => (
            <tr
              key={report.id}
              className="hover:bg-slate-850/80 transition-colors group"
            >
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => toggleFavorite(report.id)}
                  className={`p-1 rounded transition-colors ${
                    report.isFavorite
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-600 hover:text-slate-300"
                  }`}
                  aria-label={`Toggle favorite for ${report.title}`}
                >
                  <Star className="w-4 h-4" />
                </button>
              </td>
              <td className="py-3 px-4 font-mono text-xs font-semibold text-indigo-400 whitespace-nowrap">
                {report.code}
              </td>
              <td className="py-3 px-4 max-w-md">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {report.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {report.description}
                </p>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="inline-block text-xs font-medium text-indigo-300 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 rounded-full">
                  {report.category}
                </span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                  {report.formatSupported.map((fmt) => (
                    <span
                      key={fmt}
                      className="uppercase bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4 text-right pr-6 whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => togglePin(report.id)}
                    className={`p-1.5 rounded hover:bg-slate-800 ${
                      report.isPinned ? "text-indigo-400" : "text-slate-500"
                    }`}
                    title={report.isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      markReportAccessed(report);
                      setSelectedReport(report);
                      setViewMode("viewer");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Run
                  </button>
                  <button
                    onClick={() => openInWorkspaceTab(report)}
                    className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Open in new Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
