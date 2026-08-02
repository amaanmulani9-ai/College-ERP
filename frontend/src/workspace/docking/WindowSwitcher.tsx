import React, { useEffect } from "react";
import { X, Layers } from "lucide-react";
import { useWindowManager } from "./WorkspaceManager";

export const WindowSwitcher: React.FC = () => {
  const { windows, activeWindowId, focusWindow, isSwitcherOpen, setSwitcherOpen } =
    useWindowManager();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSwitcherOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSwitcherOpen]);

  if (!isSwitcherOpen) return null;

  const visibleWindows = windows.filter((w) => w.state !== "minimized");

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white">Open Windows</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-600/20 text-xs text-indigo-300 border border-indigo-500/30">
              {visibleWindows.length}
            </span>
          </div>
          <button
            onClick={() => setSwitcherOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Window List */}
        <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
          {visibleWindows.map((win) => (
            <button
              key={win.id}
              onClick={() => {
                focusWindow(win.id);
                setSwitcherOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-all ${
                win.id === activeWindowId
                  ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div>
                <div className="font-semibold">{win.title}</div>
                <div className="text-[10px] text-slate-500 font-mono">{win.route}</div>
              </div>
              <div className="flex items-center gap-2">
                {win.isPinned && (
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600/20 text-[10px] text-indigo-300">PIN</span>
                )}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  win.dockZone === "center"
                    ? "bg-slate-800 text-slate-400"
                    : "bg-emerald-600/20 text-emerald-300"
                }`}>
                  {win.dockZone.toUpperCase()}
                </span>
              </div>
            </button>
          ))}

          {visibleWindows.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500">No open windows</div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Ctrl+Tab to cycle • ESC to close</span>
          <span className="text-indigo-400 font-semibold">{windows.filter(w => w.state === "minimized").length} minimized</span>
        </div>
      </div>
    </div>
  );
};
