import React, { useState } from "react";
import { X, Keyboard } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  { category: "Navigation", keys: ["Ctrl", "K"], description: "Open Command Palette" },
  { category: "Navigation", keys: ["Ctrl", "B"], description: "Toggle Sidebar" },
  { category: "Navigation", keys: ["Ctrl", "/"], description: "Open Settings Search" },
  { category: "Navigation", keys: ["Ctrl", "H"], description: "Go to Settings Home" },
  { category: "Navigation", keys: ["Alt", "←"], description: "Navigate Back" },
  { category: "Settings", keys: ["Ctrl", "S"], description: "Save Current Configuration" },
  { category: "Settings", keys: ["Ctrl", "Z"], description: "Undo Last Change" },
  { category: "Settings", keys: ["Ctrl", "Shift", "F"], description: "Toggle Feature Flags Panel" },
  { category: "System", keys: ["Ctrl", "Shift", "H"], description: "Open System Health Monitor" },
  { category: "System", keys: ["Ctrl", "Shift", "A"], description: "Open Audit Log Center" },
  { category: "UI", keys: ["Ctrl", "Shift", "D"], description: "Toggle Dark / Light Mode" },
  { category: "UI", keys: ["F11"], description: "Full Screen Mode" },
];

const CATEGORIES = [...new Set(SHORTCUTS.map((s) => s.category))];

interface SettingsShortcutsDialogProps {
  onClose: () => void;
}

export const SettingsShortcutsDialog: React.FC<SettingsShortcutsDialogProps> = ({ onClose }) => {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? SHORTCUTS : SHORTCUTS.filter((s) => s.category === filter);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Keyboard Shortcuts Reference</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950/50 border-b border-slate-800 overflow-x-auto">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                filter === cat ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Shortcut List */}
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <p className="text-sm text-slate-200 font-medium">{s.description}</p>
              <div className="flex items-center gap-1">
                {s.keys.map((key, ki) => (
                  <React.Fragment key={ki}>
                    <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-600 text-slate-300 text-[10px] font-mono font-bold rounded-md shadow-sm">
                      {key}
                    </kbd>
                    {ki < s.keys.length - 1 && <span className="text-slate-600 text-[10px]">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono rounded">?</kbd> anywhere in Settings to open this dialog
          </p>
        </div>
      </div>
    </div>
  );
};
