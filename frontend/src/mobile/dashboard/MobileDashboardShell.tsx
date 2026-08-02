import React, { useState } from "react";
import { MobileDashboardHome } from "./MobileDashboardHome";
import { MobileExecutiveDashboard } from "./MobileExecutiveDashboard";
import { MobileReportCatalog, MobileReportItem } from "./MobileReportCatalog";
import { MobileReportViewer } from "./MobileReportViewer";
import { MobileChartViewer } from "./MobileChartViewer";
import { MobileTopTabs } from "../MobileTopTabs";

export const MobileDashboardShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState<MobileReportItem | null>(null);

  const TABS = [
    { id: "dashboard font-bold", label: "Dashboard Home" },
    { id: "executive",    label: "Executive Governance" },
    { id: "reports",      label: "Report Catalog" },
    { id: "charts",       label: "Visual Charts" },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Sub-tabs */}
      <MobileTopTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          setSelectedReport(null);
        }}
      />

      {/* Dynamic Viewport */}
      <main className="flex-1 p-3 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {selectedReport ? (
          <MobileReportViewer report={selectedReport} onBack={() => setSelectedReport(null)} />
        ) : activeTab === "executive" ? (
          <MobileExecutiveDashboard />
        ) : activeTab === "reports" ? (
          <MobileReportCatalog onSelectReport={(rep) => setSelectedReport(rep)} />
        ) : activeTab === "charts" ? (
          <MobileChartViewer />
        ) : (
          <MobileDashboardHome />
        )}
      </main>
    </div>
  );
};

export default MobileDashboardShell;
