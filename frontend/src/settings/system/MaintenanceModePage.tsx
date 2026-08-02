import React, { useState } from "react";
import { Wrench, Calendar, AlertTriangle, Shield } from "lucide-react";
import { MOCK_MAINTENANCE_WINDOWS } from "./mockSystemData";

const statusBadge: Record<string, string> = {
  Scheduled: "bg-amber-950 text-amber-300 border-amber-800",
  Ongoing:   "bg-rose-950 text-rose-300 border-rose-800",
  Completed: "bg-emerald-950 text-emerald-300 border-emerald-800",
};

export const MaintenanceModePage: React.FC = () => {
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    "We are performing scheduled system maintenance. The platform will be back online shortly. Thank you for your patience."
  );
  const [whitelistInput, setWhitelistInput] = useState("admin@nits.edu, devops@nits.edu");

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Maintenance Toggle Card */}
      <div className={`p-5 border rounded-xl transition-all ${maintenanceActive ? "bg-rose-950/40 border-rose-800" : "bg-slate-900/80 border-slate-800"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className={`w-6 h-6 ${maintenanceActive ? "text-rose-400" : "text-slate-400"}`} />
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                {maintenanceActive ? "🔴 Maintenance Mode is ACTIVE" : "Maintenance Mode"}
              </h2>
              <p className={`text-[11px] mt-0.5 ${maintenanceActive ? "text-rose-400" : "text-slate-400"}`}>
                {maintenanceActive
                  ? "All users see the maintenance page. Only whitelisted admins can access."
                  : "Enable to show maintenance page to all non-admin users."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMaintenanceActive(!maintenanceActive)}
            className={`px-5 py-2.5 font-bold rounded-xl text-xs transition-all ${
              maintenanceActive
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-rose-700 hover:bg-rose-600 text-white"
            }`}
          >
            {maintenanceActive ? "Disable Maintenance" : "Enable Maintenance"}
          </button>
        </div>

        {maintenanceActive && (
          <div className="mt-4 p-3 bg-rose-900/30 border border-rose-800/40 rounded-xl text-[11px] text-rose-300 font-mono">
            ⚠ Platform is locked. Users at login page see custom message. Countdown: 01:45:30 remaining.
          </div>
        )}
      </div>

      {/* Custom Message */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <label className="block text-[11px] font-bold text-slate-300 uppercase font-mono">Custom Maintenance Message (shown to users)</label>
        <textarea
          rows={3}
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-600 resize-none"
        />
      </div>

      {/* Admin Whitelist */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <label className="text-[11px] font-bold text-slate-300 uppercase font-mono">Whitelisted Admin Emails (bypass maintenance)</label>
        </div>
        <input
          type="text"
          value={whitelistInput}
          onChange={(e) => setWhitelistInput(e.target.value)}
          placeholder="admin@nits.edu, devops@nits.edu"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-600"
        />
        <p className="text-[10px] text-slate-600">Comma-separated email addresses that can log in during maintenance.</p>
      </div>

      {/* Scheduled Windows */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-[11px] font-bold text-slate-300 uppercase font-mono">Scheduled Maintenance Windows</h3>
          </div>
          <button className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] transition-colors">
            + Schedule Window
          </button>
        </div>
        {MOCK_MAINTENANCE_WINDOWS.map((mw) => (
          <div key={mw.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-100 text-[11px]">{mw.title}</h4>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${statusBadge[mw.status]}`}>
                {mw.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
              <span>🕐 {mw.scheduledAt}</span>
              <span>⏱ ~{mw.estimatedDuration}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mw.affectedModules.map((mod) => (
                <span key={mod} className="text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                  {mod}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Maintenance */}
      <div className="flex items-center gap-3 p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-amber-300 text-[11px]">Emergency Maintenance</p>
          <p className="text-[10px] text-amber-400/70 mt-0.5">Activates immediately with no countdown. Use only for critical incidents.</p>
        </div>
        <button className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-lg text-[11px] transition-colors whitespace-nowrap">
          Emergency Activate
        </button>
      </div>
    </div>
  );
};
