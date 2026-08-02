import React, { useState } from "react";
import { X, Pin, RotateCcw, MoreHorizontal, LayoutDashboard, Sliders, BarChart3, Settings } from "lucide-react";

export interface WorkspaceTabItem {
  id: string;
  title: string;
  isPinned?: boolean;
  icon?: React.ElementType;
}

const INITIAL_TABS: WorkspaceTabItem[] = [
  { id: "home font-bold",  title: "Workspace Home", isPinned: true, icon: LayoutDashboard },
  { id: "students", title: "Student Directory", icon: Sliders },
  { id: "fees",     title: "Fee Collection",    icon: BarChart3 },
  { id: "system",   title: "System Admin",      icon: Settings },
];

export const MobileWorkspaceTabs: React.FC = () => {
  const [tabs, setTabs] = useState<WorkspaceTabItem[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState("home");
  const [closedTabs, setClosedTabs] = useState<WorkspaceTabItem[]>([]);
  const [showOverflow, setShowOverflow] = useState(false);

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const tabToClose = tabs.find((t) => t.id === id);
    if (tabToClose && !tabToClose.isPinned) {
      setClosedTabs((prev) => [tabToClose, ...prev]);
      const updated = tabs.filter((t) => t.id !== id);
      setTabs(updated);
      if (activeTabId === id && updated.length > 0) {
        setActiveTabId(updated[0].id);
      }
    }
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const restoreClosedTab = () => {
    if (closedTabs.length > 0) {
      const [restored, ...remaining] = closedTabs;
      setTabs((prev) => [...prev, restored]);
      setClosedTabs(remaining);
      setActiveTabId(restored.id);
    }
  };

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none text-xs font-sans">
      {/* Horizontal Tabs List */}
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        const Icon = tab.icon ?? LayoutDashboard;

        return (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
              isActive
                ? "bg-slate-900 text-indigo-400 font-bold border border-slate-800 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
            <span className="text-[11px] truncate max-w-[120px]">{tab.title}</span>

            {/* Pin indicator */}
            {tab.isPinned && (
              <Pin className="w-3 h-3 text-amber-400 rotate-45 shrink-0" />
            )}

            {/* Close button for non-pinned tabs */}
            {!tab.isPinned && (
              <button
                onClick={(e) => closeTab(tab.id, e)}
                aria-label={`Close ${tab.title}`}
                className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {/* Restore Closed Tab Action */}
      {closedTabs.length > 0 && (
        <button
          onClick={restoreClosedTab}
          title={`Restore closed tab (${closedTabs[0].title})`}
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-[10px] font-bold shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restore ({closedTabs.length})</span>
        </button>
      )}

      {/* Overflow Menu Button */}
      <button
        onClick={() => setShowOverflow(!showOverflow)}
        aria-label="Tab options overflow"
        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 shrink-0"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};
