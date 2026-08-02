import React, { useState, useEffect } from "react";
import { Gauge, Layers, LayoutPanelTop, Cpu, Wifi, Zap } from "lucide-react";

interface PerfMetric {
  label: string;
  value: string;
  sub?: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

export const WorkspacePerformancePanel: React.FC = () => {
  const [fps,     setFps]     = useState<number>(60);
  const [memory,  setMemory]  = useState<string>("—");
  const [latency, setLatency] = useState<number>(38);

  // Simulate FPS sampling
  useEffect(() => {
    let frames = 0;
    let last   = performance.now();
    let rafId: number;

    const loop = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.min(frames, 60));
        frames = 0;
        last = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Memory (Chrome only via performance.memory)
  useEffect(() => {
    const check = () => {
      const perf = performance as { memory?: { usedJSHeapSize: number } };
      if (perf.memory) {
        const mb = Math.round(perf.memory.usedJSHeapSize / 1024 / 1024);
        setMemory(`${mb} MB`);
      }
    };
    check();
    const t = setInterval(check, 5000);
    return () => clearInterval(t);
  }, []);

  // Simulate latency drift
  useEffect(() => {
    const t = setInterval(() => {
      setLatency(Math.floor(Math.random() * 60) + 15);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const metrics: PerfMetric[] = [
    { label: "Frame Rate",      value: `${fps} FPS`,   sub: "target: 60",    icon: Gauge,        color: fps >= 55 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-rose-400" },
    { label: "JS Heap",         value: memory,         sub: "used heap",     icon: Cpu,          color: "text-sky-400"     },
    { label: "Latency",         value: `${latency}ms`, sub: "API ping",      icon: Wifi,         color: latency < 100 ? "text-emerald-400" : "text-amber-400" },
    { label: "Open Windows",    value: "—",            sub: "docking system",icon: LayoutPanelTop,color: "text-purple-400" },
    { label: "Open Tabs",       value: "—",            sub: "workspace tabs",icon: Layers,       color: "text-indigo-400"  },
    { label: "AI Prompts",      value: "—",            sub: "this session",  icon: Zap,          color: "text-amber-400"   },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-bold text-white">Performance Monitor</span>
        <span className="ml-auto px-1.5 py-0.5 rounded bg-emerald-600/20 text-[10px] text-emerald-300 font-bold">Live</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-[10px] text-slate-500">{m.label}</span>
              </div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
              {m.sub && <div className="text-[10px] text-slate-600">{m.sub}</div>}
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Optimisation Tips</div>
        <ul className="space-y-1 text-[11px] text-slate-400">
          <li>• Close unused workspace windows to free memory</li>
          <li>• Enable Reduced Motion for smoother low-end performance</li>
          <li>• Use Mini sidebar mode to gain more render space</li>
        </ul>
      </div>
    </div>
  );
};
