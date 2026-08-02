import React, { useState } from "react";
import { Star, Zap, Clipboard, LayoutTemplate, ArrowRight, ExternalLink } from "lucide-react";

// ─── WorkspaceFavorites ────────────────────────────────────────────────────────
interface FavoriteItem { id: string; title: string; route: string; }

const defaultFavorites: FavoriteItem[] = [
  { id: "f1", title: "AI Assistant",         route: "/ai"           },
  { id: "f2", title: "Student Directory",    route: "/students"     },
  { id: "f3", title: "Visitor Gate Passes",  route: "/visitor"      },
  { id: "f4", title: "Examinations",         route: "/examinations" },
  { id: "f5", title: "Fee Management",       route: "/fees"         },
  { id: "f6", title: "Placement Drives",     route: "/placement"    },
];

export const WorkspaceFavorites: React.FC = () => (
  <div className="space-y-2">
    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Favorites
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      {defaultFavorites.map((f) => (
        <a key={f.id} href={f.route}
          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all group">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="truncate">{f.title}</span>
        </a>
      ))}
    </div>
  </div>
);

// ─── WorkspaceShortcuts ────────────────────────────────────────────────────────
interface Shortcut { id: string; label: string; route: string; keys?: string; }

const defaultShortcuts: Shortcut[] = [
  { id: "s1", label: "Create Student",     route: "/students",    keys: "Ctrl+N" },
  { id: "s2", label: "Add Staff",          route: "/hr",          keys: "Ctrl+Shift+N" },
  { id: "s3", label: "Record Fee",         route: "/fees",        keys: "" },
  { id: "s4", label: "Ask AI",             route: "/ai",          keys: "Ctrl+A" },
  { id: "s5", label: "Gate Pass",          route: "/visitor",     keys: "" },
  { id: "s6", label: "Timetable",          route: "/timetable",   keys: "" },
];

export const WorkspaceShortcuts: React.FC = () => (
  <div className="space-y-2">
    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
      <Zap className="w-3 h-3 text-indigo-400" /> Quick Shortcuts
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      {defaultShortcuts.map((s) => (
        <a key={s.id} href={s.route}
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all group">
          <span className="truncate">{s.label}</span>
          {s.keys && <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[9px] text-slate-500 font-mono ml-1 hidden lg:block">{s.keys}</kbd>}
        </a>
      ))}
    </div>
  </div>
);

// ─── WorkspaceClipboard ────────────────────────────────────────────────────────
export const WorkspaceClipboard: React.FC = () => (
  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
    <Clipboard className="w-6 h-6 text-slate-600 mx-auto" />
    <div className="text-xs font-semibold text-slate-500">Clipboard History</div>
    <div className="text-[11px] text-slate-600">Clipboard integration available in Phase 5+</div>
  </div>
);

// ─── WorkspaceTemplates ────────────────────────────────────────────────────────
interface RoleTemplate { id: string; role: string; description: string; modules: string[]; }

const templates: RoleTemplate[] = [
  { id: "tmpl-1", role: "Academic Officer",   description: "Courses, Exams, Timetable, Attendance", modules: ["/academics/departments", "/examinations", "/timetable", "/attendance"] },
  { id: "tmpl-2", role: "Faculty",            description: "My Classes, Grades, Attendance, AI",      modules: ["/examinations", "/attendance", "/ai"] },
  { id: "tmpl-3", role: "Finance",            description: "Fees, Payments, Payroll, Reports",         modules: ["/fees", "/payroll", "/reports"] },
  { id: "tmpl-4", role: "Library",            description: "Books, Issue, Returns, Members",           modules: ["/library"] },
  { id: "tmpl-5", role: "Hostel",             description: "Rooms, Allotments, Wardens",              modules: ["/hostel"] },
  { id: "tmpl-6", role: "Principal",          description: "Dashboard, HR, Analytics, AI",            modules: ["/", "/hr", "/ai"] },
  { id: "tmpl-7", role: "Student",            description: "Results, Fees, Library, Transport, AI",   modules: ["/results", "/fees", "/library", "/transport", "/ai"] },
  { id: "tmpl-8", role: "Parent",             description: "Results, Fees, Transport, Attendance",    modules: ["/results", "/fees", "/transport", "/attendance"] },
];

export const WorkspaceTemplates: React.FC = () => {
  const [applied, setApplied] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
        <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" /> Role-Based Templates
      </div>
      <div className="space-y-1.5">
        {templates.map((t) => (
          <div key={t.id}
            className={`p-3 rounded-xl border transition-all ${applied === t.id ? "bg-indigo-600/20 border-indigo-500/40" : "bg-slate-900 border-slate-800 hover:bg-slate-800"}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">{t.role}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.description}</div>
              </div>
              <button
                onClick={() => setApplied(t.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${
                  applied === t.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white"
                }`}>
                {applied === t.id ? "Applied" : "Apply"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {t.modules.map((m) => (
                <span key={m} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
