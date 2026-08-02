import React from "react";
import { Sparkles, Wrench, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import type { ReleaseNote } from "./types";

const NOTES: ReleaseNote[] = [
  {
    version: "v0.34.0-ui-settings-final",
    date:    "2026-08-02",
    tag:     "new",
    items: [
      "Settings Final Layer: Preferences, Onboarding, Tour, Help, Feedback, Release Notes, Shortcuts",
      "SettingsOfflineBanner and SettingsConnectionStatus with real Network API",
      "SettingsPerformancePanel with live browser Performance API metrics",
      "SettingsAccessibilityPanel with WCAG 2.1 AA compliance indicator",
      "SettingsAppearancePanel with 8-colour accent picker",
      "SettingsExportImport with JSON bundle download/upload",
      "SettingsErrorBoundary with recovery screen and retry",
    ],
  },
  {
    version: "v0.34.0-ui-settings-part5",
    date:    "2026-08-02",
    tag:     "new",
    items: [
      "System Administration Center with 13 pages",
      "Real SVG sparkline charts in Health Monitor",
      "Interactive Disaster Recovery checklist with RTO/RPO tracking",
      "Cache management with per-key flush and hit-rate bars",
      "ARIA role/tab/tabpanel accessible navigation",
    ],
  },
  {
    version: "v0.33.0-ui-settings-part4",
    date:    "2026-08-01",
    tag:     "new",
    items: [
      "Platform Config Center: Branding, Integrations, AI, Notifications",
      "8-colour accent picker and theme management",
      "Payment gateway configuration",
      "Module feature flags and webhook management",
    ],
  },
  {
    version: "v0.32.0-ui-settings-part3",
    date:    "2026-07-30",
    tag:     "new",
    items: [
      "IAM & Security Center with RBAC matrix",
      "MFA settings, IP whitelist, device management",
      "Password and session policy configuration",
      "API key management with scoped permissions",
    ],
  },
  {
    version: "v0.31.0-ui-settings-part2",
    date:    "2026-07-28",
    tag:     "new",
    items: [
      "Institution & Academic Configuration Center",
      "Campus, department, program, and course management",
      "Academic session and semester configuration",
      "Holiday and working day management",
    ],
  },
  {
    version: "v0.30.0-ui-settings-part1",
    date:    "2026-07-26",
    tag:     "new",
    items: [
      "Enterprise Settings foundation: Provider, Context, Layout, Sidebar",
      "Global settings search with keyboard shortcut",
      "27 configurable category modules",
      "Workspace integration: favourites, pinned, recent",
    ],
  },
  {
    version: "v0.35.0 (Upcoming)",
    date:    "2026-08-10",
    tag:     "upcoming",
    items: [
      "Mobile Settings Experience — UI-008",
      "Settings deep-link URL routing",
      "Changelog subscription notifications",
      "Collaborative settings review for multi-admin tenants",
    ],
  },
];

const tagStyle: Record<ReleaseNote["tag"], string> = {
  new:      "bg-indigo-950 text-indigo-300 border-indigo-800",
  improved: "bg-emerald-950 text-emerald-300 border-emerald-800",
  fixed:    "bg-amber-950 text-amber-300 border-amber-800",
  upcoming: "bg-purple-950 text-purple-300 border-purple-800",
};

const tagIcon: Record<ReleaseNote["tag"], React.ElementType> = {
  new:      Sparkles,
  improved: ArrowUpRight,
  fixed:    Wrench,
  upcoming: Clock,
};

export const SettingsReleaseNotes: React.FC = () => (
  <div className="space-y-4 text-xs font-sans">
    {/* Header */}
    <div className="flex items-center gap-2 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
      <Sparkles className="w-5 h-5 text-purple-400" />
      <div>
        <h2 className="text-sm font-bold text-slate-100">Settings Release Notes</h2>
        <p className="text-[10px] text-slate-500">Full changelog for the Enterprise Settings Center — TASK-UI-007.</p>
      </div>
    </div>

    {/* Timeline */}
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-800" />
      <div className="space-y-4 pl-12">
        {NOTES.map((note) => {
          const Icon = tagIcon[note.tag];
          return (
            <div key={note.version} className="relative">
              <div className={`absolute -left-7 w-6 h-6 rounded-full border-2 flex items-center justify-center ${note.tag === "upcoming" ? "bg-purple-950 border-purple-700" : "bg-slate-900 border-slate-700"}`}>
                <Icon className={`w-3 h-3 ${note.tag === "new" ? "text-indigo-400" : note.tag === "upcoming" ? "text-purple-400" : "text-amber-400"}`} />
              </div>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <code className="text-[11px] font-bold font-mono text-slate-100">{note.version}</code>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${tagStyle[note.tag]}`}>{note.tag}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{note.date}</span>
                </div>
                <ul className="space-y-1">
                  {note.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-slate-400">
                      <CheckCircle2 className={`w-3 h-3 mt-0.5 shrink-0 ${note.tag === "upcoming" ? "text-purple-500" : "text-emerald-500"}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
