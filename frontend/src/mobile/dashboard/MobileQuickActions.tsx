import React from "react";
import { CheckSquare, Receipt, FileText, Sparkles, UserPlus, Calendar } from "lucide-react";

export const MobileQuickActions: React.FC = () => {
  const ACTIONS = [
    { label: "Take Attendance", sub: "Scan / Manual", icon: CheckSquare, color: "bg-blue-950/60 border-blue-800 text-blue-300" },
    { label: "Fee Receipt",     sub: "Collect Payment",  icon: Receipt,     color: "bg-emerald-950/60 border-emerald-800 text-emerald-300" },
    { label: "Hall Ticket",     sub: "Generate PDFs",    icon: FileText,    color: "bg-purple-950/60 border-purple-800 text-purple-300" },
    { label: "Add Student",     sub: "New Admission",    icon: UserPlus,    color: "bg-amber-950/60 border-amber-800 text-amber-300" },
    { label: "Exam Timetable",  sub: "View Schedule",    icon: Calendar,    color: "bg-cyan-950/60 border-cyan-800 text-cyan-300" },
    { label: "AI Diagnostic",   sub: "Run Copilot",      icon: Sparkles,    color: "bg-indigo-950/60 border-indigo-800 text-indigo-300" },
  ];

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <h3 className="font-bold text-slate-100 text-xs">Touch Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACTIONS.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => alert(`Triggered ${act.label}`)}
              className={`p-3 border rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95 min-h-[56px] ${act.color}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-[11px] truncate">{act.label}</p>
                <p className="text-[9px] opacity-75 font-mono truncate">{act.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
