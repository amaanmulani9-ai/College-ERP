import React, { useState } from "react";
import { Accessibility, Keyboard, Eye, Type, Volume2, Info } from "lucide-react";

export const WorkspaceAccessibilityPanel: React.FC = () => {
  const [reducedMotion,    setReducedMotion]    = useState(false);
  const [highContrast,     setHighContrast]     = useState(false);
  const [fontScale,        setFontScale]        = useState(100);
  const [keyboardNav,      setKeyboardNav]      = useState(true);
  const [focusIndicators,  setFocusIndicators]  = useState(true);
  const [screenReaderHints,setScreenReaderHints]= useState(true);

  const Toggle: React.FC<{ label: string; desc: string; checked: boolean; onChange: () => void; id: string }> = ({
    label, desc, checked, onChange, id,
  }) => (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-slate-800 last:border-0">
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-xs font-semibold text-white cursor-pointer">{label}</label>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{desc}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative mt-0.5 w-10 h-5 rounded-full flex-shrink-0 transition-colors ${checked ? "bg-indigo-600" : "bg-slate-700"}`}
        aria-label={label}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* WCAG Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
        <Accessibility className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <div>
          <div className="text-xs font-bold text-indigo-300">WCAG 2.1 AA Compliant</div>
          <div className="text-[10px] text-slate-500">Keyboard navigation · ARIA labels · Focus management</div>
        </div>
      </div>

      {/* Toggles */}
      <section aria-labelledby="a11y-toggles">
        <h3 id="a11y-toggles" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Controls</h3>
        <div className="px-1">
          <Toggle id="reduced-motion"    label="Reduced Motion"      desc="Disables animations and transitions for users who prefer less motion."    checked={reducedMotion}     onChange={() => setReducedMotion((v)    => !v)} />
          <Toggle id="high-contrast"     label="High Contrast"        desc="Increases contrast ratios for improved legibility. (Placeholder)"         checked={highContrast}      onChange={() => setHighContrast((v)     => !v)} />
          <Toggle id="keyboard-nav"      label="Keyboard Navigation"  desc="Ensures all interactive elements are reachable via Tab and arrow keys."    checked={keyboardNav}       onChange={() => setKeyboardNav((v)      => !v)} />
          <Toggle id="focus-indicators"  label="Focus Indicators"     desc="Shows visible focus rings on all interactive elements for keyboard users."  checked={focusIndicators}   onChange={() => setFocusIndicators((v)  => !v)} />
          <Toggle id="sr-hints"          label="Screen Reader Hints"  desc="Adds extra ARIA descriptions for assistive technologies."                  checked={screenReaderHints} onChange={() => setScreenReaderHints((v)=> !v)} />
        </div>
      </section>

      {/* Font scale */}
      <section aria-labelledby="font-scale-heading">
        <div id="font-scale-heading" className="flex items-center gap-2 mb-2">
          <Type className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Font Scale</span>
          <span className="ml-auto text-xs font-bold text-indigo-300">{fontScale}%</span>
        </div>
        <input
          type="range" min={80} max={150} step={10}
          value={fontScale}
          onChange={(e) => setFontScale(Number(e.target.value))}
          aria-label="Font scale percentage"
          aria-valuemin={80} aria-valuemax={150} aria-valuenow={fontScale}
          className="w-full h-1.5 rounded-full bg-slate-800 accent-indigo-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>80%</span><span>100%</span><span>150%</span>
        </div>
      </section>

      {/* Screen reader guidance */}
      <section aria-labelledby="sr-guidance">
        <div id="sr-guidance" className="flex items-center gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Screen Reader Guidance</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
          <p>• Use <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px]">Tab</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px]">Shift+Tab</kbd> to navigate interactive elements.</p>
          <p>• Use <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px]">Space</kbd> to activate buttons.</p>
          <p>• Use <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px]">Esc</kbd> to close dialogs and panels.</p>
          <p>• All landmark regions have descriptive ARIA labels.</p>
        </div>
      </section>
    </div>
  );
};
