import React from "react";
import { Download, Smartphone, CheckCircle2, X } from "lucide-react";
import { usePWA } from "./usePWA";

export const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installPWA } = usePWA();

  if (isInstalled) {
    return (
      <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-slate-100 text-[11px]">NITS ERP App Installed</p>
            <p className="text-[9px] text-emerald-300/80">Running as standalone Progressive Web App</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
          PWA Active
        </span>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-800 rounded-2xl flex items-center justify-between text-xs font-sans shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-mono text-sm shrink-0">
          N
        </div>
        <div>
          <p className="font-bold text-slate-100 text-[11px]">Install NITS ERP Mobile</p>
          <p className="text-[9px] text-indigo-300/80">Offline access, fast loading, & push notifications</p>
        </div>
      </div>

      <button
        onClick={installPWA}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] active:scale-95 transition-all shadow-md shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    </div>
  );
};
