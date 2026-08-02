import React, { useState } from "react";
import { ScrollText, Search, Download, Filter } from "lucide-react";
import { MOCK_AUDIT_LOGS } from "./mockSystemData";
import type { AuditLogEntry } from "./types";

type CategoryFilter = "All" | "Security" | "Configuration" | "System";

const resultStyle: Record<AuditLogEntry["result"], string> = {
  Success: "bg-emerald-950 text-emerald-300 border-emerald-800",
  Failure: "bg-rose-950 text-rose-300 border-rose-800",
  Blocked: "bg-amber-950 text-amber-300 border-amber-800",
  Warning: "bg-yellow-950 text-yellow-300 border-yellow-800",
};

const categoryStyle: Record<CategoryFilter, string> = {
  All:           "",
  Security:      "bg-rose-950/40 text-rose-300 border-rose-800/60",
  Configuration: "bg-indigo-950/40 text-indigo-300 border-indigo-800/60",
  System:        "bg-slate-800 text-slate-300 border-slate-700",
};

export const AuditLogPage: React.FC = () => {
  const [query, setQuery]   = useState("");
  const [category, setCat]  = useState<CategoryFilter>("All");
  const [dateFrom, setFrom] = useState("");
  const [dateTo, setTo]     = useState("");

  const filtered = MOCK_AUDIT_LOGS.filter((l) => {
    const q = query.toLowerCase();
    const matchQ    = !q || l.actor.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.target.toLowerCase().includes(q);
    const matchCat  = category === "All" || l.category === category;
    return matchQ && matchCat;
  });

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Security & Administrative Audit Trail</h2>
            <p className="text-[10px] text-slate-500">Tamper-evident log of all system events, config changes, and security actions.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-[11px]">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search actor, action, target…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-slate-200 text-[11px] placeholder-slate-500 focus:outline-none focus:border-indigo-600"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCat(e.target.value as CategoryFilter)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-[11px] focus:outline-none focus:border-indigo-600"
        >
          <option value="All">All Categories</option>
          <option value="Security">Security</option>
          <option value="Configuration">Configuration</option>
          <option value="System">System</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setFrom(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-[11px] focus:outline-none focus:border-indigo-600" />
        <input type="date" value={dateTo} onChange={(e) => setTo(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-[11px] focus:outline-none focus:border-indigo-600" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Total Events", val: MOCK_AUDIT_LOGS.length, color: "text-slate-100" },
          { label: "Security",     val: MOCK_AUDIT_LOGS.filter(l => l.category === "Security").length, color: "text-rose-400" },
          { label: "Config Changes", val: MOCK_AUDIT_LOGS.filter(l => l.category === "Configuration").length, color: "text-indigo-400" },
          { label: "Blocked",      val: MOCK_AUDIT_LOGS.filter(l => l.result === "Blocked").length, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Log Entries */}
      <div className="space-y-2 font-mono">
        {filtered.map((log) => (
          <div key={log.id} className={`p-3.5 border rounded-xl ${categoryStyle[log.category as CategoryFilter] || "bg-slate-950 border-slate-800"}`}>
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <code className="text-indigo-400 font-bold">{log.id}</code>
                <span>|</span>
                <span>{log.timestamp}</span>
                <span>|</span>
                <span className="text-slate-400">IP: {log.ip}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-slate-900 text-slate-400 border-slate-700 uppercase">{log.category}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${resultStyle[log.result]}`}>{log.result}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-[11px] flex-wrap">
              <span className="text-slate-200 font-bold font-sans">{log.actor}</span>
              <span className="text-[9px] text-slate-600 uppercase mt-0.5">[{log.role}]</span>
              <span className="text-amber-400 font-bold">{log.action}</span>
              <span className="text-slate-500 truncate">{log.target}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500 font-sans">No audit entries match your filters.</div>
        )}
      </div>
    </div>
  );
};
