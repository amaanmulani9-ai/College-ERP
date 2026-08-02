import React from "react";
import { RefreshCw, CheckCircle2, Clock, Trash2, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { usePWA } from "./usePWA";

export const SyncQueue: React.FC = () => {
  const { syncQueue, triggerManualSync, clearSyncQueue } = usePWA();

  const isSyncing = syncQueue.some((i) => i.status === "syncing");
  const pendingCount = syncQueue.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-3 font-sans text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-slate-100 text-xs">Pending Offline Actions Queue</h4>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold font-mono rounded">
              {pendingCount} Queued
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={triggerManualSync}
            disabled={isSyncing || syncQueue.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-[10px] active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing…" : "Sync Now"}</span>
          </button>
          {syncQueue.length > 0 && (
            <button
              onClick={clearSyncQueue}
              className="p-1.5 text-slate-500 hover:text-slate-300"
              title="Clear queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {syncQueue.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
          >
            <div>
              <p className="font-bold text-slate-200 text-[11px]">{item.action}</p>
              <p className="text-[9px] font-mono text-slate-500">
                Module: <span className="text-indigo-400">{item.module}</span> · {item.timestamp}
              </p>
            </div>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                item.status === "completed"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                  : item.status === "syncing"
                  ? "bg-indigo-950 text-indigo-300 border-indigo-800 animate-pulse"
                  : "bg-amber-950 text-amber-300 border-amber-800"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
        {syncQueue.length === 0 && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center text-slate-500 text-[10px]">
            No offline actions pending synchronization. All records are synced with backend.
          </div>
        )}
      </div>
    </div>
  );
};

export const SyncStatus: React.FC = () => {
  const { isOnline, syncQueue } = usePWA();
  const pending = syncQueue.filter((i) => i.status === "pending").length;

  return (
    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-[11px] font-sans">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="text-slate-300">Sync Engine Status:</span>
        <span className="font-bold font-mono text-emerald-400">
          {isOnline ? "Background Sync Active" : "Paused (Offline)"}
        </span>
      </div>
      <span className="text-slate-500 font-mono">{pending} items waiting</span>
    </div>
  );
};

export const BackgroundSyncPanel: React.FC = () => {
  const { autoSyncEnabled, setAutoSyncEnabled, wifiOnlySync, setWifiOnlySync } = usePWA();

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Zap className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Background Sync Policy</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <p className="font-bold text-slate-200 text-[11px]">Auto Background Sync</p>
            <p className="text-[9px] text-slate-500">Automatically sync pending queued data when network re-connects</p>
          </div>
          <button
            role="switch"
            aria-checked={autoSyncEnabled}
            onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors ${autoSyncEnabled ? "bg-indigo-600" : "bg-slate-700"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${autoSyncEnabled ? "left-5" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <p className="font-bold text-slate-200 text-[11px]">Wi-Fi Only Synchronization</p>
            <p className="text-[9px] text-slate-500">Restrict heavy report caching and syncs to un-metered Wi-Fi</p>
          </div>
          <button
            role="switch"
            aria-checked={wifiOnlySync}
            onClick={() => setWifiOnlySync(!wifiOnlySync)}
            className={`relative w-10 h-5 rounded-full transition-colors ${wifiOnlySync ? "bg-indigo-600" : "bg-slate-700"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${wifiOnlySync ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const SyncCenter: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 font-sans text-xs">
      <SyncQueue />
      <SyncStatus />
      <BackgroundSyncPanel />
    </div>
  );
};
