import React, { useState } from "react";
import { Settings2, Star, Bookmark, Globe, Clock, Zap } from "lucide-react";
import type { SettingsPreferencesData, SettingsDensity, AnimationLevel } from "./types";

const LANDINGS = ["Settings Home", "System Dashboard", "Institution Profile", "Security Center", "Platform Config"];
const DENSITIES: SettingsDensity[] = ["compact", "comfortable", "spacious"];
const ANIMATIONS: AnimationLevel[]  = ["none", "reduced", "full"];

const DEFAULT: SettingsPreferencesData = {
  rememberLastPage:    true,
  rememberSearch:      true,
  rememberFilters:     false,
  defaultLanding:      "Settings Home",
  density:             "comfortable",
  animationLevel:      "full",
  language:            "en-IN",
  timezone:            "Asia/Kolkata",
  favoriteCategories:  ["Institution", "Security"],
  pinnedCategories:    ["System"],
};

const Toggle: React.FC<{ label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }> = ({
  label, sub, value, onChange,
}) => (
  <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
    <div>
      <p className="text-[11px] font-bold text-slate-100">{label}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${value ? "bg-indigo-600" : "bg-slate-700"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
    </button>
  </div>
);

export const SettingsPreferences: React.FC = () => {
  const [prefs, setPrefs] = useState<SettingsPreferencesData>(DEFAULT);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof SettingsPreferencesData>(k: K, v: SettingsPreferencesData[K]) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Settings Preferences</h2>
            <p className="text-[10px] text-slate-500">Personalise your settings experience — preferences are stored locally.</p>
          </div>
        </div>
        <button onClick={save} className={`px-4 py-2 font-bold rounded-xl text-[11px] transition-all ${saved ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}>
          {saved ? "✓ Saved" : "Save Preferences"}
        </button>
      </div>

      {/* Behaviour */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase mb-3">Behaviour</h3>
        <Toggle label="Remember Last Page"    sub="Reopen Settings at the last visited page"   value={prefs.rememberLastPage}  onChange={(v) => set("rememberLastPage",  v)} />
        <Toggle label="Remember Search Query" sub="Persist search text across sessions"         value={prefs.rememberSearch}    onChange={(v) => set("rememberSearch",    v)} />
        <Toggle label="Remember Active Filters" sub="Keep sidebar category selection active"    value={prefs.rememberFilters}   onChange={(v) => set("rememberFilters",   v)} />
      </div>

      {/* Default Landing Page */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400" />
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Default Landing Page</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LANDINGS.map((l) => (
            <button
              key={l}
              onClick={() => set("defaultLanding", l)}
              className={`p-2.5 rounded-xl text-[11px] font-semibold border transition-all text-left ${prefs.defaultLanding === l ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Display */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Display</h3>
        <div>
          <p className="text-[10px] font-bold text-slate-300 mb-2">Content Density</p>
          <div className="flex gap-2">
            {DENSITIES.map((d) => (
              <button
                key={d}
                onClick={() => set("density", d)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold capitalize border transition-all ${prefs.density === d ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <p className="text-[10px] font-bold text-slate-300">Animation Level</p>
          </div>
          <div className="flex gap-2">
            {ANIMATIONS.map((a) => (
              <button
                key={a}
                onClick={() => set("animationLevel", a)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold capitalize border transition-all ${prefs.animationLevel === a ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Locale (Placeholders) */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Locale & Region</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <label className="text-[10px] font-bold text-slate-300">Language</label>
              <span className="text-[9px] text-slate-600">(placeholder)</span>
            </div>
            <select value={prefs.language} onChange={(e) => set("language", e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-600">
              <option value="en-IN">English (India)</option>
              <option value="hi">हिंदी</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <label className="text-[10px] font-bold text-slate-300">Timezone</label>
              <span className="text-[9px] text-slate-600">(placeholder)</span>
            </div>
            <select value={prefs.timezone} onChange={(e) => set("timezone", e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-600">
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC +00:00</option>
            </select>
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400" />
          <h3 className="text-[11px] font-bold font-mono text-slate-400 uppercase">Favourite & Pinned Categories</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Institution","Academic","Security","System","Platform","Branding","Notifications","Finance","HR"].map((cat) => {
            const isFav = prefs.favoriteCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => set("favoriteCategories", isFav ? prefs.favoriteCategories.filter((c) => c !== cat) : [...prefs.favoriteCategories, cat])}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${isFav ? "bg-amber-600 text-white border-amber-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-amber-700"}`}
              >
                {isFav ? "★" : "☆"} {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
