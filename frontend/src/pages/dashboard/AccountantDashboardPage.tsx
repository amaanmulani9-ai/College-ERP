import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Award,
  CheckCircle2,
  MoreVertical,
  Plus,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { ActivityFeed } from "../../components/dashboard/widgets/ActivityFeed";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const AccountantDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const outstandingFees = [
    { name: "Rahul Sharma", roll: "CS2026-012", program: "B.Tech CSE", amount: "$1,250.00", due: "2026-08-10", status: "Overdue" },
    { name: "Sneha Patel", roll: "ME2026-045", program: "B.Tech ME", amount: "$850.00", due: "2026-08-15", status: "Pending" },
    { name: "Arjun Mehta", roll: "EC2026-089", program: "B.Tech ECE", amount: "$2,100.00", due: "2026-07-31", status: "Overdue" },
    { name: "Priya Kumar", roll: "MBA2026-004", program: "MBA Business", amount: "$3,500.00", due: "2026-08-20", status: "Pending" },
  ];

  const recentTransactions = [
    { receipt: "REC-2026-1021", student: "Amaan Khan", method: "Online/UPI", amount: "$2,450.00", status: "SUCCESS" },
    { receipt: "REC-2026-1020", student: "Divya Rao", method: "DD / Cheque", amount: "$1,200.00", status: "SUCCESS" },
    { receipt: "REC-2026-1019", student: "Karan Singh", method: "Credit Card", amount: "$3,200.00", status: "SUCCESS" },
    { receipt: "REC-2026-1018", student: "Meera Joshi", method: "Online/UPI", amount: "$850.00", status: "PENDING" },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Finance & Accounts Dashboard" description="Institutional Financial Operations Control Panel for Fee Collections." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                FINANCE & ACCOUNTS DESK
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FY 2026-2027 Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.first_name || "Finance"} {user?.last_name || "Officer"}
            </h1>
            <p className="text-xs text-slate-300">
              {currentDate} • Department: <strong className="text-white">Finance & Accounts</strong> • Period: <strong className="text-emerald-300 font-mono">Q2 FY 2026-2027</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Collect Fee Payment
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <Receipt className="w-4 h-4" /> Issue Receipt
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Finance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Fee Collection YTD" value="$1.24M" change="+14.2%" isPositive={true} icon={<DollarSign className="w-5 h-5" />} subtitle="Financial Year 2026-2027" />
        <KPICard title="Today's Collections" value="$48,200" change="+8.0%" isPositive={true} icon={<TrendingUp className="w-5 h-5" />} subtitle="22 Transactions Today" />
        <KPICard title="Pending Fee Dues" value="$142,800" change="-3.2%" isPositive={true} icon={<CreditCard className="w-5 h-5" />} subtitle="284 Students Pending" />
        <KPICard title="Overdue Payments" value="$38,500" change="+1.5%" isPositive={false} icon={<TrendingDown className="w-5 h-5" />} subtitle="Past Due Date" />
        <KPICard title="Scholarships Disbursed" value="$86,400" change="+5.0%" isPositive={true} icon={<Award className="w-5 h-5" />} subtitle="142 Students Awarded" />
        <KPICard title="Refund Requests" value="8 Pending" change="0" isPositive={true} icon={<Receipt className="w-5 h-5" />} subtitle="Under Processing" />
        <KPICard title="Payment Success Rate" value="97.8%" change="+0.4%" isPositive={true} icon={<CheckCircle2 className="w-5 h-5" />} subtitle="Gateway Throughput" />
        <KPICard title="Monthly Revenue" value="$420,000" change="+11.2%" isPositive={true} icon={<DollarSign className="w-5 h-5" />} subtitle="July 2026 Total" />
      </div>

      {/* SECTION 3: Revenue Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Monthly Fee Collection & Revenue Trend" subtitle="Semester-wise fee throughput across all payment gateways" />
        <ChartPlaceholder title="Payment Gateway Performance & Method Breakdown" subtitle="UPI vs Credit Card vs DD transaction success analysis" />
      </div>

      {/* SECTION 4: Outstanding Fees Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-400" /> Outstanding & Overdue Fee List
          </h3>
          <Link to="/payments" className="text-xs text-emerald-400 font-bold hover:text-emerald-300">
            View All Dues →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Student Name (Roll)</th>
                <th className="pb-3 font-semibold">Program</th>
                <th className="pb-3 font-semibold">Amount Due</th>
                <th className="pb-3 font-semibold">Due Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {outstandingFees.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-bold text-white">
                    {row.name} <span className="font-mono text-slate-400 font-normal">({row.roll})</span>
                  </td>
                  <td className="py-3">{row.program}</td>
                  <td className="py-3 font-mono font-bold text-white">{row.amount}</td>
                  <td className="py-3 font-mono text-slate-400">{row.due}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      row.status === "Overdue"
                        ? "bg-red-950 text-red-400 border-red-900"
                        : "bg-amber-950 text-amber-400 border-amber-900"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Recent Transactions */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-400" /> Recent Fee Transaction Ledger
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Receipt No.</th>
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentTransactions.map((tx, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-emerald-300">{tx.receipt}</td>
                  <td className="py-3 font-bold text-white">{tx.student}</td>
                  <td className="py-3 text-slate-400">{tx.method}</td>
                  <td className="py-3 font-mono font-bold text-white">{tx.amount}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      tx.status === "SUCCESS"
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : "bg-amber-950 text-amber-400 border-amber-800"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
