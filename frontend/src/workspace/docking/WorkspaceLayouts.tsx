import React, { useState } from "react";
import { LayoutTemplate, Save, Trash2, RefreshCw, ChevronDown } from "lucide-react";
import { useWindowManager, LayoutPreset } from "./WorkspaceManager";

const PRESETS: { id: LayoutPreset; label: string; description: string }[] = [
  { id: "default",        label: "Default Layout",        description: "Standard workspace with home panel" },
  { id: "analytics",      label: "Analytics Layout",      description: "Data dashboards and reports side-by-side" },
  { id: "administration", label: "Administration Layout", description: "HR, payroll, and admin panels" },
  { id: "academic",       label: "Academic Layout",       description: "Timetable, examinations, and attendance" },
  { id: "finance",        label: "Finance Layout",        description: "Fees, payments, and budgeting panels" },
  { id: "library",        label: "Library Layout",        description: "Book catalog, issue/return, and members" },
  { id: "custom",         label: "Custom Layout",         description: "Your saved arrangement" },
];

export const WorkspaceLayouts: React.FC = () => {
  const { currentLayout, switchLayout, savedLayouts, saveLayout, deleteLayout, resetLayout } =
    useWindowManager();
  const [isOpen, setIsOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  const currentPreset = PRESETS.find((p) => p.id === currentLayout);

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveLayout(saveName.trim());
    setSaveName("");
    setShowSaveInput(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700/50"
        title="Workspace Layouts"
      >
        <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
        <span className="hidden sm:inline">{currentPreset?.label ?? "Default Layout"}</span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden">
          {/* Preset Layouts */}
          <div className="p-3 border-b border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Layout Presets
            </div>
            <div className="space-y-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => { switchLayout(preset.id); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                    currentLayout === preset.id
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="font-semibold">{preset.label}</div>
                  <div className="text-[10px] text-slate-500">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Custom Layouts */}
          {savedLayouts.length > 0 && (
            <div className="p-3 border-b border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Saved Layouts
              </div>
              <div className="space-y-1">
                {savedLayouts.map((layout) => (
                  <div
                    key={layout.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 group"
                  >
                    <span className="text-xs text-slate-300 truncate">{layout.name}</span>
                    <button
                      onClick={() => deleteLayout(layout.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-rose-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-3 space-y-2">
            {showSaveInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Layout name..."
                  autoFocus
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 text-xs text-white border border-slate-700 focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <button
                  onClick={handleSave}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveInput(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all"
              >
                <Save className="w-3.5 h-3.5 text-indigo-400" />
                Save Current Layout
              </button>
            )}
            <button
              onClick={() => { resetLayout(); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-xs text-slate-400 hover:text-rose-400 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
