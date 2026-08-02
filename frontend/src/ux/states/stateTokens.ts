export const STATE_TOKENS = {
  loading: {
    shimmerBg: "bg-slate-900",
    shimmerHighlight: "bg-slate-800/80 animate-pulse",
    spinnerColor: "border-indigo-500 border-t-transparent",
    barColor: "bg-indigo-600",
  },
  empty: {
    iconColor: "text-slate-500",
    titleColor: "text-slate-200",
    textColor: "text-slate-400",
    badgeBg: "bg-slate-950 border-slate-800",
  },
  success: {
    iconColor: "text-emerald-400",
    titleColor: "text-slate-100",
    textColor: "text-emerald-300/80",
    badgeBg: "bg-emerald-950/60 border-emerald-800 text-emerald-300",
  },
  warning: {
    iconColor: "text-amber-400",
    titleColor: "text-slate-100",
    textColor: "text-amber-300/80",
    badgeBg: "bg-amber-950/60 border-amber-800 text-amber-300",
  },
  error: {
    iconColor: "text-rose-400",
    titleColor: "text-slate-100",
    textColor: "text-rose-300/80",
    badgeBg: "bg-rose-950/60 border-rose-800 text-rose-300",
  },
} as const;

export type StateVariant = "loading" | "empty" | "success" | "warning" | "error";
