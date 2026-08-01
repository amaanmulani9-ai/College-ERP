import React from "react";
import {
  Building,
  Users,
  BedDouble,
  Wrench,
  DollarSign,
  CheckCircle2,
  Plus,
  ClipboardList,
  LogIn,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { ActivityFeed } from "../../components/dashboard/widgets/ActivityFeed";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const HostelWardenDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const pendingRequests = [
    { student: "Amaan Khan (CS2026-042)", room: "Block C / Room 304", type: "AC Repair", priority: "High", raised: "2026-07-31" },
    { student: "Karan Singh (ME2026-014)", room: "Block B / Room 208", type: "Plumbing Issue", priority: "Medium", raised: "2026-08-01" },
    { student: "Priya Sharma (CSE2026-091)", room: "Block A / Room 112", type: "Electrical Fitting", priority: "Low", raised: "2026-07-30" },
  ];

  const todayMovements = [
    { student: "Rahul Mehta", roll: "CS2026-018", type: "Check-In", room: "Block D / Room 402", time: "09:00 AM" },
    { student: "Divya Patel", roll: "MBA2026-005", type: "Leave Approved", room: "Block A / Room 114", time: "10:30 AM" },
    { student: "Arjun Kumar", roll: "EC2026-044", type: "Check-Out", room: "Block B / Room 210", time: "11:45 AM" },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Hostel Warden Dashboard" description="Hostel Occupancy, Maintenance & Resident Management Control Panel." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-900/80 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                HOSTEL WARDEN DESK
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 94.2% Occupancy
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.first_name || "Hostel"} {user?.last_name || "Warden"}
            </h1>
            <p className="text-xs text-slate-300">
              Hostel: <strong className="text-white">Rajiv Gandhi Residential Complex</strong> • Total Capacity: <strong className="text-purple-300 font-mono">1,020 Beds</strong> • Session: <strong className="text-indigo-300 font-mono">AY 2026-2027</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Allocate Room
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Wrench className="w-4 h-4" /> Maintenance
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" /> Visitor Log
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Hostel KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Hostel Rooms" value="255 Rooms" isPositive={true} icon={<Building className="w-5 h-5" />} subtitle="Across Blocks A, B, C & D" />
        <KPICard title="Occupied Rooms" value="240 Rooms" change="+2" isPositive={true} icon={<BedDouble className="w-5 h-5" />} subtitle="960 of 1,020 Beds" />
        <KPICard title="Available Vacancies" value="15 Rooms" change="-2" isPositive={false} icon={<BedDouble className="w-5 h-5" />} subtitle="60 Unoccupied Beds" />
        <KPICard title="Total Residents" value="960" change="+4" isPositive={true} icon={<Users className="w-5 h-5" />} subtitle="Students in Residence" />
        <KPICard title="Maintenance Requests" value="12 Pending" change="+3" isPositive={false} icon={<Wrench className="w-5 h-5" />} subtitle="3 High Priority" />
        <KPICard title="Visitor Entries Today" value="24 Visitors" isPositive={true} icon={<LogIn className="w-5 h-5" />} subtitle="Visitor Register Signed" />
        <KPICard title="Hostel Fees Pending" value="$28,400" change="-5.0%" isPositive={true} icon={<DollarSign className="w-5 h-5" />} subtitle="Hostel Dues Clearance" />
        <KPICard title="Bed Occupancy Rate" value="94.2%" change="+0.5%" isPositive={true} icon={<CheckCircle2 className="w-5 h-5" />} subtitle="Above Target 90%" />
      </div>

      {/* SECTION 3: Hostel Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Monthly Hostel Occupancy Rate Trend" subtitle="Bed utilization percentage over the current academic year" />
        <ChartPlaceholder title="Maintenance Request Category Distribution" subtitle="Electrical, Plumbing, Furniture, Network, and AC breakdown" />
      </div>

      {/* SECTION 4: Maintenance Requests Panel */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-purple-400" /> Open Maintenance Requests
        </h3>
        <div className="space-y-3">
          {pendingRequests.map((req, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">{req.student}</p>
                <p className="text-[11px] font-mono text-slate-400">{req.room} • {req.type}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-slate-500">{req.raised}</span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  req.priority === "High" ? "bg-red-950 text-red-400 border-red-900"
                  : req.priority === "Medium" ? "bg-amber-950 text-amber-400 border-amber-900"
                  : "bg-slate-900 text-slate-400 border-slate-800"
                }`}>
                  {req.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Today's Resident Movements */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <LogIn className="w-5 h-5 text-indigo-400" /> Today's Resident Check-in/Out Movements
        </h3>
        <div className="space-y-2.5">
          {todayMovements.map((mv, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">{mv.student} <span className="font-mono text-slate-400 font-normal">({mv.roll})</span></span>
                <span className="text-[11px] text-slate-400">{mv.room}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-slate-500">{mv.time}</span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  mv.type === "Check-In" ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : mv.type === "Check-Out" ? "bg-red-950 text-red-400 border-red-900"
                  : "bg-indigo-950 text-indigo-300 border-indigo-800"
                }`}>
                  {mv.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed />
        <AnnouncementPanel />
        <CalendarWidget />
      </div>
    </div>
  );
};
