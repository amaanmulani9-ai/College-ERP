import React from "react";
import { Info, Globe, GitBranch, Monitor, Building2 } from "lucide-react";

const INFO_SECTIONS = [
  {
    title: "Platform Versions",
    icon: GitBranch,
    color: "text-indigo-400",
    items: [
      { label: "ERP Platform Version",    value: "v0.34.0-ui-settings-part5" },
      { label: "Django REST Framework",   value: "5.1.4" },
      { label: "Python Runtime",          value: "3.12.4" },
      { label: "PostgreSQL",              value: "16.3" },
      { label: "Redis",                   value: "7.2.4" },
      { label: "Celery",                  value: "5.4.0" },
      { label: "React",                   value: "18.3.1" },
      { label: "Node.js",                 value: "22.4.0 LTS" },
    ],
  },
  {
    title: "Environment",
    icon: Globe,
    color: "text-emerald-400",
    items: [
      { label: "Environment",              value: "Production" },
      { label: "Deployment Region",        value: "ap-south-1 (Mumbai)" },
      { label: "Build Commit SHA",         value: "a4f8c3d9e12b" },
      { label: "Build Timestamp",          value: "2026-08-02 14:00 UTC" },
      { label: "CI/CD Pipeline",           value: "GitHub Actions" },
      { label: "Container Runtime",        value: "Docker 26.1.4" },
      { label: "Orchestration",            value: "Docker Compose" },
    ],
  },
  {
    title: "Tenant & License",
    icon: Building2,
    color: "text-amber-400",
    items: [
      { label: "Tenant Name",             value: "National Institute of Technology & Science" },
      { label: "Tenant ID",               value: "nits-prod-tenant-001" },
      { label: "License Type",            value: "Enterprise — Unlimited Users" },
      { label: "License Expiry",          value: "2027-08-01" },
      { label: "Support Tier",            value: "Priority (24x7)" },
      { label: "Data Residency",          value: "India (in-country)" },
    ],
  },
  {
    title: "Client Environment",
    icon: Monitor,
    color: "text-cyan-400",
    items: [
      { label: "Browser",                 value: typeof navigator !== "undefined" ? navigator.userAgent.split(" ").slice(-1)[0] : "—" },
      { label: "Screen Resolution",       value: typeof window !== "undefined" ? `${window.screen.width}×${window.screen.height}` : "—" },
      { label: "Viewport",                value: typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}px` : "—" },
      { label: "Color Depth",             value: typeof screen !== "undefined" ? `${screen.colorDepth}-bit` : "—" },
      { label: "Connection Type",         value: (navigator as any).connection?.effectiveType ?? "unknown" },
    ],
  },
];

export const SystemInformationPage: React.FC = () => (
  <div className="space-y-4 text-xs font-sans">
    {/* Header */}
    <div className="flex items-center gap-2 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
      <Info className="w-5 h-5 text-indigo-400" />
      <div>
        <h2 className="text-sm font-bold text-slate-100">System Information</h2>
        <p className="text-[10px] text-slate-500">Platform version, environment, tenant details, and client diagnostics.</p>
      </div>
    </div>

    {/* Info Sections */}
    {INFO_SECTIONS.map((section) => (
      <div key={section.title} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <section.icon className={`w-4 h-4 ${section.color}`} />
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">{section.title}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {section.items.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500">{item.label}</span>
              <span className="text-[10px] font-bold font-mono text-slate-200">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
