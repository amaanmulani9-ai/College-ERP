import React from "react";
import { ChevronRight, Home, BarChart2 } from "lucide-react";
import { useReporting } from "./ReportingContext";

export const ReportBreadcrumbs: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    selectedReport,
    setSelectedReport,
    setViewMode,
  } = useReporting();

  const handleReset = () => {
    setSelectedReport(null);
    setActiveCategory("All");
    setViewMode("grid");
  };

  const handleCategoryClick = () => {
    setSelectedReport(null);
    setViewMode("grid");
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800 backdrop-blur-md mb-4"
    >
      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-0.5 transition-colors"
        aria-label="Navigate to Home Workspace"
      >
        <Home className="w-4 h-4 text-indigo-400" />
        <span className="font-medium text-slate-300">Workspace</span>
      </button>

      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />

      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-0.5 transition-colors"
        aria-label="Navigate to Analytics & Reporting catalog"
      >
        <BarChart2 className="w-4 h-4 text-cyan-400" />
        <span className="font-medium text-slate-300">Reporting Framework</span>
      </button>

      {activeCategory && activeCategory !== "All" && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
          <button
            onClick={handleCategoryClick}
            className="hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1.5 py-0.5 transition-colors font-medium text-slate-300"
            aria-label={`Category: ${activeCategory}`}
          >
            {activeCategory}
          </button>
        </>
      )}

      {selectedReport && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
          <span
            className="font-semibold text-indigo-300 truncate max-w-[200px] sm:max-w-xs"
            aria-current="page"
            title={selectedReport.title}
          >
            {selectedReport.title}
          </span>
        </>
      )}
    </nav>
  );
};
