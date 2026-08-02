import React, { useState, useEffect } from "react";
import { Command, X, Keyboard } from "lucide-react";

export interface ShortcutItem {
  keyCombo: string;
  description: string;
  category: string;
}

export const SHORTCUT_LIST: ShortcutItem[] = [
  { keyCombo: "Ctrl + K / ⌘K", description: "Open Workspace Search Modal", category: "Navigation" },
  { keyCombo: "Ctrl + B / ⌘B", description: "Toggle Navigation Drawer", category: "Navigation" },
  { keyCombo: "Ctrl + Shift + A", description: "Open Docked AI Assistant", category: "Tools" },
  { keyCombo: "Escape", description: "Close active modal dialog or overlay", category: "Actions" },
  { keyCombo: "?", description: "Open Keyboard Shortcuts Help Overlay", category: "Help" },
];

export const ShortcutOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-xs">Keyboard Shortcuts Guide</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 font-mono text-[10px]">
          {SHORTCUT_LIST.map((item) => (
            <div key={item.keyCombo} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-300">{item.description}</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-indigo-300 font-bold">
                {item.keyCombo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GlobalShortcutManager: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        setShowHelp((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <ShortcutOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />;
};

export const KeyboardShortcuts: React.FC = () => <GlobalShortcutManager />;
