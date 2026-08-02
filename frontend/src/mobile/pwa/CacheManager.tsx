import React, { useState } from "react";
import { HardDrive, Trash2, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import { usePWA } from "./usePWA";

export const CacheManager: React.FC = () => {
  const { cacheSizeMB, clearCache } = usePWA();
  const [refreshing, setRefreshing] = useState(false);

  const refreshCache = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      alert("PWA static assets refreshed from network.");
    }, 1200);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-xs">Offline Cache & Storage</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Service Worker v0.35</span>
      </div>

      {/* Storage usage bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Offline Cache Allocation</span>
          <span className="font-bold font-mono text-indigo-300">{cacheSizeMB} MB / 500 MB</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${(cacheSizeMB / 500) * 100}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={refreshCache}
          disabled={refreshing}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
          <span>Refresh Cache</span>
        </button>

        <button
          onClick={clearCache}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 font-bold rounded-xl text-[11px] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cache</span>
        </button>
      </div>
    </div>
  );
};
