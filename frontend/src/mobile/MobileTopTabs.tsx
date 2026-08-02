import React from "react";

export interface MobileTopTabItem {
  id: string;
  label: string;
  badge?: string | number;
}

interface MobileTopTabsProps {
  tabs: MobileTopTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const MobileTopTabs: React.FC<MobileTopTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div
      role="tablist"
      aria-label="Sub Navigation Tabs"
      className="w-full bg-slate-900 border-b border-slate-800 px-2 flex items-center gap-1 overflow-x-auto scrollbar-none select-none shrink-0"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-bold whitespace-nowrap transition-all border-b-2 ${
              isActive
                ? "text-indigo-400 border-indigo-500 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-indigo-950 text-indigo-300 border border-indigo-800" : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
