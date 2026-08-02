import React, { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle2, RotateCcw } from "lucide-react";
import { ReportingPreferencesData } from "./types";
import { DEFAULT_PREFERENCES } from "./mockFinalData";

const LOCAL_STORAGE_PREFS_KEY = "college_erp_reporting_preferences_v1";

export const ReportingPreferences: React.FC = () => {
  const [prefs, setPrefs] = useState<ReportingPreferencesData>(DEFAULT_PREFERENCES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PREFS_KEY);
      if (stored) {
        setPrefs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load preferences", e);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFS_KEY, JSON.stringify(prefs));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error("Failed to save preferences", e);
    }
  };

  const handleReset = () => {
    setPrefs(DEFAULT_PREFERENCES);
    localStorage.removeItem(LOCAL_STORAGE_PREFS_KEY);
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Reporting Platform Personalization & Preferences
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Default Platform Entry Mode
          </label>
          <select
            value={prefs.defaultView}
            onChange={(e) => setPrefs({ ...prefs, defaultView: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="catalog">Report Catalog</option>
            <option value="analytics">Visual Analytics Hub</option>
            <option value="builder">No-Code Report Builder</option>
            <option value="executive">Executive Analytics Center</option>
            <option value="distribution">Distribution Hub</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            UI Density Layout
          </label>
          <select
            value={prefs.density}
            onChange={(e) => setPrefs({ ...prefs, density: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="compact">Compact (High Information Density)</option>
            <option value="comfortable">Comfortable (Balanced)</option>
            <option value="spacious">Spacious (Touch-Friendly)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Chart Render Animation Level
          </label>
          <select
            value={prefs.animationLevel}
            onChange={(e) => setPrefs({ ...prefs, animationLevel: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="full">Full Motion (60 FPS Smooth)</option>
            <option value="reduced">Reduced Motion</option>
            <option value="none">No Motion (Instant Render)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Chart Color Palette Theme
          </label>
          <select
            value={prefs.chartPalette}
            onChange={(e) => setPrefs({ ...prefs, chartPalette: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 capitalize font-mono"
          >
            <option value="indigo">Indigo Corporate</option>
            <option value="emerald">Emerald Finance</option>
            <option value="amber">Amber Warmth</option>
            <option value="rose">Rose High Contrast</option>
            <option value="cyberpunk">Cyberpunk Neon</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="chk-rem-filter"
            checked={prefs.rememberFilters}
            onChange={(e) => setPrefs({ ...prefs, rememberFilters: e.target.checked })}
            className="accent-indigo-500 w-4 h-4"
          />
          <label htmlFor="chk-rem-filter" className="text-slate-300 font-semibold cursor-pointer">
            Remember Filter Parameters & Module Selections Across Sessions
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="chk-auto-open"
            checked={prefs.autoOpenRecent}
            onChange={(e) => setPrefs({ ...prefs, autoOpenRecent: e.target.checked })}
            className="accent-indigo-500 w-4 h-4"
          />
          <label htmlFor="chk-auto-open" className="text-slate-300 font-semibold cursor-pointer">
            Auto-Open Last Viewed Report Upon Login
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-800">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Saved Preferences!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
