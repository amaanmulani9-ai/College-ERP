import React, { useState } from "react";
import {
  LayoutDashboard, Activity, Wrench, HardDrive, RotateCcw,
  ScrollText, ClipboardList, Folder, Layers, Zap, Database,
  ShieldAlert, Info,
} from "lucide-react";

import { SystemDashboardPage }    from "./SystemDashboardPage";
import { HealthMonitoringPage }   from "./HealthMonitoringPage";
import { MaintenanceModePage }    from "./MaintenanceModePage";
import { BackupCenterPage }       from "./BackupCenterPage";
import { RestoreCenterPage }      from "./RestoreCenterPage";
import { AuditLogPage }           from "./AuditLogPage";
import { ActivityLogPage }        from "./ActivityLogPage";
import { StorageManagementPage }  from "./StorageManagementPage";
import { JobQueuePage }           from "./JobQueuePage";
import { CacheManagementPage }    from "./CacheManagementPage";
import { DatabaseManagementPage } from "./DatabaseManagementPage";
import { DisasterRecoveryPage }   from "./DisasterRecoveryPage";
import { SystemInformationPage }  from "./SystemInformationPage";

type SystemTab =
  | "dashboard"
  | "health"
  | "maintenance"
  | "backup"
  | "restore"
  | "audit"
  | "activity"
  | "storage"
  | "jobs"
  | "cache"
  | "database"
  | "dr"
  | "info";

interface TabDef {
  id: SystemTab;
  label: string;
  icon: React.ElementType;
  danger?: boolean;
}

const TABS: TabDef[] = [
  { id: "dashboard",   label: "Dashboard",        icon: LayoutDashboard },
  { id: "health",      label: "Health",            icon: Activity },
  { id: "maintenance", label: "Maintenance",       icon: Wrench },
  { id: "backup",      label: "Backups",           icon: HardDrive },
  { id: "restore",     label: "Restore",           icon: RotateCcw,   danger: true },
  { id: "audit",       label: "Audit Logs",        icon: ScrollText },
  { id: "activity",    label: "Activity",          icon: ClipboardList },
  { id: "storage",     label: "Storage",           icon: Folder },
  { id: "jobs",        label: "Job Queue",         icon: Layers },
  { id: "cache",       label: "Cache",             icon: Zap },
  { id: "database",    label: "Database",          icon: Database },
  { id: "dr",          label: "Disaster Recovery", icon: ShieldAlert, danger: true },
  { id: "info",        label: "System Info",       icon: Info },
];

export const SystemSettingsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SystemTab>("dashboard");

  return (
    <div
      className="space-y-4 text-xs font-sans"
      role="region"
      aria-label="System Administration Center"
    >
      {/* Section Header */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <h1 className="text-lg font-bold text-slate-100">System Administration Center</h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Monitor health, manage backups, audit logs, jobs, cache, storage, and disaster recovery.
          Super Admin access only.
        </p>
      </div>

      {/* Tab Navigation — horizontal scroll on small screens */}
      <nav
        aria-label="System settings tabs"
        className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto"
      >
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              aria-selected={isActive}
              aria-controls={`sys-panel-${t.id}`}
              role="tab"
              title={t.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-[11px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                isActive
                  ? t.danger
                    ? "bg-rose-700 text-white font-bold shadow-md"
                    : "bg-indigo-600 text-white font-bold shadow-md"
                  : t.danger
                  ? "text-rose-400 hover:text-rose-200 hover:bg-rose-950/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <t.icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Page Panel */}
      <div
        id={`sys-panel-${activeTab}`}
        role="tabpanel"
        aria-label={TABS.find((t) => t.id === activeTab)?.label}
      >
        {activeTab === "dashboard"   && <SystemDashboardPage />}
        {activeTab === "health"      && <HealthMonitoringPage />}
        {activeTab === "maintenance" && <MaintenanceModePage />}
        {activeTab === "backup"      && <BackupCenterPage />}
        {activeTab === "restore"     && <RestoreCenterPage />}
        {activeTab === "audit"       && <AuditLogPage />}
        {activeTab === "activity"    && <ActivityLogPage />}
        {activeTab === "storage"     && <StorageManagementPage />}
        {activeTab === "jobs"        && <JobQueuePage />}
        {activeTab === "cache"       && <CacheManagementPage />}
        {activeTab === "database"    && <DatabaseManagementPage />}
        {activeTab === "dr"          && <DisasterRecoveryPage />}
        {activeTab === "info"        && <SystemInformationPage />}
      </div>
    </div>
  );
};

export default SystemSettingsCenter;
