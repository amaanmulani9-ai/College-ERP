import React, { useState } from "react";
import { Search, X, History, Sparkles, ChevronRight, Sliders, BarChart3, Settings, Users, GraduationCap, Building2 } from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  route: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  { id: "1", title: "Student Directory",      category: "Students",    icon: Users,         route: "/students" },
  { id: "2", title: "Fee Collection Desk",    category: "Finance",     icon: BarChart3,     route: "/fees" },
  { id: "3", title: "Academic Structure",     category: "Academics",   icon: GraduationCap, route: "/academics" },
  { id: "4", title: "IAM Role & Permissions", category: "Security",    icon: Settings,      route: "/security" },
  { id: "5", title: "System Health Monitor",  category: "System",      icon: Sliders,       route: "/system" },
  { id: "6", title: "Hostel Occupancy",       category: "Facilities",  icon: Building2,     route: "/hostel" },
];

const RECENT_SEARCHES = ["Fees 2026", "Student Roll 104", "Semester Timetable", "MFA Settings"];

export const MobileWorkspaceSearch: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState<string[]>(RECENT_SEARCHES);

  const filtered = SEARCH_DATABASE.filter((item) => {
    if (!query.trim()) return true;
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Touch Workspace Search"
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-4 flex flex-col gap-4 font-sans text-xs select-none animate-in fade-in duration-150"
    >
      {/* Search Bar Input Header */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl">
        <Search className="w-5 h-5 text-indigo-400 shrink-0" />
        <input
          type="text"
          placeholder="Search modules, features & actions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-slate-100 text-sm font-medium placeholder-slate-500 focus:outline-none"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px]"
        >
          Cancel
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Recent Searches (when query is empty) */}
        {!query && recents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] font-bold uppercase">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recent Searches</span>
              </div>
              <button
                onClick={() => setRecents([])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recents.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-[11px] font-medium transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-2">
          <p className="px-1 text-[10px] font-mono font-bold text-slate-400 uppercase">
            {query ? `Search Results (${filtered.length})` : "Suggested Modules"}
          </p>

          <div className="space-y-1.5">
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={onClose}
                  className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 hover:border-indigo-600 rounded-2xl cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-100 text-[12px]">{item.title}</p>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">{item.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
