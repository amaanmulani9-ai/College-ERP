/**
 * College ERP Design System — Shadow Tokens
 *
 * All shadows are tuned for dark mode (slate-950 background).
 * Each scale has a dark and light variant.
 */

export const shadows = {
  // ─── Elevation Scale ────────────────────────────────────────────────────
  none: "none",

  xs: {
    dark:  "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
    light: "0 1px 2px 0 rgba(15, 23, 42, 0.08)",
  },

  sm: {
    dark:  "0 2px 4px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
    light: "0 2px 4px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
  },

  md: {
    dark:  "0 4px 12px 0 rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)",
    light: "0 4px 12px 0 rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
  },

  lg: {
    dark:  "0 10px 30px 0 rgba(0, 0, 0, 0.6), 0 4px 10px -4px rgba(0, 0, 0, 0.5)",
    light: "0 10px 30px 0 rgba(15, 23, 42, 0.10), 0 4px 10px -4px rgba(15, 23, 42, 0.06)",
  },

  xl: {
    dark:  "0 20px 50px 0 rgba(0, 0, 0, 0.7), 0 8px 20px -8px rgba(0, 0, 0, 0.6)",
    light: "0 20px 50px 0 rgba(15, 23, 42, 0.15), 0 8px 20px -8px rgba(15, 23, 42, 0.08)",
  },

  // ─── Colored / Brand Glows ───────────────────────────────────────────────
  primaryGlow:   "0 8px 30px -4px rgba(99, 102, 241, 0.45)",
  secondaryGlow: "0 8px 30px -4px rgba(168, 85, 247, 0.40)",
  successGlow:   "0 8px 30px -4px rgba(16, 185, 129, 0.40)",
  dangerGlow:    "0 8px 30px -4px rgba(239, 68, 68, 0.40)",
  warningGlow:   "0 8px 30px -4px rgba(245, 158, 11, 0.40)",

  // ─── Glassmorphism ────────────────────────────────────────────────────────
  glass: {
    dark:  "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
    light: "0 8px 32px 0 rgba(15, 23, 42, 0.10), inset 0 0 0 1px rgba(255, 255, 255, 0.70)",
  },

  // ─── Inner/Inset Shadows ─────────────────────────────────────────────────
  inner: {
    dark:  "inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    light: "inset 0 2px 4px 0 rgba(15, 23, 42, 0.05)",
  },

  // ─── Focus Ring (used on interactive elements) ───────────────────────────
  focusRing:        "0 0 0 3px rgba(99, 102, 241, 0.45)",
  focusRingDanger:  "0 0 0 3px rgba(239, 68, 68, 0.40)",
  focusRingSuccess: "0 0 0 3px rgba(16, 185, 129, 0.40)",
} as const;
