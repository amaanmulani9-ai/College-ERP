import React from "react";
import { CornerDownLeft, ArrowUpDown, ExternalLink, Pin } from "lucide-react";

export const CommandFooter: React.FC = () => {
  return (
    <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 select-none">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
            <ArrowUpDown className="w-3 h-3" />
          </kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
            <CornerDownLeft className="w-3 h-3" />
          </kbd>
          Execute
        </span>
        <span className="hidden sm:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
            Ctrl+↵
          </kbd>
          Open in New Tab
        </span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-slate-400 font-semibold">
        <span className="text-indigo-400">Raycast & VS Code Style</span>
      </div>
    </div>
  );
};
