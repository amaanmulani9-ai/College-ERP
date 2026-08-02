/**
 * College ERP Design System — Color Tokens
 *
 * All palette values are sourced from the existing Tailwind slate/indigo/emerald
 * usage across the codebase and normalized into a single source of truth.
 * Maps to Tailwind's CSS variable–friendly approach.
 */

export const colors = {
  // ─── Brand / Primary (Indigo) ──────────────────────────────────────────
  primary: {
    50:  "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },

  // ─── Secondary (Purple) ────────────────────────────────────────────────
  secondary: {
    50:  "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  // ─── Success (Emerald) ─────────────────────────────────────────────────
  success: {
    50:  "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },

  // ─── Warning (Amber) ───────────────────────────────────────────────────
  warning: {
    50:  "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },

  // ─── Danger (Red) ──────────────────────────────────────────────────────
  danger: {
    50:  "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  // ─── Info (Sky) ────────────────────────────────────────────────────────
  info: {
    50:  "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },

  // ─── Neutral (Slate) ───────────────────────────────────────────────────
  neutral: {
    50:  "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },

  // ─── Semantic Theme Tokens ─────────────────────────────────────────────
  dark: {
    background: {
      base:    "#020617",   // slate-950 — page bg
      surface: "#0f172a",   // slate-900 — card/panel bg
      overlay: "#1e293b",   // slate-800 — hover overlays
      input:   "#0f172a",   // slate-900 — input fields
    },
    border: {
      subtle:  "#1e293b",   // slate-800
      default: "#334155",   // slate-700
      strong:  "#475569",   // slate-600
      focus:   "#6366f1",   // primary-500
    },
    text: {
      primary:   "#f8fafc",   // slate-50
      secondary: "#94a3b8",   // slate-400
      muted:     "#64748b",   // slate-500
      disabled:  "#334155",   // slate-700
      inverse:   "#020617",   // slate-950
    },
    sidebar: {
      bg:         "#020617",  // slate-950
      hover:      "#0f172a",  // slate-900
      active:     "rgba(99,102,241,0.1)",   // primary/10
      activeBorder:"rgba(99,102,241,0.3)",  // primary/30
      text:       "#94a3b8",  // slate-400
      textActive: "#818cf8",  // primary-400
    },
  },

  light: {
    background: {
      base:    "#f8fafc",   // slate-50
      surface: "#ffffff",   // white
      overlay: "#f1f5f9",   // slate-100
      input:   "#ffffff",
    },
    border: {
      subtle:  "#e2e8f0",   // slate-200
      default: "#cbd5e1",   // slate-300
      strong:  "#94a3b8",   // slate-400
      focus:   "#6366f1",   // primary-500
    },
    text: {
      primary:   "#0f172a",   // slate-900
      secondary: "#475569",   // slate-600
      muted:     "#94a3b8",   // slate-400
      disabled:  "#cbd5e1",   // slate-300
      inverse:   "#f8fafc",   // slate-50
    },
    sidebar: {
      bg:         "#f8fafc",
      hover:      "#f1f5f9",
      active:     "rgba(99,102,241,0.08)",
      activeBorder:"rgba(99,102,241,0.25)",
      text:       "#475569",
      textActive: "#4f46e5",
    },
  },
} as const;

export type ColorScale = typeof colors.primary;
export type SemanticColors = typeof colors.dark;
