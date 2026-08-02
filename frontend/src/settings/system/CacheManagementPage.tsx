import React, { useState } from "react";
import { Zap, Trash2, RefreshCw } from "lucide-react";
import { MOCK_CACHE_STATS } from "./mockSystemData";

export const CacheManagementPage: React.FC = () => {
  const [cleared, setCleared] = useState<Record<string, boolean>>({});
  const totalSizeKB = MOCK_CACHE_STATS.reduce((s, c) => s + c.sizeKB, 0);
  const totalHits   = MOCK_CACHE_STATS.reduce((s, c) => s + c.hits, 0);

  const clearKey = (key: string) => setCleared((prev) => ({ ...prev, [key]: true }));
  const clearAll  = () => {
    const all: Record<string, boolean> = {};
    MOCK_CACHE_STATS.forEach((c) => (all[c.key] = true));
    setCleared(all);
  };
  const warmCache = () => setCleared({});

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header + Actions */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Redis Cache Management</h2>
            <p className="text-[10px] text-slate-500">Monitor hit rates, eviction stats, and selectively flush cache keys.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={warmCache} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors text-[11px]">
            <RefreshCw className="w-3.5 h-3.5" />
            Warm Cache
          </button>
          <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors text-[11px]">
            <Trash2 className="w-3.5 h-3.5" />
            Flush All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Cache Size",  value: `${(totalSizeKB / 1024).toFixed(1)} MB`, color: "text-yellow-400" },
          { label: "Total Cache Hits",  value: totalHits.toLocaleString(),             color: "text-emerald-400" },
          { label: "Cache Keys",        value: MOCK_CACHE_STATS.length.toString(),      color: "text-indigo-400" },
        ].map((s) => (
          <div key={s.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cache Key Table */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase mb-3">Cache Key Statistics</h3>
        {MOCK_CACHE_STATS.map((stat) => {
          const hitRate = Math.round((stat.hits / (stat.hits + stat.misses)) * 100);
          const isClear = cleared[stat.key];
          return (
            <div
              key={stat.key}
              className={`p-3.5 border rounded-xl transition-all ${isClear ? "bg-rose-950/20 border-rose-800/40 opacity-50" : "bg-slate-950 border-slate-800"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <code className="text-cyan-400 text-[10px] font-mono">{stat.key}</code>
                <button onClick={() => clearKey(stat.key)} disabled={isClear} className="p-1 text-rose-500 hover:text-rose-300 disabled:opacity-30 transition-colors" title="Flush key">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 mb-1.5">
                <span className="text-emerald-400 font-bold">{hitRate}% hit rate</span>
                <span>{stat.hits.toLocaleString()} hits</span>
                <span className="text-rose-400">{stat.misses.toLocaleString()} misses</span>
                <span>{(stat.sizeKB / 1024).toFixed(1)} MB</span>
                <span>TTL {stat.ttlSeconds}s</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${hitRate}%` }} />
              </div>
              {isClear && <p className="text-[10px] text-rose-400 mt-1 font-mono">Flushed — will warm on next request</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
