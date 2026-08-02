import React from "react";
import { HardDrive, PlayCircle } from "lucide-react";
import { BackupJob } from "./types";
import { MOCK_BACKUP_JOBS } from "./mockSystemData";

const statusStyle: Record<BackupJob["status"], string> = {
  Completed: "bg-emerald-950 text-emerald-300 border-emerald-800",
  Running: "bg-indigo-950 text-indigo-300 border-indigo-800",
  Failed: "bg-rose-950 text-rose-300 border-rose-800",
};

const typeStyle: Record<BackupJob["type"], string> = {
  Full: "bg-amber-950 text-amber-300 border-amber-800",
  Incremental: "bg-cyan-950 text-cyan-300 border-cyan-800",
  "Schema-Only": "bg-purple-950 text-purple-300 border-purple-800",
};

export const BackupRecoveryPage: React.FC = () => {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Database Backup, Recovery & Retention Center</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors">
          <PlayCircle className="w-4 h-4" />
          <span>Trigger Manual Backup</span>
        </button>
      </div>

      {/* Schedule Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Daily Full Backup", value: "03:00 IST", sub: "Retention: 30 days" },
          { label: "Hourly Incremental", value: "Every 6h", sub: "Retention: 7 days" },
          { label: "Last Full Backup", value: "18.4 GB", sub: "Completed in 12m 34s" },
          { label: "RPO Target", value: "< 1 Hour", sub: "Current: 6h" },
        ].map((c) => (
          <div key={c.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <p className="text-[10px] text-slate-500 font-semibold">{c.label}</p>
            <p className="text-base font-bold font-mono text-slate-100 mt-0.5">{c.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Backup Job History */}
      <div>
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase mb-2">Recent Backup Jobs</h3>
        <div className="space-y-2 font-mono">
          {MOCK_BACKUP_JOBS.map((job) => (
            <div key={job.id} className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${typeStyle[job.type]}`}>
                {job.type}
              </span>
              <span className="text-slate-500 text-[10px]">{job.trigger}</span>
              <span className="text-slate-300 text-[11px] font-bold flex-1">{job.completedAt}</span>
              <span className="text-slate-400 text-[10px]">{job.size}</span>
              <span className="text-slate-400 text-[10px]">{job.duration}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${statusStyle[job.status]}`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
