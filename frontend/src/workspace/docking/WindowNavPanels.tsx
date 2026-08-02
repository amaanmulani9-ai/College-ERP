import React from "react";
import { Layers, ArrowRight, Pin, Clock, X } from "lucide-react";
import { useWindowManager } from "./WorkspaceManager";

// ─── Open Windows Panel ────────────────────────────────────────────────────────
export const OpenWindowsPanel: React.FC = () => {
  const { windows, activeWindowId, focusWindow, closeWindow } = useWindowManager();
  const open = windows.filter((w) => w.state !== "minimized");

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 select-none">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Layers className="w-4 h-4 text-indigo-400" />
        Open Windows
        <span className="ml-auto px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 text-[10px]">{open.length}</span>
      </h4>
      <div className="space-y-1">
        {open.map((w) => (
          <div
            key={w.id}
            className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer group transition-all ${
              w.id === activeWindowId ? "bg-indigo-600/20 border border-indigo-500/20" : "hover:bg-slate-800"
            }`}
            onClick={() => focusWindow(w.id)}
          >
            <div>
              <div className="text-xs font-semibold text-white">{w.title}</div>
              <div className="text-[10px] text-slate-500 font-mono">{w.route}</div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); closeWindow(w.id); }}
                className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {open.length === 0 && (
          <div className="text-center text-xs text-slate-600 py-4">No open windows</div>
        )}
      </div>
    </div>
  );
};

// ─── Pinned Windows Panel ──────────────────────────────────────────────────────
export const PinnedWindowsPanel: React.FC = () => {
  const { windows, focusWindow } = useWindowManager();
  const pinned = windows.filter((w) => w.isPinned);

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 select-none">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Pin className="w-4 h-4 text-indigo-400" />
        Pinned Windows
      </h4>
      <div className="space-y-1">
        {pinned.map((w) => (
          <button
            key={w.id}
            onClick={() => focusWindow(w.id)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-left group transition-all"
          >
            <div>
              <div className="text-xs font-semibold text-white">{w.title}</div>
              <div className="text-[10px] text-slate-500 font-mono">{w.route}</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400" />
          </button>
        ))}
        {pinned.length === 0 && (
          <div className="text-center text-xs text-slate-600 py-4">No pinned windows</div>
        )}
      </div>
    </div>
  );
};

// ─── Recent Windows Panel ──────────────────────────────────────────────────────
export const RecentWindowsPanel: React.FC = () => {
  const { windows, openWindow } = useWindowManager();

  // Sort by openedAt desc, take last 5
  const recent = [...windows]
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, 5);

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 select-none">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-indigo-400" />
        Recent Windows
      </h4>
      <div className="space-y-1">
        {recent.map((w) => (
          <button
            key={w.id}
            onClick={() =>
              openWindow({ title: w.title, route: w.route, iconName: w.iconName })
            }
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-left group transition-all"
          >
            <div>
              <div className="text-xs font-semibold text-white">{w.title}</div>
              <div className="text-[10px] text-slate-500">{new Date(w.openedAt).toLocaleTimeString()}</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400" />
          </button>
        ))}
        {recent.length === 0 && (
          <div className="text-center text-xs text-slate-600 py-4">No recent windows</div>
        )}
      </div>
    </div>
  );
};
