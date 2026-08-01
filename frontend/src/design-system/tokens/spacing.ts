/**
 * College ERP Design System — Spacing Tokens
 *
 * Based on a 4px base unit. All values scale proportionally.
 */

// Base unit = 4px
const BASE = 4;
const px = (n: number) => `${n * BASE}px`;

export const spacing = {
  // ─── 4px Scale ──────────────────────────────────────────────────────────
  0:    "0px",
  px:   "1px",
  0.5:  px(0.5),   //  2px
  1:    px(1),     //  4px
  1.5:  px(1.5),   //  6px
  2:    px(2),     //  8px
  2.5:  px(2.5),   // 10px
  3:    px(3),     // 12px
  3.5:  px(3.5),   // 14px
  4:    px(4),     // 16px
  5:    px(5),     // 20px
  6:    px(6),     // 24px
  7:    px(7),     // 28px
  8:    px(8),     // 32px
  9:    px(9),     // 36px
  10:   px(10),    // 40px
  11:   px(11),    // 44px
  12:   px(12),    // 48px
  14:   px(14),    // 56px
  16:   px(16),    // 64px
  20:   px(20),    // 80px
  24:   px(24),    // 96px
  28:   px(28),    // 112px
  32:   px(32),    // 128px
  36:   px(36),    // 144px
  40:   px(40),    // 160px
  48:   px(48),    // 192px
  56:   px(56),    // 224px
  64:   px(64),    // 256px
} as const;

// ─── Border Radius Scale ────────────────────────────────────────────────────
export const radius = {
  none:    "0px",
  sm:      "4px",
  md:      "8px",
  lg:      "12px",
  xl:      "16px",
  "2xl":   "20px",
  "3xl":   "24px",  // cards — matches existing rounded-3xl
  "4xl":   "32px",
  full:    "9999px",
} as const;

// ─── Container Widths ────────────────────────────────────────────────────────
export const container = {
  xs:   "480px",
  sm:   "640px",
  md:   "768px",
  lg:   "1024px",
  xl:   "1280px",
  "2xl":"1536px",
  full: "100%",
} as const;

// ─── Section Spacing ─────────────────────────────────────────────────────────
export const sectionSpacing = {
  xs:   "32px",
  sm:   "48px",
  md:   "64px",
  lg:   "96px",
  xl:   "128px",
} as const;

// ─── Component-Level Spacing ─────────────────────────────────────────────────
// Common padding combos for component sizes (matching button/input convention)
export const componentSpacing = {
  // Buttons / inputs
  xs:   { paddingX: spacing[2.5],  paddingY: spacing[1],   height: "28px" },
  sm:   { paddingX: spacing[3],    paddingY: spacing[1.5], height: "32px" },
  md:   { paddingX: spacing[4],    paddingY: spacing[2],   height: "38px" },
  lg:   { paddingX: spacing[5],    paddingY: spacing[2.5], height: "44px" },
  xl:   { paddingX: spacing[6],    paddingY: spacing[3],   height: "52px" },
} as const;
