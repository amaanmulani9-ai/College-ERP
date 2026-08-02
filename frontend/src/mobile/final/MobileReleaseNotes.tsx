import React from "react";
import { Sparkles, Calendar, CheckCircle2, Milestone } from "lucide-react";

export const MobileReleaseNotes: React.FC = () => {
  const MILESTONES = [
    { version: "v0.35.0-ui-mobile-final", date: "Aug 2, 2026", title: "Enterprise Mobile Experience Suite", items: ["Full PWA offline caching & sync queue", "Role-aware mobile dashboards & KPI carousel", "Swipeable workspace tabs & touch gestures"] },
    { version: "v0.34.0-ui-settings-final", date: "Jul 28, 2026", title: "Enterprise System Administration & Settings", items: ["System health monitoring dashboard", "Security audit logs & backup center", "Localization & notification management"] },
    { version: "v0.33.0-ui-reporting", date: "Jul 20, 2026", title: "Analytics & Custom Report Builder", items: ["Visual chart components & export engine", "Cross-module data analytics cards"] },
  ];

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h3 className="font-bold text-slate-100 text-xs">Release Notes & Version Timeline</h3>
      </div>

      <div className="space-y-3">
        {MILESTONES.map((m) => (
          <div key={m.version} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-[11px]">{m.title}</span>
              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-800 px-2 py-0.2 rounded">
                {m.version}
              </span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" /> Released {m.date}
            </p>
            <ul className="space-y-1 pt-1 text-[10px] text-slate-300">
              {m.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
