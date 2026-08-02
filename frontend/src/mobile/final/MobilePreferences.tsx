import React, { useState } from "react";
import { Sliders, Monitor, Clock, Globe, ToggleLeft, Check } from "lucide-react";

export const MobilePreferences: React.FC = () => {
  const [rememberScreen, setRememberScreen] = useState(true);
  const [rememberTabs, setRememberTabs] = useState(true);
  const [defaultDashboard, setDefaultDashboard] = useState("academic");
  const [compactMode, setCompactMode] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Sliders className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Mobile Personalization Preferences</h3>
      </div>

      <div className="space-y-2">
        {[
          { label: "Remember Last Screen", sub: "Restore active mobile view on application launch", val: rememberScreen, set: setRememberScreen },
          { label: "Remember Open Workspace Tabs", sub: "Keep active tabs preserved across app restarts", val: rememberTabs, set: setRememberTabs },
          { label: "Compact Display Density", sub: "Use smaller row padding for mobile list items", val: compactMode, set: setCompactMode },
          { label: "Smooth Micro-Animations", sub: "Enable GPU transitions and UI animations", val: enableAnimations, set: setEnableAnimations },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <p className="font-bold text-slate-200 text-[11px]">{item.label}</p>
              <p className="text-[9px] text-slate-500">{item.sub}</p>
            </div>
            <button
              role="switch"
              aria-checked={item.val}
              onClick={() => item.set(!item.val)}
              className={`relative w-10 h-5 rounded-full transition-colors ${item.val ? "bg-indigo-600" : "bg-slate-700"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.val ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        ))}

        {/* Default Dashboard Selector */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <p className="font-bold text-slate-200 text-[11px]">Default Mobile Dashboard View</p>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[
              { id: "academic",  label: "Academic" },
              { id: "executive", label: "Executive" },
              { id: "financial", label: "Financial" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDefaultDashboard(d.id)}
                className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                  defaultDashboard === d.id ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
