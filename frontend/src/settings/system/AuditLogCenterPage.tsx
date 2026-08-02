import React, { useState } from "react";
import { ScrollText, Search, Download } from "lucide-react";
import { MOCK_AUDIT_LOGS } from "./mockSystemData";

const resultStyle: Record<string, string> = {
  Success: "bg-emerald-950 text-emerald-300 border-emerald-800",
  Failure: "bg-rose-950 text-rose-300 border-rose-800",
  Blocked: "bg-amber-950 text-amber-300 border-amber-800",
};

export const AuditLogCenterPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const filtered = MOCK_AUDIT_LOGS.filter(
    (l) =>
      l.actor.toLowerCase().includes(query.toLowerCase()) ||
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.target.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Security & Administrative Audit Trail Log</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors">
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by actor, action, or target resource…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-600"
        />
      </div>

      {/* Log Entries */}
      <div className="space-y-2 font-mono">
        {filtered.map((log) => (
          <div key={log.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold text-[10px]">{log.id}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400 text-[10px]">IP: {log.ip}</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${resultStyle[log.result]}`}>
                {log.result}
              </span>
            </div>
            <div className="flex items-start gap-2 text-[11px]">
              <span className="text-slate-300 font-bold font-sans shrink-0">{log.actor}</span>
              <span className="text-slate-600 text-[9px] mt-0.5 shrink-0 uppercase">[{log.role}]</span>
              <span className="text-amber-400 font-bold shrink-0">{log.action}</span>
              <span className="text-slate-500 truncate">{log.target}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500">No audit log entries match your search.</div>
        )}
      </div>
    </div>
  );
};
