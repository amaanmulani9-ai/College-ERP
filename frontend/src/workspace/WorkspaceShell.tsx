import React, { useState, useEffect } from "react";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceTabs } from "./WorkspaceTabs";
import { WorkspaceContent } from "./WorkspaceContent";
import { WorkspaceFooter } from "./WorkspaceFooter";
import { QuickLauncher } from "./QuickLauncher";
import { WorkspaceSearch } from "./WorkspaceSearch";
import { WorkspaceProductivityHub } from "./productivity/WorkspaceProductivityHub";
import { AIAssistantDock } from "./ai/AIAssistantDock";
import {
  WorkspaceOfflineBanner,
  WorkspaceOnboarding,
  WorkspaceErrorBoundary,
  WorkspacePreferences,
  WorkspaceShortcutsDialog,
} from "./final";

interface WorkspaceShellProps {
  children?: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({ children }) => {
  const [hubOpen,       setHubOpen]       = useState(true);
  const [aiDockOpen,    setAiDockOpen]    = useState(false);
  const [prefsOpen,     setPrefsOpen]     = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Shift+A → AI dock
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setAiDockOpen((v) => !v);
        return;
      }
      // Ctrl+, → Preferences
      if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        setPrefsOpen((v) => !v);
        return;
      }
      // ? → Shortcuts dialog (only when no input focused)
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (e.key === "?" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
        return;
      }
      // Ctrl+Shift+? → Shortcuts dialog
      if (e.ctrlKey && e.shiftKey && e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* ── Global overlays (outside main layout tree) ──────────────────── */}
      <WorkspaceOfflineBanner />
      <WorkspaceOnboarding />
      <WorkspacePreferences     isOpen={prefsOpen}     onClose={() => setPrefsOpen(false)}     />
      <WorkspaceShortcutsDialog isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* ── Main workspace shell ─────────────────────────────────────────── */}
      <WorkspaceErrorBoundary fallbackTitle="Workspace Error">
        <div
          className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-hidden"
          aria-label="Enterprise Workspace"
        >
          <WorkspaceHeader />
          <div className="flex-1 flex overflow-hidden relative">
            <WorkspaceSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <WorkspaceTabs />
              <WorkspaceErrorBoundary fallbackTitle="Module Error">
                <WorkspaceContent>{children}</WorkspaceContent>
              </WorkspaceErrorBoundary>
            </div>
            {/* Productivity Hub */}
            <WorkspaceProductivityHub
              isOpen={hubOpen}
              onToggle={() => setHubOpen((v) => !v)}
            />
            {/* AI Assistant Dock */}
            <AIAssistantDock
              isOpen={aiDockOpen}
              onClose={() => setAiDockOpen(false)}
            />
          </div>
          <WorkspaceFooter />
          <QuickLauncher />
          <WorkspaceSearch />
        </div>
      </WorkspaceErrorBoundary>
    </>
  );
};
