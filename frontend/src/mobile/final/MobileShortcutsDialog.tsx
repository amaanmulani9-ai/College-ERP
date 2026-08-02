import React from "react";
import { Command, Smartphone, Keyboard, TouchpadIcon } from "lucide-react";

export const MobileShortcutsDialog: React.FC = () => {
  const GESTURES = [
    { gesture: "Swipe Left / Right", action: "Switch between open Workspace tabs" },
    { gesture: "Pull Down", action: "Refresh real-time activity feed & notifications" },
    { gesture: "Tap & Hold Card", action: "Pin or unpin module from Favorites grid" },
    { gesture: "Double Tap Title", action: "Maximize responsive visual chart viewer" },
  ];

  const KEYBOARD_SHORTCUTS = [
    { key: "⌘ + K / Ctrl + K", action: "Open Workspace Search Modal" },
    { key: "⌘ + B / Ctrl + B", action: "Toggle Mobile Navigation Drawer" },
    { key: "⌘ + Shift + A", action: "Open Docked AI Workspace Assistant" },
  ];

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Command className="w-4 h-4 text-cyan-400" />
        <h3 className="font-bold text-slate-100 text-xs">Touch Gestures & Shortcuts</h3>
      </div>

      {/* Gestures */}
      <div className="space-y-1.5">
        <p className="text-[9px] font-bold font-mono text-slate-500 uppercase">Touch Gestures</p>
        {GESTURES.map((g) => (
          <div key={g.gesture} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="font-bold text-indigo-300 text-[10px]">{g.gesture}</span>
            <span className="text-[10px] text-slate-400">{g.action}</span>
          </div>
        ))}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="space-y-1.5 pt-1">
        <p className="text-[9px] font-bold font-mono text-slate-500 uppercase">Hardware Keyboard Shortcuts</p>
        {KEYBOARD_SHORTCUTS.map((k) => (
          <div key={k.key} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px]">
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-200 font-bold">{k.key}</span>
            <span className="text-slate-400">{k.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
