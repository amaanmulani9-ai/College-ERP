import React, { useState } from "react";
import { ArrowLeft, Download, Share2, Printer, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { MobileReportItem } from "./MobileReportCatalog";

interface MobileReportViewerProps {
  report: MobileReportItem;
  onBack: () => void;
}

export const MobileReportViewer: React.FC<MobileReportViewerProps> = ({ report, onBack }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans text-xs select-none animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <button onClick={onBack} aria-label="Back to catalog" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-100 text-xs truncate">{report.title}</h3>
            <span className="text-[9px] font-mono text-indigo-400 uppercase">{report.category} Report</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            aria-label="Download report"
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl active:scale-95 transition-all"
          >
            {downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
          </button>
          <button
            onClick={handleShare}
            aria-label="Share report"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl active:scale-95 transition-all"
          >
            {shareSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Report Data Preview Table */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <p className="font-bold text-slate-200 text-xs">Mobile Report Data Snapshot</p>
          <span className="text-[9px] font-mono text-slate-500">Generated Aug 2, 2026</span>
        </div>

        <div className="space-y-2 font-mono text-[10px]">
          {[
            { metric: "Total Records Scanned", val: "12,450" },
            { metric: "Completed Clearance Rate", val: "94.2%" },
            { metric: "Outstanding Exceptions", val: "18 Records" },
            { metric: "Data Freshness", val: "Live DB Sync" },
          ].map((item) => (
            <div key={item.metric} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400">{item.metric}</span>
              <span className="font-bold text-indigo-300">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
