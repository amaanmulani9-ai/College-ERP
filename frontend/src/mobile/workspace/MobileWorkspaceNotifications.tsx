import React, { useState } from "react";
import { Bell, CheckCheck, AlertTriangle, Info, Clock, X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "high" | "info" | "system";
  timeAgo: string;
  isRead: boolean;
}

const INITIAL_NOTIFS: NotificationItem[] = [
  { id: "n1", title: "Fee Receipt Generated",   message: "Fee receipt #REC-8841 generated for Aarav Sharma", category: "info",   timeAgo: "2m ago",  isRead: false },
  { id: "n2", title: "System Maintenance Alert",message: "Scheduled backup window starting at 02:00 UTC",   category: "high",   timeAgo: "15m ago", isRead: false },
  { id: "n3", title: "New Admission Application",message: "Application #ADM-2026-902 submitted for review", category: "info",   timeAgo: "1h ago",  isRead: false },
  { id: "n4", title: "Audit Log Export Ready", message: "Audit log CSV download bundle is available",      category: "system", timeAgo: "3h ago",  isRead: true },
];

export const MobileWorkspaceNotifications: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<string>("all");

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "high") return n.category === "high";
    return true;
  });

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-xs">Notifications Center</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-600 text-white font-bold font-mono text-[9px] rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold hover:text-indigo-300"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark Read</span>
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "all",    label: "All" },
          { id: "unread", label: "Unread" },
          { id: "high",   label: "High Priority" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
              filter === f.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List of Notification Cards */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border transition-all ${
              item.isRead
                ? "bg-slate-950/60 border-slate-800/80 text-slate-400"
                : "bg-slate-950 border-indigo-800/60 text-slate-200 shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                {item.category === "high" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                )}
                <p className="font-bold text-[11px] truncate">{item.title}</p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 shrink-0">{item.timeAgo}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">{item.message}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-[11px]">
            No notifications in this filter.
          </div>
        )}
      </div>
    </div>
  );
};
