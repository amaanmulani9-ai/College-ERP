import React, { useState } from "react";
import {
  LayoutGrid,
  Table as TableIcon,
  Download,
  Printer,
  RefreshCw,
  Dock,
  Check,
} from "lucide-react";
import { useReporting } from "./ReportingContext";
import { ReportSearch } from "./components/ReportSearch";

export const ReportToolbar: React.FC = () => {
  const {
    activeCategory,
    viewMode,
    setViewMode,
    selectedReport,
    dockedReports,
    reports,
  } = useReporting();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportSuccess(`Exporting report as ${format.toUpperCase()}...`);
    setIsExportOpen(false);
    setTimeout(() => {
      setExportSuccess(null);
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const reportCount =
    activeCategory === "All"
      ? reports.length
      : reports.filter((r) => r.category === activeCategory).length;

  return (
    <div
      role="toolbar"
      aria-label="Report Controls and Actions Toolbar"
      className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 shadow-md"
    >
      {/* Title & Count */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>
            {selectedReport
              ? selectedReport.title
              : activeCategory === "All"
              ? "All Enterprise Reports & Analytics"
              : `${activeCategory} Reports`}
          </span>
          {!selectedReport && (
            <span className="text-xs font-mono font-medium text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
              {reportCount}
            </span>
          )}
        </h2>
        <p className="text-xs text-slate-400">
          {selectedReport
            ? selectedReport.description
            : "Centralized analytics engine across all 30 college ERP modules."}
        </p>
      </div>

      {/* Middle Search & Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <ReportSearch />

        {/* View Mode Switcher */}
        {!selectedReport && (
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Grid View"
              aria-label="Switch to Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Table View"
              aria-label="Switch to Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={() => setIsExportOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Export report"
            aria-expanded={isExportOpen}
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export</span>
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 text-xs z-30">
              <div className="px-3 py-1 font-semibold text-slate-400 border-b border-slate-800">
                Export Options
              </div>
              <button
                onClick={() => handleExport("pdf")}
                className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
              >
                <span>PDF Document</span>
                <span className="font-mono text-[10px] text-slate-500">.pdf</span>
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
              >
                <span>Excel Spreadsheet</span>
                <span className="font-mono text-[10px] text-slate-500">.xlsx</span>
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
              >
                <span>CSV Data File</span>
                <span className="font-mono text-[10px] text-slate-500">.csv</span>
              </button>
              <button
                onClick={() => handleExport("json")}
                className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
              >
                <span>JSON Payload</span>
                <span className="font-mono text-[10px] text-slate-500">.json</span>
              </button>
            </div>
          )}
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
          title="Print Report"
          aria-label="Print Report"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Docked Indicator */}
        {dockedReports.length > 0 && (
          <div className="flex items-center gap-1 bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs px-2.5 py-1.5 rounded-lg">
            <Dock className="w-3.5 h-3.5" />
            <span>{dockedReports.length} Docked</span>
          </div>
        )}
      </div>

      {exportSuccess && (
        <div className="absolute top-16 right-4 z-40 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs px-4 py-2 rounded-lg shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{exportSuccess}</span>
        </div>
      )}
    </div>
  );
};
