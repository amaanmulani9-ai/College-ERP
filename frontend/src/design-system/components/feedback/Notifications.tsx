import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Bell, X } from "lucide-react";

// ─── InlineAlert ───────────────────────────────────────────────────────────
export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface InlineAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const alertStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: {
    bg: "bg-sky-950/60",
    border: "border-sky-800/80",
    text: "text-sky-200",
    icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
  },
  success: {
    bg: "bg-emerald-950/60",
    border: "border-emerald-800/80",
    text: "text-emerald-200",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  },
  warning: {
    bg: "bg-amber-950/60",
    border: "border-amber-800/80",
    text: "text-amber-200",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  },
  danger: {
    bg: "bg-red-950/60",
    border: "border-red-800/80",
    text: "text-red-200",
    icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
  },
};

export const InlineAlert: React.FC<InlineAlertProps> = ({
  variant = "info",
  title,
  children,
  onDismiss,
  className = "",
}) => {
  const style = alertStyles[variant];

  return (
    <div
      className={`p-3.5 rounded-2xl border ${style.bg} ${style.border} ${style.text} text-xs flex items-start gap-3 shadow-sm ${className}`}
      role="alert"
    >
      {style.icon}
      <div className="flex-1 space-y-0.5 min-w-0">
        {title && <h5 className="font-bold text-white tracking-tight">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-slate-400 hover:text-white p-0.5 shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// ─── Banner ────────────────────────────────────────────────────────────────
export interface BannerProps {
  variant?: AlertVariant;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export const Banner: React.FC<BannerProps> = ({
  variant = "info",
  actionLabel,
  onAction,
  children,
}) => {
  const style = alertStyles[variant];

  return (
    <div className={`p-3 px-4 ${style.bg} border-b ${style.border} ${style.text} text-xs flex items-center justify-between gap-4 font-semibold`}>
      <div className="flex items-center gap-2">
        {style.icon}
        <span>{children}</span>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-[11px] font-bold hover:bg-slate-800 shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// ─── NotificationCard ──────────────────────────────────────────────────────
export interface NotificationCardProps {
  title: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
  onMarkRead?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  timestamp,
  isRead = false,
  onMarkRead,
}) => {
  return (
    <div
      onClick={onMarkRead}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
        isRead
          ? "bg-slate-950 border-slate-900 text-slate-400"
          : "bg-slate-900/90 border-slate-800 text-slate-100 font-semibold"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h5 className="text-xs font-bold text-white truncate">{title}</h5>
        <span className="text-[10px] font-mono text-slate-500 shrink-0">{timestamp}</span>
      </div>
      <p className="text-xs text-slate-400 mt-1 leading-normal">{message}</p>
    </div>
  );
};

// ─── EmptyNotification ─────────────────────────────────────────────────────
export const EmptyNotification: React.FC = () => (
  <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
      <Bell className="w-6 h-6" />
    </div>
    <h5 className="text-xs font-bold text-white">No Notifications</h5>
    <p className="text-[11px] text-slate-500">You're all caught up! Check back later for updates.</p>
  </div>
);
