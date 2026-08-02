import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search across all 30 ERP modules, students, staff, assets...",
}) => {
  return (
    <div className="relative flex items-center">
      <Search className="w-4 h-4 text-indigo-400 absolute left-3.5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-950 text-xs text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3.5 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
