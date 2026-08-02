import React from "react";
import { Wifi, Signal, Clock, RefreshCw, ShieldCheck } from "lucide-react";
import { usePWA } from "../pwa/usePWA";

export const MobileConnectionPanel: React.FC = () => {
  const { isOnline, effectiveType, latencyMs, syncQueue } = usePWA();
  const pendingCount = syncQueue.filter((i) => i.status === "pending").length;

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-xs">Mobile Connection & Sync Diagnostics</h3>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
            isOnline ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-rose-950 text-rose-300 border-rose-800"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="space-y-2 font-mono text-[10px]">
        {[
          { label: "Connection Mode", val: isOnline ? "Active Web Connection" : "Local Offline Storage" },
          { label: "Network Standard", val: effectiveType.toUpperCase() },
          { label: "Network Latency RTT", val: `${latencyMs} ms` },
          { label: "Pending Offline Action Queue", val: `${pendingCount} Items Queued` },
          { label: "Last Successful Synchronization", val: "10:28 AM (Aug 2, 2026)" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-400">{item.label}</span>
            <span className="font-bold text-indigo-300">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileOfflineCenter: React.FC = () => {
  return <MobileConnectionPanel />;
};
