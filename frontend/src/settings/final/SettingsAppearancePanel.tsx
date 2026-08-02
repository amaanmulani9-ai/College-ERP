import React, { useState } from "react";
import { Palette, Monitor, Sun, Moon, Sliders, LayoutTemplate } from "lucide-react";
import type { AppearanceConfig, ThemeMode, SettingsDensity, AnimationLevel } from "./types";

const THEMES: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
  { id: "dark",   label: "Dark",   icon: Moon   },
  { id: "light",  label: "Light",  icon: Sun    },
  { id: "system", label: "System", icon: Monitor },
];

const DENSITIES: SettingsDensity[] = ["compact", "comfortable", "spacious"];
const ANIMATIONS: AnimationLevel[]  = ["none", "reduced", "full"];
const SIDEBARS   = ["fixed", "collapsible", "floating"] as const;

const ACCENTS = [
  "#4F46E5", "#0EA5E9", "#10B981", "#F59E0B",
  "#EC4899", "#8B5CF6", "#EF4444", "#F97316",
];

const DEFAULT: AppearanceConfig = {
  theme: "dark", density: "comfortable", animationLevel: "full",
  sidebarBehavior: "fixed", accentColor: "#4F46E5",
};

export const SettingsAppearancePanel: React.FC = () => {
  const [cfg, setCfg] = useState<AppearanceConfig>(DEFAULT);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof AppearanceConfig>(k: K, v: AppearanceConfig[K]) =>
    setCfg((c) => ({ ...c, [k]: v }));

  return (
    <div className="space-y-5 text-xs font-sans">
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Appearance Settings</h2>
            <p className="text-[10px] text-slate-500">Customise theme, density, sidebar behaviour and animation level.</p>
          </div>
        </div>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className={`px-4 py-2 font-bold rounded-xl text-[11px] transition-all ${saved ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}>
          {saved ? "✓ Applied" : "Apply"}
        </button>
      </div>

      {/* Theme */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Theme Mode</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => set("theme", t.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${cfg.theme === t.id ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600"}`}>
              <t.icon className="w-5 h-5" />
              <span className="text-[11px] font-bold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Colour (placeholder) */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Accent Colour</h3>
          <span className="text-[9px] text-slate-600 font-mono">(placeholder)</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {ACCENTS.map((color) => (
            <button key={color} onClick={() => set("accentColor", color)}
              style={{ background: color }}
              className={`w-8 h-8 rounded-full transition-all border-2 ${cfg.accentColor === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
              title={color}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <div className="w-4 h-4 rounded-full border border-slate-600" style={{ background: cfg.accentColor }} />
          <code className="font-mono">{cfg.accentColor}</code>
          <span>— Applied as CSS custom property</span>
        </div>
      </div>

      {/* Density */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Content Density</h3>
        </div>
        <div className="flex gap-2">
          {DENSITIES.map((d) => (
            <button key={d} onClick={() => set("density", d)}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold capitalize border transition-all ${cfg.density === d ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-emerald-400" />
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Sidebar Behaviour</h3>
        </div>
        <div className="flex gap-2">
          {SIDEBARS.map((s) => (
            <button key={s} onClick={() => set("sidebarBehavior", s)}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold capitalize border transition-all ${cfg.sidebarBehavior === s ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Animation */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Animation Level</h3>
        <div className="flex gap-2">
          {ANIMATIONS.map((a) => (
            <button key={a} onClick={() => set("animationLevel", a)}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold capitalize border transition-all ${cfg.animationLevel === a ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600"}`}>
              {a}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500">
          "None" disables all CSS transitions and respects <code className="font-mono">prefers-reduced-motion</code>.
        </p>
      </div>
    </div>
  );
};
