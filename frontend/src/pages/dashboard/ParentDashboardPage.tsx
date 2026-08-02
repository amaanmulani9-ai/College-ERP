import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Percent,
  Award,
  CreditCard,
  Building,
  CheckCircle2,
  Download,
  Bell,
  PhoneCall,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const ParentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const childInfo = {
    name: "Amaan Khan",
    roll: "CS2026-042",
    program: "B.Tech Computer Science & Engineering",
    semester: "Semester 5",
    gpa: "3.88",
    attendance: "94.2%",
    feeStatus: "Paid in Full ($0.00 Due)",
    hostel: "Block C, Room 304",
  };

  const recentPayments = [
    { receipt: "REC-2026-098", title: "Semester 5 Tuition & Campus Fee", amount: "$2,450.00", date: "2026-07-15", status: "PAID" },
    { receipt: "REC-2026-042", title: "Hostel & Mess Charges Q3", amount: "$850.00", date: "2026-06-10", status: "PAID" },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Parent & Guardian Portal" description="Parent Oversight Dashboard for Child Performance & Fee Receipts." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                PARENT GUARDIAN DESK
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Linked Student: {childInfo.name} ({childInfo.roll})
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, Mr./Mrs. {user?.last_name || "Guardian"}!
            </h1>

            <p className="text-xs text-slate-300">
              Student: <strong className="text-white">{childInfo.name}</strong> • Program: <strong className="text-indigo-300">{childInfo.program}</strong> • Session: <strong className="text-indigo-300 font-mono">AY 2026-2027</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/payments" className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> Pay Fee Invoice
            </Link>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Download Fee Receipt
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> Contact Faculty
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Parent KPIs for Linked Student */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Child Attendance Rate" value={childInfo.attendance} change="+1.2%" isPositive={true} icon={<Percent className="w-5 h-5" />} subtitle="Above Minimum 75%" />
        <KPICard title="Cumulative Grade Point" value={`${childInfo.gpa} GPA`} change="+0.12" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="Top 5% Performance" />
        <KPICard title="Outstanding Fee Dues" value="$0.00" isPositive={true} icon={<CreditCard className="w-5 h-5" />} subtitle="Tuition Paid in Full" />
        <KPICard title="Hostel Residence" value={childInfo.hostel} isPositive={true} icon={<Building className="w-5 h-5" />} subtitle="Hostel Resident" />
        <KPICard title="Library Books Borrowed" value="2 Books" isPositive={true} icon={<Users className="w-5 h-5" />} subtitle="Zero Overdue Fines" />
        <KPICard title="Scholarship Awarded" value="25% Merit Waiver" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="Active Scholarship" />
        <KPICard title="Disciplinary / Behavior" value="0 Alerts" isPositive={true} icon={<CheckCircle2 className="w-5 h-5" />} subtitle="Clean Conduct Record" />
        <KPICard title="Upcoming Mid-Terms" value="2 Exams" isPositive={true} icon={<CalendarIcon className="w-5 h-5" />} subtitle="Starts Aug 15" />
      </div>

      {/* SECTION 3: Performance & Attendance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Child Monthly Attendance Progress" subtitle="Month-by-month attendance percentage tracking for Amaan Khan" />
        <ChartPlaceholder title="Semester Exam Performance Trend" subtitle="GPA progression and grade distribution over academic terms" />
      </div>

      {/* SECTION 4: Fee Receipts & Payment Audit */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" /> Recent Fee Payment Receipts & Audits
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            Account Up-to-Date
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Receipt Number</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Amount Paid</th>
                <th className="pb-3 font-semibold">Date Paid</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentPayments.map((p, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-indigo-300">{p.receipt}</td>
                  <td className="py-3 font-semibold text-white">{p.title}</td>
                  <td className="py-3 font-mono font-bold text-white">{p.amount}</td>
                  <td className="py-3 font-mono text-slate-400">{p.date}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 ml-auto">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Institutional Announcements & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnouncementPanel />
        <CalendarWidget />
      </div>
    </div>
  );
};
