import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Wrench,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { Button, PrimaryButton, SecondaryButton } from "../Button";

export interface FeedbackScreenProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

// ─── SuccessScreen ─────────────────────────────────────────────────────────
export const SuccessScreen: React.FC<FeedbackScreenProps> = ({
  title,
  description,
  actionLabel = "Continue",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => (
  <div className="min-h-[60vh] p-6 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
    <div className="p-4 rounded-3xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 shadow-2xl shadow-emerald-500/20">
      <CheckCircle2 className="w-12 h-12" />
    </div>
    <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
    <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    <div className="flex items-center gap-3 pt-2 w-full justify-center">
      {secondaryActionLabel && onSecondaryAction && (
        <SecondaryButton onClick={onSecondaryAction}>{secondaryActionLabel}</SecondaryButton>
      )}
      {onAction && <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>}
    </div>
  </div>
);

// ─── ErrorScreen ───────────────────────────────────────────────────────────
export const ErrorScreen: React.FC<FeedbackScreenProps> = ({
  title,
  description,
  actionLabel = "Try Again",
  onAction,
}) => (
  <div className="min-h-[60vh] p-6 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
    <div className="p-4 rounded-3xl bg-red-950/80 border border-red-800 text-red-400 shadow-2xl shadow-red-500/20">
      <AlertCircle className="w-12 h-12" />
    </div>
    <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
    <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    {onAction && (
      <Button variant="danger" onClick={onAction} className="pt-2">
        {actionLabel}
      </Button>
    )}
  </div>
);

// ─── WarningScreen ─────────────────────────────────────────────────────────
export const WarningScreen: React.FC<FeedbackScreenProps> = ({
  title,
  description,
  actionLabel = "Proceed",
  onAction,
}) => (
  <div className="min-h-[60vh] p-6 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
    <div className="p-4 rounded-3xl bg-amber-950/80 border border-amber-800 text-amber-400 shadow-2xl shadow-amber-500/20">
      <AlertTriangle className="w-12 h-12" />
    </div>
    <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
    <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    {onAction && (
      <Button variant="warning" onClick={onAction} className="pt-2">
        {actionLabel}
      </Button>
    )}
  </div>
);

// ─── MaintenanceScreen ─────────────────────────────────────────────────────
export const MaintenanceScreen: React.FC = () => (
  <div className="min-h-[70vh] p-6 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
    <div className="p-4 rounded-3xl bg-purple-950/80 border border-purple-800 text-purple-400 shadow-2xl shadow-purple-500/20">
      <Wrench className="w-12 h-12 animate-pulse" />
    </div>
    <h2 className="text-2xl font-extrabold text-white tracking-tight">System Under Maintenance</h2>
    <p className="text-xs text-slate-400 leading-relaxed">
      We are upgrading the College ERP platform to serve you better. Scheduled maintenance will complete shortly.
    </p>
  </div>
);

// ─── ComingSoonScreen ──────────────────────────────────────────────────────
export const ComingSoonScreen: React.FC<{ featureName?: string }> = ({
  featureName = "This Module",
}) => (
  <div className="min-h-[60vh] p-6 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
    <div className="p-4 rounded-3xl bg-indigo-950/80 border border-indigo-800 text-indigo-400 shadow-2xl shadow-indigo-500/20">
      <Sparkles className="w-12 h-12" />
    </div>
    <h2 className="text-2xl font-extrabold text-white tracking-tight">{featureName} Coming Soon</h2>
    <p className="text-xs text-slate-400 leading-relaxed">
      Our engineering team is actively building this enterprise module. Stay tuned for the upcoming platform release!
    </p>
  </div>
);

// ─── AccessRestrictedScreen ────────────────────────────────────────────────
export const AccessRestrictedScreen: React.FC<{ onBack?: () => void }> = ({
  onBack = () => window.history.back(),
}) => (
  <div className="min-h-[60vh] p-6 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
    <div className="p-4 rounded-3xl bg-red-950/80 border border-red-800 text-red-400 shadow-2xl shadow-red-500/20">
      <ShieldAlert className="w-12 h-12" />
    </div>
    <h2 className="text-2xl font-extrabold text-white tracking-tight">Access Restricted</h2>
    <p className="text-xs text-slate-400 leading-relaxed">
      You do not have the required administrative role or permissions to access this page. Please contact your administrator.
    </p>
    <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
      Return to Safety
    </Button>
  </div>
);
