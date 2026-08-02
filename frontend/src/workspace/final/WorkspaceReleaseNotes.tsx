import React, { useState } from "react";
import { Rocket, CheckCircle2, Clock, ChevronDown, ChevronUp, Sparkles, GitMerge } from "lucide-react";

interface ReleaseEntry {
  version: string;
  date: string;
  tag: "latest" | "stable" | "upcoming";
  highlights: string[];
  modules: string[];
}

const RELEASES: ReleaseEntry[] = [
  {
    version: "v0.32.0",
    date:    "August 2026",
    tag:     "latest",
    highlights: [
      "Enterprise Workspace Framework (TASK-UI-005)",
      "AI Academic Assistant integrated into workspace",
      "Productivity Hub with Tasks, Notes, Calendar, Reminders",
      "Multi-window Docking System",
      "Command Palette (Ctrl+K)",
      "Production polish — accessibility, offline support, preferences",
    ],
    modules: ["Workspace", "AI", "Productivity", "Docking"],
  },
  {
    version: "v0.31.0",
    date:    "July 2026",
    tag:     "stable",
    highlights: [
      "Visitor Management System (TASK-029)",
      "Alumni Management System (TASK-028)",
      "AI Academic Assistant backend (TASK-030)",
      "Placement & Careers module (TASK-027)",
      "Asset Management module (TASK-026)",
    ],
    modules: ["Visitor", "Alumni", "AI Backend", "Placement", "Assets"],
  },
  {
    version: "v0.30.0",
    date:    "June 2026",
    tag:     "stable",
    highlights: [
      "Transport Management",
      "Hostel Management",
      "Library Management",
      "Fee Management improvements",
      "Payroll engine enhancements",
    ],
    modules: ["Transport", "Hostel", "Library", "Fees", "Payroll"],
  },
  {
    version: "v0.33.0",
    date:    "September 2026",
    tag:     "upcoming",
    highlights: [
      "Enterprise Reporting & Analytics (UI-006)",
      "Advanced chart builder",
      "Scheduled reports",
      "PDF/Excel export",
      "Multi-tenant analytics dashboard",
    ],
    modules: ["Reports", "Analytics", "Exports"],
  },
];

const TAG_STYLES: Record<string, string> = {
  latest:   "bg-indigo-600/20 text-indigo-300 border-indigo-500/30",
  stable:   "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
  upcoming: "bg-amber-600/20 text-amber-300 border-amber-500/30",
};

export const WorkspaceReleaseNotes: React.FC = () => {
  const [expanded, setExpanded] = useState<string>("v0.32.0");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Rocket className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-bold text-white">Release Notes</span>
      </div>

      <div className="space-y-2">
        {RELEASES.map((rel) => {
          const isExpanded = expanded === rel.version;
          const Icon = rel.tag === "upcoming" ? Clock : rel.tag === "latest" ? Sparkles : CheckCircle2;
          return (
            <div key={rel.version}
              className={`rounded-2xl border overflow-hidden transition-all ${
                rel.tag === "latest"   ? "border-indigo-500/30 bg-indigo-600/5" :
                rel.tag === "upcoming" ? "border-amber-500/30 bg-amber-600/5"  :
                                         "border-slate-800 bg-slate-900"
              }`}>
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? "" : rel.version)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                aria-expanded={isExpanded}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${rel.tag === "latest" ? "text-indigo-400" : rel.tag === "upcoming" ? "text-amber-400" : "text-emerald-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white font-mono">{rel.version}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold capitalize ${TAG_STYLES[rel.tag]}`}>
                      {rel.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{rel.date}</div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-800/60">
                  <ul className="mt-3 space-y-1.5">
                    {rel.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <span className="text-indigo-400 mt-0.5 flex-shrink-0">✦</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rel.modules.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-400 font-mono">{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
        <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
        Full changelog available in project repository
      </div>
    </div>
  );
};
