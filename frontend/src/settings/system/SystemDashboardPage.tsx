import React from "react";
import { Activity, Database, Cpu, HardDrive, Layers, Zap, Globe, Server } from "lucide-react";
import { MOCK_SERVICES } from "./mockSystemData";

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

const MetricPill: React.FC<{ label: string; value: string; icon: React.ElementType; color: string }> = ({
  label, value, icon: Icon, color,
}) => (
  <div className="flex flex-col gap-1 p-4 bg-slate-950 border border-slate-800 rounded-xl">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
    <div className="h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
      <div className={`h-full rounded-full bg-current opacity-60`} style={{ width: "72%" }} />
    </div>
  </div>
);

export const SystemDashboardPage: React.FC = () => {
  const healthy   = MOCK_SERVICES.filter((s) => s.status === "Healthy").length;
  const degraded  = MOCK_SERVICES.filter((s) => s.status === "Degraded").length;
  const critical  = MOCK_SERVICES.filter((s) => s.status === "Critical").length;
  const maint     = MOCK_SERVICES.filter((s) => s.status === "Maintenance").length;
  const total     = MOCK_SERVICES.length;

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* Overall Health Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        critical > 0 ? "bg-rose-950/40 border-rose-800" :
        degraded > 0 ? "bg-amber-950/40 border-amber-800" :
        "bg-emerald-950/40 border-emerald-800"
      }`}>
        <div className="flex items-center gap-3">
          <Activity className={`w-6 h-6 ${critical > 0 ? "text-rose-400" : degraded > 0 ? "text-amber-400" : "text-emerald-400"}`} />
          <div>
            <p className={`font-bold text-base ${critical > 0 ? "text-rose-300" : degraded > 0 ? "text-amber-300" : "text-emerald-300"}`}>
              {critical > 0 ? "System Critical" : degraded > 0 ? "System Degraded" : "All Systems Operational"}
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              {healthy} healthy · {degraded} degraded · {critical} critical · {maint} maintenance
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <p className={`text-2xl font-bold ${critical > 0 ? "text-rose-400" : degraded > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {Math.round((healthy / total) * 100)}%
          </p>
          <p className="text-[10px] text-slate-500">platform health</p>
        </div>
      </div>

      {/* Resource Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricPill label="CPU Usage"       value="34%"    icon={Cpu}      color="text-blue-400" />
        <MetricPill label="Memory"          value="61%"    icon={Layers}   color="text-purple-400" />
        <MetricPill label="Disk"            value="72%"    icon={HardDrive} color="text-amber-400" />
        <MetricPill label="API Req/min"     value="1,284"  icon={Globe}    color="text-emerald-400" />
      </div>

      {/* Service Grid */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Live Service Status</h3>
          <span className="text-[10px] text-slate-600">Auto-refreshing every 10s</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MOCK_SERVICES.map((svc) => (
            <div key={svc.id} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[svc.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-100 truncate">{svc.service}</p>
                <p className="text-[10px] font-mono text-slate-500">{svc.latencyMs}ms · {svc.uptime} uptime</p>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${statusBadge[svc.status]}`}>
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Database Size",  value: "41.2 GB",  icon: Database,  color: "text-indigo-400" },
          { label: "Redis Memory",   value: "1.8 GB",   icon: Zap,       color: "text-yellow-400" },
          { label: "Queue Depth",    value: "14 jobs",  icon: Layers,    color: "text-cyan-400" },
          { label: "Storage Used",   value: "291 GB",   icon: Server,    color: "text-rose-400" },
        ].map((m) => (
          <div key={m.label} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <m.icon className={`w-5 h-5 mx-auto mb-1 ${m.color}`} />
            <p className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
