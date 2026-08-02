import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, UserPlus, CreditCard, BookOpen, Calendar, Shield } from "lucide-react";

export const QuickActions: React.FC = () => {
  const actions = [
    { label: "Enroll Student", route: "/students/create", icon: <UserPlus className="w-4 h-4 text-emerald-400" /> },
    { label: "Record Payment", route: "/payments/collect", icon: <CreditCard className="w-4 h-4 text-indigo-400" /> },
    { label: "Issue Certificate", route: "/certificates/issue", icon: <Shield className="w-4 h-4 text-purple-400" /> },
    { label: "Issue Library Book", route: "/library/issue", icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { label: "Add Timetable Entry", route: "/timetable/add", icon: <Calendar className="w-4 h-4 text-pink-400" /> },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-lg space-y-3">
      <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <PlusCircle className="w-4 h-4 text-indigo-400" /> Quick Administrative Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {actions.map((act, i) => (
          <Link
            key={i}
            to={act.route}
            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:border-indigo-500/40 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2"
          >
            {act.icon}
            <span className="truncate">{act.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
