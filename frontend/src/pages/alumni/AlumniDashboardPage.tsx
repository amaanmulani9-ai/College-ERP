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
  Users,
  Award,
  HeartHandshake,
  Calendar,
  Briefcase,
  Globe,
  Plus,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AlumniSummary {
  id: string;
  alumni_id: string;
  student_name: string;
  graduation_year: number;
  current_status: string;
  company_name: string;
}

export const AlumniDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    registered_alumni: 1450,
    active_members: 890,
    mentorship_programs: 12,
    upcoming_events: 5,
    total_donations: 4500000,
    active_campaigns: 4,
    job_referrals: 68,
    success_stories: 34,
  });

  const [recentAlumni] = useState<AlumniSummary[]>([
    { id: "1", alumni_id: "ALU-2022-0192", student_name: "Ananya Sharma", graduation_year: 2022, current_status: "Employed", company_name: "Google LLC (Mountain View)" },
    { id: "2", alumni_id: "ALU-2023-0401", student_name: "Vikram Malhotra", graduation_year: 2023, current_status: "Entrepreneur", company_name: "PayTech Solutions (Founder)" },
    { id: "3", alumni_id: "ALU-2021-0883", student_name: "Rohan Varma", graduation_year: 2021, current_status: "Higher Studies", company_name: "Stanford University (Ph.D.)" },
  ]);

  useEffect(() => {
    fetch("/api/alumni/dashboard/kpis/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKpis((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<AlumniSummary>[] = [
    { key: "alumni_id", header: "Alumni ID", sortable: true },
    { key: "student_name", header: "Alumni Name", sortable: true },
    { key: "graduation_year", header: "Graduation Year", sortable: true },
    {
      key: "current_status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.current_status.toUpperCase()}
          variant={r.current_status === "Employed" ? "success" : r.current_status === "Entrepreneur" ? "info" : "neutral"}
        />
      ),
    },
    { key: "company_name", header: "Organization / Institution" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Institutional Alumni Network Portal"
        subtitle="Alumni directory, membership tiers, career timeline, mentorship matching, events & fundraising"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/alumni/directory">
              <Button variant="ghost" leftIcon={<Globe className="w-4 h-4" />}>
                Alumni Directory
              </Button>
            </Link>
            <Link to="/alumni/donations">
              <Button variant="primary" leftIcon={<HeartHandshake className="w-4 h-4" />}>
                Give Back / Donate
              </Button>
            </Link>
          </div>
        }
      />

      <InlineAlert variant="success" title="Global Alumni Network Operational">
        Connecting {kpis.registered_alumni} registered alumni across {kpis.active_members} active membership tiers. Total fundraising contributions stand at ₹{(kpis.total_donations / 100000).toFixed(2)} Lakhs across {kpis.active_campaigns} active campaigns.
      </InlineAlert>

      <StatList
        stats={[
          { label: "Registered Alumni", value: kpis.registered_alumni },
          { label: "Active Members", value: kpis.active_members },
          { label: "Upcoming Events", value: kpis.upcoming_events },
          { label: "Total Contributions", value: `₹${(kpis.total_donations / 100000).toFixed(2)} L` },
          { label: "Job Referrals", value: kpis.job_referrals },
          { label: "Success Stories", value: kpis.success_stories },
        ]}
      />

      {/* Quick Navigation Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Link to="/alumni/mentorship" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-600/10 text-indigo-400"><Users className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Mentorship</h4>
            <p className="text-xs text-slate-400">Mentor-Mentee Matching</p>
          </div>
        </Link>
        <Link to="/alumni/events" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-400"><Calendar className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Reunions & Events</h4>
            <p className="text-xs text-slate-400">Webinars & Chapter Meets</p>
          </div>
        </Link>
        <Link to="/alumni/job-referrals" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-600/10 text-amber-400"><Briefcase className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Job Referrals</h4>
            <p className="text-xs text-slate-400">Career & Peer Hiring</p>
          </div>
        </Link>
        <Link to="/alumni/success-stories" className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-600/10 text-purple-400"><Award className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Success Stories</h4>
            <p className="text-xs text-slate-400">Featured Spotlights</p>
          </div>
        </Link>
      </div>

      <DataTable
        title="Recently Registered Alumni Directory"
        data={recentAlumni}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
