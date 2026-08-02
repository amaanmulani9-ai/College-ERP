import React, { useState } from "react";
import { useSettings } from "./SettingsContext";
import { Search, X, Sliders, ArrowUpRight, Star } from "lucide-react";
import { SettingPageItem } from "./types";

interface SettingsSearchProps {
  onClose: () => void;
  onSelectSetting: (setting: SettingPageItem) => void;
}

export const SettingsSearch: React.FC<SettingsSearchProps> = ({
  onClose,
  onSelectSetting,
}) => {
  const { pages, favoriteIds, markAsRecent } = useSettings();
  const [query, setQuery] = useState("");

  const filteredPages = pages.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (p: SettingPageItem) => {
    markAsRecent(p.id);
    onSelectSetting(p);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-xs font-sans space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Global Settings Instant Search</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type setting name, category, or code (e.g. SMTP, RBAC, Fees)..."
            className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-medium"
            autoFocus
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredPages.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No setting configuration page found for "{query}".</p>
          ) : (
            filteredPages.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                className="flex items-center justify-between p-3.5 bg-slate-950/90 border border-slate-800 hover:border-indigo-500/60 rounded-xl transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[9px] text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-900 font-bold uppercase">
                      {p.category}
                    </span>
                    <span className="font-mono text-[9px] text-slate-500">{p.code}</span>
                    <h4 className="font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-1">{p.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
