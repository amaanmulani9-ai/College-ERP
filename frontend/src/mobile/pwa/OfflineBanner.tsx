import React, { useState } from "react";
import { WifiOff, RefreshCw, X, CheckCircle2 } from "lucide-react";
import { usePWA } from "./usePWA";

export const OfflineBanner: React.FC = () => {
  const { isOnline } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-3 bg-gradient-to-r from-rose-950/90 to-purple-950/90 border border-rose-800/80 rounded-2xl shadow-xl flex items-center justify-between text-xs font-sans select-none animate-in fade-in duration-200"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-900/60 border border-rose-700 flex items-center justify-center text-rose-300 shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold text-slate-100 text-[11px]">Working Offline</p>
          <p className="text-[9px] text-rose-200/80">
            Changes will be queued and auto-synced upon reconnection.
          </p>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="p-1.5 text-slate-400 hover:text-slate-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
