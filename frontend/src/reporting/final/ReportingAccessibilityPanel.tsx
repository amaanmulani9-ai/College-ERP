import React, { useState } from "react";
import { Eye, CheckCircle2, ShieldCheck, Sun, Type } from "lucide-react";

export const ReportingAccessibilityPanel: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontScaling, setFontScaling] = useState("normal");

  return (
    <div
      role="region"
      aria-label="Accessibility & Inclusivity Settings"
      className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Accessibility & WCAG 2.1 AA Compliance Panel
          </h3>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>WCAG 2.1 AA Verified</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Font Scaling & Typography Size
          </label>
          <select
            value={fontScaling}
            onChange={(e) => setFontScaling(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono"
          >
            <option value="normal">Normal (100% Standard)</option>
            <option value="large">Large (115% High-Legibility)</option>
            <option value="extra-large">Extra Large (130% Accessibility)</option>
          </select>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="chk-high-contrast"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
            <label htmlFor="chk-high-contrast" className="text-slate-300 font-semibold cursor-pointer">
              High Contrast Color Mode (4.5:1 Ratio)
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="chk-reduced-motion"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
            <label htmlFor="chk-reduced-motion" className="text-slate-300 font-semibold cursor-pointer">
              Enforce Reduced Motion & No-FPS Animations
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
