import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Percent,
  Award,
  BookOpen,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  Download,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const studentInfo = {
    id: "CS2026-042",
    program: "B.Tech Computer Science & Engineering",
    department: "Computer Science",
    semester: "Semester 5",
    gpa: "3.88 / 4.0",
    attendance: "94.2%",
    credits: "92 / 160",
    hostel: "Block C, Room 304",
    scholarship: "Merit Scholarship (25% Fee Waiver)",
  };

  const todayClasses = [
    { code: "CS302", name: "Data Structures & Algorithms", time: "09:00 AM - 10:30 AM", room: "Hall 4B", teacher: "Prof. Sharma", status: "Completed" },
    { code: "CS401", name: "Database Management Systems", time: "11:00 AM - 12:30 PM", room: "Lab 2", teacher: "Dr. Verma", status: "Active Now" },
    { code: "CS505", name: "Artificial Intelligence & ML", time: "02:00 PM - 03:30 PM", room: "Hall 2A", teacher: "Prof. Patel", status: "Upcoming" },
  ];

  const subjectAttendance = [
    { subject: "Data Structures & Algorithms (CS302)", attended: "26 / 28", percentage: "92.8%", status: "Good" },
    { subject: "Database Management Systems (CS401)", attended: "24 / 24", percentage: "100.0%", status: "Excellent" },
    { subject: "Artificial Intelligence & ML (CS505)", attended: "22 / 24", percentage: "91.6%", status: "Good" },
    { subject: "Computer Networks Lab (CS402L)", attended: "11 / 12", percentage: "91.6%", status: "Good" },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Student Portal Dashboard" description="Personalized Student Academic & Campus Life Workbench." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-bold text-indigo-300">
                {user?.first_name?.[0] || "S"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-[10px] font-mono font-bold">
                  STUDENT PORTAL
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold">
                  {studentInfo.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.first_name || "Student"}!
              </h1>

              <p className="text-xs text-slate-300">
                {studentInfo.program} • {studentInfo.semester} • Session: <strong className="text-indigo-300 font-mono">AY 2026-2027</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/timetable" className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/30">
              View Timetable
            </Link>
            <Link to="/results" className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors">
              View Grade Results
            </Link>
            <Link to="/certificates" className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download Certificate
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 2: Student KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Overall Attendance" value={studentInfo.attendance} change="+1.2%" isPositive={true} icon={<Percent className="w-5 h-5" />} subtitle="Eligible for Exams" />
        <KPICard title="Cumulative GPA" value={studentInfo.gpa} change="+0.12" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="Dean's List Candidate" />
        <KPICard title="Earned Credits" value={studentInfo.credits} isPositive={true} icon={<GraduationCap className="w-5 h-5" />} subtitle="Degree Progress 57.5%" />
        <KPICard title="Outstanding Fee Dues" value="$0.00 Paid" isPositive={true} icon={<CreditCard className="w-5 h-5" />} subtitle="No Pending Dues" />
        <KPICard title="Library Books Issued" value="2 Books" isPositive={true} icon={<BookOpen className="w-5 h-5" />} subtitle="Due in 12 Days" />
        <KPICard title="Hostel Allocation" value={studentInfo.hostel} isPositive={true} icon={<Building className="w-5 h-5" />} subtitle="Resident Student" />
        <KPICard title="Scholarship Status" value="25% Active" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="Merit Waiver Applied" />
        <KPICard title="Certificates Issued" value="4 Verified" isPositive={true} icon={<CheckCircle2 className="w-5 h-5" />} subtitle="Public QR Codes Ready" />
      </div>

      {/* SECTION 3: Today's Timetable Schedule */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" /> Today's Lecture Schedule
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayClasses.map((cls, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border space-y-2 relative ${
              cls.status === "Active Now" ? "bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-600/20" : "bg-slate-950 border-slate-800"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                  {cls.code}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  cls.status === "Active Now"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800 animate-pulse"
                    : cls.status === "Completed"
                    ? "bg-slate-900 text-slate-400 border border-slate-800"
                    : "bg-purple-950 text-purple-300 border border-purple-800"
                }`}>
                  {cls.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">{cls.name}</h4>
              <p className="text-xs text-slate-400">{cls.teacher}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                <span>{cls.time}</span>
                <span className="text-indigo-300">{cls.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Subject-wise Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-400" /> Subject-wise Attendance Tracker
          </h3>

          <div className="space-y-3">
            {subjectAttendance.map((sa, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[240px]">{sa.subject}</span>
                  <span className="font-mono font-bold text-emerald-400">{sa.percentage} ({sa.attended})</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: sa.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ChartPlaceholder title="Academic Performance & Semester GPA Trend" subtitle="Cumulative GPA progression across previous semesters" />
      </div>

      {/* SECTION 5: Campus Bulletins & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnouncementPanel />
        <CalendarWidget />
      </div>
    </div>
  );
};
