import React, { useState } from "react";
import { MobilePreferences } from "./MobilePreferences";
import { MobileAppearancePanel } from "./MobileAppearancePanel";
import { MobileAccessibilityPanel } from "./MobileAccessibilityPanel";
import { MobilePerformancePanel } from "./MobilePerformancePanel";
import { MobileConnectionPanel } from "./MobileConnectionPanel";
import { MobileHelpCenter } from "./MobileHelpCenter";
import { MobileFeedbackDialog } from "./MobileFeedbackDialog";
import { MobileReleaseNotes } from "./MobileReleaseNotes";
import { MobileShortcutsDialog } from "./MobileShortcutsDialog";
import { MobileOnboarding } from "./MobileOnboarding";
import { MobileExportImport } from "./MobileExportImport";
import { MobileDiagnostics } from "./MobileDiagnostics";
import { MobileErrorBoundary } from "./MobileErrorBoundary";
import { MobileTopTabs } from "../MobileTopTabs";

export const MobileFinalCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("preferences");

  const TABS = [
    { id: "preferences",   label: "Preferences" },
    { id: "appearance",    label: "Appearance" },
    { id: "accessibility", label: "Accessibility" },
    { id: "performance",   label: "Performance" },
    { id: "diagnostics",   label: "Diagnostics" },
    { id: "connection",    label: "Connection" },
    { id: "help",          label: "Help Center" },
    { id: "feedback",      label: "Feedback" },
    { id: "notes",         label: "Release Notes" },
    { id: "shortcuts",     label: "Shortcuts" },
    { id: "tour",          label: "Tour / Onboarding" },
    { id: "backup",        label: "Export / Import" },
  ];

  return (
    <MobileErrorBoundary>
      <div className="space-y-4 font-sans text-xs select-none max-w-4xl mx-auto w-full p-3 sm:p-6">
        <MobileTopTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id)}
        />

        {activeTab === "preferences" && <MobilePreferences />}
        {activeTab === "appearance" && <MobileAppearancePanel />}
        {activeTab === "accessibility" && <MobileAccessibilityPanel />}
        {activeTab === "performance" && <MobilePerformancePanel />}
        {activeTab === "diagnostics" && <MobileDiagnostics />}
        {activeTab === "connection" && <MobileConnectionPanel />}
        {activeTab === "help" && <MobileHelpCenter />}
        {activeTab === "feedback" && <MobileFeedbackDialog />}
        {activeTab === "notes" && <MobileReleaseNotes />}
        {activeTab === "shortcuts" && <MobileShortcutsDialog />}
        {activeTab === "tour" && <MobileOnboarding />}
        {activeTab === "backup" && <MobileExportImport />}
      </div>
    </MobileErrorBoundary>
  );
};
