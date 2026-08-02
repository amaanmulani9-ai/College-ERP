import React from "react";
import { Server, Database, Cpu, Activity, CheckCircle2, Layers } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const foundationChecks = [
    { title: "Django 5 Backend Engine", desc: "Python 3.13+ with DRF & django-tenants configured", icon: Server, color: "text-emerald-400" },
    { title: "PostgreSQL 16 Multi-Tenant DB", desc: "Schema isolation architecture initialized", icon: Database, color: "text-indigo-400" },
    { title: "Redis & Celery Task Pipeline", desc: "Caching, sessions & async task workers ready", icon: Cpu, color: "text-amber-400" },
    { title: "Vite + React + Tailwind Frontend", desc: "TypeScript & TanStack Query client ready", icon: Layers, color: "text-cyan-400" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Activity className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            TASK-001 Complete
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            Enterprise College ERP Workspace
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
            The foundation workspace is fully initialized. No authentication or business logic modules have been executed yet, keeping the core platform clean for TASK-002.
          </p>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {foundationChecks.map((check, idx) => {
          const Icon = check.icon;
          return (
            <div key={idx} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 bg-slate-950 rounded-lg border border-slate-800 ${check.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  Ready
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200">{check.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">{check.desc}</p>
            </div>
          );
        })}
      </div>

      {/* System Information Box */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Foundation Health Endpoint
        </h3>
        <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
          <div><span className="text-slate-500">GET</span> /api/health/ &rarr; <span className="text-emerald-400">200 OK</span> {"{\"status\": \"ok\", \"service\": \"college-erp-api\"}"}</div>
          <div><span className="text-slate-500">GET</span> /api/ready/ &rarr; <span className="text-emerald-400">200 OK</span> {"{\"status\": \"ready\", \"checks\": {\"database\": true, \"cache\": true}}"}</div>
        </div>
      </div>
    </div>
  );
};
