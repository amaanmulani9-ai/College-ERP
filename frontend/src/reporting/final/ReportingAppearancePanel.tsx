import React, { useState } from "react";
import { Palette, Moon, Sun, Monitor } from "lucide-react";

export const ReportingAppearancePanel: React.FC = () => {
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("dark");
  const [palette, setPalette] = useState("indigo");

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Platform Appearance & Theme Customization
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            System Theme Mode
          </label>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <button
              onClick={() => setThemeMode("dark")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border ${
                themeMode === "dark"
                  ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => setThemeMode("light")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border ${
                themeMode === "light"
                  ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>

            <button
              onClick={() => setThemeMode("system")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border ${
                themeMode === "system"
                  ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Auto</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Visual Analytics Palette Theme
          </label>
          <select
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono capitalize"
          >
            <option value="indigo">Indigo Corporate Dark</option>
            <option value="emerald">Emerald Financial Glass</option>
            <option value="amber">Amber Executive Sunset</option>
            <option value="cyberpunk">Cyberpunk Neon Night</option>
          </select>
        </div>
      </div>
    </div>
  );
};
