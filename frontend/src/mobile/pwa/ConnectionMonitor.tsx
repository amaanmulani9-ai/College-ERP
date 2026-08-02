import React from "react";
import { Wifi, WifiOff, Activity, Gauge, Signal } from "lucide-react";
import { usePWA } from "./usePWA";

export const ConnectionMonitor: React.FC = () => {
  const { isOnline, effectiveType, latencyMs } = usePWA();

  const isSlow = latencyMs > 150 || effectiveType === "2g" || effectiveType === "3g";

  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl font-sans text-xs select-none">
      <div className="flex items-center justify-between">
        {/* Network Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isOnline
                ? "bg-emerald-950/80 border-emerald-800 text-emerald-400"
                : "bg-rose-950/80 border-rose-800 text-rose-400"
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-100 text-[11px]">
                {isOnline ? "Network Connected" : "Offline Mode Active"}
              </h4>
              {isSlow && isOnline && (
                <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 text-[8px] font-bold font-mono rounded">
                  Slow Connection
                </span>
              )}
            </div>
            <p className="text-[9px] font-mono text-slate-500">
              Type: <span className="text-slate-300 uppercase">{effectiveType}</span> · Latency:{" "}
              <span className="text-slate-300">{latencyMs}ms</span>
            </p>
          </div>
        </div>

        {/* Signal Indicator */}
        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
          <Signal className={`w-4 h-4 ${isOnline ? "text-emerald-400" : "text-rose-500"}`} />
          <span className="hidden sm:inline font-bold">{isOnline ? "Excellent Signal" : "No Internet"}</span>
        </div>
      </div>
    </div>
  );
};
