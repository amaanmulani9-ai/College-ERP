import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Circle } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "academic" | "finance" | "personal" | "reminder";
  time?: string;
}

const EVENT_COLORS: Record<CalendarEvent["type"], string> = {
  academic:  "bg-indigo-600/20 text-indigo-300  border-indigo-600/30",
  finance:   "bg-emerald-600/20 text-emerald-300 border-emerald-600/30",
  personal:  "bg-purple-600/20 text-purple-300   border-purple-600/30",
  reminder:  "bg-amber-600/20  text-amber-300    border-amber-600/30",
};

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const sampleEvents: CalendarEvent[] = [
  { id: "e1", title: "Mid-Semester Exam Begins",      date: fmt(today),           type: "academic",  time: "09:00 AM" },
  { id: "e2", title: "Fee Collection Deadline",       date: fmt(addDays(today,2)), type: "finance",   time: "05:00 PM" },
  { id: "e3", title: "Faculty Board Meeting",         date: fmt(addDays(today,1)), type: "academic",  time: "02:30 PM" },
  { id: "e4", title: "Alumni Networking Drive",       date: fmt(addDays(today,5)), type: "personal",  time: "11:00 AM" },
  { id: "e5", title: "Hostel Allotment Submission",   date: fmt(addDays(today,3)), type: "reminder",  time: "03:00 PM" },
  { id: "e6", title: "Campus Placement — TechCorp",   date: fmt(addDays(today,7)), type: "academic",  time: "10:00 AM" },
];

export const WorkspaceCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(fmt(today));
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = viewMonth.getDay();

  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const eventsOnDate = (dateStr: string) => sampleEvents.filter((e) => e.date === dateStr);
  const selectedEvents = eventsOnDate(selectedDate);
  const upcomingEvents = sampleEvents
    .filter((e) => e.date >= fmt(today))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const getDayStr = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    return fmt(d);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-xs font-bold text-white">{monthLabel}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>

      {/* Mini Calendar Grid */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
        <div className="grid grid-cols-7 gap-0.5 mb-2">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-slate-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const ds = getDayStr(day);
            const isToday = ds === fmt(today);
            const isSelected = ds === selectedDate;
            const hasEvents = eventsOnDate(ds).length > 0;
            return (
              <button key={day} onClick={() => setSelectedDate(ds)}
                className={`w-full aspect-square rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center relative transition-all ${
                  isSelected ? "bg-indigo-600 text-white" :
                  isToday    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40" :
                               "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}>
                {day}
                {hasEvents && !isSelected && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Events */}
      {selectedEvents.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" })}
          </div>
          {selectedEvents.map((ev) => (
            <div key={ev.id} className={`flex items-start gap-2 px-3 py-2 rounded-xl border text-xs ${EVENT_COLORS[ev.type]}`}>
              <Circle className="w-2 h-2 mt-0.5 fill-current flex-shrink-0" />
              <div>
                <div className="font-semibold">{ev.title}</div>
                {ev.time && <div className="text-[10px] opacity-70">{ev.time}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Events */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-indigo-400" /> Upcoming
        </div>
        {upcomingEvents.map((ev) => (
          <div key={ev.id} className={`flex items-start gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer hover:opacity-80 transition-opacity ${EVENT_COLORS[ev.type]}`}
            onClick={() => setSelectedDate(ev.date)}>
            <div className="flex-1">
              <div className="font-semibold leading-tight">{ev.title}</div>
              <div className="text-[10px] opacity-70 mt-0.5">
                {new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month:"short", day:"numeric" })}
                {ev.time && ` · ${ev.time}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
