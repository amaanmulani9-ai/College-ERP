import React from "react";
import {
  X, LayoutDashboard, Sliders, BarChart3, Settings, Shield,
  GraduationCap, Users, BookOpen, Building2, HelpCircle, LogOut,
  ChevronRight, Sparkles, AlertCircle, HardDrive, Bell,
} from "lucide-react";
import { useMobile } from "./useMobile";

interface DrawerItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category: "main" | "academic" | "admin" | "tools";
}

const DRAWER_ITEMS: DrawerItem[] = [
  { id: "dashboard",     label: "Executive Dashboard", icon: LayoutDashboard, category: "main" },
  { id: "workspace",     label: "Workspace Hub",       icon: Sliders, badge: "UI-005", category: "main" },
  { id: "reports",       label: "Reporting Center",    icon: BarChart3, badge: "UI-006", category: "main" },
  { id: "academics",     label: "Academic Management", icon: GraduationCap, category: "academic" },
  { id: "students",      label: "Student Directory",   icon: Users, category: "academic" },
  { id: "library",       label: "Library System",      icon: BookOpen, category: "academic" },
  { id: "hostel",        label: "Hostel & Transport",  icon: Building2, category: "academic" },
  { id: "rbac",          label: "Security & IAM",      icon: Shield, category: "admin" },
  { id: "settings",      label: "Enterprise Settings", icon: Settings, badge: "UI-007", category: "admin" },
  { id: "system",        label: "System Health",       icon: HardDrive, category: "tools" },
  { id: "ai",            label: "AI Copilot Workspace",icon: Sparkles, category: "tools" },
];

export const MobileDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, setActiveTab } = useMobile();

  if (!isDrawerOpen) return null;

  const navigateTo = (tabId: string) => {
    setActiveTab(tabId);
    closeDrawer();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Drawer"
      className="fixed inset-0 z-50 flex animate-in fade-in duration-200"
    >
      {/* Backdrop overlay */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between z-10 shadow-2xl overflow-y-auto text-xs font-sans">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-mono text-sm">
              N
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">NITS ERP</h3>
              <p className="text-[10px] text-slate-500 font-mono">Enterprise v0.35.0</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close drawer"
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-3 mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-indigo-300">
              AK
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-100 truncate text-[11px]">Amaan Khan</p>
            <span className="text-[9px] font-bold font-mono text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800 uppercase">
              Super Admin
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-3 space-y-4">
          {/* Main */}
          <div>
            <p className="px-2 mb-1.5 text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">
              Core Platform
            </p>
            <div className="space-y-1">
              {DRAWER_ITEMS.filter((i) => i.category === "main").map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-slate-100 transition-colors text-left font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-indigo-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Academic */}
          <div>
            <p className="px-2 mb-1.5 text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">
              Academic Modules
            </p>
            <div className="space-y-1">
              {DRAWER_ITEMS.filter((i) => i.category === "academic").map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-slate-100 transition-colors text-left font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Admin */}
          <div>
            <p className="px-2 mb-1.5 text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">
              Administration
            </p>
            <div className="space-y-1">
              {DRAWER_ITEMS.filter((i) => i.category === "admin").map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-slate-100 transition-colors text-left font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-purple-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold font-mono bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
          <button
            onClick={() => navigateTo("settings")}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors text-[11px]"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help & Feedback</span>
          </button>
          <button
            onClick={closeDrawer}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors font-bold text-[11px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
