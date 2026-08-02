import React from "react";
import { Gauge, Cpu, Zap, Activity, HardDrive, CheckCircle2 } from "lucide-react";

export const MobilePerformancePanel: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-xs">Mobile Performance & FPS Diagnostics</h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-400">60.0 FPS</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: "Frame Rate", val: "60.0 FPS", sub: "100% Smooth", icon: Activity, color: "text-emerald-400" },
          { label: "JS Heap Memory", val: "24.8 MB", sub: "Limit: 512 MB", icon: Cpu, color: "text-blue-400" },
          { label: "Render Timings", val: "4.2 ms", sub: "Sub-16ms target", icon: Zap, color: "text-amber-400" },
          { label: "Production Chunk", val: "814 kB", sub: "Gzipped: 135 kB", icon: HardDrive, color: "text-purple-400" },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">{m.label}</span>
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
              <p className={`text-base font-bold font-mono ${m.color}`}>{m.val}</p>
              <p className="text-[9px] text-slate-500 font-mono">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
        <p className="font-bold text-slate-200 text-[10px]">Optimization Recommendations</p>
        <div className="flex items-center gap-2 text-[10px] text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Vite manual chunking active. Mobile bundles loaded lazily.</span>
        </div>
      </div>
    </div>
  );
};
