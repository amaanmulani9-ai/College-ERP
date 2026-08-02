import React, { useState } from "react";
import { Download, Upload, FileJson, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ExportBundle } from "./types";

const DEMO_BUNDLE: ExportBundle = {
  version:     "1.0.0",
  exportedAt:  new Date().toISOString(),
  preferences: {
    rememberLastPage:    true,
    rememberSearch:      true,
    rememberFilters:     false,
    defaultLanding:      "Settings Home",
    density:             "comfortable",
    animationLevel:      "full",
    language:            "en-IN",
    timezone:            "Asia/Kolkata",
    favoriteCategories:  ["Institution", "Security"],
    pinnedCategories:    ["System"],
  },
  appearance: {
    theme:           "dark",
    density:         "comfortable",
    animationLevel:  "full",
    sidebarBehavior: "fixed",
    accentColor:     "#4F46E5",
  },
  accessibility: {
    reducedMotion:     false,
    highContrast:      false,
    fontScale:         1,
    keyboardFocus:     true,
    screenReaderHints: false,
  },
  favorites: ["Institution", "Security", "System"],
  pinned:    ["System"],
};

export const SettingsExportImport: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "exported" | "imported" | "error">("idle");
  const [importText, setImportText] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const exportBundle = () => {
    const bundle: ExportBundle = { ...DEMO_BUNDLE, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `nits-erp-settings-${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
    setStatus("exported");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const importBundle = () => {
    try {
      const parsed = JSON.parse(importText) as Partial<ExportBundle>;
      if (!parsed.version || !parsed.preferences) throw new Error("Invalid bundle format");
      setStatus("imported");
      setImportText("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImportText(ev.target?.result as string ?? "");
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <FileJson className="w-5 h-5 text-emerald-400" />
        <div>
          <h2 className="text-sm font-bold text-slate-100">Settings Export & Import</h2>
          <p className="text-[10px] text-slate-500">Backup your preferences, appearance, favourites and pinned items as a JSON bundle.</p>
        </div>
      </div>

      {/* Status */}
      {status !== "idle" && (
        <div className={`flex items-center gap-3 p-3.5 border rounded-xl ${status === "error" ? "bg-rose-950/40 border-rose-800" : "bg-emerald-950/40 border-emerald-800"}`}>
          {status === "error" ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span className={`font-bold text-[11px] ${status === "error" ? "text-rose-300" : "text-emerald-300"}`}>
            {status === "exported" ? "Settings bundle exported successfully!"
              : status === "imported" ? "Settings bundle imported successfully!"
              : "Invalid JSON bundle. Check the format and try again."}
          </span>
        </div>
      )}

      {/* Export */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Export Settings Bundle</h3>
        <p className="text-[10px] text-slate-500">Downloads a JSON file containing all your preferences, appearance config, accessibility settings, favourites, and pinned categories.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["Preferences", "Appearance", "Accessibility", "Favourites", "Pinned Items", "Workspace Links"].map((item) => (
            <div key={item} className="flex items-center gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[10px] text-slate-400">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportBundle}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-[11px] transition-colors">
            <Download className="w-4 h-4" /> Export as JSON
          </button>
          <button onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] transition-colors">
            {showPreview ? "Hide Preview" : "Preview Bundle"}
          </button>
        </div>
        {showPreview && (
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-mono text-slate-400 overflow-x-auto max-h-48">
            {JSON.stringify({ ...DEMO_BUNDLE, exportedAt: new Date().toISOString() }, null, 2)}
          </pre>
        )}
      </div>

      {/* Import */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Import Settings Bundle</h3>
        <p className="text-[10px] text-slate-500">Upload or paste a previously exported JSON bundle to restore your settings configuration.</p>

        {/* File Upload */}
        <label className="flex items-center gap-2 p-3 bg-slate-950 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-indigo-600 transition-colors">
          <Upload className="w-4 h-4 text-slate-500" />
          <span className="text-[11px] text-slate-400">Click to upload a .json bundle file</span>
          <input type="file" accept=".json" className="hidden" onChange={handleFile} />
        </label>

        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <div className="flex-1 h-px bg-slate-800" />
          <span>or paste JSON below</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <textarea rows={6} value={importText} onChange={(e) => setImportText(e.target.value)}
          placeholder='{"version":"1.0.0","preferences":{...}}'
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-[10px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-600 resize-none" />

        <button onClick={importBundle} disabled={!importText.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-[11px] transition-colors">
          <Upload className="w-4 h-4" /> Import Bundle
        </button>
      </div>
    </div>
  );
};
