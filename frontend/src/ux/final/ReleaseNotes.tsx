import React from "react";
import { Sparkles, Terminal, Code, CheckCircle2, BookOpen, Layers } from "lucide-react";

export const ReleaseNotes: React.FC = () => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h3 className="font-bold text-slate-100 text-xs">Official v1.0.0 Release Notes</h3>
      </div>
      <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
        v1.0.0 Production Release
      </span>
    </div>
    <div className="space-y-2 text-[10px] text-slate-300">
      <p className="font-bold text-slate-100 text-[11px]">Enterprise Highlights:</p>
      <ul className="space-y-1 pl-2">
        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Full Backend ERP Apps (TASK-001 → TASK-030)</li>
        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Frontend Suites: Landing, Auth, Dashboards, Design System, Workspace, Reporting, Settings, Mobile</li>
        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Enterprise Motion, State, Accessibility (WCAG 2.1 AA), Performance System (UI-009)</li>
        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Progressive Web App (PWA) with Offline Action Queue & Sync Policy</li>
      </ul>
    </div>
  </div>
);

export const VersionInfo: React.FC = () => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-mono text-[10px] text-slate-300">
    <span>Enterprise Suite Version:</span>
    <span className="font-bold text-indigo-400">v1.0.0 (Tag: v1.0.0)</span>
  </div>
);

export const BuildInformation: React.FC = () => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-[10px] text-slate-300">
    <div className="flex justify-between">
      <span>Vite Build Output:</span>
      <span className="font-bold text-emerald-400">dist/ (Clean 13.09s)</span>
    </div>
    <div className="flex justify-between">
      <span>Main Entry Chunk:</span>
      <span className="font-bold text-indigo-300">814 kB (135 kB Gzip)</span>
    </div>
  </div>
);

export const DependencyStatus: React.FC = () => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-mono text-[10px] text-slate-300">
    <span>Dependencies & Security:</span>
    <span className="font-bold text-emerald-400">0 Vulnerabilities</span>
  </div>
);

export const QualityMetrics: React.FC = () => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 font-sans text-xs select-none">
    <h3 className="font-bold text-slate-100 text-xs">Quality Metrics Overview</h3>
    <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
        <p className="text-slate-500">Pytest Coverage</p>
        <p className="text-base font-bold text-emerald-400">84.0%</p>
      </div>
      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
        <p className="text-slate-500">TypeScript Errors</p>
        <p className="text-base font-bold text-emerald-400">0 Errors</p>
      </div>
    </div>
  </div>
);

export const DocumentationCenter: React.FC = () => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
      <BookOpen className="w-4 h-4 text-cyan-400" />
      <h3 className="font-bold text-slate-100 text-xs">Generated Release Documentation</h3>
    </div>
    <div className="space-y-1.5 font-mono text-[10px]">
      {[
        "docs/release-readiness.md",
        "docs/v1.0.0-release-notes.md",
        "docs/production-checklist.md",
        "docs/component-inventory.md",
        "docs/project-summary.md",
      ].map((doc) => (
        <div key={doc} className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
          <span>{doc}</span>
          <span className="text-emerald-400 font-bold">Generated</span>
        </div>
      ))}
    </div>
  </div>
);
