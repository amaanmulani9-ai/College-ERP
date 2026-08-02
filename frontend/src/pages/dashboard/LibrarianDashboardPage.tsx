import React from "react";
import {
  BookOpen,
  BookMarked,
  Users,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  Plus,
  Search,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { ActivityFeed } from "../../components/dashboard/widgets/ActivityFeed";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const LibrarianDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const todayActivities = [
    { type: "Issue", book: "Introduction to Algorithms (Cormen)", student: "Amaan Khan (CS2026-042)", time: "09:15 AM", status: "Issued" },
    { type: "Return", book: "Database System Concepts (Silberschatz)", student: "Priya Patel (ME2026-015)", time: "10:40 AM", status: "Returned" },
    { type: "Overdue", book: "Operating Systems (Tanenbaum)", student: "Ravi Kumar (EC2026-088)", time: "3 days ago", status: "Overdue" },
    { type: "Reserve", book: "Artificial Intelligence: A Modern Approach", student: "Sneha Rao (CS2026-092)", time: "11:30 AM", status: "Reserved" },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Library Management Dashboard" description="Digital Library Circulation, Catalog & Fine Management Workbench." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                LIBRARY MANAGEMENT DESK
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Library Open — 08:00 AM–08:00 PM
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.first_name || "Library"} {user?.last_name || "Officer"}
            </h1>
            <p className="text-xs text-slate-300">
              Branch: <strong className="text-white">Central Campus Library</strong> • Holdings: <strong className="text-amber-300 font-mono">185,000 Volumes</strong> • Session: <strong className="text-indigo-300 font-mono">AY 2026-2027</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-600/30 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Issue Book
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Process Return
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Search Catalog
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Library KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Book Holdings" value="185,000" change="+1,200" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="Physical & Digital Volumes" />
        <KPICard title="Books Currently Issued" value="2,840" change="+45" isPositive={true} icon={<BookMarked className="w-5 h-5" />} subtitle="Active Borrowers" />
        <KPICard title="Returns Processed Today" value="124" change="+18" isPositive={true} icon={<RefreshCw className="w-5 h-5" />} subtitle="As of 11:30 AM" />
        <KPICard title="Overdue Books" value="86" change="-12" isPositive={true} icon={<AlertTriangle className="w-5 h-5" />} subtitle="Average 4 Days Late" />
        <KPICard title="Fine Collection Today" value="$420.00" change="+$80" isPositive={true} icon={<DollarSign className="w-5 h-5" />} subtitle="Overdue Fines Paid" />
        <KPICard title="Reservation Queue" value="58 Books" change="+8" isPositive={true} icon={<BookMarked className="w-5 h-5" />} subtitle="Awaiting Return" />
        <KPICard title="Active Library Members" value="3,240" change="+84" isPositive={true} icon={<Users className="w-5 h-5" />} subtitle="Students & Faculty" />
        <KPICard title="Digital E-Resources" value="42,000" change="+500" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="JSTOR, SpringerLink, IEEE" />
      </div>

      {/* SECTION 3: Library Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Book Issue & Return Circulation Trend" subtitle="Daily and weekly book circulation volume across all categories" />
        <ChartPlaceholder title="Subject Category Popularity & Demand Matrix" subtitle="Engineering, Science, Commerce & Humanities borrowing patterns" />
      </div>

      {/* SECTION 4: Today's Circulation Activity */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" /> Today's Circulation Activity Log
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {todayActivities.map((act, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  act.status === "Issued" ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                  : act.status === "Returned" ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : act.status === "Overdue" ? "bg-red-950 text-red-400 border-red-900"
                  : "bg-purple-950 text-purple-300 border-purple-800"
                }`}>
                  {act.status}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{act.time}</span>
              </div>
              <p className="text-xs font-bold text-white leading-snug truncate">{act.book}</p>
              <p className="text-[11px] text-slate-400">{act.student}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed />
        <AnnouncementPanel />
        <CalendarWidget />
      </div>
    </div>
  );
};
