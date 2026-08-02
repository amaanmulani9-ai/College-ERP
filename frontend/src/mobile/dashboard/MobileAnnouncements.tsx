import React from "react";
import { Megaphone, Calendar, Tag, ChevronRight } from "lucide-react";

const ANNOUNCEMENTS = [
  { id: "an1", title: "Mid-Term Examination Schedule Released", date: "Aug 10, 2026", tag: "Exams", urgent: true },
  { id: "an2", title: "Campus Placement Drive: Google & Microsoft", date: "Aug 15, 2026", tag: "Placements", urgent: false },
  { id: "an3", title: "Hostel Fee Payment Deadline Extension", date: "Aug 20, 2026", tag: "Hostel", urgent: false },
];

export const MobileAnnouncements: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
          <Megaphone className="w-4 h-4 text-purple-400" />
          <span>Campus Announcements</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Official</span>
      </div>

      <div className="space-y-2">
        {ANNOUNCEMENTS.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="space-y-1 min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  item.urgent ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-slate-800 text-slate-400"
                }`}>
                  {item.tag}
                </span>
                <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  {item.date}
                </span>
              </div>
              <p className="font-bold text-slate-200 text-[11px] truncate">{item.title}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
