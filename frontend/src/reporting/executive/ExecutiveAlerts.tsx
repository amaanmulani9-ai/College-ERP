import React from "react";
import { AlertTriangle, ArrowUpRight, Bell, CheckCircle2 } from "lucide-react";
import { ExecutiveAlertItem } from "./types";
import { MOCK_EXECUTIVE_ALERTS } from "./mockExecutiveData";

interface ExecutiveAlertsProps {
  alerts?: ExecutiveAlertItem[];
  onDrillDown: (alert: ExecutiveAlertItem) => void;
}

export const ExecutiveAlerts: React.FC<ExecutiveAlertsProps> = ({
  alerts = MOCK_EXECUTIVE_ALERTS,
  onDrillDown,
}) => {
  const getSeverityBadge = (sev: "critical" | "warning" | "info") => {
    switch (sev) {
      case "critical":
        return "bg-rose-950 text-rose-300 border-rose-800 font-bold";
      case "warning":
        return "bg-amber-950 text-amber-300 border-amber-800 font-bold";
      default:
        return "bg-indigo-950 text-indigo-300 border-indigo-800";
    }
  };

  return (
    <div
      role="region"
      aria-label="Executive Alert Center"
      className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100">Executive Alert Center</h3>
        </div>
        <span className="font-mono text-[10px] text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-900 font-bold">
          {alerts.length} Active Triggers
        </span>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onDrillDown(alert)}
            className="flex items-center justify-between p-3 bg-slate-950/90 border border-slate-800 hover:border-indigo-500/60 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase ${getSeverityBadge(
                  alert.severity
                )}`}
              >
                {alert.severity}
              </span>
              <div>
                <h4 className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {alert.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>Module: {alert.module}</span>
                  <span>•</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-200 text-xs bg-slate-800 px-2 py-0.5 rounded">
                {alert.count} items
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDrillDown(alert);
                }}
                className="p-1 text-slate-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
                title="Drill-down to Report"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
