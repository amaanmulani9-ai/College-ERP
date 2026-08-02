import React from "react";
import { Star, Pin, ArrowRight } from "lucide-react";
import { CommandItemData } from "./CommandItem";

interface FavoritesPanelProps {
  favoriteItems: CommandItemData[];
  onSelect: (item: CommandItemData) => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ favoriteItems, onSelect }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 select-none">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Pinned & Favorites
      </h4>

      <div className="space-y-1">
        {favoriteItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-left text-xs text-slate-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="truncate">{item.title}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400" />
          </button>
        ))}
      </div>
    </div>
  );
};
