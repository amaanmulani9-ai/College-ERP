import React from "react";
import { Star, ChevronRight, Users, DollarSign, Settings, GraduationCap } from "lucide-react";

const FAVORITES = [
  { title: "Student Registry",    category: "Students", icon: Users,         color: "text-blue-400" },
  { title: "Fee Receipt Desk",    category: "Finance",  icon: DollarSign,    color: "text-emerald-400" },
  { title: "System Administration",category: "System",   icon: Settings,      color: "text-indigo-400" },
  { title: "Academic Session",    category: "Academics",icon: GraduationCap, color: "text-purple-400" },
];

export const MobileWorkspaceFavorites: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Pinned & Favorites</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">4 Items</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {FAVORITES.map((fav) => {
          const Icon = fav.icon;
          return (
            <div
              key={fav.title}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 ${fav.color} shrink-0`} />
                <div className="min-w-0">
                  <p className="font-bold text-slate-200 text-[10px] truncate">{fav.title}</p>
                  <p className="text-[8px] font-mono text-slate-500 uppercase">{fav.category}</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
