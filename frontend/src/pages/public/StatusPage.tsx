import React, { useEffect } from "react";
import { Activity, CheckCircle2, ShieldCheck, Server, Database, Key, Layers, RefreshCw } from "lucide-react";

export const StatusPage: React.FC = () => {
  useEffect(() => {
    document.title = "System Status & Availability | College ERP SaaS";
  }, []);

  const services = [
    { name: "REST API Gateways (/api/v1/)", status: "Operational", uptime: "99.99%", latency: "24ms", icon: <Server className="w-5 h-5 text-emerald-400" /> },
    { name: "React 19 Frontend App", status: "Operational", uptime: "100%", latency: "12ms", icon: <Layers className="w-5 h-5 text-cyan-400" /> },
    { name: "PostgreSQL 16 Multi-Tenant Clusters", status: "Operational", uptime: "99.98%", latency: "8ms", icon: <Database className="w-5 h-5 text-indigo-400" /> },
    { name: "SimpleJWT Auth & Redis Permission Cache", status: "Operational", uptime: "100%", latency: "2ms", icon: <Key className="w-5 h-5 text-amber-400" /> },
    { name: "Razorpay / Stripe Payment Webhooks", status: "Operational", uptime: "99.95%", latency: "110ms", icon: <CheckCircle2 className="w-5 h-5 text-purple-400" /> },
    { name: "Celery Worker Queue (Async Jobs)", status: "Operational", uptime: "99.99%", latency: "45ms", icon: <RefreshCw className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <div className="pt-10 pb-20 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          Real-Time Institutional Uptime
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">College ERP System Status</h1>
        <p className="text-xs text-slate-400">Current status as of {new Date().toLocaleTimeString()} (UTC+5:30)</p>
      </div>

      {/* Overall Status Box */}
      <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-3xl p-8 text-center space-y-2 backdrop-blur-xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">All Systems Operational</h2>
        <p className="text-xs text-emerald-300">Global average SLA: <strong className="text-white font-mono">99.99% Uptime</strong> across all tenant schemas.</p>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Service Infrastructure Breakdown</h3>
        <div className="space-y-3">
          {services.map((s, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  {s.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{s.name}</h4>
                  <span className="text-[10px] text-slate-400">Avg Latency: <strong className="text-slate-300 font-mono">{s.latency}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-slate-400 font-mono">{s.uptime}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance & Incidents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Scheduled Maintenance</h4>
          <p className="text-xs text-slate-400">No maintenance scheduled for the next 7 days. Schema migrations execute seamlessly zero-downtime.</p>
        </div>
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Incident History (Past 90 Days)</h4>
          <p className="text-xs text-slate-400">No major outages or security incidents reported in the past 90 days. 100% test pass record maintained.</p>
        </div>
      </div>
    </div>
  );
};
