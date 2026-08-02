import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  StatList,
  DataTable,
  StatusBadge,
  Button,
  InlineAlert,
  ColumnDef,
} from "../../design-system";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Award,
  Users,
  TrendingUp,
  FileCheck,
  Calendar,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DriveSummary {
  id: string;
  drive_code: string;
  company_name: string;
  job_role: string;
  ctc: number;
  mode: string;
  drive_date: string;
  status: string;
}

export const PlacementDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    registered_companies: 42,
    active_campus_drives: 8,
    eligible_students: 450,
    total_applications: 1240,
    selected_students: 315,
    placement_percentage: 70.0,
    highest_package: 4500000,
    average_package: 850000,
    total_internships: 180,
  });

  const [recentDrives] = useState<DriveSummary[]>([
    { id: "1", drive_code: "DRV-2026-GOOG", company_name: "Google India Ltd", job_role: "Software Development Engineer (SDE-1)", ctc: 3200000, mode: "Hybrid", drive_date: "2026-08-15", status: "Registration Open" },
    { id: "2", drive_code: "DRV-2026-MSFT", company_name: "Microsoft R&D", job_role: "Cloud Solution Architect Intern / FTE", ctc: 2800000, mode: "Online", drive_date: "2026-08-20", status: "Upcoming" },
    { id: "3", drive_code: "DRV-2026-AMZN", company_name: "Amazon Web Services", job_role: "Systems Development Engineer", ctc: 2400000, mode: "Offline", drive_date: "2026-07-28", status: "In Progress" },
  ]);

  useEffect(() => {
    fetch("/api/placement/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<DriveSummary>[] = [
    { key: "drive_code", header: "Drive Code", sortable: true },
    { key: "company_name", header: "Company Name", sortable: true },
    { key: "job_role", header: "Job Role / Title" },
    { key: "ctc", header: "CTC Package (₹)", accessor: (r) => `₹${(r.ctc / 100000).toFixed(2)} LPA` },
    { key: "mode", header: "Mode" },
    { key: "drive_date", header: "Drive Date" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={
            r.status === "Registration Open"
              ? "success"
              : r.status === "In Progress"
              ? "warning"
              : "info"
          }
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Training & Placement Cell"
        subtitle="Campus recruitment drives, student applications, interview schedules, offer tracking & career development"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/placement/companies">
              <Button variant="ghost" leftIcon={<Building2 className="w-4 h-4" />}>
                Company Directory
              </Button>
            </Link>
            <Link to="/placement/drives">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Create Campus Drive
              </Button>
            </Link>
          </div>
        }
      />

      <InlineAlert variant="info" title="Campus Placement Season 2025-2026 Active">
        Registration is currently open for {kpis.active_campus_drives} corporate recruitment drives. Current placement placement rate is {kpis.placement_percentage}% with highest package at ₹{(kpis.highest_package / 100000).toFixed(2)} LPA.
      </InlineAlert>

      <StatList
        stats={[
          { label: "Registered Companies", value: kpis.registered_companies },
          { label: "Active Campus Drives", value: kpis.active_campus_drives },
          { label: "Placed Students", value: kpis.selected_students },
          { label: "Placement Rate", value: `${kpis.placement_percentage}%` },
          { label: "Highest Package", value: `₹${(kpis.highest_package / 100000).toFixed(2)} LPA` },
          { label: "Average CTC", value: `₹${(kpis.average_package / 100000).toFixed(2)} LPA` },
        ]}
      />

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Link to="/placement/applications" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-600/10 text-indigo-400"><FileCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Applications</h4>
            <p className="text-xs text-slate-400">Student Drive Submissions</p>
          </div>
        </Link>
        <Link to="/placement/interviews" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-600/10 text-amber-400"><Calendar className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Interviews</h4>
            <p className="text-xs text-slate-400">Rounds & Panel Feedback</p>
          </div>
        </Link>
        <Link to="/placement/offers" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-400"><Award className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Offer Letters</h4>
            <p className="text-xs text-slate-400">Packages & Acceptances</p>
          </div>
        </Link>
        <Link to="/placement/statistics" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-600/10 text-purple-400"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Analytics</h4>
            <p className="text-xs text-slate-400">CTC & Dept Statistics</p>
          </div>
        </Link>
      </div>

      <DataTable
        title="Active Campus Recruitment Drives"
        data={recentDrives}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
