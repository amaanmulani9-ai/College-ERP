import React, { useEffect, useState } from "react";
import { PieChart, Calendar, UserCheck, RefreshCw } from "lucide-react";
import { attendanceService } from "../services/attendanceService";

export const AttendanceReportsPage: React.FC = () => {
  const [dailyData, setDailyData] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [dailyRes, monthlyRes] = await Promise.all([
        attendanceService.getDailyReport(),
        attendanceService.getMonthlyReport(),
      ]);
      setDailyData(dailyRes.data);
      setMonthlyData(monthlyRes.data);
    } catch (err) {
      console.error("Failed to load attendance reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[600px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PieChart className="w-6 h-6 text-indigo-400" />
            Institutional Attendance Reports & Analytics
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Aggregated attendance metrics across daily sessions and monthly period summaries.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Summary */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Daily Summary ({dailyData?.date})
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl">
              <span className="text-slate-400">Total Sessions Today</span>
              <span className="font-extrabold text-white">{dailyData?.total_sessions}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl">
              <span className="text-slate-400">Present Student Records</span>
              <span className="font-extrabold text-emerald-400">{dailyData?.present_students}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl">
              <span className="text-slate-400">Absent Student Records</span>
              <span className="font-extrabold text-rose-400">{dailyData?.absent_students}</span>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Monthly Overview ({monthlyData?.year}-{monthlyData?.month})
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl">
              <span className="text-slate-400">Total Sessions Conducted</span>
              <span className="font-extrabold text-white">{monthlyData?.total_sessions}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl">
              <span className="text-slate-400">Average Monthly Attendance Rate</span>
              <span className="font-extrabold text-indigo-400">{monthlyData?.average_percentage}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl">
              <span className="text-slate-400">Excused / Leave Records</span>
              <span className="font-extrabold text-amber-400">{monthlyData?.excused_records}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
