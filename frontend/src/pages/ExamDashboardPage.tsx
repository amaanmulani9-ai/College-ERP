import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Calendar, Ticket, UserCheck, Layers, Plus, ArrowRight, ShieldCheck } from "lucide-react";
import { examService, ExamItem, ExamScheduleItem, HallTicketItem } from "../services/examService";

export const ExamDashboardPage: React.FC = () => {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>([]);
  const [hallTickets, setHallTickets] = useState<HallTicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [examRes, schedRes, htRes] = await Promise.all([
          examService.listExams(),
          examService.listSchedules(),
          examService.listHallTickets(),
        ]);
        setExams(examRes.data.results ?? (examRes.data as unknown as ExamItem[]));
        setSchedules(schedRes.data.results ?? (schedRes.data as unknown as ExamScheduleItem[]));
        setHallTickets(htRes.data.results ?? (htRes.data as unknown as HallTicketItem[]));
      } catch (err) {
        console.error("Failed to load exam dashboard data", err);
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
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 rounded-2xl border border-blue-500/20 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Award className="w-7 h-7 text-blue-400" />
            Enterprise Examination Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            End-to-end exam planning, conflict-free room scheduling, hall ticket issuance & invigilator management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/examinations/hall-tickets"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
          >
            <Ticket className="w-4 h-4" />
            Generate Hall Tickets
          </Link>
          <Link
            to="/examinations/schedules"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            Exam Schedules
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Examinations</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{exams.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Scheduled & active exams</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Exam Hall Slots</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{schedules.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Room & time allocations</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Issued Hall Tickets</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{hallTickets.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Verified student admit passes</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Invigilator Duties</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {schedules.filter((s) => s.invigilator).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Assigned faculty supervisors</p>
        </div>
      </div>

      {/* Active Exams Roster */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Published Examination Roster
          </h2>
          <span className="text-xs text-slate-400">Active session exams</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Subject Code</th>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Exam Type</th>
                <th className="p-3">Program</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {exams.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-blue-300">{ex.subject_detail?.code || ex.subject}</td>
                  <td className="p-3 font-bold text-white">{ex.subject_detail?.name || "Subject"}</td>
                  <td className="p-3 text-purple-300 font-semibold">{ex.exam_type_detail?.name || ex.exam_type}</td>
                  <td className="p-3 text-slate-400">{ex.program_detail?.code || "BSCS"}</td>
                  <td className="p-3 font-mono text-slate-300">
                    {ex.start_date} to {ex.end_date}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-bold text-[10px] uppercase">
                      {ex.status_display}
                    </span>
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
