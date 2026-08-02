import React, { useState } from "react";
import { Download, Upload, CheckCircle2, FileCode } from "lucide-react";
import { DEFAULT_PREFERENCES } from "./mockFinalData";

export const ReportingExportImport: React.FC = () => {
  const [importedStatus, setImportedStatus] = useState(false);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        preferences: DEFAULT_PREFERENCES,
        version: "v0.33.0",
        exportedAt: new Date().toISOString(),
      }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `reporting_config_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportedStatus(true);
      setTimeout(() => setImportedStatus(false), 2500);
    }
  };

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Export / Import Platform Configurations & Builder Drafts
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backup / Export Config */}
        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
          <h4 className="font-bold text-slate-200">Backup Platform Settings (.json)</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Download your personalized preferences, saved report filters, custom builder drafts, and automated schedule templates.
          </p>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Configuration JSON</span>
          </button>
        </div>

        {/* Restore / Import Config */}
        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
          <h4 className="font-bold text-slate-200">Restore Configuration (.json)</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Import a previously backed-up reporting configuration JSON file to restore preferences and custom templates.
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold shadow-md transition-colors ${
                importedStatus
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              {importedStatus ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Configuration Restored!</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Select JSON File...</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
