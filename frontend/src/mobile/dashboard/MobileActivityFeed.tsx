import React from "react";
import { Activity, Clock, CheckCircle2, AlertCircle, FileText, User } from "lucide-react";

interface ActivityLogItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timeAgo: string;
  icon: React.ElementType;
}

const ACTIVITIES: ActivityLogItem[] = [
  { id: "a1", user: "Dr. K. V. Sharma", action: "published syllabus update for", target: "Data Structures CS-301", timeAgo: "10m ago", icon: FileText },
  { id: "a2", user: "Finance Admin",    action: "generated bulk fee receipt bundle for", target: "Engineering Batch 2026", timeAgo: "45m ago", icon: CheckCircle2 },
  { id: "a3", user: "System Auditor",   action: "triggered security audit log export for", target: "IAM Roles Matrix", timeAgo: "2h ago", icon: AlertCircle },
  { id: "a4", user: "Admissions Desk",  action: "approved seat allocation for", target: "Application #ADM-8802", timeAgo: "4h ago", icon: User },
];

export const MobileActivityFeed: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Live Activity Feed</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Real-time</span>
      </div>

      <div className="space-y-2">
        {ACTIVITIES.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-slate-200 leading-tight">
                  <span className="font-bold text-slate-100">{act.user}</span> {act.action}{" "}
                  <span className="font-semibold text-indigo-300">{act.target}</span>
                </p>
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500 mt-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{act.timeAgo}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
