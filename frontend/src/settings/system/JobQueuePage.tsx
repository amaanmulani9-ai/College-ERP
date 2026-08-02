import React, { useState } from "react";
import { Layers, RefreshCw, XCircle, RotateCcw } from "lucide-react";
import { MOCK_JOBS } from "./mockSystemData";
import type { JobEntry } from "./types";

type JobFilter = "All" | "Running" | "Pending" | "Completed" | "Failed";

const statusStyle: Record<JobEntry["status"], string> = {
  Running:   "bg-indigo-950 text-indigo-300 border-indigo-800",
  Pending:   "bg-amber-950 text-amber-300 border-amber-800",
  Completed: "bg-emerald-950 text-emerald-300 border-emerald-800",
  Failed:    "bg-rose-950 text-rose-300 border-rose-800",
  Cancelled: "bg-slate-800 text-slate-400 border-slate-700",
};

const statusDot: Record<JobEntry["status"], string> = {
  Running:   "bg-indigo-400 animate-pulse",
  Pending:   "bg-amber-400",
  Completed: "bg-emerald-400",
  Failed:    "bg-rose-500",
  Cancelled: "bg-slate-600",
};

const FILTERS: JobFilter[] = ["All", "Running", "Pending", "Completed", "Failed"];

export const JobQueuePage: React.FC = () => {
  const [filter, setFilter] = useState<JobFilter>("All");

  const filtered = filter === "All" ? MOCK_JOBS : MOCK_JOBS.filter((j) => j.status === filter);

  const counts: Record<JobFilter, number> = {
    All:       MOCK_JOBS.length,
    Running:   MOCK_JOBS.filter((j) => j.status === "Running").length,
    Pending:   MOCK_JOBS.filter((j) => j.status === "Pending").length,
    Completed: MOCK_JOBS.filter((j) => j.status === "Completed").length,
    Failed:    MOCK_JOBS.filter((j) => j.status === "Failed").length,
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Celery Job Queue Monitor</h2>
            <p className="text-[10px] text-slate-500">Track scheduled, running, and failed background jobs across all queues.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-[11px]">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Running",   val: counts.Running,   color: "text-indigo-400" },
          { label: "Pending",   val: counts.Pending,   color: "text-amber-400" },
          { label: "Completed", val: counts.Completed, color: "text-emerald-400" },
          { label: "Failed",    val: counts.Failed,    color: "text-rose-400" },
        ].map((s) => (
          <div key={s.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              filter === f ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-2 font-mono">
        {filtered.map((job) => (
          <div key={job.id} className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[job.status]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-100 font-sans truncate">{job.name}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                <span className="text-slate-600">Queue:</span>
                <code className="text-cyan-400">{job.queue}</code>
                <span>·</span>
                <span>{job.scheduledAt}</span>
                {job.retries > 0 && <span className="text-rose-400 font-bold">· {job.retries}x retried</span>}
              </div>
            </div>
            {job.duration && <span className="text-[10px] text-slate-500 shrink-0">{job.duration}</span>}
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${statusStyle[job.status]}`}>
              {job.status}
            </span>
            <div className="flex items-center gap-1">
              {job.status === "Failed" && (
                <button className="p-1.5 text-amber-400 hover:text-amber-200 transition-colors" title="Retry job">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              {(job.status === "Running" || job.status === "Pending") && (
                <button className="p-1.5 text-rose-400 hover:text-rose-200 transition-colors" title="Cancel job">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
