import React from "react";
import { Download, FileCode, FileSpreadsheet, Image } from "lucide-react";

interface ChartExportMenuProps {
  title: string;
  onClose: () => void;
}

export const ChartExportMenu: React.FC<ChartExportMenuProps> = ({ title, onClose }) => {
  const handleExport = (format: string) => {
    alert(`Exported "${title}" as ${format.toUpperCase()}`);
    onClose();
  };

  return (
    <div className="absolute right-0 top-8 z-40 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 text-xs backdrop-blur-md">
      <div className="px-3 py-1 font-semibold text-slate-400 border-b border-slate-800">
        Export Chart
      </div>
      <button
        onClick={() => handleExport("png")}
        className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Image className="w-3.5 h-3.5 text-indigo-400" />
          <span>PNG Image</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">.png</span>
      </button>

      <button
        onClick={() => handleExport("svg")}
        className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Vector SVG</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">.svg</span>
      </button>

      <button
        onClick={() => handleExport("csv")}
        className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>CSV Dataset</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">.csv</span>
      </button>

      <button
        onClick={() => handleExport("json")}
        className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Download className="w-3.5 h-3.5 text-purple-400" />
          <span>JSON Schema</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">.json</span>
      </button>
    </div>
  );
};
