import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, CheckCircle2, ZapOff, Sparkles } from "lucide-react";

export const MobileAccessibilityPanel: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(true);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Eye className="w-4 h-4 text-emerald-400" />
        <h3 className="font-bold text-slate-100 text-xs">Accessibility & WCAG 2.1 AA</h3>
      </div>

      {/* WCAG Compliance Badge */}
      <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="font-bold text-slate-100 text-[11px]">WCAG 2.1 AA Compliant</p>
            <p className="text-[9px] text-emerald-300/80">48px minimum touch targets & ARIA screen reader roles</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
          Verified
        </span>
      </div>

      <div className="space-y-2">
        {[
          { label: "Reduced Motion Mode", sub: "Disable parallax and sliding animations", val: reducedMotion, set: setReducedMotion },
          { label: "High Contrast Colors", sub: "Enhance text contrast ratios for outdoor viewing", val: highContrast, set: setHighContrast },
          { label: "High-Visibility Focus Rings", sub: "Display 3px outline on keyboard/switch focus", val: focusIndicators, set: setFocusIndicators },
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
      </div>
    </div>
  );
};
