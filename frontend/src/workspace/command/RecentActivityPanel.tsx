import React from "react";
import { Clock, FileText, Search, ArrowRight } from "lucide-react";
import { CommandItemData } from "./CommandItem";

interface RecentActivityPanelProps {
  recentPages: CommandItemData[];
  recentSearches: string[];
  onSelectPage: (item: CommandItemData) => void;
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  recentPages,
  recentSearches,
  onSelectPage,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 select-none">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-indigo-400" /> Recent ERP Activity
      </h4>

      {/* Recent Pages */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase">Visited Pages</div>
        <div className="space-y-1">
          {recentPages.map((page) => (
            <button
              key={page.id}
              onClick={() => onSelectPage(page)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-left text-xs text-slate-300 hover:text-white transition-all group"
            >
              <span className="truncate">{page.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Recent Searches</div>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((term, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-[11px] text-slate-400 border border-slate-800"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
