import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Layers,
  PieChart as PieIcon,
  Plus,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { admissionService, AdmissionsDashboardStats } from "../services/admissionService";

export const AdmissionsDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdmissionsDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await admissionService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admissions dashboard stats", err);
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

  const getStatusBadgeColor = (st: string) => {
    switch (st) {
      case "approved":
      case "enrolled":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "rejected":
      case "cancelled":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "submitted":
      case "under_review":
      case "document_verification":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-700/50 text-slate-300 border-slate-600/30";
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-400" />
            Admissions & Enrollment Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage prospective student applications, seat allocations, document verifications & automated enrollment pipelines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admissions/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
          <Link
            to="/admissions/applications"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            View Roster
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Applications</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats?.total_applications ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">All applicant cycles</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Verification</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats?.pending_documents ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Documents awaiting review</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Seats Occupied</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats?.occupied_seats ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Out of {stats?.total_seats ?? 0} total capacity ({stats?.available_seats ?? 0} remaining)
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Seat Utilization</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {stats?.total_seats && stats.total_seats > 0
              ? `${Math.round((stats.occupied_seats / stats.total_seats) * 100)}%`
              : "N/A"}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Overall fill rate across categories</p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Card */}
        <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Application Status Breakdown
            </h2>
            <span className="text-xs text-slate-500">{stats?.status_breakdown.length ?? 0} states</span>
          </div>

          <div className="space-y-2.5">
            {stats?.status_breakdown && stats.status_breakdown.length > 0 ? (
              stats.status_breakdown.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80"
                >
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${getStatusBadgeColor(
                      item.status
                    )}`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                  <span className="text-sm font-bold text-white font-mono">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs text-center py-6">No applications submitted yet.</p>
            )}
          </div>
        </div>

        {/* Program Breakdown Card */}
        <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Program Applications Demand
            </h2>
            <span className="text-xs text-slate-500">{stats?.program_breakdown.length ?? 0} programs</span>
          </div>

          <div className="space-y-2.5">
            {stats?.program_breakdown && stats.program_breakdown.length > 0 ? (
              stats.program_breakdown.map((prog) => (
                <div
                  key={prog.program__name}
                  className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80"
                >
                  <span className="text-xs font-medium text-slate-300">{prog.program__name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((prog.count / (stats.total_applications || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white font-mono">{prog.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs text-center py-6">No program statistics available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
