/**
 * College ERP Design System — Animation Tokens
 *
 * All animation values are compatible with both CSS and Framer Motion.
 */

// ─── Duration ──────────────────────────────────────────────────────────────
export const duration = {
  instant:   0,
  fast:      100,   // ms — micro-interactions (hover ripple)
  normal:    200,   // ms — most transitions
  moderate:  300,   // ms — modals, drawers open
  slow:      400,   // ms — page transitions
  slower:    600,   // ms — hero animations
  slowest:   800,   // ms — loading reveals
} as const;

// ─── Easing Curves ─────────────────────────────────────────────────────────
export const ease = {
  // CSS string values
  linear:     "linear",
  easeIn:     "cubic-bezier(0.4, 0, 1, 1)",
  easeOut:    "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut:  "cubic-bezier(0.4, 0, 0.2, 1)",
  spring:     "cubic-bezier(0.34, 1.56, 0.64, 1)",  // bouncy
  anticipate: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",

  // Framer Motion array values [x1, y1, x2, y2]
  framer: {
    easeIn:    [0.4, 0, 1, 1]     as [number, number, number, number],
    easeOut:   [0, 0, 0.2, 1]     as [number, number, number, number],
    easeInOut: [0.4, 0, 0.2, 1]   as [number, number, number, number],
    spring:    [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
} as const;

// ─── Framer Motion Spring Configs ──────────────────────────────────────────
export const springConfig = {
  // Snappy — for tooltips, dropdowns
  snappy: {
    type: "spring" as const,
    damping: 30,
    stiffness: 400,
    mass: 0.8,
  },
  // Default — for modals, drawers
  default: {
    type: "spring" as const,
    damping: 25,
    stiffness: 300,
    mass: 1,
  },
  // Gentle — for page transitions, cards
  gentle: {
    type: "spring" as const,
    damping: 20,
    stiffness: 200,
    mass: 1,
  },
  // Bouncy — for success states, celebrations
  bouncy: {
    type: "spring" as const,
    damping: 12,
    stiffness: 300,
    mass: 0.8,
  },
} as const;

// ─── Pre-composed Framer Motion Variants ──────────────────────────────────
export const variants = {
  // Fade in/out
  fade: {
    initial:  { opacity: 0 },
    animate:  { opacity: 1, transition: { duration: duration.normal / 1000, ease: ease.framer.easeOut } },
    exit:     { opacity: 0, transition: { duration: duration.fast   / 1000, ease: ease.framer.easeIn  } },
  },

  // Slide up (used for toasts, modals from bottom)
  slideUp: {
    initial:  { opacity: 0, y: 16 },
    animate:  { opacity: 1, y: 0,  transition: { duration: duration.moderate / 1000, ease: ease.framer.easeOut } },
    exit:     { opacity: 0, y: 8,  transition: { duration: duration.normal   / 1000, ease: ease.framer.easeIn  } },
  },

  // Slide down (used for dropdowns)
  slideDown: {
    initial:  { opacity: 0, y: -8 },
    animate:  { opacity: 1, y: 0,  transition: { duration: duration.normal   / 1000, ease: ease.framer.easeOut } },
    exit:     { opacity: 0, y: -4, transition: { duration: duration.fast     / 1000, ease: ease.framer.easeIn  } },
  },

  // Slide from right (used for drawers/panels)
  slideRight: {
    initial:  { opacity: 0, x: "100%" },
    animate:  { opacity: 1, x: "0%",   transition: springConfig.default },
    exit:     { opacity: 0, x: "100%", transition: springConfig.snappy  },
  },

  // Slide from left (used for sidebar)
  slideLeft: {
    initial:  { opacity: 0, x: "-100%" },
    animate:  { opacity: 1, x: "0%",    transition: springConfig.default },
    exit:     { opacity: 0, x: "-100%", transition: springConfig.snappy  },
  },

  // Scale (used for modals, cards)
  scale: {
    initial:  { opacity: 0, scale: 0.95 },
    animate:  { opacity: 1, scale: 1,    transition: { duration: duration.moderate / 1000, ease: ease.framer.spring } },
    exit:     { opacity: 0, scale: 0.97, transition: { duration: duration.normal   / 1000, ease: ease.framer.easeIn } },
  },

  // Stagger container (for lists)
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren:  0.06,
        delayChildren:    0.05,
      },
    },
  },

  // Stagger item (child of staggerContainer)
  staggerItem: {
    initial:  { opacity: 0, y: 12 },
    animate:  { opacity: 1, y: 0, transition: { duration: duration.moderate / 1000, ease: ease.framer.easeOut } },
  },
} as const;

// ─── CSS Transition Strings ────────────────────────────────────────────────
export const transition = {
  fast:    `all ${duration.fast}ms ${ease.easeOut}`,
  normal:  `all ${duration.normal}ms ${ease.easeOut}`,
  moderate:`all ${duration.moderate}ms ${ease.easeInOut}`,
  slow:    `all ${duration.slow}ms ${ease.easeInOut}`,
  colors:  `color ${duration.normal}ms ${ease.easeOut}, background-color ${duration.normal}ms ${ease.easeOut}, border-color ${duration.normal}ms ${ease.easeOut}`,
  transform:`transform ${duration.normal}ms ${ease.spring}`,
  shadow:  `box-shadow ${duration.normal}ms ${ease.easeOut}`,
  opacity: `opacity ${duration.fast}ms ${ease.easeOut}`,
} as const;
