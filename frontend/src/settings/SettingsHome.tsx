import React from "react";
import { useSettings } from "./SettingsContext";
import { SettingPageItem } from "./types";
import {
  Star,
  Pin,
  Clock,
  ArrowRight,
  Sliders,
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  Lock,
  Bell,
  DollarSign,
  CreditCard,
  FileSpreadsheet,
  BookOpen,
  Home as HomeIcon,
  Bus,
  Boxes,
  ShoppingCart,
  QrCode,
  UserCheck,
  Briefcase,
  Heart,
  UserPlus,
  Sparkles,
  Palette,
  Plug,
  Server,
  History,
  Database,
} from "lucide-react";

interface SettingsHomeProps {
  onSelectSetting: (setting: SettingPageItem) => void;
}

export const SettingsHome: React.FC<SettingsHomeProps> = ({ onSelectSetting }) => {
  const {
    pages,
    activeCategory,
    viewMode,
    favoriteIds,
    pinnedIds,
    recentIds,
    toggleFavorite,
    togglePin,
    markAsRecent,
  } = useSettings();

  // Filter pages based on activeCategory
  const filteredPages = pages.filter((p) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Favorites") return favoriteIds.includes(p.id);
    if (activeCategory === "Pinned") return pinnedIds.includes(p.id);
    if (activeCategory === "Recent") return recentIds.includes(p.id);
    return p.category === activeCategory;
  });

  const handleCardClick = (p: SettingPageItem) => {
    markAsRecent(p.id);
    onSelectSetting(p);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Configured Categories</span>
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">{pages.length} Pages</div>
          <p className="text-[10px] text-slate-400 font-mono">27 Admin Modules</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Starred Favorites</span>
          </span>
          <div className="text-2xl font-bold font-mono text-amber-400">{favoriteIds.length} Starred</div>
          <p className="text-[10px] text-slate-400 font-mono">Quick Access</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Pin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pinned Shortcuts</span>
          </span>
          <div className="text-2xl font-bold font-mono text-cyan-400">{pinnedIds.length} Pinned</div>
          <p className="text-[10px] text-slate-400 font-mono">Sidebar Deck</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recently Modified</span>
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">{recentIds.length} History</div>
          <p className="text-[10px] text-emerald-400 font-mono">Just Now</p>
        </div>
      </div>

      {/* Settings Grid / List View */}
      {filteredPages.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Sliders className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-300">No Setting Pages Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching categories or clearing search query.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map((p) => {
            const isFav = favoriteIds.includes(p.id);
            const isPin = pinnedIds.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => handleCardClick(p)}
                className="p-4 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-xl transition-all cursor-pointer group flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 font-bold uppercase">
                      {p.category}
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => togglePin(p.id)}
                        className={`p-1 rounded transition-colors ${
                          isPin ? "text-cyan-400" : "text-slate-600 hover:text-slate-400"
                        }`}
                        title={isPin ? "Unpin" : "Pin"}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className={`p-1 rounded transition-colors ${
                          isFav ? "text-amber-400 fill-amber-400" : "text-slate-600 hover:text-slate-400"
                        }`}
                        title={isFav ? "Unfavorite" : "Favorite"}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 block mb-1">{p.code}</span>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  <span>Modified: {p.lastModified}</span>
                  <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Configure</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredPages.map((p) => {
            const isFav = favoriteIds.includes(p.id);
            const isPin = pinnedIds.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => handleCardClick(p)}
                className="p-3 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 font-bold uppercase shrink-0">
                    {p.category}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{p.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
                    {p.lastModified}
                  </span>
                  <button
                    onClick={() => togglePin(p.id)}
                    className={`p-1 rounded transition-colors ${
                      isPin ? "text-cyan-400" : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className={`p-1 rounded transition-colors ${
                      isFav ? "text-amber-400 fill-amber-400" : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
