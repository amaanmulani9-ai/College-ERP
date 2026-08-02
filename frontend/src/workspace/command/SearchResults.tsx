import React from "react";
import { CommandItem, CommandItemData } from "./CommandItem";

interface SearchResultsProps {
  items: CommandItemData[];
  selectedIndex: number;
  onSelect: (item: CommandItemData) => void;
  onOpenNewTab: (item: CommandItemData) => void;
  onToggleFavorite?: (item: CommandItemData) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  items,
  selectedIndex,
  onSelect,
  onOpenNewTab,
  onToggleFavorite,
}) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center space-y-2">
        <div className="text-xs font-semibold text-slate-400">No matching results found</div>
        <p className="text-[11px] text-slate-500">Try refining your search terms or selecting a different category filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, idx) => (
        <CommandItem
          key={item.id}
          item={item}
          isSelected={idx === selectedIndex}
          onSelect={onSelect}
          onOpenNewTab={onOpenNewTab}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
