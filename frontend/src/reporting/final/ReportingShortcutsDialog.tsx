import React, { useState } from "react";
import { Command, Search, X } from "lucide-react";
import { MOCK_SHORTCUTS } from "./mockFinalData";

interface ReportingShortcutsDialogProps {
  onClose: () => void;
}

export const ReportingShortcutsDialog: React.FC<ReportingShortcutsDialogProps> = ({ onClose }) => {
  const [search, setSearch] = useState("");

  const filteredShortcuts = MOCK_SHORTCUTS.filter(
    (s) =>
      s.keyCombo.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-xs font-sans space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Keyboard Shortcuts Directory</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shortcut keys or commands..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredShortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-950/90 border border-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-900 uppercase font-bold">
                  {s.category}
                </span>
                <span className="font-semibold text-slate-200">{s.description}</span>
              </div>
              <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[11px] font-bold rounded-md shadow-sm">
                {s.keyCombo}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
