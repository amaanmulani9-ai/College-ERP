import React, { useState } from "react";
import { Download, Upload, RotateCcw, CheckCircle2, ShieldAlert } from "lucide-react";

export const MobileExportImport: React.FC = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExport = () => {
    const data = JSON.stringify({ version: "v0.35.0", timestamp: new Date().toISOString(), theme: "dark" }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mobile-erp-config.json";
    a.click();
    setSuccessMsg("Mobile preferences exported to mobile-erp-config.json");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset mobile settings to default factory configuration?")) {
      setSuccessMsg("Mobile configuration reset to defaults.");
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Download className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Mobile Backup, Import & Export</h3>
      </div>

      {successMsg && (
        <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-[10px] text-emerald-300 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Config</span>
        </button>

        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 font-bold rounded-xl text-[11px] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  );
};
