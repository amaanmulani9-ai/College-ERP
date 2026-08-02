import React from "react";
import { Database, Zap } from "lucide-react";
import { MOCK_DB_TABLES } from "./mockSystemData";

export const DatabaseManagementPage: React.FC = () => {
  const totalRows = MOCK_DB_TABLES.reduce((s, t) => s + t.rows, 0);
  const totalSize = MOCK_DB_TABLES.reduce((s, t) => s + t.sizeKB, 0);

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">PostgreSQL Database Management</h2>
            <p className="text-[10px] text-slate-500">Table stats, connection pool, index health, and optimization actions.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors text-[11px]">
          <Zap className="w-3.5 h-3.5" />
          Run VACUUM ANALYZE
        </button>
      </div>

      {/* DB Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "PostgreSQL Version", value: "16.3",              color: "text-indigo-400" },
          { label: "Total Rows",         value: totalRows.toLocaleString(), color: "text-slate-100" },
          { label: "Total DB Size",      value: `${(totalSize / 1024 / 1024).toFixed(1)} GB`, color: "text-amber-400" },
          { label: "Active Connections", value: "24 / 100",          color: "text-emerald-400" },
        ].map((m) => (
          <div key={m.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <p className={`text-base font-bold font-mono ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Connection Pool */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Connection Pool (PgBouncer)</h3>
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Active: <span className="text-emerald-400 font-bold">24</span></span>
          <span className="text-slate-400">Idle: <span className="text-slate-300 font-bold">18</span></span>
          <span className="text-slate-400">Waiting: <span className="text-amber-400 font-bold">0</span></span>
          <span className="text-slate-400">Max: <span className="text-slate-300 font-bold">100</span></span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "24%" }} />
        </div>
      </div>

      {/* Table Stats */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Table Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left py-2 pr-4">Table</th>
                <th className="text-right py-2 pr-4">Rows</th>
                <th className="text-right py-2 pr-4">Size</th>
                <th className="text-right py-2 pr-4">Indexes</th>
                <th className="text-right py-2">Last Vacuum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {MOCK_DB_TABLES.map((t) => (
                <tr key={t.name} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2 pr-4 text-indigo-300 font-bold">{t.name}</td>
                  <td className="py-2 pr-4 text-right text-slate-300">{t.rows.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right text-slate-400">{(t.sizeKB / 1024).toFixed(1)} MB</td>
                  <td className="py-2 pr-4 text-right text-slate-400">{t.indexes}</td>
                  <td className="py-2 text-right text-slate-500">{t.lastVacuum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Actions */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Reindex All Tables",        desc: "Rebuilds all indexes for optimal query performance.",  btn: "Run REINDEX", color: "bg-slate-800 hover:bg-slate-700" },
          { label: "Analyze Query Performance",  desc: "Show slow queries from pg_stat_statements extension.", btn: "Show Slow Queries", color: "bg-slate-800 hover:bg-slate-700" },
        ].map((a) => (
          <div key={a.label} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <p className="font-bold text-slate-100 text-[11px]">{a.label}</p>
            <p className="text-[10px] text-slate-500">{a.desc}</p>
            <button className={`px-3 py-1.5 ${a.color} text-slate-200 font-bold rounded-lg text-[11px] transition-colors`}>{a.btn}</button>
          </div>
        ))}
      </div>
    </div>
  );
};
