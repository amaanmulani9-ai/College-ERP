import React from "react";
import { HardDrive, PlayCircle, Clock, Download } from "lucide-react";
import { MOCK_BACKUP_JOBS } from "./mockSystemData";
import type { BackupJob } from "./types";

const statusStyle: Record<BackupJob["status"], string> = {
  Completed: "bg-emerald-950 text-emerald-300 border-emerald-800",
  Running:   "bg-indigo-950 text-indigo-300 border-indigo-800",
  Failed:    "bg-rose-950 text-rose-300 border-rose-800",
};

const typeStyle: Record<BackupJob["type"], string> = {
  "Full":        "bg-amber-950 text-amber-300 border-amber-800",
  "Incremental": "bg-cyan-950 text-cyan-300 border-cyan-800",
  "Schema-Only": "bg-purple-950 text-purple-300 border-purple-800",
};

export const BackupCenterPage: React.FC = () => (
  <div className="space-y-4 text-xs font-sans">
    {/* Actions Row */}
    <div className="flex items-center gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
      <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] transition-colors">
        <PlayCircle className="w-4 h-4" />
        Manual Full Backup
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] transition-colors">
        <PlayCircle className="w-4 h-4" />
        Incremental Now
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] transition-colors">
        <Clock className="w-4 h-4" />
        Edit Schedule
      </button>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Daily Full Backup", value: "03:00 IST", sub: "Retention: 30 days" },
        { label: "Incremental Cadence", value: "Every 6h", sub: "Retention: 7 days" },
        { label: "Last Backup Size", value: "18.4 GB", sub: "Full · 12m 34s" },
        { label: "RPO Target", value: "< 6 Hours", sub: "Current RTO: ~45m" },
      ].map((c) => (
        <div key={c.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
          <p className="text-[10px] text-slate-500 font-semibold">{c.label}</p>
          <p className="text-base font-bold font-mono text-slate-100 mt-0.5">{c.value}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>

    {/* Retention Policy */}
    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
      <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Retention Policy</h3>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Full Backups",         value: "30 days" },
          { label: "Incremental Backups",  value: "7 days"  },
          { label: "Schema-Only Backups",  value: "90 days" },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-400">{r.label}</span>
            <span className="text-[10px] font-bold font-mono text-indigo-300">{r.value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Backup History */}
    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
      <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Backup History</h3>
      <div className="space-y-2">
        {MOCK_BACKUP_JOBS.map((job) => (
          <div key={job.id} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono shrink-0 ${typeStyle[job.type]}`}>
              {job.type}
            </span>
            <span className="text-[10px] text-slate-500 shrink-0">{job.trigger}</span>
            <span className="text-[11px] font-bold text-slate-200 flex-1 font-mono truncate">{job.completedAt}</span>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">{job.size}</span>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">{job.duration}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${statusStyle[job.status]}`}>
              {job.status}
            </span>
            {job.status === "Completed" && (
              <button className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors" title="Download backup">
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
