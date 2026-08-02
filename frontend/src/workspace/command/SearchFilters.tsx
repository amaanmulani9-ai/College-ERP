import React from "react";

interface SearchFiltersProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 select-none no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
