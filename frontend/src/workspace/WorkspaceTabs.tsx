import React from "react";
import { Plus, RotateCcw, XOctagon } from "lucide-react";
import { useTabs } from "./TabContext";
import { WorkspaceTab } from "./WorkspaceTab";

export const WorkspaceTabs: React.FC = () => {
  const { tabs, activeTabId, openTab, restoreLastClosedTab, closeAllTabs, closedHistory } = useTabs();

  return (
    <div className="h-10 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between overflow-x-auto select-none no-scrollbar">
      {/* Scrollable Tabs List */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {tabs.map((tab) => (
          <WorkspaceTab key={tab.id} tab={tab} isActive={tab.id === activeTabId} />
        ))}

        {/* New Tab Button */}
        <button
          onClick={() =>
            openTab({
              title: "Workspace Home",
              route: "/workspace",
              iconName: "Home",
            })
          }
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors"
          title="New Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Controls (Restore Closed, Close All) */}
      <div className="flex items-center gap-1 pl-2">
        {closedHistory.length > 0 && (
          <button
            onClick={restoreLastClosedTab}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400 transition-colors text-xs flex items-center gap-1"
            title="Restore Closed Tab"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={closeAllTabs}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors text-xs"
          title="Close Unpinned Tabs"
        >
          <XOctagon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
