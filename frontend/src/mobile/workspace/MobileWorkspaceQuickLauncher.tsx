import React, { useState } from "react";
import { Users, GraduationCap, DollarSign, Building2, BookOpen, Shield, Settings, Sparkles, Star } from "lucide-react";

interface LauncherCard {
  id: string;
  title: string;
  category: "core" | "academic" | "admin" | "finance";
  icon: React.ElementType;
  color: string;
  bgColor: string;
  isFavorite?: boolean;
}

const LAUNCHER_ITEMS: LauncherCard[] = [
  { id: "students", title: "Student Directory", category: "academic", icon: Users,         color: "text-blue-400",   bgColor: "bg-blue-950/50 border-blue-800/80" },
  { id: "academics",title: "Academic Sessions",category: "academic", icon: GraduationCap, color: "text-purple-400", bgColor: "bg-purple-950/50 border-purple-800/80" },
  { id: "fees",     title: "Fee Collection",   category: "finance",  icon: DollarSign,    color: "text-emerald-400",bgColor: "bg-emerald-950/50 border-emerald-800/80" },
  { id: "library",  title: "Library Catalog",  category: "academic", icon: BookOpen,      color: "text-amber-400",  bgColor: "bg-amber-950/50 border-amber-800/80" },
  { id: "hostel",   title: "Hostel & Rooms",   category: "core",     icon: Building2,     color: "text-cyan-400",   bgColor: "bg-cyan-950/50 border-cyan-800/80" },
  { id: "security", title: "Security & IAM",   category: "admin",    icon: Shield,        color: "text-rose-400",   bgColor: "bg-rose-950/50 border-rose-800/80" },
  { id: "settings", title: "System Admin",     category: "admin",    icon: Settings,      color: "text-indigo-400", bgColor: "bg-indigo-950/50 border-indigo-800/80" },
  { id: "ai",       title: "AI Workspace",     category: "core",     icon: Sparkles,      color: "text-yellow-400", bgColor: "bg-yellow-950/50 border-yellow-800/80" },
];

export const MobileWorkspaceQuickLauncher: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [favs, setFavs] = useState<string[]>(["students", "fees"]);

  const filtered = LAUNCHER_ITEMS.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "favs") return favs.includes(item.id);
    return item.category === activeCategory;
  });

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavs((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-3 text-xs font-sans">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 select-none">
        {[
          { id: "all",      label: "All Modules" },
          { id: "favs",     label: "⭐ Favorites" },
          { id: "academic", label: "Academics" },
          { id: "finance",  label: "Finance" },
          { id: "admin",    label: "Admin" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-[11px] ${
              activeCategory === cat.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Touch Card Grid (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isFav = favs.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-3.5 border rounded-2xl flex flex-col justify-between min-h-[96px] cursor-pointer active:scale-95 transition-all relative overflow-hidden ${item.bgColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <button
                  onClick={(e) => toggleFav(item.id, e)}
                  aria-label="Toggle favorite"
                  className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>
              </div>

              <div>
                <p className="font-bold text-slate-100 text-[11px] truncate leading-tight mt-2">{item.title}</p>
                <span className="text-[9px] font-mono text-slate-400 uppercase opacity-80">{item.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
