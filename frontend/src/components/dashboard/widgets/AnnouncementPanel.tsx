import React from "react";
import { Megaphone, BellRing, Pin } from "lucide-react";

export const AnnouncementPanel: React.FC = () => {
  const announcements = [
    { title: "Mid-Term Examination Schedule Released", date: "Aug 05, 2026", priority: "HIGH", tag: "Exams" },
    { title: "Campus Network & ERP Maintenance Window", date: "Aug 08, 2026", priority: "MEDIUM", tag: "IT Ops" },
    { title: "Annual Merit Scholarship Applications Open", date: "Aug 12, 2026", priority: "NORMAL", tag: "Finance" },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-purple-400" /> Institutional Bulletins
        </h3>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800 font-bold">
          3 Active
        </span>
      </div>

      <div className="space-y-3">
        {announcements.map((item, i) => (
          <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-mono font-bold text-indigo-400 flex items-center gap-1">
                <Pin className="w-3 h-3 text-purple-400" /> {item.tag}
              </span>
              <span className="text-slate-500 font-mono">{item.date}</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
