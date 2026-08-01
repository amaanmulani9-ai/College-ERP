import React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export const CalendarWidget: React.FC = () => {
  const events = [
    { title: "Academic Senate Meeting", time: "10:00 AM - 11:30 AM", room: "Conference Room A" },
    { title: "CS302 Algorithm Lecture", time: "02:00 PM - 03:30 PM", room: "Hall 4B" },
    { title: "Hostel Warden Inspection", time: "05:00 PM - 06:00 PM", room: "Block C" },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-pink-400" /> Today's Campus Calendar
        </h3>
        <span className="text-[11px] font-mono text-slate-400">Aug 01, 2026</span>
      </div>

      <div className="space-y-2.5">
        {events.map((ev, i) => (
          <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-xs font-bold text-slate-200 block">{ev.title}</span>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-400" /> {ev.time}</span>
              <span className="text-slate-500">{ev.room}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
