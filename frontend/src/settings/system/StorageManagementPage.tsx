import React from "react";
import { HardDrive, Trash2 } from "lucide-react";
import { MOCK_STORAGE_BUCKETS } from "./mockSystemData";

const catColor: Record<string, string> = {
  Uploads:  "bg-blue-500",
  Reports:  "bg-purple-500",
  Media:    "bg-pink-500",
  Logs:     "bg-amber-500",
  Backups:  "bg-emerald-500",
};

const catBadge: Record<string, string> = {
  Uploads: "bg-blue-950 text-blue-300 border-blue-800",
  Reports: "bg-purple-950 text-purple-300 border-purple-800",
  Media:   "bg-pink-950 text-pink-300 border-pink-800",
  Logs:    "bg-amber-950 text-amber-300 border-amber-800",
  Backups: "bg-emerald-950 text-emerald-300 border-emerald-800",
};

export const StorageManagementPage: React.FC = () => {
  const totalUsed  = MOCK_STORAGE_BUCKETS.reduce((s, b) => s + b.usedGB, 0);
  const totalCap   = MOCK_STORAGE_BUCKETS.reduce((s, b) => s + b.totalGB, 0);
  const pct        = Math.round((totalUsed / totalCap) * 100);

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Storage Management</h2>
            <p className="text-[10px] text-slate-500">Monitor disk usage across all ERP storage buckets and clean up old data.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors text-[11px]">
          <Trash2 className="w-3.5 h-3.5" />
          Cleanup Wizard
        </button>
      </div>

      {/* Total Usage Bar */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300">Total Platform Storage</span>
          <span className={`text-[11px] font-bold font-mono ${pct > 80 ? "text-rose-400" : pct > 60 ? "text-amber-400" : "text-emerald-400"}`}>
            {totalUsed.toFixed(1)} GB / {totalCap} GB ({pct}%)
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct > 80 ? "bg-rose-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Stacked legend */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {MOCK_STORAGE_BUCKETS.map((b) => (
            <div key={b.id} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${catColor[b.category]}`} />
              <span className="text-[10px] text-slate-400">{b.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bucket Cards */}
      <div className="space-y-2">
        {MOCK_STORAGE_BUCKETS.map((bucket) => {
          const used = Math.round((bucket.usedGB / bucket.totalGB) * 100);
          return (
            <div key={bucket.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${catBadge[bucket.category]}`}>
                    {bucket.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-100">{bucket.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{bucket.usedGB} GB / {bucket.totalGB} GB</span>
                  <button className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors" title="Clean up this bucket">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${catColor[bucket.category]}`}
                  style={{ width: `${used}%`, opacity: 0.8 }}
                />
              </div>
              <p className="text-[10px] font-mono text-slate-600 mt-1 text-right">{used}% used</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
