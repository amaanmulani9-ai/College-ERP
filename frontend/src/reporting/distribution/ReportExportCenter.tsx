import React, { useState } from "react";
import { Download, FileText, Printer, CheckCircle2, FileSpreadsheet, Image as ImageIcon, Code } from "lucide-react";
import { ExportFormat } from "./types";

export const ReportExportCenter: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("pdf");
  const [reportTitle, setReportTitle] = useState("Institutional Executive Overview & Performance Audit");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [pageOrientation, setPageOrientation] = useState<"portrait" | "landscape">("landscape");
  const [paperSize, setPaperSize] = useState<"A4" | "Letter" | "Legal">("A4");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const formats: { format: ExportFormat; label: string; ext: string; icon: React.FC<{ className?: string }> }[] = [
    { format: "pdf", label: "PDF Document", ext: ".pdf", icon: FileText },
    { format: "excel", label: "Excel Workbook", ext: ".xlsx", icon: FileSpreadsheet },
    { format: "csv", label: "CSV Spreadsheet", ext: ".csv", icon: FileText },
    { format: "json", label: "JSON Data Stream", ext: ".json", icon: Code },
    { format: "png", label: "PNG Image Snapshot", ext: ".png", icon: ImageIcon },
    { format: "svg", label: "SVG Vector Graphic", ext: ".svg", icon: ImageIcon },
    { format: "print", label: "Direct Print Spool", ext: "Print", icon: Printer },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
          <Download className="w-5 h-5 text-indigo-400" />
          <span>Universal Enterprise Report Export Hub</span>
        </h2>
        <p className="text-slate-400">
          Convert & download high-resolution reports across 7 production formats with layout controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Format Selector */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            1. Select Export Target Format
          </h3>
          <div className="space-y-2">
            {formats.map((f) => {
              const IconComp = f.icon;
              const isSelected = selectedFormat === f.format;
              return (
                <button
                  key={f.format}
                  onClick={() => setSelectedFormat(f.format)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-bold ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4" />
                    <span>{f.label}</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-80">{f.ext}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout & Options Configuration */}
        <div className="lg:col-span-2 p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
            2. Configure Page & Render Parameters
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Document Title Header
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Paper Orientation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPageOrientation("portrait")}
                  className={`py-2 rounded-lg border font-mono ${
                    pageOrientation === "portrait"
                      ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => setPageOrientation("landscape")}
                  className={`py-2 rounded-lg border font-mono ${
                    pageOrientation === "landscape"
                      ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Paper Size Format
              </label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono"
              >
                <option value="A4">A4 (210 x 297 mm)</option>
                <option value="Letter">Letter (8.5 x 11 in)</option>
                <option value="Legal">Legal (8.5 x 14 in)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="chk-charts"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
            <label htmlFor="chk-charts" className="text-slate-300 font-semibold cursor-pointer">
              Embed Visual Analytics Charts & Rendered SVG Micro-Graphs
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] font-mono text-slate-400">
              Estimated File Size: <span className="text-indigo-400 font-bold">~2.4 MB</span>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              {isExporting ? (
                <span>Generating {selectedFormat.toUpperCase()}...</span>
              ) : exportComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Download Ready!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Report File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
