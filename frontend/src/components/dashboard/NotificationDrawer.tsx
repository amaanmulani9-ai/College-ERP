import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCheck,
  GraduationCap,
  CreditCard,
  Percent,
  BookOpen,
  Building,
  Server,
  Filter,
  Search,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  category: "academic" | "finance" | "attendance" | "library" | "hostel" | "system";
  time: string;
  isRead: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Mid-Term Schedule Published", message: "Examinations begin August 15, 2026. Download hall tickets from the portal.", category: "academic", time: "10 mins ago", isRead: false },
  { id: "2", title: "Fee Payment Confirmed", message: "Your Semester 5 tuition of $2,450.00 has been received. Receipt REC-2026-1021 generated.", category: "finance", time: "1 hour ago", isRead: false },
  { id: "3", title: "Low Attendance Alert", message: "3 students have attendance below 75% in CS302. Immediate action required.", category: "attendance", time: "2 hours ago", isRead: false },
  { id: "4", title: "Library Book Due in 3 Days", message: "Introduction to Algorithms (Cormen) is due on Aug 04, 2026. Please return or renew.", category: "library", time: "3 hours ago", isRead: true },
  { id: "5", title: "Hostel Maintenance Update", message: "Block C AC repair completed. Room 304 services fully restored.", category: "hostel", time: "5 hours ago", isRead: true },
  { id: "6", title: "System Maintenance Window", message: "Scheduled maintenance on Aug 08, 2026 from 02:00–04:00 AM IST. Brief downtime expected.", category: "system", time: "1 day ago", isRead: true },
];

const CATEGORY_CONFIG = {
  academic: { label: "Academic", icon: <GraduationCap className="w-3.5 h-3.5" />, color: "text-indigo-400 bg-indigo-950 border-indigo-800" },
  finance: { label: "Finance", icon: <CreditCard className="w-3.5 h-3.5" />, color: "text-emerald-400 bg-emerald-950 border-emerald-800" },
  attendance: { label: "Attendance", icon: <Percent className="w-3.5 h-3.5" />, color: "text-amber-400 bg-amber-950 border-amber-800" },
  library: { label: "Library", icon: <BookOpen className="w-3.5 h-3.5" />, color: "text-yellow-400 bg-yellow-950 border-yellow-800" },
  hostel: { label: "Hostel", icon: <Building className="w-3.5 h-3.5" />, color: "text-purple-400 bg-purple-950 border-purple-800" },
  system: { label: "System", icon: <Server className="w-3.5 h-3.5" />, color: "text-slate-400 bg-slate-900 border-slate-700" },
};

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));

  const filtered = notifications.filter((n) => {
    const matchesCategory = activeFilter === "all" || n.category === activeFilter;
    const matchesSearch = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const FILTERS = ["all", "academic", "finance", "attendance", "library", "hostel", "system"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-950 border-l border-slate-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">Notification Center</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="px-4 py-2.5 border-b border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold capitalize shrink-0 border transition-colors ${
                    activeFilter === f
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No notifications found</p>
                </div>
              ) : (
                filtered.map((notif) => {
                  const cfg = CATEGORY_CONFIG[notif.category];
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`w-full text-left p-4 hover:bg-slate-900/60 transition-colors relative ${!notif.isRead ? "bg-indigo-950/20" : ""}`}
                    >
                      {!notif.isRead && (
                        <span className="absolute right-4 top-4 w-2 h-2 rounded-full bg-indigo-500" />
                      )}
                      <div className="flex items-start gap-3">
                        <span className={`p-1.5 rounded-lg border text-xs ${cfg.color} shrink-0`}>
                          {cfg.icon}
                        </span>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className={`text-xs font-bold leading-snug ${notif.isRead ? "text-slate-300" : "text-white"}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] font-mono text-slate-600">{notif.time}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
