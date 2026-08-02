import React, { useState } from "react";
import { ConnectionMonitor } from "./ConnectionMonitor";
import { OfflineBanner } from "./OfflineBanner";
import { InstallPrompt } from "./InstallPrompt";
import { UpdateAvailableDialog } from "./UpdateAvailableDialog";
import { SyncCenter } from "./SyncCenter";
import { CacheManager } from "./CacheManager";
import { PWASettings } from "./PWASettings";
import { OfflineDashboard } from "./OfflineDashboard";
import { OfflineWorkspace } from "./OfflineWorkspace";
import { OfflineReports } from "./OfflineReports";
import { OfflineSettings } from "./OfflineSettings";
import { MobileTopTabs } from "../MobileTopTabs";

export const OfflineCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("sync");

  const TABS = [
    { id: "sync",      label: "Sync & Queue" },
    { id: "cache",     label: "Cache Storage" },
    { id: "dashboard", label: "Offline Dashboard" },
    { id: "workspace", label: "Offline Workspace" },
    { id: "reports",   label: "Offline Reports" },
    { id: "settings",  label: "PWA Settings" },
  ];

  return (
    <div className="space-y-4 font-sans text-xs select-none">
      {/* Network & PWA Status Notifications */}
      <ConnectionMonitor />
      <OfflineBanner />
      <InstallPrompt />
      <UpdateAvailableDialog />

      {/* Top Sub Tabs */}
      <MobileTopTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
      />

      {/* Dynamic Tab Panel Content */}
      {activeTab === "sync" && <SyncCenter />}
      {activeTab === "cache" && <CacheManager />}
      {activeTab === "dashboard" && <OfflineDashboard />}
      {activeTab === "workspace" && <OfflineWorkspace />}
      {activeTab === "reports" && <OfflineReports />}
      {activeTab === "settings" && <PWASettings />}
    </div>
  );
};
