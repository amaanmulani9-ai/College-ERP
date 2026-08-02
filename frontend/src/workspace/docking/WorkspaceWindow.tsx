import React, { useRef, useState, useCallback } from "react";
import {
  Minus,
  Maximize2,
  Minimize2,
  X,
  Pin,
  Copy,
  GripVertical,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { useWindowManager, WorkspaceWindowRecord, DockZone, WindowState } from "./WorkspaceManager";

interface WorkspaceWindowProps {
  window: WorkspaceWindowRecord;
  children?: React.ReactNode;
}

export const WorkspaceWindow: React.FC<WorkspaceWindowProps> = ({ window: win, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    setWindowState,
    setWindowDock,
    pinWindow,
    duplicateWindow,
    updateWindowPosition,
  } = useWindowManager();

  const [contextOpen, setContextOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = activeWindowId === win.id;

  // ── Drag to Move ─────────────────────────────────────────────────────────
  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.state === "maximized") return;
      e.preventDefault();
      focusWindow(win.id);
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - win.position.x,
        y: e.clientY - win.position.y,
      };

      const onMove = (ev: MouseEvent) => {
        const x = Math.max(0, ev.clientX - dragOffset.current.x);
        const y = Math.max(0, ev.clientY - dragOffset.current.y);
        updateWindowPosition(win.id, { x, y });
      };

      const onUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, focusWindow, updateWindowPosition]
  );

  if (win.state === "minimized") {
    return (
      <div
        onClick={() => setWindowState(win.id, "normal")}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all select-none ${
          isActive ? "border-indigo-500/50" : ""
        }`}
        title={`Restore: ${win.title}`}
      >
        <Maximize2 className="w-3 h-3 text-indigo-400" />
        {win.title}
      </div>
    );
  }

  const isMaximized = win.state === "maximized";

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: "absolute",
        inset: 0,
        zIndex: win.zIndex,
        width: "100%",
        height: "100%",
      }
    : {
        position: "absolute",
        top: win.position.y,
        left: win.position.x,
        width: win.position.width,
        height: win.position.height,
        zIndex: win.zIndex,
        minWidth: 320,
        minHeight: 200,
      };

  return (
    <div
      ref={containerRef}
      style={windowStyle}
      onClick={() => focusWindow(win.id)}
      className={`flex flex-col rounded-2xl overflow-hidden shadow-2xl border transition-shadow select-none ${
        isActive
          ? "border-indigo-500/40 shadow-indigo-900/30"
          : "border-slate-800/80 opacity-95"
      } ${isDragging ? "shadow-2xl shadow-indigo-600/20" : ""}`}
    >
      {/* ── Title Bar ─────────────────────────────────────────────────────── */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className={`h-9 px-3 flex items-center justify-between flex-shrink-0 cursor-grab active:cursor-grabbing select-none ${
          isActive
            ? "bg-slate-800 border-b border-slate-700"
            : "bg-slate-900 border-b border-slate-800"
        }`}
      >
        {/* Left: Icon + Title + Pin badge */}
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-white truncate">{win.title}</span>
          {win.isPinned && (
            <span className="px-1.5 py-0.5 rounded bg-indigo-600/20 text-[10px] font-bold text-indigo-300 flex-shrink-0">
              PINNED
            </span>
          )}
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Context Menu Toggle */}
          <div className="relative">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setContextOpen(!contextOpen);
              }}
              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Window Options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {contextOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 text-xs z-50"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseLeave={() => setContextOpen(false)}
              >
                <button onClick={() => { pinWindow(win.id); setContextOpen(false); }} className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white">
                  {win.isPinned ? "Unpin Window" : "Pin Window"}
                </button>
                <button onClick={() => { duplicateWindow(win.id); setContextOpen(false); }} className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white">
                  Duplicate Window
                </button>
                <hr className="border-slate-800 my-1" />
                {(["left", "right", "top", "bottom", "center"] as DockZone[]).map((zone) => (
                  <button
                    key={zone}
                    onClick={() => { setWindowDock(win.id, zone); setContextOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 hover:text-white ${win.dockZone === zone ? "text-indigo-400" : "text-slate-300"}`}
                  >
                    Dock {zone.charAt(0).toUpperCase() + zone.slice(1)}
                  </button>
                ))}
                <hr className="border-slate-800 my-1" />
                <button onClick={() => { closeWindow(win.id); setContextOpen(false); }} className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-slate-800">
                  Close Window
                </button>
              </div>
            )}
          </div>

          {/* Minimize */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setWindowState(win.id, "minimized"); }}
            className="p-1 rounded hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors"
            title="Minimize"
            aria-label="Minimize window"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setWindowState(win.id, isMaximized ? "normal" : "maximized");
            }}
            className="p-1 rounded hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close */}
          {!win.isPinned && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
              className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Close"
              aria-label="Close window"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Window Body ───────────────────────────────────────────────────── */}
      <div className={`flex-1 overflow-auto ${isActive ? "bg-slate-950" : "bg-slate-950/90"}`}>
        {children ?? (
          <div className="h-full flex flex-col items-center justify-center gap-3 p-6">
            <div className="text-xs font-bold text-slate-400">{win.title}</div>
            <div className="font-mono text-[11px] text-indigo-400">{win.route}</div>
            <a
              href={win.route}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Navigate to Module
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
