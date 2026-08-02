import React, { useState, useEffect } from "react";
import {
  Settings, X, Palette, Accessibility, Gauge,
  HelpCircle, MessageSquarePlus, Rocket, Package,
  Wifi, ChevronRight, RotateCcw,
} from "lucide-react";
import { WorkspaceAppearancePanel } from "./WorkspaceAppearancePanel";
import { WorkspaceAccessibilityPanel } from "./WorkspaceAccessibilityPanel";
import { WorkspacePerformancePanel } from "./WorkspacePerformancePanel";
import { WorkspaceHelpCenter } from "./WorkspaceHelpCenter";
import { WorkspaceFeedbackDialog } from "./WorkspaceFeedbackDialog";
import { WorkspaceReleaseNotes } from "./WorkspaceReleaseNotes";
import { WorkspaceExportImport } from "./WorkspaceExportImport";
import { WorkspaceConnectionStatus } from "./WorkspaceConnectionStatus";

// ─── Settings sections ────────────────────────────────────────────────────────

type SettingsSection =
  | "appearance"
  | "accessibility"
  | "performance"
  | "connection"
  | "export"
  | "help"
  | "release";

interface Section {
  id: SettingsSection;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

const SECTIONS: Section[] = [
  { id: "appearance",    label: "Appearance",    icon: Palette,         description: "Theme, density, accent colour, animations" },
  { id: "accessibility", label: "Accessibility", icon: Accessibility,   description: "Reduced motion, contrast, font scale, ARIA"  },
  { id: "performance",   label: "Performance",   icon: Gauge,           description: "FPS, memory, open windows and latency"       },
  { id: "connection",    label: "Connection",    icon: Wifi,            description: "Network status, sync, API health"            },
  { id: "export",        label: "Export/Import", icon: Package,         description: "Backup and restore workspace data"           },
  { id: "help",          label: "Help Center",   icon: HelpCircle,      description: "FAQ, tips, documentation links"              },
  { id: "release",       label: "Release Notes", icon: Rocket,          description: "Version history and upcoming features"       },
];

// ─── Preferences persistence ──────────────────────────────────────────────────

interface WorkspacePrefs {
  defaultLandingPage: string;
  rememberLastSession: boolean;
  autoOpenPinned: boolean;
  animationLevel: "full" | "reduced" | "none";
  density: "compact" | "comfortable" | "spacious";
  language: string;
  timezone: string;
}

const DEFAULT_PREFS: WorkspacePrefs = {
  defaultLandingPage: "/",
  rememberLastSession: true,
  autoOpenPinned: true,
  animationLevel: "full",
  density: "comfortable",
  language: "English (US)",
  timezone: "Asia/Kolkata (IST)",
};

const PREFS_KEY = "college_erp_workspace_preferences";

function loadPrefs(): WorkspacePrefs {
  try { const r = localStorage.getItem(PREFS_KEY); return r ? { ...DEFAULT_PREFS, ...(JSON.parse(r) as Partial<WorkspacePrefs>) } : DEFAULT_PREFS; }
  catch { return DEFAULT_PREFS; }
}

function savePrefs(p: WorkspacePrefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* silent */ }
}

// ─── WorkspacePreferences ─────────────────────────────────────────────────────

interface WorkspacePreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspacePreferences: React.FC<WorkspacePreferencesProps> = ({
  isOpen, onClose,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");
  const [prefs, setPrefs] = useState<WorkspacePrefs>(loadPrefs);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { savePrefs(prefs); }, [prefs]);

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const handleSave = () => {
    savePrefs(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setPrefs(DEFAULT_PREFS);
    savePrefs(DEFAULT_PREFS);
  };

  if (!isOpen) return null;

  const Toggle: React.FC<{ label: string; desc: string; checked: boolean; onChange: () => void; id: string }> = ({
    label, desc, checked, onChange, id,
  }) => (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-slate-800/60 last:border-0">
      <div>
        <label htmlFor={id} className="text-xs font-semibold text-white cursor-pointer">{label}</label>
        <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button id={id} role="switch" aria-checked={checked} onClick={onChange}
        className={`relative mt-0.5 w-10 h-5 rounded-full flex-shrink-0 transition-colors ${checked ? "bg-indigo-600" : "bg-slate-700"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );

  return (
    <>
      {/* Feedback dialog (child) */}
      <WorkspaceFeedbackDialog isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* Main preferences dialog */}
      <div role="dialog" aria-modal="true" aria-label="Workspace Preferences"
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

        <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex overflow-hidden">
          {/* ── Left nav ─────────────────────────────────────────────────── */}
          <nav className="w-56 flex-shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col" aria-label="Settings sections">
            <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-800">
              <Settings className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-white">Preferences</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                    aria-pressed={activeSection === sec.id}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                      activeSection === sec.id
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-semibold">{sec.label}</span>
                    {activeSection === sec.id && <ChevronRight className="w-3 h-3 ml-auto text-indigo-400" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback + reset */}
            <div className="p-2 border-t border-slate-800 space-y-1">
              <button onClick={() => setFeedbackOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-all">
                <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-400" />
                Send Feedback
              </button>
              <button onClick={handleReset}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-rose-400 text-xs font-semibold transition-all">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Defaults
              </button>
            </div>
          </nav>

          {/* ── Right panel ──────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <div>
                <h2 className="text-sm font-bold text-white">{SECTIONS.find((s) => s.id === activeSection)?.label}</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">{SECTIONS.find((s) => s.id === activeSection)?.description}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Close preferences">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activeSection === "appearance"    && <WorkspaceAppearancePanel />}
              {activeSection === "accessibility" && <WorkspaceAccessibilityPanel />}
              {activeSection === "performance"   && <WorkspacePerformancePanel />}
              {activeSection === "connection"    && <WorkspaceConnectionStatus />}
              {activeSection === "export"        && <WorkspaceExportImport />}
              {activeSection === "help"          && <WorkspaceHelpCenter />}
              {activeSection === "release"       && <WorkspaceReleaseNotes />}
            </div>

            {/* General preferences (always visible for appearance/accessibility) */}
            {(activeSection === "appearance") && (
              <div className="px-6 py-4 border-t border-slate-800 space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">General Preferences</div>
                <div className="space-y-0.5">
                  <Toggle id="pref-remember-session" label="Remember Last Session" desc="Reopen last visited module on login" checked={prefs.rememberLastSession} onChange={() => setPrefs((p) => ({ ...p, rememberLastSession: !p.rememberLastSession }))} />
                  <Toggle id="pref-auto-pinned"      label="Auto-open Pinned Tabs"  desc="Open pinned modules automatically on workspace load" checked={prefs.autoOpenPinned}     onChange={() => setPrefs((p) => ({ ...p, autoOpenPinned:     !p.autoOpenPinned     }))} />
                </div>
              </div>
            )}

            {/* Footer save row */}
            <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className={`text-[11px] font-semibold transition-all ${saved ? "text-emerald-400" : "text-slate-600"}`}>
                {saved ? "✓ Preferences saved" : "Changes auto-saved"}
              </span>
              <button onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
