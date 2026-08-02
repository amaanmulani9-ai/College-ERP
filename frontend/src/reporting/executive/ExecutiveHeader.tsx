import React from "react";
import { ShieldCheck, Layers, Calendar, ChevronRight } from "lucide-react";
import { ExecutiveRole, CrossModuleDomain } from "./types";
import { MOCK_ROLE_TITLES } from "./mockExecutiveData";

interface ExecutiveHeaderProps {
  activeRole: ExecutiveRole;
  activeDomain: CrossModuleDomain | null;
  onSelectDomain: (domain: CrossModuleDomain | null) => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  activeRole,
  activeDomain,
  onSelectDomain,
}) => {
  const roleInfo = MOCK_ROLE_TITLES[activeRole] || MOCK_ROLE_TITLES["Super Admin"];

  const domains: { label: CrossModuleDomain; icon: string }[] = [
    { label: "Student Lifecycle", icon: "GraduationCap" },
    { label: "Financial Health", icon: "DollarSign" },
    { label: "Campus Operations", icon: "Building" },
    { label: "Human Resources", icon: "Users" },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 mb-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              Role: {activeRole}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Real-time Leadership Control
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100">{roleInfo.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{roleInfo.focus}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Year 2026-2027</span>
          </div>
        </div>
      </div>

      {/* Cross-Module Domains Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => onSelectDomain(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeDomain === null
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Role View</span>
        </button>

        <span className="text-slate-600 font-mono">|</span>

        {domains.map((d) => {
          const isActive = activeDomain === d.label;
          return (
            <button
              key={d.label}
              onClick={() => onSelectDomain(d.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-cyan-600 text-white shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <span>{d.label} Flow</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
