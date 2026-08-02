import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Pin, ChevronRight } from "lucide-react";

const SHORTCUTS = [
  { label: "Enroll Student", route: "/students/create", color: "text-emerald-400 bg-emerald-950 border-emerald-800" },
  { label: "Collect Fee", route: "/payments/collect", color: "text-indigo-400 bg-indigo-950 border-indigo-800" },
  { label: "Issue Library Book", route: "/library/issue", color: "text-amber-400 bg-amber-950 border-amber-800" },
  { label: "Generate NIRF Report", route: "/reports/naac-nirf", color: "text-purple-400 bg-purple-950 border-purple-800" },
  { label: "View Hostel Roster", route: "/hostel", color: "text-pink-400 bg-pink-950 border-pink-800" },
  { label: "System Security Settings", route: "/profile/security", color: "text-slate-400 bg-slate-900 border-slate-700" },
];

export const PinnedShortcuts: React.FC = () => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-lg space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Pin className="w-4 h-4 text-indigo-400" /> Pinned Shortcuts
      </h3>

      <div className="space-y-2">
        {SHORTCUTS.map((s, i) => (
          <Link
            key={i}
            to={s.route}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <span className={`w-2 h-2 rounded-full border ${s.color}`} />
            {s.label}
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-600" />
          </Link>
        ))}
      </div>
    </div>
  );
};
