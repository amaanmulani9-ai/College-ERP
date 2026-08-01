# Enterprise Design System Foundation — Specification

**Version:** v0.21.0-design-system  
**Updated:** August 1, 2026  
**Module:** `frontend/src/design-system/`

---

## 1. Overview

The Enterprise Design System provides a standardized, theme-aware token foundation, component library, custom hook suite, and helper utilities for College ERP.

---

## 2. Directory Structure

```
frontend/src/design-system/
├── tokens/
│   ├── colors.ts            # Palette (Primary, Secondary, Success, Danger, Warning, Info, Neutral) + Dark/Light Theme tokens
│   ├── typography.ts        # Font families (Outfit, Inter, JetBrains Mono), sizes, line heights, weights, text styles
│   ├── spacing.ts           # 4px grid scale, border radius, container widths, section spacing, component heights
│   ├── shadows.ts           # Elevation scale (xs-xl), brand glows, glassmorphism, focus rings
│   ├── animations.ts        # Duration scale, easing curves, Framer Motion springs, slide/fade/scale variants
│   ├── breakpoints.ts       # Breakpoint sizes (320px-1920px), media query strings, device queries
│   ├── zIndex.ts            # Strict layering scale (base to skipLink)
│   └── index.ts             # Token barrel export
├── components/
│   ├── Button.tsx           # Base Button + Primary, Secondary, Ghost, Danger, Success, Warning, Outline, Link, Loading, IconButton
│   ├── Typography.tsx       # Heading (H1-H6), Text, Label, Caption, Overline, Code, Kbd, TruncatedText
│   └── index.ts             # Component barrel export
├── hooks/
│   └── index.ts             # useBreakpoint, useMediaQuery, useIsMobile/Tablet/Desktop, useReducedMotion, useClickOutside, useKeyPress, useLocalStorage, useDebounce, useToggle, useCopyToClipboard
├── providers/
│   └── DesignSystemProvider.tsx # Context provider exposing current resolved theme, semantic color tokens, and reduced motion preference
├── utils/
│   └── index.ts             # cx(), formatters (Compact, Currency, Percent, Date, RelativeTime), string/color/DOM/array helpers
└── index.ts                 # Master barrel export
```

---

## 3. Verification

- **TypeScript:** 0 errors (`npx tsc --noEmit`)
- **Build:** Clean Vite production build
- **Accessibility:** Full ARIA support, keyboard navigation, focus indicators, reduced motion detection
