import React from "react";
import { FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";

export const OfflineReports: React.FC = () => {
  return (
    <div className="space-y-3 font-sans text-xs select-none">
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <h3 className="font-bold text-slate-100 text-xs">Downloaded Offline Reports</h3>
        <span className="text-[10px] font-mono text-indigo-400">3 PDFs Cached</span>
      </div>

      <div className="space-y-2">
        {[
          { title: "Semester Admission Audit Report", size: "2.4 MB", date: "Aug 1, 2026" },
          { title: "Fee Collection & Outstanding Statement", size: "4.1 MB", date: "Jul 28, 2026" },
          { title: "Faculty Load Analysis Report", size: "1.8 MB", date: "Jul 25, 2026" },
        ].map((rep) => (
          <div key={rep.title} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-100 text-[11px]">{rep.title}</p>
                <p className="text-[9px] font-mono text-slate-500">{rep.size} · Downloaded {rep.date}</p>
              </div>
            </div>
            <button className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg">
              <Download className="w-3 h-3" /> View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
