import React from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  Award,
  Percent,
  CheckCircle2,
  Plus,
  FileCheck,
  Bell,
  BarChart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { ActivityFeed } from "../../components/dashboard/widgets/ActivityFeed";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const HODDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const departmentName = "Computer Science & Engineering";

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="HOD Department Dashboard" description="Head of Department Academic Control Panel." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                HEAD OF DEPARTMENT DESK
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Department Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Department of {departmentName}
            </h1>

            <p className="text-xs text-slate-300">
              HOD: <strong className="text-white">Prof. {user?.last_name || "Department Chair"}</strong> • Active Faculty: <strong className="text-indigo-300 font-mono">24 Instructors</strong> • Term: <strong className="text-indigo-300 font-mono">AY 2026-2027</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Assign Faculty Subject
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" /> Approve Attendance
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> Department Notice
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: HOD Department KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Department Students" value="420" change="+4.5%" isPositive={true} icon={<Users className="w-5 h-5" />} subtitle="CS Enrolled Students" />
        <KPICard title="Faculty Members" value="24" change="0" isPositive={true} icon={<UserCheck className="w-5 h-5" />} subtitle="Professors & Instructors" />
        <KPICard title="Assigned Subjects" value="32" change="+2" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="Theory & Lab Modules" />
        <KPICard title="Today's Active Classes" value="14" change="0" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="Timetable Scheduled" />
        <KPICard title="Average Student Attendance" value="94.1%" change="+2.0%" isPositive={true} icon={<Percent className="w-5 h-5" />} subtitle="Department Attendance" />
        <KPICard title="Internal Assessment Pass %" value="91.0%" change="+1.5%" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="Mid-Term Pass Rate" />
        <KPICard title="Research Projects Active" value="8 Projects" change="+2" isPositive={true} icon={<BarChart className="w-5 h-5" />} subtitle="AI & Cloud Research" />
        <KPICard title="Course Completion Rate" value="78.5%" change="+5.0%" isPositive={true} icon={<CheckCircle2 className="w-5 h-5" />} subtitle="Syllabus Progress" />
      </div>

      {/* SECTION 3: Department Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Department Student Performance & GPA Distribution" subtitle="Grade curve analysis across Computer Science semesters" />
        <ChartPlaceholder title="Faculty Workload & Lecture Allocation Matrix" subtitle="Weekly teaching hours assigned per faculty member" />
      </div>

      {/* SECTION 4: Department Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed />
        <AnnouncementPanel />
        <CalendarWidget />
      </div>
    </div>
  );
};
