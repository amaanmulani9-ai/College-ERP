import React from "react";
import { useSettings } from "./SettingsContext";
import { ChevronRight, Home, Sliders } from "lucide-react";

export const SettingsBreadcrumbs: React.FC = () => {
  const { activeCategory, setActiveCategory } = useSettings();

  return (
    <nav aria-label="Settings Breadcrumb Trail" className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
      <button
        onClick={() => setActiveCategory("All")}
        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Enterprise</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

      <button
        onClick={() => setActiveCategory("All")}
        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
      >
        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
        <span>Settings Hub</span>
      </button>

      {activeCategory !== "All" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-indigo-300 font-bold">{activeCategory}</span>
        </>
      )}
    </nav>
  );
};
