import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "pending"
  | "purple";

export interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  dotOnly?: boolean;
  className?: string;
}

const variantStyles: Record<StatusVariant, { bg: string; border: string; text: string; dot: string }> = {
  success: {
    bg: "bg-emerald-950/80",
    border: "border-emerald-800/80",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  warning: {
    bg: "bg-amber-950/80",
    border: "border-amber-800/80",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
  danger: {
    bg: "bg-red-950/80",
    border: "border-red-800/80",
    text: "text-red-300",
    dot: "bg-red-400",
  },
  info: {
    bg: "bg-sky-950/80",
    border: "border-sky-800/80",
    text: "text-sky-300",
    dot: "bg-sky-400",
  },
  neutral: {
    bg: "bg-slate-900",
    border: "border-slate-800",
    text: "text-slate-300",
    dot: "bg-slate-400",
  },
  pending: {
    bg: "bg-indigo-950/80",
    border: "border-indigo-800/80",
    text: "text-indigo-300",
    dot: "bg-indigo-400",
  },
  purple: {
    bg: "bg-purple-950/80",
    border: "border-purple-800/80",
    text: "text-purple-300",
    dot: "bg-purple-400",
  },
};

const defaultIcons: Partial<Record<StatusVariant, React.ReactNode>> = {
  success: <CheckCircle2 className="w-3.5 h-3.5" />,
  warning: <AlertTriangle className="w-3.5 h-3.5" />,
  danger: <XCircle className="w-3.5 h-3.5" />,
  info: <Info className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = "neutral",
  icon,
  size = "md",
  dotOnly = false,
  className = "",
}) => {
  const style = variantStyles[variant];
  const sizeClass =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : size === "lg"
      ? "text-xs px-3 py-1 font-bold"
      : "text-[11px] px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full border shadow-inner ${style.bg} ${style.border} ${style.text} ${sizeClass} ${className}`}
    >
      {dotOnly ? (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      ) : (
        icon || defaultIcons[variant]
      )}
      <span>{label}</span>
    </span>
  );
};

// ─── ProgressBadge ──────────────────────────────────────────────────────────
export interface ProgressBadgeProps {
  progress: number; // 0-100
  label?: string;
  size?: "sm" | "md";
}

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({
  progress,
  label,
  size = "md",
}) => {
  const variant: StatusVariant =
    progress >= 80 ? "success" : progress >= 50 ? "info" : progress >= 25 ? "warning" : "danger";

  return (
    <div className="inline-flex items-center gap-2">
      <StatusBadge label={label || `${progress}%`} variant={variant} size={size} />
      <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800 hidden sm:block">
        <div
          className={`h-full transition-all duration-300 ${
            progress >= 80
              ? "bg-emerald-500"
              : progress >= 50
              ? "bg-sky-500"
              : progress >= 25
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

// ─── PriorityBadge ─────────────────────────────────────────────────────────
export type PriorityLevel = "low" | "medium" | "high" | "critical";

export interface PriorityBadgeProps {
  priority: PriorityLevel;
}

const priorityMap: Record<PriorityLevel, { label: string; variant: StatusVariant }> = {
  low: { label: "Low", variant: "neutral" },
  medium: { label: "Medium", variant: "info" },
  high: { label: "High", variant: "warning" },
  critical: { label: "Critical", variant: "danger" },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = priorityMap[priority];
  return <StatusBadge label={config.label} variant={config.variant} size="sm" />;
};

// ─── HealthBadge ───────────────────────────────────────────────────────────
export interface HealthBadgeProps {
  status: "healthy" | "degraded" | "down" | "maintenance";
  uptime?: string;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ status, uptime }) => {
  const variantMap: Record<string, StatusVariant> = {
    healthy: "success",
    degraded: "warning",
    down: "danger",
    maintenance: "purple",
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <StatusBadge
        label={status.toUpperCase()}
        variant={variantMap[status]}
        icon={<Activity className="w-3.5 h-3.5" />}
        size="sm"
      />
      {uptime && <span className="text-[10px] font-mono text-slate-400">({uptime})</span>}
    </div>
  );
};

// ─── VerificationBadge ────────────────────────────────────────────────────
export interface VerificationBadgeProps {
  isVerified: boolean;
  label?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  label,
}) => {
  return isVerified ? (
    <StatusBadge
      label={label || "Verified"}
      variant="success"
      icon={<ShieldCheck className="w-3.5 h-3.5" />}
      size="sm"
    />
  ) : (
    <StatusBadge
      label={label || "Unverified"}
      variant="warning"
      icon={<ShieldAlert className="w-3.5 h-3.5" />}
      size="sm"
    />
  );
};
