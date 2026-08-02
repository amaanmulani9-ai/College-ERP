import React from "react";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

export const ExecutiveTimeline: React.FC = () => {
  const events = [
    { date: "Aug 15, 2026", title: "Mid-Term Examination Results Release", status: "completed" },
    { date: "Sep 01, 2026", title: "Q3 Tuition Fee Recovery Deadline", status: "upcoming" },
    { date: "Oct 10, 2026", title: "NAAC Peer Team Inspection Audit", status: "upcoming" },
    { date: "Nov 20, 2026", title: "Annual Placement Drive Mega-Phase", status: "upcoming" },
  ];

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
        <Calendar className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Strategic Institutional Milestones Timeline
        </h3>
      </div>

      <div className="space-y-3 pl-2 border-l-2 border-slate-800">
        {events.map((ev, i) => (
          <div key={i} className="relative pl-4">
            <div className="absolute -left-[9px] top-0.5 w-4 h-4 bg-slate-950 rounded-full border-2 border-indigo-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-indigo-400 font-bold block">
              {ev.date}
            </span>
            <h4 className="font-bold text-slate-200">{ev.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
