import React from "react";
import {
  Undo,
  Redo,
  Save,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { PreviewDevice, BuilderTemplate } from "./types";
import { MOCK_BUILDER_TEMPLATES } from "./mockFieldsAndTemplates";

interface BuilderToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  lastSavedAt: string | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  previewDevice: PreviewDevice;
  onPreviewDeviceChange: (dev: PreviewDevice) => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onSelectTemplate: (tmpl: BuilderTemplate) => void;
  onSaveDraft: () => void;
  onOpenInWorkspace?: () => void;
}

export const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  title,
  onTitleChange,
  lastSavedAt,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  previewDevice,
  onPreviewDeviceChange,
  isPreviewMode,
  onTogglePreview,
  onSelectTemplate,
  onSaveDraft,
  onOpenInWorkspace,
}) => {
  return (
    <div
      role="toolbar"
      aria-label="Report Builder Toolbar"
      className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/95 border-b border-slate-800 text-xs shadow-md z-30"
    >
      {/* Title & Template Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Report Title..."
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-sm font-bold text-slate-100 focus:ring-2 focus:ring-indigo-500 max-w-xs"
          />
        </div>

        {/* Template Selector Dropdown */}
        <select
          onChange={(e) => {
            const tmpl = MOCK_BUILDER_TEMPLATES.find((t) => t.id === e.target.value);
            if (tmpl) onSelectTemplate(tmpl);
          }}
          className="bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="" disabled>
            Load Preset Template...
          </option>
          {MOCK_BUILDER_TEMPLATES.map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id}>
              {tmpl.name}
            </option>
          ))}
        </select>

        {/* Auto-save Status */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{lastSavedAt ? `Saved ${lastSavedAt}` : "Auto-saving..."}</span>
        </div>
      </div>

      {/* Center Controls: Undo/Redo & Device Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 cursor-not-allowed"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 cursor-not-allowed"
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Device Preview Selector */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => onPreviewDeviceChange("desktop")}
            className={`p-1.5 rounded transition-colors ${
              previewDevice === "desktop" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPreviewDeviceChange("tablet")}
            className={`p-1.5 rounded transition-colors ${
              previewDevice === "tablet" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPreviewDeviceChange("mobile")}
            className={`p-1.5 rounded transition-colors ${
              previewDevice === "mobile" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPreviewDeviceChange("print")}
            className={`p-1.5 rounded transition-colors ${
              previewDevice === "print" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Print Layout"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Actions: Preview Mode & Save Draft */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            isPreviewMode
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isPreviewMode ? "Edit Builder" : "Live Preview"}</span>
        </button>

        <button
          onClick={onSaveDraft}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft</span>
        </button>

        {onOpenInWorkspace && (
          <button
            onClick={onOpenInWorkspace}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg border border-slate-700"
            title="Open in Workspace Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
