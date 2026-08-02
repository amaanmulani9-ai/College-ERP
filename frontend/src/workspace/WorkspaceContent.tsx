import React from "react";
import { useTabs } from "./TabContext";
import { WorkspaceHomePage } from "./WorkspaceHomePage";

interface WorkspaceContentProps {
  children?: React.ReactNode;
}

export const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ children }) => {
  const { tabs, activeTabId } = useTabs();

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <main className="flex-1 bg-slate-950 overflow-y-auto relative">
      {activeTab?.route === "/workspace" || !activeTab ? (
        <WorkspaceHomePage />
      ) : (
        children || (
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-2">{activeTab.title}</h2>
            <p className="text-xs text-slate-400">Rendering workspace module for route: <span className="font-mono text-indigo-400">{activeTab.route}</span></p>
          </div>
        )
      )}
    </main>
  );
};
