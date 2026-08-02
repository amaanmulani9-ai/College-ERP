import React, { useState, useRef } from "react";
import { Download, Upload, CheckCircle2, AlertTriangle, Package } from "lucide-react";

interface ExportData {
  version: string;
  exportedAt: string;
  preferences: Record<string, unknown>;
  pinnedModules: string[];
  favorites: string[];
  layouts: string[];
  notes: unknown[];
  tasks: unknown[];
}

function gatherExport(): ExportData {
  const get = (key: string): unknown => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
  };
  return {
    version:       "v0.32.0",
    exportedAt:    new Date().toISOString(),
    preferences:   (get("college_erp_workspace_preferences") as Record<string, unknown>) ?? {},
    pinnedModules: (get("college_erp_workspace_pinned")     as string[]  ) ?? [],
    favorites:     (get("college_erp_workspace_favorites")  as string[]  ) ?? [],
    layouts:       (get("college_erp_workspace_layouts")    as string[]  ) ?? [],
    notes:         (get("college_erp_workspace_notes")      as unknown[] ) ?? [],
    tasks:         (get("college_erp_workspace_tasks")      as unknown[] ) ?? [],
  };
}

function applyImport(data: ExportData): void {
  const set = (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* silent */ }
  };
  set("college_erp_workspace_preferences", data.preferences   ?? {});
  set("college_erp_workspace_pinned",      data.pinnedModules ?? []);
  set("college_erp_workspace_favorites",   data.favorites     ?? []);
  set("college_erp_workspace_layouts",     data.layouts       ?? []);
  set("college_erp_workspace_notes",       data.notes         ?? []);
  set("college_erp_workspace_tasks",       data.tasks         ?? []);
}

export const WorkspaceExportImport: React.FC = () => {
  const [exportStatus, setExportStatus] = useState<"idle" | "done">("idle");
  const [importStatus, setImportStatus] = useState<"idle" | "done" | "error">("idle");
  const [importError,  setImportError]  = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = gatherExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `workspace-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus("done");
    setTimeout(() => setExportStatus("idle"), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ExportData;
        if (!data.version || !data.exportedAt) throw new Error("Invalid workspace backup file.");
        applyImport(data);
        setImportStatus("done");
        setImportError("");
        setTimeout(() => setImportStatus("idle"), 3000);
      } catch (err) {
        setImportStatus("error");
        setImportError(err instanceof Error ? err.message : "Parse error");
        setTimeout(() => setImportStatus("idle"), 5000);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    e.target.value = "";
  };

  const EXPORT_ITEMS = [
    "Workspace preferences",
    "Pinned modules",
    "Favorites",
    "Saved layouts",
    "Notes & Tasks",
    "Settings",
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-bold text-white">Export / Import Workspace</span>
      </div>

      {/* What's included */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Included in backup</div>
        <ul className="grid grid-cols-2 gap-1">
          {EXPORT_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Export */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400">Export Backup</div>
        <button
          onClick={handleExport}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            exportStatus === "done"
              ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
          }`}
        >
          {exportStatus === "done" ? (
            <><CheckCircle2 className="w-4 h-4" /> Exported!</>
          ) : (
            <><Download className="w-4 h-4" /> Export JSON</>
          )}
        </button>
      </div>

      {/* Import */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400">Import Backup</div>
        <input ref={fileInputRef} type="file" accept=".json,application/json"
          onChange={handleImport} aria-label="Import workspace backup JSON file"
          className="sr-only" id="workspace-import-input"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
            importStatus === "done"  ? "border-emerald-500/40 bg-emerald-600/10 text-emerald-300" :
            importStatus === "error" ? "border-rose-500/40 bg-rose-600/10 text-rose-300"         :
                                       "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
          }`}
        >
          {importStatus === "done"  ? <><CheckCircle2  className="w-4 h-4" /> Imported!</>             :
           importStatus === "error" ? <><AlertTriangle className="w-4 h-4" /> Import Failed</>         :
                                      <><Upload className="w-4 h-4" /> Import JSON Backup</>}
        </button>
        {importStatus === "error" && importError && (
          <p className="text-[11px] text-rose-400 px-1">{importError}</p>
        )}
        <p className="text-[10px] text-slate-600">
          Import will overwrite your current workspace preferences and data. A full page reload may be required.
        </p>
      </div>
    </div>
  );
};
