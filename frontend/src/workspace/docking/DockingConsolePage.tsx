import React, { useState } from "react";
import {
  Plus,
  Layers,
  LayoutTemplate,
  Map,
  SidebarOpen,
  Activity,
  Database,
  Zap,
  Wifi,
} from "lucide-react";
import { WorkspaceManagerProvider, useWindowManager } from "./WorkspaceManager";
import { WorkspaceGrid } from "./WorkspaceGrid";
import { WorkspaceLayouts } from "./WorkspaceLayouts";
import { WorkspaceMiniMap } from "./WorkspaceMiniMap";
import { WindowSwitcher } from "./WindowSwitcher";
import { OpenWindowsPanel } from "./OpenWindowsPanel";
import { PinnedWindowsPanel } from "./PinnedWindowsPanel";
import { RecentWindowsPanel } from "./RecentWindowsPanel";

const QUICK_MODULES = [
  { title: "Student Directory",     route: "/students",    iconName: "Users"    },
  { title: "Examinations",          route: "/examinations", iconName: "BookOpen" },
  { title: "AI Assistant Hub",      route: "/ai",          iconName: "Sparkles" },
  { title: "Visitor Security",      route: "/visitor",     iconName: "Shield"   },
  { title: "Fees & Payments",       route: "/fees",        iconName: "Dollar"   },
  { title: "Hostel Management",     route: "/hostel",      iconName: "Building" },
  { title: "Transport Fleet",       route: "/transport",   iconName: "Bus"      },
  { title: "Placement & Careers",   route: "/placement",   iconName: "Award"    },
];

// ─── Inner Shell (uses context) ───────────────────────────────────────────────
const DockingShell: React.FC = () => {
  const { windows, openWindow, currentLayout } = useWindowManager();
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* ── Docking Toolbar ──────────────────────────────────────────────── */}
      <div className="h-11 flex-shrink-0 flex items-center gap-2 px-3 bg-slate-900 border-b border-slate-800">
        {/* Quick Open Modules */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {QUICK_MODULES.map((mod) => (
            <button
              key={mod.route}
              onClick={() => openWindow(mod)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] font-medium transition-all whitespace-nowrap border border-slate-700/50"
              title={`Open ${mod.title}`}
            >
              {mod.title}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Layout Switcher */}
        <WorkspaceLayouts />

        {/* Minimap Toggle */}
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className={`p-1.5 rounded-lg transition-all border ${
            showMinimap
              ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
              : "bg-slate-800 border-slate-700/50 text-slate-400 hover:text-white"
          }`}
          title="Toggle MiniMap"
        >
          <Map className="w-4 h-4" />
        </button>

        {/* Side Panel Toggle */}
        <button
          onClick={() => setSidePanelOpen(!sidePanelOpen)}
          className={`p-1.5 rounded-lg transition-all border ${
            sidePanelOpen
              ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
              : "bg-slate-800 border-slate-700/50 text-slate-400 hover:text-white"
          }`}
          title="Toggle Window Navigator"
        >
          <SidebarOpen className="w-4 h-4" />
        </button>

        {/* Window Count Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/50 text-[11px] font-semibold text-slate-300">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          {windows.filter((w) => w.state !== "minimized").length} windows
        </div>
      </div>

      {/* ── Main Body: Grid + Side Panel ─────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Window Grid */}
        <div className="flex-1 overflow-hidden">
          <WorkspaceGrid />
        </div>

        {/* Side Navigator Panel */}
        {sidePanelOpen && (
          <div className="w-72 flex-shrink-0 border-l border-slate-800 bg-slate-900/60 overflow-y-auto p-3 space-y-3">
            <OpenWindowsPanel />
            <PinnedWindowsPanel />
            <RecentWindowsPanel />
            {showMinimap && <WorkspaceMiniMap />}
          </div>
        )}
      </div>

      {/* ── Docking Status Bar ───────────────────────────────────────────── */}
      <div className="h-7 flex-shrink-0 flex items-center justify-between px-4 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            <strong className="text-slate-300">Enterprise Docking Workspace</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <LayoutTemplate className="w-3 h-3 text-indigo-400" />
            Layout: <strong className="text-indigo-300 ml-1">{currentLayout.charAt(0).toUpperCase() + currentLayout.slice(1)}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Windows: <strong className="text-slate-300">{windows.length}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" />
            Springfield Academic Cloud
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <strong className="text-emerald-400">18ms</strong>
          </span>
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <strong className="text-emerald-400">Online</strong>
          </span>
          <span>Ctrl+Tab — Switch Windows</span>
        </div>
      </div>

      {/* Window Switcher Overlay */}
      <WindowSwitcher />
    </div>
  );
};

// ─── Page Export (wraps with provider) ────────────────────────────────────────
export const DockingConsolePage: React.FC = () => {
  return (
    <WorkspaceManagerProvider>
      <DockingShell />
    </WorkspaceManagerProvider>
  );
};
