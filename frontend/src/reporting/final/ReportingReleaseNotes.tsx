import React from "react";
import { Sparkles, CheckCircle } from "lucide-react";
import { MOCK_RELEASE_NOTES } from "./mockFinalData";

export const ReportingReleaseNotes: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Reporting & Analytics Release Notes & Version History
        </h3>
      </div>

      <div className="space-y-4">
        {MOCK_RELEASE_NOTES.map((rn) => (
          <div key={rn.version} className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                  {rn.version}
                </span>
                <h4 className="font-bold text-slate-200">{rn.title}</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{rn.date}</span>
            </div>

            <ul className="space-y-1 pt-1">
              {rn.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-300 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
