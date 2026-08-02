# Enterprise Motion & Micro-interaction System

> **Module**: `frontend/src/ux/motion/`  
> **Version**: v0.36.0-ui-ux-part1  
> **Integrations**: Standardizes transitions, animations, hover effects, and focus states across UI-001 through UI-008  
> **Part**: TASK-UI-009 Part 1/5  

---

## Overview

The **Enterprise Motion System** establishes a centralized animation architecture for the NITS College ERP. It provides unified timing tokens (Fast 100ms, Normal 200ms, Slow 300ms), spring physics parameters, GPU-accelerated styling helpers (`translateZ(0)`), accessibility-compliant `prefers-reduced-motion` detection, structural transitions (Fade, Scale, Slide, Modal, Drawer, Toast), and micro-interaction wrappers (ButtonPress, CardHover, FAB, ListItem).

---

## Component & Token Map

```
frontend/src/ux/motion/
├── motionTokens.ts             # Durations (100ms, 200ms, 300ms), easings, spring physics, & feedback tokens
├── motionVariants.ts           # CSS transition class presets for fade, scale, slide, modal, drawer, & toasts
├── motionHelpers.ts            # GPU style acceleration helper & prefers-reduced-motion detector
├── MotionProvider.tsx          # MotionContext & Provider managing reduced motion & speed multipliers
├── useMotion.ts                # Custom hook for global motion settings
├── FadeTransition.tsx          # Structural Fade, Scale, Slide, & Page transitions
├── ModalTransition.tsx         # Accessible Modal & Drawer overlay transitions
├── PopoverTransition.tsx       # Popover, Tooltip, Dropdown, Accordion, Toast, & Notification transitions
├── HoverCardAnimation.tsx      # HoverCardAnimation & ButtonPressAnimation (active:scale-95)
├── CardHoverAnimation.tsx      # CardHoverAnimation, ListItemAnimation, & FABAnimation
└── index.ts                    # Barrel export
```

---

## Key Features & Implementations

### 1. Motion Tokens (`motionTokens.ts`)
- **Durations**: Fast (`100ms`), Normal (`200ms`), Slow (`300ms`), Reduced (`0ms`).
- **Easings**: Standard (`cubic-bezier(0.4, 0, 0.2, 1)`), Decelerate, Accelerate, Bounce.
- **Spring Physics**: Soft (`stiffness: 100, damping: 15`), Medium, Heavy.

### 2. GPU Acceleration & Accessibility (`motionHelpers.ts` & `MotionProvider.tsx`)
- All motion components apply `willChange: "transform, opacity"` and `transform: "translateZ(0)"` to prevent layout thrashing and maintain 60 FPS performance.
- Automatically respects system `prefers-reduced-motion: reduce` media queries and provides a manual toggle in global settings.

### 3. Interactive Micro-Animations (`HoverCardAnimation.tsx` & `ButtonPressAnimation.tsx`)
- **ButtonPress**: Applies `active:scale-95` on touch/click with disabled state opacity reduction.
- **CardHover**: Applies subtle hover lift (`hover:-translate-y-1`) and elevated shadow borders (`hover:border-indigo-500/50`).

---

## Verification & Build Status

- **TypeScript Compilation**: `npx tsc --noEmit` → **0 errors**.
- **Production Build**: `npm run build` → **Passed cleanly**.
- **Git Commit**: `feat(ui): implement enterprise motion system`
- **Git Tag**: `v0.36.0-ui-ux-part1`
