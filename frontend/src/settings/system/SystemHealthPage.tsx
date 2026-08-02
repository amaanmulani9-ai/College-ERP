import React from "react";
import { Activity, RefreshCw } from "lucide-react";
import { SystemHealth } from "./types";
import { MOCK_SYSTEM_HEALTH } from "./mockSystemData";

const statusStyle: Record<SystemHealth["status"], string> = {
  Healthy: "bg-emerald-950 text-emerald-300 border-emerald-800",
  Degraded: "bg-amber-950 text-amber-300 border-amber-800",
  Critical: "bg-rose-950 text-rose-300 border-rose-800",
  Maintenance: "bg-slate-800 text-slate-400 border-slate-700",
};

const dotStyle: Record<SystemHealth["status"], string> = {
  Healthy: "bg-emerald-400",
  Degraded: "bg-amber-400 animate-pulse",
  Critical: "bg-rose-500 animate-pulse",
  Maintenance: "bg-slate-500",
};

export const SystemHealthPage: React.FC = () => {
  const healthy = MOCK_SYSTEM_HEALTH.filter((s) => s.status === "Healthy").length;
  const total = MOCK_SYSTEM_HEALTH.length;

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-100">Live Infrastructure Health Dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            <span className="text-emerald-400 font-bold font-mono">{healthy}/{total}</span> services operational
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall Status Bar */}
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
          style={{ width: `${(healthy / total) * 100}%` }}
        />
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOCK_SYSTEM_HEALTH.map((svc) => (
          <div key={svc.service} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
            <div className="mt-1">
              <div className={`w-2.5 h-2.5 rounded-full ${dotStyle[svc.status]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-slate-100 text-[11px] leading-tight truncate">{svc.service}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase whitespace-nowrap ${statusStyle[svc.status]}`}>
                  {svc.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-500">
                <span>↑ {svc.uptime}</span>
                <span className="text-slate-600">|</span>
                <span className={svc.latencyMs > 200 ? "text-amber-400" : "text-slate-400"}>{svc.latencyMs}ms</span>
                <span className="text-slate-600">|</span>
                <span>{svc.lastChecked}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
