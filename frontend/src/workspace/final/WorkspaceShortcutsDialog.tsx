import React, { useState, useEffect, useRef } from "react";
import { Keyboard, Search, X, Printer } from "lucide-react";

interface Shortcut {
  id: string;
  category: string;
  label: string;
  keys: string[];
}

const ALL_SHORTCUTS: Shortcut[] = [
  // Navigation
  { id: "s1",  category: "Navigation",   label: "Open Command Palette",        keys: ["Ctrl", "K"]             },
  { id: "s2",  category: "Navigation",   label: "Toggle AI Assistant",         keys: ["Ctrl", "Shift", "A"]    },
  { id: "s3",  category: "Navigation",   label: "Global Search",               keys: ["Ctrl", "F"]             },
  { id: "s4",  category: "Navigation",   label: "Go to Dashboard",             keys: ["Ctrl", "Home"]          },
  { id: "s5",  category: "Navigation",   label: "Go back",                     keys: ["Alt", "←"]              },
  { id: "s6",  category: "Navigation",   label: "Go forward",                  keys: ["Alt", "→"]              },
  // Workspace
  { id: "s7",  category: "Workspace",    label: "Switch Window (Docking)",     keys: ["Ctrl", "Tab"]           },
  { id: "s8",  category: "Workspace",    label: "Close Active Window",         keys: ["Ctrl", "W"]             },
  { id: "s9",  category: "Workspace",    label: "New Workspace Tab",           keys: ["Ctrl", "T"]             },
  { id: "s10", category: "Workspace",    label: "Toggle Sidebar",              keys: ["Ctrl", "\\"]            },
  { id: "s11", category: "Workspace",    label: "Toggle Productivity Hub",     keys: ["Ctrl", "Shift", "P"]    },
  { id: "s12", category: "Workspace",    label: "Open Shortcuts Dialog",       keys: ["Ctrl", "Shift", "?"]    },
  // Editor / Forms
  { id: "s13", category: "Editor",       label: "Save / Submit Form",          keys: ["Ctrl", "S"]             },
  { id: "s14", category: "Editor",       label: "Undo",                        keys: ["Ctrl", "Z"]             },
  { id: "s15", category: "Editor",       label: "Redo",                        keys: ["Ctrl", "Y"]             },
  { id: "s16", category: "Editor",       label: "Copy",                        keys: ["Ctrl", "C"]             },
  { id: "s17", category: "Editor",       label: "Paste",                       keys: ["Ctrl", "V"]             },
  // AI
  { id: "s18", category: "AI",           label: "Open AI Chat",                keys: ["Ctrl", "Shift", "A"]    },
  { id: "s19", category: "AI",           label: "Send AI Message",             keys: ["Enter"]                 },
  { id: "s20", category: "AI",           label: "New AI Conversation",         keys: ["Ctrl", "Shift", "N"]    },
  // Dialogs
  { id: "s21", category: "Dialogs",      label: "Close Dialog / Panel",        keys: ["Esc"]                   },
  { id: "s22", category: "Dialogs",      label: "Confirm Dialog",              keys: ["Enter"]                 },
  { id: "s23", category: "Dialogs",      label: "Open Help Center",            keys: ["F1"]                    },
  { id: "s24", category: "Dialogs",      label: "Open Shortcuts Dialog",       keys: ["?"]                     },
];

const CATEGORIES = ["All", ...new Set(ALL_SHORTCUTS.map((s) => s.category))];

interface WorkspaceShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceShortcutsDialog: React.FC<WorkspaceShortcutsDialogProps> = ({
  isOpen, onClose,
}) => {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen) { setSearch(""); inputRef.current?.focus(); }
  }, [isOpen]);

  // Esc to close, "?" to open (handled in parent)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = ALL_SHORTCUTS.filter((s) => {
    const matchCat = category === "All" || s.category === category;
    const matchQ   = !search || s.label.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const grouped = CATEGORIES.filter((c) => c !== "All").reduce<Record<string, Shortcut[]>>((acc, cat) => {
    const items = filtered.filter((s) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Keyboard className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <h2 className="text-base font-bold text-white flex-1">Keyboard Shortcuts</h2>
          <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Print shortcuts" title="Print (placeholder)">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Close shortcuts dialog">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input ref={inputRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shortcuts…" aria-label="Search keyboard shortcuts"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 px-5 py-2.5 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                category === cat ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Shortcut list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {Object.entries(category === "All" ? grouped : { [category]: filtered }).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{cat}</h3>
              <div className="space-y-1">
                {items.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-900 group transition-all">
                    <span className="text-sm text-slate-300 group-hover:text-white">{s.label}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {s.keys.map((k, i) => (
                        <React.Fragment key={i}>
                          <kbd className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold font-mono text-slate-200 shadow-sm">
                            {k}
                          </kbd>
                          {i < s.keys.length - 1 && <span className="text-slate-600 text-[10px]">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500">No shortcuts match "{search}"</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 text-[11px] text-slate-600 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono">Esc</kbd> to close · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono">?</kbd> to reopen
        </div>
      </div>
    </div>
  );
};
