import React from "react";
import { History, ChevronRight, Clock, Sliders, BarChart3, Users, Settings } from "lucide-react";

interface RecentModuleItem {
  id: string;
  title: string;
  category: string;
  timeAgo: string;
  icon: React.ElementType;
}

const RECENTS: RecentModuleItem[] = [
  { id: "r1", title: "Fee Collection Desk",  category: "Finance",   timeAgo: "5m ago",  icon: BarChart3 },
  { id: "r2", title: "Student Directory",    category: "Students",  timeAgo: "18m ago", icon: Users },
  { id: "r3", title: "System Health",        category: "System",    timeAgo: "1h ago",  icon: Settings },
  { id: "r4", title: "RBAC Matrix Page",     category: "Security",  timeAgo: "3h ago",  icon: Sliders },
];

export const MobileWorkspaceRecents: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Continue Working (Recents)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Auto-saved</span>
      </div>

      <div className="space-y-1.5">
        {RECENTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-[11px]">{item.title}</p>
                  <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono">
                    <span>{item.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      {item.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
