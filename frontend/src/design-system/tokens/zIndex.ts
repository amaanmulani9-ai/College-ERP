/**
 * College ERP Design System — Z-Index Tokens
 *
 * Strict layering hierarchy to prevent accidental overlap bugs.
 */

export const zIndex = {
  // ─── Base Layers ──────────────────────────────────────────────────────
  base:        0,     // Default document flow
  raised:      1,     // Slightly elevated elements (sticky table headers)
  sticky:      10,    // Sticky elements (top bar in tables)

  // ─── Navigation ───────────────────────────────────────────────────────
  sidebar:     20,    // Left navigation sidebar
  header:      30,    // Top header bar (sticky)
  breadcrumb:  31,    // Breadcrumb overlay above header

  // ─── Overlays ─────────────────────────────────────────────────────────
  dropdown:    40,    // Dropdowns, select menus, autocomplete
  popover:     45,    // Popovers (hover cards, info panels)
  drawer:      50,    // Side drawers (notifications, settings)
  backdrop:    55,    // Backdrop/overlay behind modals
  modal:       60,    // Modal dialogs
  modalContent:61,    // Modal content (above modal backdrop)

  // ─── Feedback ─────────────────────────────────────────────────────────
  tooltip:     70,    // Tooltips (always on top of modals)
  toast:       80,    // Toast/snackbar notifications
  commandPalette: 90, // Command palette (Ctrl+K)

  // ─── System ───────────────────────────────────────────────────────────
  overlay:     100,   // Full-screen overlays (loading screens)
  skipLink:    999,   // Accessibility skip-to-content link
} as const;

export type ZIndexKey = keyof typeof zIndex;
