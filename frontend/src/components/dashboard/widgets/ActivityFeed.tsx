import React from "react";
import { Activity, UserCheck, CreditCard, Award, BookOpen } from "lucide-react";

export const ActivityFeed: React.FC = () => {
  const activities = [
    { title: "New Student Enrolled", desc: "Amaan Khan assigned ID CS-2026-042", time: "10 mins ago", icon: <UserCheck className="w-4 h-4 text-emerald-400" /> },
    { title: "Fee Payment Received", desc: "$2,450 semester tuition paid via Razorpay", time: "25 mins ago", icon: <CreditCard className="w-4 h-4 text-indigo-400" /> },
    { title: "Degree Certificate Issued", desc: "Public QR verification generated", time: "1 hour ago", icon: <Award className="w-4 h-4 text-purple-400" /> },
    { title: "Library Book Returned", desc: "Data Structures & Algorithms v4", time: "2 hours ago", icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-lg space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-400" /> Real-time Audit Activity Stream
      </h3>

      <div className="space-y-3">
        {activities.map((act, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              {act.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-white block truncate">{act.title}</span>
              <span className="text-[11px] text-slate-400 block truncate">{act.desc}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 shrink-0">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
