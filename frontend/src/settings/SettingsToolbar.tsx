import React, { useEffect } from "react";
import { useSettings } from "./SettingsContext";
import { Search, LayoutGrid, List, Sliders, ExternalLink } from "lucide-react";

interface SettingsToolbarProps {
  onOpenSearchModal: () => void;
  onOpenInWorkspace?: () => void;
}

export const SettingsToolbar: React.FC<SettingsToolbarProps> = ({
  onOpenSearchModal,
  onOpenInWorkspace,
}) => {
  const { activeCategory, viewMode, setViewMode, searchQuery, setSearchQuery } = useSettings();

  // Keyboard shortcut Ctrl+, trigger for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        onOpenSearchModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearchModal]);

  return (
    <div
      role="toolbar"
      aria-label="Settings Toolbar Controls"
      className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl mb-6 text-xs shadow-md"
    >
      {/* Category Indicator & Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400 font-bold">Category:</span>
          <span className="text-indigo-400 font-extrabold bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-800">
            {activeCategory}
          </span>
        </div>

        {/* Quick Instant Search Trigger */}
        <div
          onClick={onOpenSearchModal}
          className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 hover:border-indigo-500/60 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs">Search settings (e.g. SMTP, RBAC, Fees)...</span>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl+,
          </kbd>
        </div>
      </div>

      {/* Right Actions: View Mode & Workspace Tab */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {onOpenInWorkspace && (
          <button
            onClick={onOpenInWorkspace}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </button>
        )}
      </div>
    </div>
  );
};
