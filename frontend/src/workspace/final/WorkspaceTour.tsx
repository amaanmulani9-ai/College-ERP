import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Trophy, MapPin } from "lucide-react";

// ─── Tour step definitions ────────────────────────────────────────────────────

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;       // CSS selector (optional — if absent, centred modal)
  position?: "top" | "bottom" | "left" | "right";
  emoji?: string;
}

const DEFAULT_STEPS: TourStep[] = [
  { id: "t1", title: "Welcome to the Enterprise Workspace",  emoji: "🎉", description: "This is your intelligent ERP workspace. Everything you need to manage your institution is accessible from one unified interface." },
  { id: "t2", title: "Command Palette",   emoji: "⌨️", description: "Press Ctrl+K at any time to open the Command Palette. Search for any module, action, or page instantly without leaving the keyboard." },
  { id: "t3", title: "Productivity Hub",  emoji: "📌", description: "The right sidebar contains your Productivity Hub — Tasks, Notes, Calendar, Reminders, Bookmarks, and Notifications. All data is saved locally." },
  { id: "t4", title: "AI Assistant",      emoji: "🤖", description: "Press Ctrl+Shift+A to open the AI Academic Assistant. Ask anything about your students, generate reports, draft emails, or get AI-powered insights." },
  { id: "t5", title: "Docking System",    emoji: "🪟", description: "Open multiple module windows side-by-side. Navigate to /workspace/docking or use the Window menu to split your screen into a desktop-like workspace." },
  { id: "t6", title: "Quick Search",      emoji: "🔍", description: "Use the global search bar in the header to find students, fees, placements, staff, and more across all 30+ modules in one query." },
  { id: "t7", title: "Keyboard Shortcuts",emoji: "⚡", description: "Press ? or Ctrl+Shift+? to open the shortcuts dialog. All workspace, AI, and module shortcuts are documented and searchable." },
  { id: "t8", title: "You're all set!",   emoji: "🏆", description: "You've completed the workspace tour. Click any module in the sidebar to get started, or ask the AI Assistant for help anytime." },
];

// ─── WorkspaceTour ────────────────────────────────────────────────────────────

interface WorkspaceTourProps {
  steps?: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const WorkspaceTour: React.FC<WorkspaceTourProps> = ({
  steps = DEFAULT_STEPS,
  isActive,
  onComplete,
  onSkip,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => { if (isActive) setCurrent(0); }, [isActive]);

  if (!isActive) return null;

  const step = steps[current];
  const isLast  = current === steps.length - 1;
  const isFirst = current === 0;

  const handleNext = () => {
    if (isLast) onComplete();
    else setCurrent((n) => n + 1);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Workspace Tour">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Tour card */}
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={current + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label="Tour progress"
          />
        </div>

        {/* Step content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-4xl leading-none">{step.emoji ?? "✦"}</div>
            <button onClick={onSkip} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0" aria-label="Skip tour">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
              Step {current + 1} of {steps.length}
            </div>
            <h2 className="text-lg font-bold text-white">{step.title}</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{step.description}</p>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`rounded-full transition-all ${i === current ? "w-5 h-2 bg-indigo-500" : "w-2 h-2 bg-slate-700 hover:bg-slate-500"}`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrent((n) => Math.max(0, n - 1))}
              disabled={isFirst}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-sm font-semibold transition-all"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20"
              aria-label={isLast ? "Complete tour" : "Next step"}
            >
              {isLast ? (
                <><Trophy className="w-4 h-4" /> Complete Tour</>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <button onClick={onSkip} className="w-full text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
            Skip tour — I'll explore on my own
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── WorkspaceOnboarding ──────────────────────────────────────────────────────

const ONBOARDING_KEY = "college_erp_onboarding_complete";

interface WorkspaceOnboardingProps {
  forceShow?: boolean;
}

export const WorkspaceOnboarding: React.FC<WorkspaceOnboardingProps> = ({ forceShow = false }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour,    setShowTour]    = useState(false);
  const [completed,   setCompleted]   = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done || forceShow) setShowWelcome(true);
  }, [forceShow]);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowTour(false);
    setCompleted(true);
    setTimeout(() => setCompleted(false), 3000);
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowTour(false);
    setShowWelcome(false);
  };

  // Completion badge
  if (completed) {
    return (
      <div role="status" aria-live="polite"
        className="fixed bottom-8 right-8 z-[10001] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40 animate-in slide-in-from-bottom-4 duration-500">
        <Trophy className="w-5 h-5 text-amber-300" />
        <div>
          <div className="text-sm font-bold">Workspace Mastered!</div>
          <div className="text-xs text-indigo-200">You've completed the onboarding tour.</div>
        </div>
      </div>
    );
  }

  if (showTour) {
    return <WorkspaceTour isActive={true} onComplete={handleComplete} onSkip={handleSkip} />;
  }

  if (!showWelcome) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Welcome to the workspace"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative gradient bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-8 text-center space-y-5">
          <div className="text-6xl">🎓</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome to the Enterprise Workspace</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-sm mx-auto">
              Your intelligent ERP hub for students, faculty, finance, placements, and more — all in one modern interface.
            </p>
          </div>
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-2 text-left">
            {[
              { emoji: "⌨️", label: "Command Palette"    },
              { emoji: "🤖", label: "AI Assistant"       },
              { emoji: "📌", label: "Productivity Hub"   },
              { emoji: "🪟", label: "Docking System"     },
            ].map(({ emoji, label }) => (
              <div key={label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xl">{emoji}</span>
                <span className="text-xs font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowWelcome(false); setShowTour(true); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20">
              <MapPin className="w-4 h-4" /> Take the Tour
            </button>
            <button onClick={handleSkip}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all">
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
