import React, { useState } from "react";
import { Sliders, HelpCircle, Sparkles, Activity, ShieldCheck, FileCode, MessageSquare, Command } from "lucide-react";
import { ReportingPreferences } from "./ReportingPreferences";
import { ReportingOnboarding } from "./ReportingOnboarding";
import { ReportingHelpCenter } from "./ReportingHelpCenter";
import { ReportingReleaseNotes } from "./ReportingReleaseNotes";
import { ReportingPerformancePanel } from "./ReportingPerformancePanel";
import { ReportingAccessibilityPanel } from "./ReportingAccessibilityPanel";
import { ReportingAppearancePanel } from "./ReportingAppearancePanel";
import { ReportingExportImport } from "./ReportingExportImport";
import { ReportingShortcutsDialog } from "./ReportingShortcutsDialog";
import { ReportingFeedbackDialog } from "./ReportingFeedbackDialog";

export const ReportingFinalCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "preferences" | "performance" | "accessibility" | "help" | "release" | "export"
  >("preferences");

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="space-y-6 text-xs font-sans p-4 sm:p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Banner & Guided Tour */}
      <ReportingOnboarding />

      {/* Settings Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-950 border border-slate-800 rounded-xl font-semibold">
          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "preferences" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab("performance")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "performance" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Performance</span>
          </button>

          <button
            onClick={() => setActiveTab("accessibility")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "accessibility" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accessibility</span>
          </button>

          <button
            onClick={() => setActiveTab("help")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "help" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </button>

          <button
            onClick={() => setActiveTab("release")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "release" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Release Notes</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "export" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Backup/Restore</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShortcuts(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <Command className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shortcuts</span>
          </button>

          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <ReportingPreferences />
          <ReportingAppearancePanel />
        </div>
      )}

      {activeTab === "performance" && <ReportingPerformancePanel />}

      {activeTab === "accessibility" && <ReportingAccessibilityPanel />}

      {activeTab === "help" && <ReportingHelpCenter />}

      {activeTab === "release" && <ReportingReleaseNotes />}

      {activeTab === "export" && <ReportingExportImport />}

      {/* Shortcuts & Feedback Modals */}
      {showShortcuts && <ReportingShortcutsDialog onClose={() => setShowShortcuts(false)} />}
      {showFeedback && <ReportingFeedbackDialog onClose={() => setShowFeedback(false)} />}
    </div>
  );
};

export default ReportingFinalCenter;
