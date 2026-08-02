import React from "react";
import { Terminal, Download, RotateCcw, Trash2, Shield } from "lucide-react";

export const SystemAdvancedPage: React.FC = () => {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Terminal className="w-5 h-5 text-rose-400" />
        <h2 className="text-base font-bold text-slate-100">Advanced System Configuration & Danger Zone Operations</h2>
      </div>

      {/* Environment Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Django Version", value: "5.1.4" },
          { label: "Python Runtime", value: "3.12.4" },
          { label: "PostgreSQL Version", value: "16.3" },
          { label: "Redis Version", value: "7.2.4" },
          { label: "Node.js Version", value: "22.4.0 LTS" },
          { label: "React Version", value: "18.3.1" },
          { label: "Celery Version", value: "5.4.0" },
          { label: "Deployment Environment", value: "Production" },
          { label: "Build Commit SHA", value: "a4f8c3d" },
        ].map((item) => (
          <div key={item.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <p className="text-[10px] text-slate-500 font-semibold">{item.label}</p>
            <p className="text-sm font-bold font-mono text-indigo-300 mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase mb-3">Platform Admin Operations</h3>
        {[
          { icon: RotateCcw, label: "Flush All Redis Caches", desc: "Clears all session and query caches. Users will be signed out.", color: "text-amber-400", btnColor: "bg-amber-700 hover:bg-amber-600", btnLabel: "Flush Caches" },
          { icon: Download, label: "Export Full Platform Snapshot", desc: "Download a complete ZIP snapshot of configs, templates, and data exports.", color: "text-indigo-400", btnColor: "bg-indigo-700 hover:bg-indigo-600", btnLabel: "Export Snapshot" },
          { icon: Shield, label: "Run Security Health Scan", desc: "Triggers a full OWASP/CWE vulnerability scan against the current deployment.", color: "text-emerald-400", btnColor: "bg-emerald-700 hover:bg-emerald-600", btnLabel: "Run Scan" },
        ].map((action) => (
          <div key={action.label} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
              <div>
                <p className="font-bold text-slate-100 text-sm">{action.label}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">{action.desc}</p>
              </div>
            </div>
            <button className={`px-4 py-2 ${action.btnColor} text-white font-bold rounded-lg text-xs transition-colors whitespace-nowrap`}>
              {action.btnLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <h3 className="font-bold text-rose-300 text-sm">Danger Zone — Irreversible Actions</h3>
        </div>
        <p className="text-[11px] text-rose-400/70">
          These actions are permanent and cannot be undone. They require dual Super Admin authentication and are logged in the security audit trail.
        </p>
        {[
          { label: "Reset All Platform Settings to Factory Defaults", btnLabel: "Reset Settings" },
          { label: "Purge All Soft-Deleted Records from Database", btnLabel: "Purge Records" },
          { label: "Wipe Demo / Test Data from Production Database", btnLabel: "Wipe Test Data" },
        ].map((d) => (
          <div key={d.label} className="flex items-center justify-between p-3 bg-rose-950/20 border border-rose-800/30 rounded-lg">
            <span className="text-rose-300 text-[11px] font-semibold">{d.label}</span>
            <button className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-rose-200 font-bold rounded-lg text-[10px] transition-colors border border-rose-700 whitespace-nowrap">
              {d.btnLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
