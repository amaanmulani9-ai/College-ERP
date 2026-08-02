import React from "react";
import { Activity, ShieldCheck, Database, Zap } from "lucide-react";

export const WorkspaceFooter: React.FC = () => {
  return (
    <footer className="h-7 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] text-slate-500 select-none z-20">
      {/* System Health Status */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          SYSTEM OPERATIONAL
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1 text-slate-400">
          <Database className="w-3 h-3 text-indigo-400" />
          Tenant: <strong className="text-slate-300">Springfield Academic Cloud</strong>
        </span>
      </div>

      {/* Shortcuts & Latency */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-slate-400 font-mono">
          Latency: <strong className="text-emerald-400">18 ms</strong>
        </span>
        <span className="hidden md:inline text-slate-500 font-mono">
          Ctrl+K Search | Ctrl+J Quick Launch
        </span>
        <span className="text-slate-400 font-semibold">
          v0.32.0 Workspace
        </span>
      </div>
    </footer>
  );
};
