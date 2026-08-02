import React, { useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { MOCK_ACTIVITY_LOGS } from "./mockSystemData";

const moduleColors: Record<string, string> = {
  Admissions: "bg-blue-950 text-blue-300 border-blue-800",
  Fees:       "bg-emerald-950 text-emerald-300 border-emerald-800",
  Reports:    "bg-purple-950 text-purple-300 border-purple-800",
  Settings:   "bg-indigo-950 text-indigo-300 border-indigo-800",
  Library:    "bg-amber-950 text-amber-300 border-amber-800",
  HR:         "bg-cyan-950 text-cyan-300 border-cyan-800",
  Backups:    "bg-rose-950 text-rose-300 border-rose-800",
};

export const ActivityLogPage: React.FC = () => {
  const [query, setQuery]   = useState("");
  const [module, setModule] = useState("All");
  const [date, setDate]     = useState("");

  const modules = ["All", ...Array.from(new Set(MOCK_ACTIVITY_LOGS.map((l) => l.module)))];

  const filtered = MOCK_ACTIVITY_LOGS.filter((l) => {
    const q = query.toLowerCase();
    return (
      (!q || l.user.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q)) &&
      (module === "All" || l.module === module)
    );
  });

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <ClipboardList className="w-5 h-5 text-cyan-400" />
        <div>
          <h2 className="text-sm font-bold text-slate-100">User & Module Activity Log</h2>
          <p className="text-[10px] text-slate-500">Track all user actions across every ERP module in real time.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search user, action, detail…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-slate-200 text-[11px] placeholder-slate-500 focus:outline-none focus:border-indigo-600"
          />
        </div>
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-[11px] focus:outline-none"
        >
          {modules.map((m) => <option key={m}>{m}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-[11px] focus:outline-none" />
      </div>

      {/* Activity Feed */}
      <div className="space-y-2">
        {filtered.map((log) => (
          <div key={log.id} className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono mt-0.5 shrink-0 ${moduleColors[log.module] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
              {log.module}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold text-slate-100">{log.user}</span>
                <span className="text-amber-400 font-bold text-[11px] font-mono">{log.action}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{log.detail}</p>
            </div>
            <span className="text-[10px] font-mono text-slate-600 shrink-0">{log.timestamp}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500">No activity records match your filters.</div>
        )}
      </div>
    </div>
  );
};
