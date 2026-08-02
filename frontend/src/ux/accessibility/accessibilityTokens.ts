export const ACCESSIBILITY_TOKENS = {
  focusRing: {
    standard: "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    highContrast: "focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
  },
  liveRegion: {
    polite: "polite" as const,
    assertive: "assertive" as const,
  },
  keys: {
    TAB: "Tab",
    ESCAPE: "Escape",
    ENTER: "Enter",
    SPACE: " ",
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
  },
} as const;

export type LiveRegionPriority = "polite" | "assertive";
