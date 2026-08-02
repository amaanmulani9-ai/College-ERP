import React, { useState, useEffect } from "react";
import { Bookmark, Plus, Trash2, ExternalLink, Star, FolderOpen } from "lucide-react";

export interface WorkspaceBookmark {
  id: string;
  title: string;
  route: string;
  module: string;
  isFavorite: boolean;
  addedAt: number;
}

const STORAGE_KEY = "college_erp_workspace_bookmarks";

const defaultBookmarks: WorkspaceBookmark[] = [
  { id: "b1", title: "Student Directory",       route: "/students",    module: "Academic",   isFavorite: true,  addedAt: Date.now() - 86400000 },
  { id: "b2", title: "Examinations & Grading",  route: "/examinations", module: "Academic",  isFavorite: false, addedAt: Date.now() - 72000000 },
  { id: "b3", title: "Visitor Gate Passes",     route: "/visitor",     module: "Security",   isFavorite: true,  addedAt: Date.now() - 43200000 },
  { id: "b4", title: "AI Academic Assistant",   route: "/ai",          module: "AI & Tools", isFavorite: true,  addedAt: Date.now() - 21600000 },
  { id: "b5", title: "Placement Campus Drives", route: "/placement",   module: "Careers",    isFavorite: false, addedAt: Date.now() - 10800000 },
  { id: "b6", title: "Fee Payment Collection",  route: "/fees",        module: "Finance",    isFavorite: false, addedAt: Date.now() - 3600000 },
];

export const WorkspaceBookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<WorkspaceBookmark[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : defaultBookmarks; } catch { return defaultBookmarks; }
  });
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks)); } catch { /* silent */ }
  }, [bookmarks]);

  const toggleFav = (id: string) =>
    setBookmarks((prev) => prev.map((b) => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  const remove = (id: string) => setBookmarks((prev) => prev.filter((b) => b.id !== id));

  // Group by module
  const modules = [...new Set(bookmarks.map((b) => b.module))];

  const favorites = bookmarks.filter((b) => b.isFavorite);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Favorites Row */}
      {favorites.length > 0 && (
        <div className="space-y-1.5">
          <div className="px-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400" /> Favorites
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {favorites.map((b) => (
              <a key={b.id} href={b.route}
                className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/20 border border-amber-800/30 hover:bg-amber-950/40 text-xs text-amber-200 truncate transition-all group">
                <ExternalLink className="w-3 h-3 flex-shrink-0 text-amber-400" />
                <span className="truncate">{b.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Grouped by Module */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {modules.map((mod) => {
          const items = bookmarks.filter((b) => b.module === mod);
          const isOpen = expandedModule === mod || expandedModule === null;
          return (
            <div key={mod} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setExpandedModule(isOpen && expandedModule === mod ? null : mod)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" /> {mod}
                </span>
                <span className="text-slate-600 text-[10px]">{items.length}</span>
              </button>
              {isOpen && (
                <div className="border-t border-slate-800 divide-y divide-slate-800/60">
                  {items.map((b) => (
                    <div key={b.id} className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/60 group transition-all">
                      <a href={b.route} className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-200 hover:text-white truncate">{b.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{b.route}</div>
                      </a>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleFav(b.id)}
                          className={`p-1 rounded hover:bg-slate-700 ${b.isFavorite ? "text-amber-400" : "text-slate-500 hover:text-amber-400"}`}>
                          <Star className={`w-3 h-3 ${b.isFavorite ? "fill-amber-400" : ""}`} />
                        </button>
                        <button onClick={() => remove(b.id)}
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
