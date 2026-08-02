import React from "react";
import { Sparkles, RefreshCw, X, ArrowUpCircle } from "lucide-react";
import { usePWA } from "./usePWA";

export const UpdateAvailableDialog: React.FC = () => {
  const { updateAvailable, applyUpdate } = usePWA();

  if (!updateAvailable) return null;

  return (
    <div className="p-3.5 bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-700/80 rounded-2xl shadow-xl flex items-center justify-between text-xs font-sans animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-700 flex items-center justify-center text-purple-300 shrink-0">
          <ArrowUpCircle className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-slate-100 text-[11px]">System Update Available</p>
            <span className="px-1.5 py-0.2 bg-purple-900 text-purple-200 border border-purple-700 text-[8px] font-mono font-bold rounded">
              v0.35.0
            </span>
          </div>
          <p className="text-[9px] text-purple-200/80">
            Includes mobile workspace fixes, offline caching, and PWA performance enhancements.
          </p>
        </div>
      </div>

      <button
        onClick={applyUpdate}
        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-[10px] active:scale-95 transition-all shadow-md shrink-0"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Update Now</span>
      </button>
    </div>
  );
};

export const UpdateManager: React.FC = () => {
  return <UpdateAvailableDialog />;
};
