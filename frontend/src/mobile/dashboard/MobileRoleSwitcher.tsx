import React, { useState } from "react";
import { UserCheck, Shield, GraduationCap, Users, User, Heart, ChevronDown, Check } from "lucide-react";

export type RoleType = "superadmin" | "principal" | "hod" | "teacher" | "student" | "parent";

export interface RoleConfig {
  id: RoleType;
  title: string;
  badge: string;
  icon: React.ElementType;
  color: string;
}

export const ROLES: RoleConfig[] = [
  { id: "superadmin", title: "Super Admin", badge: "HQ",       icon: Shield,        color: "text-rose-400" },
  { id: "principal",  title: "Principal",   badge: "Executive",icon: UserCheck,     color: "text-purple-400" },
  { id: "hod",        title: "HOD",         badge: "Dept Head", icon: GraduationCap, color: "text-indigo-400" },
  { id: "teacher",    title: "Teacher",     badge: "Faculty",  icon: Users,         color: "text-blue-400" },
  { id: "student",    title: "Student",     badge: "Enrolled", icon: User,          color: "text-emerald-400" },
  { id: "parent",     title: "Parent",      badge: "Guardian", icon: Heart,         color: "text-amber-400" },
];

interface MobileRoleSwitcherProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
}

export const MobileRoleSwitcher: React.FC<MobileRoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeRoleConfig = ROLES.find((r) => r.id === currentRole) ?? ROLES[0];
  const Icon = activeRoleConfig.icon;

  return (
    <div className="relative font-sans text-xs select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 active:scale-98 transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
            <Icon className={`w-4 h-4 ${activeRoleConfig.color}`} />
          </div>
          <div className="text-left min-w-0">
            <p className="font-bold text-slate-100 text-[11px] truncate">{activeRoleConfig.title} View</p>
            <span className="text-[9px] font-mono text-slate-400 uppercase">{activeRoleConfig.badge} Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded uppercase">
            Switch Role
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Role Picker Dropdown Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <p className="px-3 py-1.5 text-[9px] font-bold font-mono text-slate-500 uppercase border-b border-slate-800">
            Select Active Dashboard Role
          </p>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {ROLES.map((r) => {
              const RIcon = r.icon;
              const isSelected = r.id === currentRole;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    onRoleChange(r.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 font-bold"
                      : "bg-slate-950 text-slate-300 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <RIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : r.color}`} />
                    <span className="text-[11px] truncate">{r.title}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
