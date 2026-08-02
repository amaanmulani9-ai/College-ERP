import React, { Suspense, ReactNode, Profiler, ProfilerOnRenderCallback } from "react";
import { Gauge, Cpu, Activity } from "lucide-react";
import { usePerformance } from "./usePerformance";
import { PageSkeleton } from "../states/PageSkeleton";

export const FPSMonitor: React.FC = () => {
  const { fps } = usePerformance();
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300">
      <Activity className="w-3.5 h-3.5 text-emerald-400" />
      <span>{fps.toFixed(1)} FPS</span>
    </div>
  );
};

export const MemoryMonitor: React.FC = () => {
  const { jsHeapMB } = usePerformance();
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300">
      <Cpu className="w-3.5 h-3.5 text-blue-400" />
      <span>{jsHeapMB} MB Heap</span>
    </div>
  );
};

export const RenderProfiler: React.FC<{ id: string; children: ReactNode }> = ({ id, children }) => {
  const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
    if (actualDuration > 16.6) {
      console.warn(`[Profiler Alert] Component ${id} phase "${phase}" rendered in ${actualDuration.toFixed(2)}ms`);
    }
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
};

export const LazyBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = <PageSkeleton />,
}) => <Suspense fallback={fallback}>{children}</Suspense>;
