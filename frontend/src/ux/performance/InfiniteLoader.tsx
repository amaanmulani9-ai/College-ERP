import React, { useState } from "react";
import { Gauge, HardDrive, RefreshCw, Layers } from "lucide-react";
import { usePerformance } from "./usePerformance";
import { FPSMonitor, MemoryMonitor } from "./FPSMonitor";

export const InfiniteLoader: React.FC<{ onLoadMore: () => void; hasMore: boolean }> = ({
  onLoadMore,
  hasMore,
}) => {
  if (!hasMore) return <p className="text-center text-[10px] text-slate-500 font-mono py-2">All records loaded</p>;

  return (
    <div className="py-3 text-center">
      <button
        onClick={onLoadMore}
        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 text-[10px] font-bold rounded-xl transition-all"
      >
        Load More Items
      </button>
    </div>
  );
};

export const ImageOptimizer: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className = "",
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      {!loaded && <div className="absolute inset-0 bg-slate-900 animate-pulse" />}
    </div>
  );
};

export const BundleInspector: React.FC = () => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-[10px]">
    <div className="flex justify-between text-slate-400">
      <span>Index Bundle Chunk</span>
      <span className="font-bold text-indigo-300">814 kB (135 kB Gzip)</span>
    </div>
    <div className="flex justify-between text-slate-400">
      <span>Vendor Chunks</span>
      <span className="font-bold text-emerald-400">Split (TanStack / React / UI)</span>
    </div>
  </div>
);

export const CacheStatus: React.FC = () => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-mono text-[10px]">
    <span className="text-slate-400">Service Worker Cache</span>
    <span className="font-bold text-indigo-300">42.8 MB Allocated</span>
  </div>
);

export const PerformanceMonitor: React.FC = () => {
  const { showMonitorOverlay, setShowMonitorOverlay } = usePerformance();

  if (!showMonitorOverlay) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 p-3 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md space-y-2 font-sans text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-4">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 text-[11px]">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span>Performance Monitor</span>
        </div>
        <button onClick={() => setShowMonitorOverlay(false)} className="text-[10px] text-slate-500 hover:text-slate-300">
          ✕
        </button>
      </div>

      <div className="flex items-center gap-4">
        <FPSMonitor />
        <MemoryMonitor />
      </div>
    </div>
  );
};
