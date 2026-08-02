import React, { useState } from "react";
import { X, Pin, Copy, RefreshCw, Circle } from "lucide-react";
import { WorkspaceTabItem, useTabs } from "./TabContext";

interface WorkspaceTabProps {
  tab: WorkspaceTabItem;
  isActive: boolean;
}

export const WorkspaceTab: React.FC<WorkspaceTabProps> = ({ tab, isActive }) => {
  const { setActiveTabId, closeTab, closeOtherTabs, pinTab, duplicateTab } = useTabs();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuOpen(true);
  };

  return (
    <div
      className={`relative group flex items-center gap-2 px-3.5 py-1.5 rounded-t-xl text-xs font-medium cursor-pointer transition-all border-t border-x select-none ${
        isActive
          ? "bg-slate-950 border-slate-700/80 text-indigo-400 font-semibold shadow-sm"
          : "bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
      }`}
      onClick={() => setActiveTabId(tab.id)}
      onContextMenu={handleContextMenu}
    >
      {/* Pin Icon */}
      {tab.isPinned && <Pin className="w-3 h-3 text-indigo-400 rotate-45" />}

      {/* Unsaved indicator dot */}
      {tab.isUnsaved && <Circle className="w-2 h-2 fill-amber-400 text-amber-400" />}

      {/* Tab Title */}
      <span className="truncate max-w-[130px]">{tab.title}</span>

      {/* Close Button (if not pinned) */}
      {!tab.isPinned && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeTab(tab.id);
          }}
          className="p-0.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Close Tab"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Tab Context Menu */}
      {contextMenuOpen && (
        <div
          className="fixed bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs z-50 w-40"
          onMouseLeave={() => setContextMenuOpen(false)}
        >
          <button
            onClick={() => {
              pinTab(tab.id);
              setContextMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {tab.isPinned ? "Unpin Tab" : "Pin Tab"}
          </button>
          <button
            onClick={() => {
              duplicateTab(tab.id);
              setContextMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Duplicate Tab
          </button>
          <button
            onClick={() => {
              closeOtherTabs(tab.id);
              setContextMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Close Other Tabs
          </button>
        </div>
      )}
    </div>
  );
};
