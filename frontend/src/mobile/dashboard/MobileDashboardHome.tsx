import React, { useState } from "react";
import { MobileRoleSwitcher, RoleType } from "./MobileRoleSwitcher";
import { MobileKPICarousel } from "./MobileKPICarousel";
import { MobileQuickActions } from "./MobileQuickActions";
import { MobileAnalyticsCards } from "./MobileAnalyticsCards";
import { MobileChartViewer } from "./MobileChartViewer";
import { MobileWidgetGrid } from "./MobileWidgetGrid";
import { MobileAnnouncements } from "./MobileAnnouncements";
import { MobileActivityFeed } from "./MobileActivityFeed";
import { MobileCalendar } from "./MobileCalendar";
import { MobileExecutiveDashboard } from "./MobileExecutiveDashboard";

export const MobileDashboardHome: React.FC = () => {
  const [role, setRole] = useState<RoleType>("superadmin");

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Role Switcher Control */}
      <MobileRoleSwitcher currentRole={role} onRoleChange={(r) => setRole(r)} />

      {/* Role-Specific Content */}
      {role === "principal" ? (
        <MobileExecutiveDashboard />
      ) : (
        <>
          {/* Swipeable KPI Carousel */}
          <MobileKPICarousel role={role} />

          {/* Touch Quick Actions */}
          <MobileQuickActions />

          {/* Analytics Summary Cards */}
          <MobileAnalyticsCards />

          {/* Interactive Responsive Chart Viewer */}
          <MobileChartViewer />

          {/* Collapsible Widget Grid */}
          <MobileWidgetGrid />

          {/* Announcements & Notices */}
          <MobileAnnouncements />

          {/* Activity Feed */}
          <MobileActivityFeed />

          {/* Mini Academic Calendar */}
          <MobileCalendar />
        </>
      )}
    </div>
  );
};
