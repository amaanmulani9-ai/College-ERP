import React from "react";
import { Settings, Shield, Sliders } from "lucide-react";

export const OfflineSettings: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Settings className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Offline Settings Configuration</h3>
      </div>
      <p className="text-[10px] text-slate-400">
        Settings modified while offline will be automatically reconciled with backend servers upon reconnection.
      </p>
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-[10px]">
        Last Synced Configuration Version: <strong>v0.35.0-ui-mobile-part4</strong>
      </div>
    </div>
  );
};
