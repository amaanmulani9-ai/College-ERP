export const MOTION_TOKENS = {
  duration: {
    fast: 100,      // Micro interactions, buttons, tooltips
    normal: 200,    // Modals, dropdowns, cards
    slow: 300,      // Page transitions, drawer slide-ins
    reduced: 0,     // Reduced motion override
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    decelerate: "cubic-bezier(0.0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  spring: {
    soft: { stiffness: 100, damping: 15, mass: 1 },
    medium: { stiffness: 200, damping: 20, mass: 1 },
    heavy: { stiffness: 300, damping: 25, mass: 1 },
  },
  scale: {
    hover: 1.02,
    press: 0.98,
    active: 1.05,
  },
  feedback: {
    successPulse: "scale-105 border-emerald-500 shadow-emerald-500/20",
    warningPulse: "scale-105 border-amber-500 shadow-amber-500/20",
    errorShake: "animate-shake border-rose-500 shadow-rose-500/20",
  },
} as const;

export type MotionDuration = keyof typeof MOTION_TOKENS.duration;
export type MotionEasing = keyof typeof MOTION_TOKENS.easing;
