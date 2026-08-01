import React from "react";
import {
  BookOpen,
  Users,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Upload,
  UserCheck,
  AlertTriangle,
  Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ActivityFeed } from "../../components/dashboard/widgets/ActivityFeed";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const todayClasses = [
    { code: "CS302", name: "Data Structures & Algorithms", time: "09:00 AM - 10:30 AM", room: "Hall 4B", batch: "CSE-3A (60 Students)", status: "Completed" },
    { code: "CS401", name: "Database Management Systems", time: "11:00 AM - 12:30 PM", room: "Lab 2", batch: "CSE-4B (45 Students)", status: "Pending Attendance" },
    { code: "CS505", name: "Artificial Intelligence & ML", time: "02:00 PM - 03:30 PM", room: "Hall 2A", batch: "CSE-5A (55 Students)", status: "Upcoming" },
  ];

  const lowAttendanceStudents = [
    { name: "Rahul Sharma", roll: "CS2026012", attendance: "68%", subject: "CS302" },
    { name: "Priya Patel", roll: "CS2026045", attendance: "71%", subject: "CS401" },
    { name: "Amit Kumar", roll: "CS2026089", attendance: "73%", subject: "CS505" },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Faculty & Teacher Portal" description="Instructor Class Schedule, Attendance & Grading Workbench." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                FACULTY WORKBENCH
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 1 Class Pending Attendance
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, Prof. {user?.first_name || "Faculty"} {user?.last_name || "Member"}
            </h1>

            <p className="text-xs text-slate-300">
              Designation: <strong className="text-white">Senior Assistant Professor</strong> • Department: <strong className="text-indigo-300">Computer Science</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Mark Class Attendance
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Upload Exam Marks
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" /> My Timetable
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Teacher KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Today's Classes" value="3 Classes" isPositive={true} icon={<Clock className="w-5 h-5" />} subtitle="Timetable Scheduled" />
        <KPICard title="Assigned Subjects" value="3 Subjects" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="CS302, CS401, CS505" />
        <KPICard title="Total Enrolled Students" value="160" isPositive={true} icon={<Users className="w-5 h-5" />} subtitle="Across all batches" />
        <KPICard title="Attendance Pending" value="1 Class" isPositive={false} icon={<AlertTriangle className="w-5 h-5 text-amber-400" />} subtitle="CS401 Lab 2" />
        <KPICard title="Active Assignments" value="6 Active" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="Pending Grading" />
        <KPICard title="Upcoming Examinations" value="2 Exams" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="Mid-Terms Next Week" />
      </div>

      {/* SECTION 3: Today's Timetable Schedule */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" /> Today's Lecture & Lab Schedule
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayClasses.map((cls, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                  {cls.code}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  cls.status === "Completed"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : cls.status === "Pending Attendance"
                    ? "bg-amber-950 text-amber-400 border border-amber-800 animate-pulse"
                    : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}>
                  {cls.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">{cls.name}</h4>
              <p className="text-xs text-slate-400">{cls.batch}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                <span>{cls.time}</span>
                <span className="text-indigo-300">{cls.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Student Attendance Alerts & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Low Attendance Alert List (&lt;75%)
          </h3>

          <div className="space-y-2">
            {lowAttendanceStudents.map((st, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{st.name} ({st.roll})</span>
                  <span className="text-[11px] text-slate-400 font-mono">Subject: {st.subject}</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-xl border border-amber-800">
                  {st.attendance}
                </span>
              </div>
            ))}
          </div>
        </div>

        <CalendarWidget />
      </div>

      {/* SECTION 5: Activity & Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <AnnouncementPanel />
      </div>
    </div>
  );
};
