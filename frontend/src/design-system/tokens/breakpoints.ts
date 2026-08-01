/**
 * College ERP Design System — Breakpoint Tokens
 */

// ─── Breakpoint Values ─────────────────────────────────────────────────────
export const breakpoints = {
  mobile:    "320px",   // xs
  mobileLG:  "480px",   // small phones landscape
  tablet:    "640px",   // sm — Tailwind sm
  tabletLG:  "768px",   // md — Tailwind md
  laptop:    "1024px",  // lg — Tailwind lg
  laptopLG:  "1280px",  // xl — Tailwind xl
  desktop:   "1536px",  // 2xl — Tailwind 2xl
  ultrawide: "1920px",  // ultra-wide monitors
} as const;

// ─── Numeric Breakpoint Values (px) ───────────────────────────────────────
export const breakpointsPx = {
  mobile:    320,
  mobileLG:  480,
  tablet:    640,
  tabletLG:  768,
  laptop:    1024,
  laptopLG:  1280,
  desktop:   1536,
  ultrawide: 1920,
} as const;

// ─── Media Query Strings ───────────────────────────────────────────────────
export const mediaQuery = {
  mobile:    `(min-width: ${breakpoints.mobile})`,
  mobileLG:  `(min-width: ${breakpoints.mobileLG})`,
  tablet:    `(min-width: ${breakpoints.tablet})`,
  tabletLG:  `(min-width: ${breakpoints.tabletLG})`,
  laptop:    `(min-width: ${breakpoints.laptop})`,
  laptopLG:  `(min-width: ${breakpoints.laptopLG})`,
  desktop:   `(min-width: ${breakpoints.desktop})`,
  ultrawide: `(min-width: ${breakpoints.ultrawide})`,

  // Max-width queries
  mobileOnly:  `(max-width: ${breakpoints.tablet})`,
  tabletOnly:  `(min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.laptop})`,
  laptopOnly:  `(min-width: ${breakpoints.laptop}) and (max-width: ${breakpoints.desktop})`,

  // Device feature queries
  touch:       "(hover: none) and (pointer: coarse)",
  mouse:       "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  darkMode:    "(prefers-color-scheme: dark)",
  highDpi:     "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
} as const;

export type Breakpoint = keyof typeof breakpoints;
