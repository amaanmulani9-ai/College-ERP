import React, { useState } from "react";
import { ExecutiveRole, CrossModuleDomain } from "./types";
import { ExecutiveSidebar } from "./ExecutiveSidebar";
import { ExecutiveDashboard } from "./ExecutiveDashboard";
import { useReporting } from "../ReportingContext";
import { useTabs } from "../../workspace/TabContext";

export const ExecutiveAnalyticsCenter: React.FC = () => {
  const [activeRole, setActiveRole] = useState<ExecutiveRole>("Super Admin");
  const [activeDomain, setActiveDomain] = useState<CrossModuleDomain | null>(null);

  const { setSelectedReport, setViewMode } = useReporting();

  // Workspace integration
  let openTabAction: ((tab: { title: string; route: string; iconName?: string }) => void) | null = null;
  try {
    const tabsCtx = useTabs();
    if (tabsCtx && tabsCtx.openTab) {
      openTabAction = tabsCtx.openTab;
    }
  } catch (_e) {
    openTabAction = null;
  }

  const handleDrillDown = (route: string) => {
    if (openTabAction) {
      openTabAction({
        title: `Drill-Down: ${activeRole}`,
        route: route,
        iconName: "BarChart3",
      });
    }
  };

  return (
    <div className="flex h-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Executive Sidebar Navigator */}
      <ExecutiveSidebar
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        activeDomain={activeDomain}
        onSelectDomain={setActiveDomain}
      />

      {/* Main Executive Dashboard View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveDashboard
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          activeDomain={activeDomain}
          onSelectDomain={setActiveDomain}
          onDrillDown={handleDrillDown}
          onOpenInWorkspace={
            openTabAction
              ? () =>
                  openTabAction!({
                    title: `Executive: ${activeRole}`,
                    route: `/reporting/executive`,
                    iconName: "ShieldCheck",
                  })
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ExecutiveAnalyticsCenter;
