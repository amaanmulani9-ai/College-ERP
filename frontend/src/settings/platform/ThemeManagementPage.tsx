import React, { useState } from "react";
import { Sun, Moon, Monitor, Sliders } from "lucide-react";

export const ThemeManagementPage: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Sliders className="w-5 h-5 text-indigo-400" />
        <h2 className="text-base font-bold text-slate-100">Theme Appearance & Layout Density Options</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-2">Interface Theme Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark", label: "Dark Mode", icon: Moon },
              { id: "light", label: "Light Mode", icon: Sun },
              { id: "system", label: "System Default", icon: Monitor },
            ].map((t) => {
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    theme === t.id
                      ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
