import React, { useState } from "react";
import { Palette, Moon, Sun, Monitor, Type, Layers } from "lucide-react";

export const MobileAppearancePanel: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accent, setAccent] = useState("indigo");
  const [fontScale, setFontScale] = useState(100);
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  const ACCENTS = [
    { id: "indigo", bg: "bg-indigo-600", border: "border-indigo-500" },
    { id: "emerald",bg: "bg-emerald-600",border: "border-emerald-500" },
    { id: "purple", bg: "bg-purple-600", border: "border-purple-500" },
    { id: "cyan",   bg: "bg-cyan-600",   border: "border-cyan-500" },
    { id: "amber",  bg: "bg-amber-600",  border: "border-amber-500" },
  ];

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Palette className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Mobile Theme & Appearance</h3>
      </div>

      {/* Mode Selector */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold font-mono text-slate-500 uppercase">Color Scheme</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "dark",   label: "Dark",   icon: Moon },
            { id: "light",  label: "Light",  icon: Sun },
            { id: "system", label: "System", icon: Monitor },
          ].map((t) => {
            const Icon = t.icon;
            const isAct = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                  isAct ? "bg-indigo-600 text-white border-indigo-500 font-bold" : "bg-slate-950 text-slate-400 border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold font-mono text-slate-500 uppercase">Accent Theme Palette</p>
        <div className="flex items-center gap-3 p-2.5 bg-slate-950 border border-slate-800 rounded-xl justify-around">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={`w-7 h-7 rounded-full ${a.bg} border-2 transition-transform ${
                accent === a.id ? "scale-125 border-white shadow-lg" : "border-transparent opacity-60"
              }`}
              aria-label={`Select ${a.id} theme`}
            />
          ))}
        </div>
      </div>

      {/* Font Scale & Density */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <p className="font-bold text-slate-200 text-[10px]">Font Scale ({fontScale}%)</p>
          <div className="flex items-center gap-1 pt-1">
            {[90, 100, 110, 120].map((s) => (
              <button
                key={s}
                onClick={() => setFontScale(s)}
                className={`flex-1 py-1 rounded border text-[9px] font-mono font-bold ${
                  fontScale === s ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <p className="font-bold text-slate-200 text-[10px]">Padding Density</p>
          <div className="flex items-center gap-1 pt-1">
            {["comfortable", "compact"].map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d as any)}
                className={`flex-1 py-1 rounded border text-[9px] font-bold capitalize ${
                  density === d ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
