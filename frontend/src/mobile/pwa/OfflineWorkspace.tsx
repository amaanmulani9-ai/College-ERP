import React from "react";
import { WifiOff, Sliders, Users, BarChart3, Settings } from "lucide-react";

export const OfflineWorkspace: React.FC = () => {
  return (
    <div className="space-y-4 font-sans text-xs select-none">
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <h3 className="font-bold text-slate-100 text-xs">Offline Workspace Launcher</h3>
          <p className="text-[10px] text-slate-400">
            Offline cached versions of active workspace modules are accessible below.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { title: "Student Directory", sub: "12,450 Records Cached", icon: Users, color: "text-blue-400" },
          { title: "Fee Collection Desk", sub: "Recent Receipt Drafts", icon: BarChart3, color: "text-emerald-400" },
          { title: "System Administration", sub: "Local Configuration Copy", icon: Settings, color: "text-indigo-400" },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Icon className={`w-4.5 h-4.5 ${m.color}`} />
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-[11px]">{m.title}</p>
                  <p className="text-[9px] font-mono text-slate-500">{m.sub}</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                Cached
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
