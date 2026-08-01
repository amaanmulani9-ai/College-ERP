import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Database,
  Users,
  CheckCircle2,
  Cpu,
  BarChart2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      category: "SaaS Multi-Tenancy Architecture",
      items: [
        { title: "PostgreSQL Schema Isolation", desc: "Each tenant institution operates on an isolated DB schema managed via django-tenants." },
        { title: "Custom Subdomains & Domains", desc: "Support for custom institutional hostnames (e.g., demo.college-erp.com or erp.stanford.edu)." },
        { title: "Tenant Lifecycle Automation", desc: "Automated tenant schema creation, default role seeding, and isolated media storage." },
      ],
    },
    {
      category: "Security & Role-Based Access Control",
      items: [
        { title: "14 Pre-Built Institutional Roles", desc: "System Admin, Registrar, Dean, HOD, Faculty, Accountant, Warden, Student, Parent, etc." },
        { title: "Redis Permission Caching", desc: "Permissions evaluated in <1ms using Redis key caching (`rbac:<schema>:user:<id>:permissions`)." },
        { title: "Brute-Force Lockout Protection", desc: "Automatic 15-minute account lockout after 5 consecutive failed login attempts." },
      ],
    },
    {
      category: "Academic & Financial Automation",
      items: [
        { title: "Auto Student & Staff IDs", desc: "Deterministic format (`ERP-YEAR-PROGRAM-SEQUENCE`) with conflict-safe sequences." },
        { title: "Razorpay & Stripe Gateway", desc: "Integrated payment gateways with webhook verification, receipt generation, and refund audits." },
        { title: "Hostel & Room Allocation", desc: "Integrated hostel fee billing, warden management, maintenance ticketing, and vacancy reports." },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          Platform Capabilities
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Enterprise Features Designed for{" "}
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Scale & Compliance
          </span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Detailed technical overview of CampusPro ERP's architectural stack and automated workflows.
        </p>
      </div>

      <div className="space-y-12">
        {featureList.map((sec, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              {sec.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sec.items.map((item, i) => (
                <div key={i} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link
          to="/modules"
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/25 inline-flex items-center gap-2"
        >
          Explore All 20 Functional Modules <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
