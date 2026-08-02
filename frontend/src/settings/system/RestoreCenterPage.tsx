import React, { useState } from "react";
import { RotateCcw, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { MOCK_BACKUP_JOBS } from "./mockSystemData";

export const RestoreCenterPage: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [done, setDone] = useState(false);

  const completedBackups = MOCK_BACKUP_JOBS.filter((j) => j.status === "Completed");

  const handleRestore = () => {
    if (!confirmed) return;
    setRestoring(true);
    setTimeout(() => { setRestoring(false); setDone(true); }, 3000);
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 bg-rose-950/40 border border-rose-800 rounded-xl">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-rose-300 text-sm">⚠ Restore is a Destructive Operation</p>
          <p className="text-[11px] text-rose-400/80 mt-1">
            Restoring from a backup will <strong className="text-rose-300">overwrite the current database</strong> with the selected recovery point.
            This action cannot be undone. Ensure maintenance mode is active before proceeding.
          </p>
        </div>
      </div>

      {/* Backup Selection */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">1. Select Recovery Point</h3>
        <div className="space-y-2">
          {completedBackups.map((job) => (
            <label
              key={job.id}
              className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                selected === job.id ? "bg-indigo-950/50 border-indigo-600" : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="backup-point"
                value={job.id}
                checked={selected === job.id}
                onChange={() => { setSelected(job.id); setConfirmed(false); setDone(false); }}
                className="text-indigo-600"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded uppercase">{job.type}</span>
                  <span className="text-[9px] text-slate-500">{job.trigger}</span>
                </div>
                <p className="text-[11px] font-bold font-mono text-slate-100">{job.completedAt}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{job.location}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-300 font-mono">{job.size}</p>
                <p className="text-[10px] text-slate-500">{job.duration}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Confirmation */}
      {selected && !done && (
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">2. Confirmation Required</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 text-rose-600" />
            <span className="text-[11px] text-slate-300">
              I understand this will <strong className="text-rose-300">overwrite the live database</strong> and cannot be reversed.
              I confirm maintenance mode is active and all users have been notified.
            </span>
          </label>
          <button
            onClick={handleRestore}
            disabled={!confirmed || restoring}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-700 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${restoring ? "animate-spin" : ""}`} />
            {restoring ? "Restoring Database… Please wait" : "Execute Restore"}
          </button>
          {restoring && (
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-600 rounded-full animate-pulse w-3/4" />
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {done && (
        <div className="flex items-center gap-3 p-5 bg-emerald-950/40 border border-emerald-800 rounded-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          <div>
            <p className="font-bold text-emerald-300 text-sm">Restore Completed Successfully</p>
            <p className="text-[11px] text-emerald-400/80 mt-0.5">Database has been restored. Run Health Monitoring to validate all services.</p>
          </div>
        </div>
      )}

      {/* Validation Reminder */}
      <div className="flex items-center gap-3 p-3.5 bg-amber-950/30 border border-amber-800/50 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-[11px] text-amber-300">
          After restore: run <code className="font-mono text-amber-200">python manage.py migrate --check</code> and verify Health Monitor shows all services Healthy before disabling maintenance mode.
        </p>
      </div>
    </div>
  );
};
