import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, UserCheck, Calendar, PieChart, Lock, QrCode, Plus, ArrowRight } from "lucide-react";
import { attendanceService, AttendanceSessionItem } from "../services/attendanceService";

export const AttendanceDashboardPage: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSessionItem[]>([]);
  const [dailyReport, setDailyReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [sessRes, repRes] = await Promise.all([
          attendanceService.listSessions(),
          attendanceService.getDailyReport(),
        ]);
        setSessions(sessRes.data.results ?? (sessRes.data as unknown as AttendanceSessionItem[]));
        setDailyReport(repRes.data);
      } catch (err) {
        console.error("Failed to load attendance dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[600px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 rounded-2xl border border-emerald-500/20 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <CheckSquare className="w-7 h-7 text-emerald-400" />
            Enterprise Attendance Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Student & Faculty daily marking, QR session readiness, session locking, and percentage analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/attendance/take"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Take Attendance
          </Link>
          <Link
            to="/attendance/reports"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            Reports & Analytics
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Sessions Conducted</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{sessions.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Recorded attendance sessions</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's Present Students</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{dailyReport?.present_students ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Out of {dailyReport?.total_student_records ?? 0} marked</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's Absent Students</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{dailyReport?.absent_students ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Unexcused absentees today</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">QR Tokens Generated</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {sessions.filter((s) => s.qr_token).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Ready for contactless verification</p>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Recent Attendance Sessions
          </h2>
          <span className="text-xs text-slate-400">Showing latest sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Faculty</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Lock State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-white">{s.date}</td>
                  <td className="p-3 text-indigo-300 font-bold">{s.subject_detail?.code || s.subject}</td>
                  <td className="p-3 text-slate-300">
                    {s.faculty_detail?.profile?.first_name} {s.faculty_detail?.profile?.last_name}
                  </td>
                  <td className="p-3 text-slate-400 font-mono">
                    {s.start_time} - {s.end_time}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-[10px] uppercase">
                      {s.status_display}
                    </span>
                  </td>
                  <td className="p-3">
                    {s.is_locked ? (
                      <span className="flex items-center gap-1 text-amber-400 text-[11px] font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Open</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
