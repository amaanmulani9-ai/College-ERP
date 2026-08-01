import React from "react";
import {
  Users,
  UserCheck,
  Building2,
  BookOpen,
  Award,
  TrendingUp,
  Percent,
  GraduationCap,
  Plus,
  FileText,
  Calendar,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { QuickActions } from "../../components/dashboard/widgets/QuickActions";
import { ActivityFeed } from "../../components/dashboard/widgets/ActivityFeed";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const PrincipalDashboardPage: React.FC = () => {
  const { user, tenant } = useAuth();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Principal Executive Dashboard" description="Institutional Academic & Operations Executive Control Panel." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                PRINCIPAL EXECUTIVE DESK
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Institution Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, Dr. {user?.last_name || "Principal"}!
            </h1>

            <p className="text-xs text-slate-300">
              {currentDate} • Institution: <strong className="text-white">{tenant || "Stanford Institute"}</strong> • Session: <strong className="text-indigo-300 font-mono">AY 2026-2027</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Create Announcement
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Generate Report
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Academic Calendar
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Principal KPI Grid (8 Core Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Institution Students" value="2,450" change="+6.2%" isPositive={true} icon={<Users className="w-5 h-5" />} subtitle="Undergraduate & Postgrad" />
        <KPICard title="Faculty & Teaching Staff" value="185" change="+3.0%" isPositive={true} icon={<UserCheck className="w-5 h-5" />} subtitle="12 Academic Departments" />
        <KPICard title="Active Academic Departments" value="12" change="0.0%" isPositive={true} icon={<Building2 className="w-5 h-5" />} subtitle="Engineering, Management & Arts" />
        <KPICard title="Degree Programs Offered" value="28" change="+2" isPositive={true} icon={<GraduationCap className="w-5 h-5" />} subtitle="B.Tech, M.Tech, MBA, Ph.D" />
        <KPICard title="Total Active Courses" value="142" change="+5.4%" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="Current Semester Courses" />
        <KPICard title="Average Student Attendance" value="92.4%" change="+1.8%" isPositive={true} icon={<Percent className="w-5 h-5" />} subtitle="Target 90% Exceeded" />
        <KPICard title="Fee Collection Throughput" value="88.5%" change="+4.2%" isPositive={true} icon={<TrendingUp className="w-5 h-5" />} subtitle="Semester Fee Collections" />
        <KPICard title="Graduation Rate" value="96.2%" change="+0.8%" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="Class of 2026 Cohort" />
      </div>

      {/* SECTION 3: Quick Action Grid */}
      <QuickActions />

      {/* SECTION 4: Institutional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Institutional Admissions & Student Growth" subtitle="Semester-wise student onboarding trend across all departments" />
        <ChartPlaceholder title="Departmental Examination Performance Matrix" subtitle="Average GPA and pass percentage comparison by department" />
      </div>

      {/* SECTION 5: Academic Overview & Timetable Summary */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Academic Term Overview — Fall Semester 2026
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Current Term</span>
            <span className="text-sm font-bold text-white block">Semester 5 & 7 Active</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Active Subjects</span>
            <span className="text-sm font-bold text-white block">142 Theory & Lab Modules</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Next Examinations</span>
            <span className="text-sm font-bold text-indigo-300 block">Mid-Terms (Aug 15)</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Timetable Integrity</span>
            <span className="text-sm font-bold text-emerald-400 block">100% Conflict Free</span>
          </div>
        </div>
      </div>

      {/* SECTION 6: Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed />
        <AnnouncementPanel />
        <CalendarWidget />
      </div>
    </div>
  );
};
