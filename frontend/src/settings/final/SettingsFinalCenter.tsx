import React, { useState, useEffect, useCallback } from "react";
import {
  Settings2, Palette, Accessibility, Gauge, Wifi, Map,
  BookOpen, MessageSquare, Sparkles, FileJson, ScrollText,
  Keyboard, AlertTriangle,
} from "lucide-react";

import { SettingsPreferences }      from "./SettingsPreferences";
import { SettingsAppearancePanel }  from "./SettingsAppearancePanel";
import { SettingsAccessibilityPanel } from "./SettingsAccessibilityPanel";
import { SettingsPerformancePanel } from "./SettingsPerformancePanel";
import { SettingsConnectionStatus } from "./SettingsConnectionStatus";
import { SettingsOfflineBanner }    from "./SettingsOfflineBanner";
import { SettingsTour }             from "./SettingsTour";
import { SettingsHelpCenter }       from "./SettingsHelpCenter";
import { SettingsFeedbackDialog }   from "./SettingsFeedbackDialog";
import { SettingsReleaseNotes }     from "./SettingsReleaseNotes";
import { SettingsExportImport }     from "./SettingsExportImport";
import { SettingsShortcutsDialog }  from "./SettingsShortcutsDialog";
import { SettingsOnboarding }       from "./SettingsOnboarding";
import { SettingsErrorBoundary }    from "./SettingsErrorBoundary";

type FinalTab =
  | "preferences" | "appearance" | "accessibility" | "performance"
  | "connection"  | "tour"       | "notes"         | "export";

interface TabDef {
  id: FinalTab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabDef[] = [
  { id: "preferences",   label: "Preferences",   icon: Settings2    },
  { id: "appearance",    label: "Appearance",     icon: Palette      },
  { id: "accessibility", label: "Accessibility",  icon: Accessibility },
  { id: "performance",   label: "Performance",    icon: Gauge        },
  { id: "connection",    label: "Connection",     icon: Wifi         },
  { id: "tour",          label: "Guided Tour",    icon: Map          },
  { id: "notes",         label: "Release Notes",  icon: Sparkles     },
  { id: "export",        label: "Export/Import",  icon: FileJson     },
];

export const SettingsFinalCenter: React.FC = () => {
  const [activeTab, setActiveTab]  = useState<FinalTab>("preferences");
  const [showHelp, setShowHelp]    = useState(false);
  const [showFeedback, setFeedback] = useState(false);
  const [showShortcuts, setShortcuts] = useState(false);
  const [showOnboarding, setOnboarding] = useState(false);

  // ? key → open shortcuts
  const handleKey = useCallback((e: KeyboardEvent) => {
    if ((e.key === "?" || e.key === "/") && !e.ctrlKey && !e.metaKey && e.target === document.body) {
      setShortcuts(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="space-y-4 text-xs font-sans" role="region" aria-label="Settings Finalization Center">
      {/* Offline Banner */}
      <SettingsOfflineBanner />

      {/* Section Header with workspace actions */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h1 className="text-sm font-bold text-slate-100">Settings Polish & Personalisation</h1>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Preferences · Appearance · Accessibility · Performance · Connection · Tour · Release Notes · Export/Import
          </p>
        </div>
        {/* Workspace action buttons */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowHelp(true)} title="Help Center (Ctrl+Shift+H)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-[11px] font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Help</span>
          </button>
          <button onClick={() => setFeedback(true)} title="Send Feedback"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-[11px] font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Feedback</span>
          </button>
          <button onClick={() => setShortcuts(true)} title="Keyboard Shortcuts (?)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-[11px] font-semibold">
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
          <button onClick={() => setOnboarding(true)} title="Start Guided Onboarding"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors text-[11px] font-bold">
            <ScrollText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tour</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav aria-label="Settings final tabs" className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            role="tab"
            aria-selected={activeTab === t.id}
            aria-controls={`final-panel-${t.id}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-[11px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${
              activeTab === t.id
                ? "bg-indigo-600 text-white font-bold shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <t.icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Error Boundary wraps all tab content */}
      <SettingsErrorBoundary fallbackTitle="Settings Panel Error">
        <div id={`final-panel-${activeTab}`} role="tabpanel" aria-label={TABS.find((t) => t.id === activeTab)?.label}>
          {activeTab === "preferences"   && <SettingsPreferences />}
          {activeTab === "appearance"    && <SettingsAppearancePanel />}
          {activeTab === "accessibility" && <SettingsAccessibilityPanel />}
          {activeTab === "performance"   && <SettingsPerformancePanel />}
          {activeTab === "connection"    && <SettingsConnectionStatus />}
          {activeTab === "tour"          && <SettingsTour onClose={() => setActiveTab("preferences")} />}
          {activeTab === "notes"         && <SettingsReleaseNotes />}
          {activeTab === "export"        && <SettingsExportImport />}
        </div>
      </SettingsErrorBoundary>

      {/* Error Boundary demo banner */}
      <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-[10px] text-slate-500">
          All settings sections are wrapped in <code className="font-mono text-slate-400">SettingsErrorBoundary</code> — rendering errors will show a recovery screen with retry and reload options.
        </p>
      </div>

      {/* Modal Layers */}
      {showHelp      && <SettingsHelpCenter     onClose={() => setShowHelp(false)} />}
      {showFeedback  && <SettingsFeedbackDialog  onClose={() => setFeedback(false)} />}
      {showShortcuts && <SettingsShortcutsDialog onClose={() => setShortcuts(false)} />}
      {showOnboarding && (
        <SettingsOnboarding
          onClose={() => setOnboarding(false)}
          onComplete={() => setOnboarding(false)}
        />
      )}
    </div>
  );
};

export default SettingsFinalCenter;
