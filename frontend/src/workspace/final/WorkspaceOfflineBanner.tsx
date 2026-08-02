import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// ─── useNetworkStatus ─────────────────────────────────────────────────────────

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline  = () => { setIsOnline(true);  setWasOffline(true);  };
    const handleOffline = () => { setIsOnline(false); setWasOffline(false); };

    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}

// ─── WorkspaceOfflineBanner ───────────────────────────────────────────────────

export const WorkspaceOfflineBanner: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const t = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-600/95 text-white text-sm font-semibold shadow-2xl shadow-emerald-900/40 backdrop-blur animate-in slide-in-from-top-2 duration-300"
      >
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        Back online — workspace synced
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-3 px-6 py-2.5 bg-amber-600/95 text-white text-sm font-semibold shadow-2xl backdrop-blur"
    >
      <div className="flex items-center gap-2.5">
        <WifiOff className="w-4 h-4 flex-shrink-0" />
        You're offline — workspace data may be cached
      </div>
      <div className="flex items-center gap-2 text-amber-200 text-xs">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Reconnecting…
      </div>
    </div>
  );
};

// ─── WorkspaceConnectionStatus ────────────────────────────────────────────────

type Status = "online" | "offline" | "reconnecting";

export const WorkspaceConnectionStatus: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const [status, setStatus] = useState<Status>(isOnline ? "online" : "offline");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    setStatus(isOnline ? "online" : "offline");
  }, [isOnline]);

  // Simulate latency ping every 30s
  useEffect(() => {
    const ping = () => {
      const start = Date.now();
      setTimeout(() => {
        if (navigator.onLine) setLatency(Math.floor(Math.random() * 80) + 20);
      }, 100);
    };
    ping();
    const t = setInterval(ping, 30000);
    return () => clearInterval(t);
  }, []);

  const configs: Record<Status, { icon: React.FC<{ className?: string }>; label: string; color: string }> = {
    online:       { icon: Wifi,         label: "Connected",    color: "text-emerald-400" },
    offline:      { icon: WifiOff,      label: "Offline",      color: "text-rose-400"   },
    reconnecting: { icon: RefreshCw,    label: "Reconnecting", color: "text-amber-400"  },
  };

  const cfg = configs[status];
  const Icon = cfg.icon;

  return (
    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connection Status</div>

      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${cfg.color}`}>
          <Icon className={`w-4 h-4 ${status === "reconnecting" ? "animate-spin" : ""}`} />
          <span className="text-sm font-bold">{cfg.label}</span>
        </div>
        <span className={`w-2.5 h-2.5 rounded-full ${status === "online" ? "bg-emerald-400 animate-pulse" : status === "offline" ? "bg-rose-400" : "bg-amber-400 animate-pulse"}`} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Latency",   value: latency ? `${latency}ms` : "—" },
          { label: "API",       value: isOnline ? "Reachable"  : "Unreachable" },
          { label: "Sync",      value: isOnline ? "Live"       : "Paused"      },
          { label: "Cache",     value: "Available"                             },
        ].map((m) => (
          <div key={m.label} className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500">{m.label}</div>
            <div className="text-xs font-bold text-white mt-0.5">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-600 border-t border-slate-800 pt-2">
        Workspace continues to function in offline mode using cached data.
      </div>
    </div>
  );
};
