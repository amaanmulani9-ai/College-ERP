import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  UserCheck,
  CreditCard,
  BookOpen,
  Building,
  Activity,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Database,
  Server,
  Zap,
  HardDrive,
  Mail,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SEOHead } from "../../components/public/SEOHead";
import { KPICard } from "../../components/dashboard/widgets/KPICard";
import { ChartPlaceholder } from "../../components/dashboard/widgets/ChartPlaceholder";
import { QuickActions } from "../../components/dashboard/widgets/QuickActions";
import { ActivityFeed } from "../../components/dashboard/widgets/ActivityFeed";
import { AnnouncementPanel } from "../../components/dashboard/widgets/AnnouncementPanel";
import { CalendarWidget } from "../../components/dashboard/widgets/CalendarWidget";

export const SuperAdminDashboardPage: React.FC = () => {
  const { user, tenant } = useAuth();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tenantsList = [
    { name: "Stanford Institute of Technology", schema: "tenant_stanford", plan: "Enterprise SaaS", status: "Active", health: "99.99%", users: "1,250", expiry: "2027-12-31" },
    { name: "Oxford Global Academy", schema: "tenant_oxford", plan: "Professional Tier", status: "Active", health: "99.98%", users: "850", expiry: "2026-11-30" },
    { name: "MIT Engineering Campus", schema: "tenant_mit", plan: "Enterprise SaaS", status: "Active", health: "100.0%", users: "2,100", expiry: "2028-05-15" },
    { name: "Cambridge International College", schema: "tenant_cambridge", plan: "Starter Plan", status: "Pending Sync", health: "98.50%", users: "340", expiry: "2026-09-01" },
  ];

  const systemHealth = [
    { service: "Django REST API Core", status: "Healthy", latency: "12ms", icon: <Server className="w-4 h-4 text-emerald-400" /> },
    { service: "PostgreSQL 16 Cluster", status: "Healthy", latency: "4ms", icon: <Database className="w-4 h-4 text-emerald-400" /> },
    { service: "Redis Permission Cache", status: "Healthy", latency: "1ms", icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { service: "S3 Object Storage", status: "Healthy", latency: "24ms", icon: <HardDrive className="w-4 h-4 text-emerald-400" /> },
    { service: "Celery Worker Queue", status: "Healthy", latency: "8ms", icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { service: "SMTP Email Service", status: "Healthy", latency: "45ms", icon: <Mail className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <SEOHead title="Super Admin Dashboard" description="SaaS Platform Super Admin Executive Operations Control Panel." />

      {/* SECTION 1: Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                SUPER ADMIN PLATFORM CONTROL
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Services Operational
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.first_name || "Super Admin"}!
            </h1>

            <p className="text-xs text-slate-300">
              {currentDate} • Session: <strong className="text-white font-mono">AY 2026-2027</strong> • Current Schema: <strong className="text-indigo-300 font-mono">{tenant || "stanford-demo"}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Provision New Tenant
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors">
              Add Global Admin
            </button>
            <button className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors">
              Platform Settings
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Global KPI Cards (9 Metrics Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPICard
          title="Active College Tenants"
          value="24 Colleges"
          change="+12.5%"
          isPositive={true}
          icon={<Building2 className="w-5 h-5" />}
          subtitle="4 Pending Provisioning"
        />
        <KPICard
          title="Total Registered Students"
          value="48,250"
          change="+8.4%"
          isPositive={true}
          icon={<Users className="w-5 h-5" />}
          subtitle="Across all active schemas"
        />
        <KPICard
          title="Faculty & Teaching Staff"
          value="3,420"
          change="+4.1%"
          isPositive={true}
          icon={<UserCheck className="w-5 h-5" />}
          subtitle="14 Granular RBAC Roles"
        />
        <KPICard
          title="Total SaaS ARR Revenue"
          value="$1.48M"
          change="+18.2%"
          isPositive={true}
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="SaaS Subscription Billing"
        />
        <KPICard
          title="Outstanding Fee Collections"
          value="$142.8K"
          change="-5.2%"
          isPositive={true}
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="Pending student fee dues"
        />
        <KPICard
          title="Library Catalog Items"
          value="185,000"
          change="+6.0%"
          isPositive={true}
          icon={<BookOpen className="w-5 h-5" />}
          subtitle="Physical & digital e-books"
        />
        <KPICard
          title="Hostel Bed Occupancy"
          value="94.2%"
          change="+2.1%"
          isPositive={true}
          icon={<Building className="w-5 h-5" />}
          subtitle="3,850 of 4,080 beds occupied"
        />
        <KPICard
          title="Platform Uptime SLA"
          value="99.99%"
          change="0.00%"
          isPositive={true}
          icon={<Activity className="w-5 h-5" />}
          subtitle="Target 99.9% achieved"
        />
      </div>

      {/* SECTION 3: Quick Action Grid */}
      <QuickActions />

      {/* SECTION 4: Analytics Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          title="Global Student Admissions & Enrollment Trend"
          subtitle="Monthly new student registrations across all multi-tenant schemas"
        />
        <ChartPlaceholder
          title="SaaS Subscription & Fee Collection Analytics"
          subtitle="Aggregated platform financial performance and payment gateway throughput"
        />
      </div>

      {/* SECTION 5: Tenant Overview Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" /> Active SaaS Tenant Provisioning Matrix
            </h3>
            <p className="text-xs text-slate-400">PostgreSQL Schema-isolated institutional tenants</p>
          </div>
          <button className="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1">
            View All Tenants <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Institution Name</th>
                <th className="pb-3 font-semibold">Schema Identifier</th>
                <th className="pb-3 font-semibold">Plan</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Health SLA</th>
                <th className="pb-3 font-semibold">Active Users</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {tenantsList.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-semibold text-white">{t.name}</td>
                  <td className="py-3.5 font-mono text-indigo-300">{t.schema}</td>
                  <td className="py-3.5">{t.plan}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-emerald-400">{t.health}</td>
                  <td className="py-3.5 font-mono">{t.users}</td>
                  <td className="py-3.5 text-right">
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

      {/* SECTION 6: System Health & Infrastructure Monitoring */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Platform Infrastructure Health Monitors
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {systemHealth.map((sh, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {sh.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{sh.service}</span>
                  <span className="text-[10px] font-mono text-slate-400">Latency: {sh.latency}</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                {sh.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7: Activity, Announcements & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed />
        <AnnouncementPanel />
        <CalendarWidget />
      </div>
    </div>
  );
};
