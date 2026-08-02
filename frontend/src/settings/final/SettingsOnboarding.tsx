import React, { useState } from "react";
import {
  Sparkles, Settings2, Shield, LayoutDashboard, ChevronRight,
  ChevronLeft, CheckCircle2, Building2, Cpu, X,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  icon: React.ElementType;
  color: string;
  bullets: string[];
  cta: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: "welcome", title: "Welcome to Enterprise Settings",
    subtitle: "Your central hub for all ERP configuration",
    emoji: "🎉", icon: Sparkles, color: "text-amber-400",
    bullets: [
      "27 configurable categories across all ERP modules",
      "Global search to find any setting instantly",
      "Favourite and pin your most-used sections",
      "Role-based access — Super Admin sees everything",
    ],
    cta: "Let's Begin",
  },
  {
    id: "institution", title: "Institution & Academic",
    subtitle: "Configure your campus, departments, and programs",
    emoji: "🏛️", icon: Building2, color: "text-cyan-400",
    bullets: [
      "Set up institution profile, logo and contact details",
      "Manage campuses, departments, and academic structure",
      "Configure academic sessions, semesters and calendar",
      "Manage holidays, working days and classrooms",
    ],
    cta: "Got It",
  },
  {
    id: "security", title: "Security & Identity",
    subtitle: "Manage users, roles and access control",
    emoji: "🔐", icon: Shield, color: "text-rose-400",
    bullets: [
      "Create and assign granular role permissions via RBAC Matrix",
      "Configure MFA, password policies and session controls",
      "IP whitelisting, device management and login security",
      "Full audit trail of every system and security event",
    ],
    cta: "Understood",
  },
  {
    id: "platform", title: "Platform & Integrations",
    subtitle: "Branding, notifications, payments and AI",
    emoji: "⚙️", icon: Settings2, color: "text-purple-400",
    bullets: [
      "Upload your institution logo, set accent colours",
      "Configure SMTP, SMS, and push notification channels",
      "Integrate payment gateways, LMS, and external APIs",
      "Enable AI features, manage feature flags and webhooks",
    ],
    cta: "Got It",
  },
  {
    id: "system", title: "System Administration",
    subtitle: "Monitor health, backups and infrastructure",
    emoji: "🖥️", icon: Cpu, color: "text-emerald-400",
    bullets: [
      "Real-time health monitoring for all platform services",
      "Schedule automatic backups with configurable retention",
      "Monitor job queues, cache hit rates and DB performance",
      "Full disaster recovery runbook with emergency contacts",
    ],
    cta: "Almost Done",
  },
  {
    id: "done", title: "You're All Set!",
    subtitle: "Start configuring your enterprise ERP",
    emoji: "✅", icon: LayoutDashboard, color: "text-indigo-400",
    bullets: [
      "Use the sidebar to navigate between all settings sections",
      "Press Ctrl+/ to open the global settings search",
      "Press ? to view keyboard shortcuts at any time",
      "Open Help Center for guides and documentation",
    ],
    cta: "Enter Settings",
  },
];

interface SettingsOnboardingProps {
  onClose?: () => void;
  onComplete?: () => void;
}

export const SettingsOnboarding: React.FC<SettingsOnboardingProps> = ({ onClose, onComplete }) => {
  const [step, setStep]     = useState(0);
  const current             = STEPS[step];
  const isLast              = step === STEPS.length - 1;
  const pct                 = ((step + 1) / STEPS.length) * 100;

  const next = () => { if (isLast) { onComplete?.(); onClose?.(); } else setStep(step + 1); };
  const prev = () => setStep(Math.max(0, step - 1));

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" role="dialog" aria-modal="true" aria-label="Settings Onboarding">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-xs font-sans">
        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        {/* Close */}
        {onClose && (
          <div className="flex justify-end px-5 pt-4">
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors" aria-label="Skip onboarding">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-8 pb-6 pt-2 text-center space-y-5">
          <span className="text-6xl">{current.emoji}</span>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{current.title}</h2>
            <p className="text-slate-400 text-[11px] mt-1">{current.subtitle}</p>
          </div>

          {/* Bullets */}
          <div className="text-left space-y-2">
            {current.bullets.map((b) => (
              <div key={b} className="flex items-start gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${current.color}`} />
                <span className="text-[11px] text-slate-300">{b}</span>
              </div>
            ))}
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} aria-label={`Step ${i + 1}`}
                className={`transition-all rounded-full ${i === step ? "w-5 h-2 bg-indigo-500" : i < step ? "w-2 h-2 bg-emerald-500" : "w-2 h-2 bg-slate-700"}`} />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={prev} disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-0 text-slate-200 font-bold rounded-xl transition-all text-[11px]">
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button onClick={next}
              className={`flex items-center gap-1.5 px-6 py-2.5 font-bold rounded-xl transition-colors text-[11px] text-white ${isLast ? "bg-emerald-600 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>
              {current.cta} {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
