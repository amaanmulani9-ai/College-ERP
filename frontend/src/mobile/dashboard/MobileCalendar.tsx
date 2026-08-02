import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export const MobileCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(15);
  const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

  const EVENTS_MAP: Record<number, string> = {
    10: "Mid-Term Exams Start",
    15: "Placement Drive Day 1",
    20: "Hostel Fee Due Date",
    28: "Academic Council Meet",
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
          <CalendarIcon className="w-4 h-4 text-cyan-400" />
          <span>Academic Calendar (August 2026)</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-400 hover:text-slate-200"><ChevronLeft className="w-4 h-4" /></button>
          <button className="p-1 text-slate-400 hover:text-slate-200"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Mini Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="p-1 text-slate-500 font-bold">{d}</div>
        ))}
        {DAYS.slice(0, 14).map((day) => {
          const hasEvent = !!EVENTS_MAP[day];
          const isSel = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`p-1.5 rounded-lg transition-all relative font-bold ${
                isSel
                  ? "bg-indigo-600 text-white"
                  : hasEvent
                  ? "bg-slate-950 text-indigo-300 border border-indigo-800"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{day}</span>
              {hasEvent && !isSel && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Event Details Card for Selected Day */}
      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
        <p className="text-[9px] font-mono text-slate-500 uppercase">Event for Aug {selectedDay}, 2026</p>
        <p className="font-bold text-slate-200 text-[11px] mt-0.5">
          {EVENTS_MAP[selectedDay] ?? "No special academic events scheduled."}
        </p>
      </div>
    </div>
  );
};
