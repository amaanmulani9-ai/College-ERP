import React, { useState } from "react";
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Layers,
  AlertTriangle,
  Target,
  BarChart3,
} from "lucide-react";
import { ExecutiveRole, CrossModuleDomain } from "./types";

interface ExecutiveSidebarProps {
  activeRole: ExecutiveRole;
  onSelectRole: (role: ExecutiveRole) => void;
  activeDomain: CrossModuleDomain | null;
  onSelectDomain: (domain: CrossModuleDomain | null) => void;
}

const ROLES: ExecutiveRole[] = [
  "Super Admin",
  "Principal",
  "Vice Principal",
  "Registrar",
  "HOD",
  "Finance Officer",
  "HR Manager",
  "Library Admin",
  "Transport Manager",
  "Hostel Warden",
  "Placement Officer",
];

const DOMAINS: CrossModuleDomain[] = [
  "Student Lifecycle",
  "Financial Health",
  "Campus Operations",
  "Human Resources",
];

export const ExecutiveSidebar: React.FC<ExecutiveSidebarProps> = ({
  activeRole,
  onSelectRole,
  activeDomain,
  onSelectDomain,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Executive Center Navigation Sidebar"
      className={`relative flex flex-col bg-slate-900/90 border-r border-slate-800 transition-all duration-300 z-20 font-sans text-xs ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Executive Center</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors mx-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 font-medium">
        {/* Leadership Role Dashboards */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Leadership Dashboards ({ROLES.length})
            </div>
          )}
          <div className="space-y-0.5">
            {ROLES.map((r) => {
              const isActive = activeRole === r && activeDomain === null;
              return (
                <button
                  key={r}
                  onClick={() => {
                    onSelectRole(r);
                    onSelectDomain(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white font-bold shadow"
                      : "text-slate-300 hover:bg-slate-800/80"
                  }`}
                  title={r}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <UserCheck className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-indigo-400"}`} />
                    {!collapsed && <span className="truncate">{r}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cross-Module Analytics Domains */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Cross-Module Analytics ({DOMAINS.length})
            </div>
          )}
          <div className="space-y-0.5">
            {DOMAINS.map((d) => {
              const isActive = activeDomain === d;
              return (
                <button
                  key={d}
                  onClick={() => onSelectDomain(d)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-cyan-600 text-white font-bold shadow"
                      : "text-slate-300 hover:bg-slate-800/80"
                  }`}
                  title={d}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Layers className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-cyan-400"}`} />
                    {!collapsed && <span className="truncate">{d}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
