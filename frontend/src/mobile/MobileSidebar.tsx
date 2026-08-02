import React from "react";
import { LayoutDashboard, Sliders, BarChart3, Settings, Shield } from "lucide-react";
import { useMobile } from "./useMobile";

export const MobileSidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useMobile();

  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "workspace", label: "Workspace", icon: Sliders },
    { id: "reports",   label: "Reports",   icon: BarChart3 },
    { id: "settings",  label: "Settings",  icon: Settings },
    { id: "security",  label: "Security",  icon: Shield },
  ];

  return (
    <aside aria-label="Mobile Navigation Rail" className="hidden sm:flex flex-col w-16 bg-slate-900 border-r border-slate-800 py-3 items-center gap-4 select-none shrink-0">
      <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-mono text-sm mb-2">
        N
      </div>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </aside>
  );
};
