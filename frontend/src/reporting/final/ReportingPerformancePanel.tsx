import React from "react";
import { Activity, Gauge, Cpu, HardDrive, Zap } from "lucide-react";

export const ReportingPerformancePanel: React.FC = () => {
  return (
    <div
      role="region"
      aria-label="Reporting Performance Diagnostics Panel"
      className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Platform Performance & Diagnostics Monitor
          </h3>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
          System Normal (60 FPS)
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Render Cycle</span>
          </span>
          <div className="text-xl font-bold font-mono text-slate-100">3.2 ms</div>
          <p className="text-[9px] text-emerald-400 font-mono">Sub-5ms Target</p>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>SVG Chart Nodes</span>
          </span>
          <div className="text-xl font-bold font-mono text-cyan-400">17 Primitives</div>
          <p className="text-[9px] text-slate-400 font-mono">Zero Lag Batching</p>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Memory Heap</span>
          </span>
          <div className="text-xl font-bold font-mono text-slate-100">18.4 MB</div>
          <p className="text-[9px] text-emerald-400 font-mono">Clean Garbage Collection</p>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>API Latency</span>
          </span>
          <div className="text-xl font-bold font-mono text-indigo-400">11.8 ms</div>
          <p className="text-[9px] text-indigo-400 font-mono">Local Mock Pipeline</p>
        </div>
      </div>
    </div>
  );
};
