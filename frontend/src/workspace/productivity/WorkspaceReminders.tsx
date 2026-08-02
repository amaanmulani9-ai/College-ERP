import React, { useState } from "react";
import { Bell, CheckCircle2, X } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  isDismissed: boolean;
}

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const sampleReminders: Reminder[] = [
  { id: "r1", title: "Approve semester timetable draft",    dueDate: fmt(today),              isDismissed: false },
  { id: "r2", title: "Submit NAAC report section III",      dueDate: fmt(addDays(today, 1)),  isDismissed: false },
  { id: "r3", title: "Review overdue fee defaulters list",  dueDate: fmt(addDays(today, -1)), isDismissed: false },
  { id: "r4", title: "Update hostel warden assignment",     dueDate: fmt(addDays(today, 3)),  isDismissed: false },
  { id: "r5", title: "Alumni mentorship session prep",      dueDate: fmt(addDays(today, 5)),  isDismissed: false },
];

type Filter = "today" | "tomorrow" | "week" | "overdue" | "all";

export const WorkspaceReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
  const [filter, setFilter] = useState<Filter>("all");

  const dismiss = (id: string) =>
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, isDismissed: true } : r));
  const remove = (id: string) => setReminders((prev) => prev.filter((r) => r.id !== id));

  const active = reminders.filter((r) => !r.isDismissed);

  const filtered = active.filter((r) => {
    if (filter === "today")    return r.dueDate === fmt(today);
    if (filter === "tomorrow") return r.dueDate === fmt(addDays(today, 1));
    if (filter === "week")     return r.dueDate >= fmt(today) && r.dueDate <= fmt(addDays(today, 7));
    if (filter === "overdue")  return r.dueDate < fmt(today);
    return true;
  });

  const overdueCnt = active.filter((r) => r.dueDate < fmt(today)).length;

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Overdue Alert */}
      {overdueCnt > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-700/40 text-xs text-rose-300">
          <Bell className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span><strong>{overdueCnt}</strong> overdue reminder{overdueCnt > 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Filter Pills */}
      <div className="flex gap-1.5 flex-wrap">
        {(["all","today","tomorrow","week","overdue"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              filter === f
                ? f === "overdue" ? "bg-rose-600 text-white" : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reminder List */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {filtered.map((r) => {
          const isOverdue = r.dueDate < fmt(today);
          const isToday   = r.dueDate === fmt(today);
          return (
            <div key={r.id}
              className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all group ${
                isOverdue ? "bg-rose-950/30 border-rose-800/30" :
                isToday   ? "bg-amber-950/20 border-amber-800/30" :
                            "bg-slate-900 border-slate-800"
              }`}>
              <Bell className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isOverdue ? "text-rose-400" : isToday ? "text-amber-400" : "text-indigo-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 leading-snug">{r.title}</p>
                <p className={`text-[10px] mt-0.5 font-mono ${isOverdue ? "text-rose-400" : "text-slate-500"}`}>
                  {isOverdue ? "Overdue — " : ""}{new Date(r.dueDate + "T00:00:00").toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => dismiss(r.id)} className="p-1 rounded hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400" title="Dismiss"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(r.id)}  className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"     title="Remove"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">No reminders for this filter.</div>
        )}
      </div>
    </div>
  );
};
