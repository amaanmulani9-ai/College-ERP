import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface ManagedTab {
  id: string;
  title: string;
  route: string;
  isActive: boolean;
}

interface WorkspaceTabsManagerProps {
  windowId: string;
  initialTabs?: ManagedTab[];
}

export const WorkspaceTabsManager: React.FC<WorkspaceTabsManagerProps> = ({
  windowId,
  initialTabs = [],
}) => {
  const [tabs, setTabs] = useState<ManagedTab[]>(
    initialTabs.length > 0
      ? initialTabs
      : [{ id: "t1", title: "Module View", route: "/workspace", isActive: true }]
  );

  const setActive = (id: string) => {
    setTabs((prev) => prev.map((t) => ({ ...t, isActive: t.id === id })));
  };

  const closeTab = (id: string) => {
    const remaining = tabs.filter((t) => t.id !== id);
    if (remaining.length === 0) return;
    const wasActive = tabs.find((t) => t.id === id)?.isActive;
    setTabs(
      wasActive
        ? remaining.map((t, idx) => ({ ...t, isActive: idx === remaining.length - 1 }))
        : remaining
    );
  };

  const addTab = () => {
    const id = `t-${Date.now()}`;
    setTabs((prev) => [
      ...prev.map((t) => ({ ...t, isActive: false })),
      { id, title: "New Panel", route: "/workspace", isActive: true },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-2 bg-slate-900 border-b border-slate-800 overflow-x-auto no-scrollbar flex-shrink-0 h-8">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-t-lg text-[11px] font-medium cursor-pointer transition-all select-none ${
              tab.isActive
                ? "bg-slate-950 text-indigo-400 border-t border-x border-slate-700"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="truncate max-w-[100px]">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="opacity-0 hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-500 hover:text-slate-200 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors"
          title="New tab in this window"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 bg-slate-950 overflow-auto">
        {tabs
          .filter((t) => t.isActive)
          .map((tab) => (
            <div key={tab.id} className="h-full flex items-center justify-center text-xs text-slate-500">
              Panel: <span className="font-mono text-indigo-400 ml-1">{tab.route}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
