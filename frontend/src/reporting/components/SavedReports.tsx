import React from "react";
import { Bookmark, Play, Trash2 } from "lucide-react";
import { useReporting } from "../ReportingContext";

export const SavedReports: React.FC = () => {
  const { savedReports, deleteSavedFilter, applySavedFilter } = useReporting();

  if (!savedReports || savedReports.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
        <Bookmark className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-300">No Saved Report Presets</h4>
        <p className="text-xs text-slate-500 mt-1">
          When configuring report filters, click "Save Preset" to save custom parameter views here for quick one-click access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="region" aria-label="Saved Report Presets">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
        <Bookmark className="w-4 h-4 text-cyan-400" />
        <span>Saved Custom Report Filters & Presets ({savedReports.length})</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {savedReports.map((saved) => (
          <div
            key={saved.id}
            className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all"
          >
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-0.5">
                {saved.reportTitle}
              </span>
              <h4 className="text-xs font-semibold text-slate-200">{saved.name}</h4>
              <span className="text-[10px] text-slate-500">
                Saved {new Date(saved.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => applySavedFilter(saved)}
                className="p-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                title="Run preset report"
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
              <button
                onClick={() => deleteSavedFilter(saved.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Delete saved preset"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
