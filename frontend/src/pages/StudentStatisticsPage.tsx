import React, { useEffect, useState } from "react";
import { BarChart3, Users, CheckCircle, ShieldAlert, GraduationCap } from "lucide-react";
import { studentService } from "../services/studentService";

export const StudentStatisticsPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService
      .getDashboardSummary()
      .then((data) => setSummary(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Student Population Analytics
        </h1>
        <p className="text-xs text-slate-400">Institutional student enrollment breakdown & department metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{summary?.total_students || 0}</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Status</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{summary?.active_students || 0}</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Suspended</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">{summary?.suspended_students || 0}</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Graduated Alumni</span>
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400">{summary?.graduated_students || 0}</p>
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Active Students by Department</h2>
        <div className="space-y-3">
          {summary?.department_breakdown?.map((item: any) => (
            <div key={item.department__name} className="flex items-center justify-between text-xs p-2 bg-slate-950 rounded border border-slate-800">
              <span className="font-medium text-slate-200">{item.department__name || "Unassigned Department"}</span>
              <span className="font-mono text-indigo-400 font-bold">{item.count} Students</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
