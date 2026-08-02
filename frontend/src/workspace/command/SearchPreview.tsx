import React from "react";
import { Compass, ExternalLink, ShieldCheck, Tag, Info } from "lucide-react";
import { CommandItemData } from "./CommandItem";

interface SearchPreviewProps {
  item: CommandItemData | null;
  onOpen: (item: CommandItemData) => void;
  onOpenNewTab: (item: CommandItemData) => void;
}

export const SearchPreview: React.FC<SearchPreviewProps> = ({
  item,
  onOpen,
  onOpenNewTab,
}) => {
  if (!item) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-xs text-slate-500 border-l border-slate-800">
        Select an item to view quick details
      </div>
    );
  }

  return (
    <div className="h-full p-5 border-l border-slate-800 bg-slate-950/60 flex flex-col justify-between select-none">
      <div className="space-y-4">
        {/* Header Icon & Title */}
        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 w-fit">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white leading-tight">{item.title}</h3>
          <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-indigo-300 border border-slate-700">
            {item.category}
          </span>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Route Path</div>
            <code className="font-mono text-indigo-400">{item.route}</code>
          </div>

          {item.description && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Module Overview</div>
              <p className="text-[11px] leading-relaxed text-slate-400">{item.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <button
          onClick={() => onOpen(item)}
          className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          Open Module View
        </button>
        <button
          onClick={() => onOpenNewTab(item)}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in New Workspace Tab
        </button>
      </div>
    </div>
  );
};
