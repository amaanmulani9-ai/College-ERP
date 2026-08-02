import React, { useState } from "react";
import { Search, BarChart3, Star, ChevronRight, FileSpreadsheet, Eye } from "lucide-react";

export interface MobileReportItem {
  id: string;
  title: string;
  category: "academic" | "financial" | "admin";
  format: string;
  isFavorite?: boolean;
}

const REPORTS: MobileReportItem[] = [
  { id: "rep1", title: "Semester Admission Audit Report", category: "academic", format: "PDF / XLSX", isFavorite: true },
  { id: "rep2", title: "Fee Collection & Outstanding Summary", category: "financial", format: "PDF / CSV", isFavorite: true },
  { id: "rep3", title: "Faculty Efficiency & Load Analysis", category: "admin",     format: "XLSX",       isFavorite: false },
  { id: "rep4", title: "Hostel Vacancy & Occupancy Statement", category: "admin",    format: "PDF",        isFavorite: false },
  { id: "rep5", title: "Library Book Issue & Fine Register", category: "academic", format: "CSV",        isFavorite: false },
];

export const MobileReportCatalog: React.FC<{ onSelectReport: (rep: MobileReportItem) => void }> = ({
  onSelectReport,
}) => {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = REPORTS.filter((r) => {
    if (catFilter !== "all" && r.category !== catFilter) return false;
    if (!query) return true;
    return r.title.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="space-y-3 font-sans text-xs select-none">
      {/* Search & Filter Bar */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports catalog…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: "all",       label: "All Reports" },
            { id: "academic",  label: "Academic" },
            { id: "financial", label: "Financial" },
            { id: "admin",      label: "Admin" },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                catFilter === c.id ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-2">
        {filtered.map((rep) => (
          <div
            key={rep.id}
            onClick={() => onSelectReport(rep)}
            className="p-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                <FileSpreadsheet className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-100 text-[11px] truncate">{rep.title}</p>
                <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mt-0.5">
                  <span className="uppercase">{rep.category}</span>
                  <span>·</span>
                  <span>{rep.format}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
