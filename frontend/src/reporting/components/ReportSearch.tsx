import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useReporting } from "../ReportingContext";

export const ReportSearch: React.FC = () => {
  const { searchQuery, setSearchQuery } = useReporting();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Ctrl+F or Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-md" role="search">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 h-4 text-slate-400" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search reports by title, code, module or category (Ctrl+K)..."
        aria-label="Search reports"
        className="w-full pl-9 pr-8 py-2 bg-slate-900/80 text-slate-200 placeholder-slate-500 border border-slate-700/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Clear search query"
        >
          <X className="h-4 h-4" />
        </button>
      )}
    </div>
  );
};
