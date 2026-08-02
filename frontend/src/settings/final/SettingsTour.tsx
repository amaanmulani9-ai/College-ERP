import React, { useState } from "react";
import { Map, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, Award } from "lucide-react";
import type { TourStep } from "./types";

const TOUR_STEPS: TourStep[] = [
  { id: "home",        emoji: "🏠", title: "Settings Home",          description: "Your central hub for all ERP configuration. Browse by category, use search, or jump to favourites from here.",    target: "Settings Home" },
  { id: "institution", emoji: "🏛️", title: "Institution & Academic",  description: "Configure your institution profile, campuses, academic structure, departments, programs, and calendar.",             target: "Institution" },
  { id: "security",    emoji: "🔐", title: "Security & IAM",          description: "Manage users, roles, permissions, authentication policies, MFA, IP whitelists, and device management.",              target: "Security" },
  { id: "platform",    emoji: "⚙️", title: "Platform Settings",       description: "Control branding, notifications, payment gateways, AI configuration, integrations, module flags and webhooks.",      target: "Platform" },
  { id: "system",      emoji: "🖥️", title: "System Administration",   description: "Monitor infrastructure health, manage backups, audit logs, job queues, cache, database, and disaster recovery.",    target: "System" },
  { id: "search",      emoji: "🔍", title: "Global Search",           description: "Use the search bar at the top of Settings to instantly find any setting across all categories. Supports fuzzy match.", target: "Search" },
];

export const SettingsTour: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [step, setStep]       = useState(0);
  const [complete, setComplete] = useState(false);

  const current = TOUR_STEPS[step];
  const pct     = ((step + 1) / TOUR_STEPS.length) * 100;

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else setComplete(true);
  };
  const prev = () => setStep(Math.max(0, step - 1));

  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center space-y-5 text-xs font-sans">
        <Award className="w-16 h-16 text-amber-400" />
        <div>
          <h2 className="text-xl font-bold text-slate-100">You've mastered Settings! 🎉</h2>
          <p className="text-slate-400 mt-2">You can restart this tour at any time from the Help Center.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setStep(0); setComplete(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors text-[11px]">
            <RotateCcw className="w-3.5 h-3.5" /> Restart Tour
          </button>
          {onClose && (
            <button onClick={onClose}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-[11px]">
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs font-sans max-w-lg mx-auto">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Settings Tour</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{step + 1} / {TOUR_STEPS.length}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 mt-2 justify-center">
          {TOUR_STEPS.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`transition-all rounded-full ${i === step ? "w-5 h-2 bg-indigo-500" : i < step ? "w-2 h-2 bg-emerald-500" : "w-2 h-2 bg-slate-700"}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Step Card */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-4">
        <span className="text-5xl">{current.emoji}</span>
        <div>
          <h3 className="text-base font-bold text-slate-100">{current.title}</h3>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{current.description}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-600">
          <span>Navigate to:</span>
          <code className="text-indigo-400 font-bold">{current.target}</code>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 font-bold rounded-xl transition-colors text-[11px]">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        {step < TOUR_STEPS.length - 1 ? (
          <button onClick={next}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-[11px]">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button onClick={next}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Complete Tour
          </button>
        )}
      </div>
    </div>
  );
};
