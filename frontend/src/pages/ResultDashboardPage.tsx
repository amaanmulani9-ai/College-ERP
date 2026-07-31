import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, FileText, CheckCircle2, TrendingUp, Layers, Plus, ArrowRight, Award } from "lucide-react";
import { resultService, SemesterResultItem, StudentResultItem } from "../services/resultService";

export const ResultDashboardPage: React.FC = () => {
  const [semResults, setSemResults] = useState<SemesterResultItem[]>([]);
  const [studentResults, setStudentResults] = useState<StudentResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [semRes, stdRes] = await Promise.all([
          resultService.listSemesterResults(),
          resultService.listStudentResults(),
        ]);
        setSemResults(semRes.data.results ?? (semRes.data as unknown as SemesterResultItem[]));
        setStudentResults(stdRes.data.results ?? (stdRes.data as unknown as StudentResultItem[]));
      } catch (err) {
        console.error("Failed to load result dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[600px]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const publishedCount = semResults.filter((s) => s.is_published).length;
  const avgCgpa =
    semResults.length > 0
      ? (semResults.reduce((acc, curr) => acc + curr.cgpa, 0) / semResults.length).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-900/60 via-slate-900 to-slate-900 rounded-2xl border border-amber-500/20 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-400" />
            Enterprise Result Management Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Marks entry, automatic grade & credit point calculation, SGPA/CGPA processing, rank generation & publishing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/results/entry"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Enter Marks
          </Link>
          <Link
            to="/results/publish"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            Publish Results
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Subject Marks Entered</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{studentResults.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Graded subject records</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Published Semester Results</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{publishedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Out of {semResults.length} calculated</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Institutional CGPA</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{avgCgpa}</p>
          <p className="text-[11px] text-slate-500 mt-1">Cumulative grade point avg</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Ranked Students</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {semResults.filter((s) => s.rank).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Batch merit ranks assigned</p>
        </div>
      </div>

      {/* Published Semester Results Roster */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Semester Results & SGPA Summary
          </h2>
          <span className="text-xs text-slate-400">Calculated semester records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Student ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Semester</th>
                <th className="p-3">SGPA</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {semResults.map((sr) => (
                <tr key={sr.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-amber-400">#{sr.rank || "-"}</td>
                  <td className="p-3 font-mono font-semibold text-indigo-300">
                    {sr.student_detail?.student_id || sr.student}
                  </td>
                  <td className="p-3 font-bold text-white">
                    {sr.student_detail?.profile?.first_name} {sr.student_detail?.profile?.last_name}
                  </td>
                  <td className="p-3 text-slate-300">{sr.semester_detail?.name || sr.semester}</td>
                  <td className="p-3 font-mono font-extrabold text-emerald-400">{sr.sgpa.toFixed(2)}</td>
                  <td className="p-3 font-mono font-extrabold text-amber-300">{sr.cgpa.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-[10px] uppercase">
                      {sr.result_status_display}
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
