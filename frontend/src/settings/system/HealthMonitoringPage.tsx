import React, { useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { MOCK_SERVICES } from "./mockSystemData";

type CategoryFilter = "All" | "API" | "Database" | "Redis" | "Email" | "AI" | "Payments" | "Storage";

const statusDot: Record<string, string> = {
  Healthy:     "bg-emerald-400",
  Degraded:    "bg-amber-400 animate-pulse",
  Critical:    "bg-rose-500 animate-pulse",
  Maintenance: "bg-slate-500",
  Unknown:     "bg-slate-600",
};

const statusBadge: Record<string, string> = {
  Healthy:     "bg-emerald-950 text-emerald-300 border-emerald-800",
  Degraded:    "bg-amber-950 text-amber-300 border-amber-800",
  Critical:    "bg-rose-950 text-rose-300 border-rose-800",
  Maintenance: "bg-slate-800 text-slate-400 border-slate-700",
  Unknown:     "bg-slate-800 text-slate-500 border-slate-700",
};

const CATEGORIES: CategoryFilter[] = ["All","API","Database","Redis","Email","AI","Payments","Storage"];

const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <svg viewBox={`0 0 ${data.length * 8} 24`} className="w-24 h-6" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={data.map((v, i) => `${i * 8 + 4},${24 - (v / max) * 20}`).join(" ")}
      />
    </svg>
  );
};

export const HealthMonitoringPage: React.FC = () => {
  const [filter, setFilter] = useState<CategoryFilter>("All");

  const filtered = filter === "All" ? MOCK_SERVICES : MOCK_SERVICES.filter((s) => s.category === filter);
  const healthy  = MOCK_SERVICES.filter((s) => s.status === "Healthy").length;
  const total    = MOCK_SERVICES.length;

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Infrastructure Health Monitoring</h2>
            <p className="text-[10px] text-slate-500">
              {healthy}/{total} services operational · Real-time latency & uptime tracking
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-[11px]">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Overall Progress Bar */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-slate-500">Platform Health Score</span>
          <span className={`text-[10px] font-bold font-mono ${healthy === total ? "text-emerald-400" : "text-amber-400"}`}>
            {Math.round((healthy / total) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${healthy === total ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${(healthy / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              filter === cat ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service Cards */}
      <div className="space-y-2">
        {filtered.map((svc) => (
          <div key={svc.id} className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <div className={`w-3 h-3 rounded-full shrink-0 ${statusDot[svc.status]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-slate-100 text-[11px] truncate">{svc.service}</p>
                <span className="text-[9px] text-slate-600 font-mono uppercase">{svc.category}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                <span>↑ {svc.uptime}</span>
                <span className={svc.latencyMs > 200 ? "text-amber-400 font-bold" : "text-slate-400"}>{svc.latencyMs}ms</span>
                <span className="text-slate-600">checked {svc.lastChecked}</span>
              </div>
            </div>
            <MiniSparkline data={svc.history} color={svc.status === "Healthy" ? "#34d399" : svc.status === "Degraded" ? "#fbbf24" : "#f87171"} />
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${statusBadge[svc.status]}`}>
              {svc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
