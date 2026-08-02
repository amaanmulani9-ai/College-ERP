import React from "react";
import { FileSearch, RefreshCw } from "lucide-react";
import { useReporting } from "../ReportingContext";

export const ReportEmptyState: React.FC = () => {
  const { searchQuery, setSearchQuery, setActiveCategory } = useReporting();

  const handleReset = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-xl"
    >
      <div className="p-4 bg-slate-800/80 rounded-full text-slate-400 mb-4 shadow-inner">
        <FileSearch className="w-10 h-10 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">
        No reports found
      </h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {searchQuery
          ? `No analytics or reports matched your query "${searchQuery}". Try refining search keywords or clearing filters.`
          : "There are no reports available in this category or view right now."}
      </p>
      <button
        onClick={handleReset}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <RefreshCw className="w-4 h-4" />
        Reset Catalog Filters
      </button>
    </div>
  );
};
