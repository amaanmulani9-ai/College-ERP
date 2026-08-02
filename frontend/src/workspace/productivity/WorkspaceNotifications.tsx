import React, { useState } from "react";
import { Bell, X, CheckCheck, Filter, Circle } from "lucide-react";

type NotifGroup = "system" | "academic" | "finance" | "hr" | "transport" | "library" | "ai";
type NotifFilter = "all" | "unread" | "priority";

interface Notification {
  id: string;
  group: NotifGroup;
  title: string;
  body: string;
  isRead: boolean;
  isPriority: boolean;
  timestamp: number;
}

const GROUP_LABELS: Record<NotifGroup, string> = {
  system: "System", academic: "Academic", finance: "Finance",
  hr: "HR", transport: "Transport", library: "Library", ai: "AI",
};

const GROUP_COLORS: Record<NotifGroup, string> = {
  system:    "bg-slate-800 text-slate-300",
  academic:  "bg-indigo-600/20 text-indigo-300",
  finance:   "bg-emerald-600/20 text-emerald-300",
  hr:        "bg-purple-600/20 text-purple-300",
  transport: "bg-amber-600/20 text-amber-300",
  library:   "bg-sky-600/20 text-sky-300",
  ai:        "bg-rose-600/20 text-rose-300",
};

const sampleNotifs: Notification[] = [
  { id: "n1", group: "finance",  title: "Fee Payment Received",     body: "₹45,000 collected — Ravi Kumar (CS301)", isRead: false, isPriority: true,  timestamp: Date.now()-300000   },
  { id: "n2", group: "academic", title: "Exam Schedule Updated",    body: "Mid-semester exam dates updated for CSE Dept", isRead: false, isPriority: true, timestamp: Date.now()-900000 },
  { id: "n3", group: "ai",       title: "AI Provider Online",       body: "Placeholder AI engine is ready for queries",   isRead: false, isPriority: false, timestamp: Date.now()-1800000 },
  { id: "n4", group: "transport",title: "Bus Route 12 Delayed",     body: "Route 12 (Airport Road) delayed by 20 min",    isRead: true,  isPriority: false, timestamp: Date.now()-3600000 },
  { id: "n5", group: "hr",       title: "Leave Request Pending",    body: "3 staff leave requests await your approval",   isRead: false, isPriority: true,  timestamp: Date.now()-7200000 },
  { id: "n6", group: "library",  title: "Book Return Due",          body: "12 books past return deadline — auto-fine due", isRead: true, isPriority: false, timestamp: Date.now()-14400000 },
  { id: "n7", group: "system",   title: "System Backup Completed",  body: "Nightly backup succeeded — 2.3 GB archived",   isRead: true,  isPriority: false, timestamp: Date.now()-86400000 },
];

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60)    return `${d}s ago`;
  if (d < 3600)  return `${Math.floor(d/60)}m ago`;
  if (d < 86400) return `${Math.floor(d/3600)}h ago`;
  return `${Math.floor(d/86400)}d ago`;
}

export const WorkspaceNotifications: React.FC = () => {
  const [notifs, setNotifs] = useState<Notification[]>(sampleNotifs);
  const [filter, setFilter] = useState<NotifFilter>("all");
  const [activeGroup, setActiveGroup] = useState<NotifGroup | "all">("all");

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const dismiss = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const filtered = notifs.filter((n) => {
    const groupMatch = activeGroup === "all" || n.group === activeGroup;
    if (filter === "unread")   return groupMatch && !n.isRead;
    if (filter === "priority") return groupMatch && n.isPriority;
    return groupMatch;
  });

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Header + Mark all read */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">{unreadCount} unread</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5">
        {(["all","unread","priority"] as NotifFilter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"}`}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {/* Group Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveGroup("all")} className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-all ${activeGroup === "all" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}>All</button>
        {(Object.keys(GROUP_LABELS) as NotifGroup[]).map((g) => (
          <button key={g} onClick={() => setActiveGroup(g)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-all ${activeGroup === g ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}>
            {GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {filtered.map((n) => (
          <div key={n.id} onClick={() => markRead(n.id)}
            className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer group transition-all ${n.isRead ? "bg-slate-900/60 border-slate-800/60 opacity-70" : "bg-slate-900 border-slate-800"}`}>
            {!n.isRead && <Circle className="w-2 h-2 fill-indigo-400 text-indigo-400 flex-shrink-0 mt-1.5" />}
            {n.isRead  && <div className="w-2 h-2 flex-shrink-0 mt-1.5" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${GROUP_COLORS[n.group]}`}>{GROUP_LABELS[n.group]}</span>
                {n.isPriority && <span className="px-1.5 py-0.5 rounded bg-rose-600/20 text-rose-300 text-[10px] font-bold">PRIORITY</span>}
              </div>
              <p className="text-xs font-semibold text-slate-200 leading-snug">{n.title}</p>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{n.body}</p>
              <p className="text-[10px] text-slate-600 mt-1">{timeAgo(n.timestamp)}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all flex-shrink-0">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div className="py-8 text-center text-xs text-slate-500">No notifications for this filter.</div>}
      </div>
    </div>
  );
};
