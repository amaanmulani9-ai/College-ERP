import React, { useState } from "react";
import { Palette, LayoutGrid, Sliders, Monitor, Moon, Sun } from "lucide-react";

type Theme   = "dark" | "light" | "system";
type Density = "compact" | "comfortable" | "spacious";

const ACCENT_COLORS = [
  { id: "indigo",  label: "Indigo",  hex: "#6366f1" },
  { id: "violet",  label: "Violet",  hex: "#8b5cf6" },
  { id: "sky",     label: "Sky",     hex: "#0ea5e9" },
  { id: "emerald", label: "Emerald", hex: "#10b981" },
  { id: "amber",   label: "Amber",   hex: "#f59e0b" },
  { id: "rose",    label: "Rose",    hex: "#f43f5e" },
];

export const WorkspaceAppearancePanel: React.FC = () => {
  const [theme,       setTheme]       = useState<Theme>("dark");
  const [density,     setDensity]     = useState<Density>("comfortable");
  const [accent,      setAccent]      = useState("indigo");
  const [sidebarMode, setSidebarMode] = useState<"full" | "mini" | "floating">("full");
  const [animations,  setAnimations]  = useState(true);

  const themeOptions: { id: Theme; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "dark",   label: "Dark",   icon: Moon    },
    { id: "light",  label: "Light",  icon: Sun     },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-5">
      {/* Theme */}
      <section aria-labelledby="theme-heading">
        <div id="theme-heading" className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Theme</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              aria-pressed={theme === id}
              className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                theme === id
                  ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Accent Color */}
      <section aria-labelledby="accent-heading">
        <div id="accent-heading" className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Accent Color</span>
          <span className="text-[10px] text-slate-500 ml-1">(placeholder)</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setAccent(c.id)}
              aria-label={`Accent color: ${c.label}`}
              aria-pressed={accent === c.id}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                accent === c.id ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>
      </section>

      {/* Density */}
      <section aria-labelledby="density-heading">
        <div id="density-heading" className="flex items-center gap-2 mb-3">
          <LayoutGrid className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Workspace Density</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["compact","comfortable","spacious"] as Density[]).map((d) => (
            <button key={d} onClick={() => setDensity(d)} aria-pressed={density === d}
              className={`py-2 rounded-xl border text-[11px] font-semibold capitalize transition-all ${
                density === d
                  ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Sidebar mode */}
      <section aria-labelledby="sidebar-heading">
        <div id="sidebar-heading" className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Sidebar Mode</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["full","mini","floating"] as const).map((m) => (
            <button key={m} onClick={() => setSidebarMode(m)} aria-pressed={sidebarMode === m}
              className={`py-2 rounded-xl border text-[11px] font-semibold capitalize transition-all ${
                sidebarMode === m
                  ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
              {m}
            </button>
          ))}
        </div>
      </section>

      {/* Panel animations toggle */}
      <section aria-labelledby="anim-heading">
        <div id="anim-heading" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Panel Animations</span>
          </div>
          <button
            role="switch"
            aria-checked={animations}
            onClick={() => setAnimations((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${animations ? "bg-indigo-600" : "bg-slate-700"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${animations ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1">Disable for improved performance on low-end devices or when using reduced motion.</p>
      </section>
    </div>
  );
};
