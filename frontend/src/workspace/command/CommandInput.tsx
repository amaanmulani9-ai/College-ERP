import React from "react";
import { Search, X, Command } from "lucide-react";

interface CommandInputProps {
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  placeholder?: string;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  query,
  onQueryChange,
  onClose,
  placeholder = "Search ERP modules, students, staff, assets, AI, commands...",
}) => {
  return (
    <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90 select-none">
      <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400">
        <Command className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
      />

      {query && (
        <button
          onClick={() => onQueryChange("")}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 text-xs"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
        ESC
      </kbd>

      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
