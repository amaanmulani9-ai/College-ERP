import React from "react";
import { LayoutDashboard, Sliders, BarChart3, Bell, User } from "lucide-react";
import { useMobile, MobileTab } from "./useMobile";

interface TabItem {
  id: MobileTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const DEFAULT_TABS: TabItem[] = [
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { id: "workspace",     label: "Workspace",     icon: Sliders         },
  { id: "reports",       label: "Reports",       icon: BarChart3       },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 3  },
  { id: "profile",       label: "Profile",       icon: User            },
];

export const MobileBottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useMobile();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around select-none"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)" }}
    >
      {DEFAULT_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            className={`relative flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
              isActive
                ? "text-indigo-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute -top-1.5 w-8 h-1 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
            )}

            <div className="relative mb-0.5">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 bg-rose-600 text-white text-[8px] font-bold font-mono rounded-full flex items-center justify-center border border-slate-900">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className={`text-[10px] tracking-tight truncate max-w-[64px] ${isActive ? "text-indigo-300 font-bold" : "text-slate-400 font-medium"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
