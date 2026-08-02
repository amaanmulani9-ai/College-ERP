import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { CommandItemData } from "./CommandItem";

interface FavoriteCommandsProps {
  items: CommandItemData[];
  onSelect: (item: CommandItemData) => void;
}

export const FavoriteCommands: React.FC<FavoriteCommandsProps> = ({ items, onSelect }) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-1 my-2">
      <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Favorite Shortcuts
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-left text-xs text-slate-300 hover:text-white transition-all group"
          >
            <span className="truncate">{item.title}</span>
            <span className="text-[10px] text-slate-500 group-hover:text-amber-400 font-mono flex items-center gap-1">
              {item.category} <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
