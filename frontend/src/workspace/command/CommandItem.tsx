import React from "react";
import { Compass, ExternalLink, Star, Pin, CornerDownLeft } from "lucide-react";

export interface CommandItemData {
  id: string;
  title: string;
  description?: string;
  category: string;
  route: string;
  iconName?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

interface CommandItemProps {
  item: CommandItemData;
  isSelected: boolean;
  onSelect: (item: CommandItemData) => void;
  onOpenNewTab: (item: CommandItemData) => void;
  onToggleFavorite?: (item: CommandItemData) => void;
}

export const CommandItem: React.FC<CommandItemProps> = ({
  item,
  isSelected,
  onSelect,
  onOpenNewTab,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all select-none group ${
        isSelected
          ? "bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm"
          : "hover:bg-slate-800/80 text-slate-300 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`p-2 rounded-lg transition-all ${
            isSelected
              ? "bg-indigo-600 text-white"
              : "bg-slate-950 text-indigo-400 group-hover:bg-slate-800"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold truncate text-white">{item.title}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-400 border border-slate-700/50">
              {item.category}
            </span>
          </div>
          {item.description && (
            <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item);
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400"
            title="Favorite"
          >
            <Star className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenNewTab(item);
          }}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          title="Open in New Tab (Ctrl+Enter)"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 ml-1" />
      </div>
    </div>
  );
};
