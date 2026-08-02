# Enterprise Accessibility & Keyboard Navigation System

> **Module**: `frontend/src/ux/accessibility/`  
> **Version**: v0.36.0-ui-ux-part3  
> **Integrations**: Reuses UI-004 Design System, UI-005 Workspace, UI-006 Reporting, UI-007 Settings, UI-008 Mobile, & UI-009 Motion/State Systems  
> **Part**: TASK-UI-009 Part 3/5  

---

## Overview

The **Enterprise Accessibility System** enforces WCAG 2.1 AA compliance, high-visibility keyboard focus rings (`focus-visible:ring-indigo-500`), focus trap modal locks, screen reader ARIA live region announcements, skip navigation links, global keyboard shortcut managers (<kbd>⌘+K</kbd>, <kbd>⌘+B</kbd>, <kbd>?</kbd>), accessible form controls, and accessible table structures.

---

## Component & Architecture Map

```
frontend/src/ux/accessibility/
├── accessibilityTokens.ts     # ARIA live region priorities, focus ring styles, keycode constants
├── AccessibilityProvider.tsx  # Global Accessibility Context & Provider for screen reader announcements
├── useAccessibility.ts        # Custom hook for global accessibility context access
├── FocusTrap.tsx              # Modal & drawer keyboard focus trap lock
├── SkipNavigation.tsx         # WCAG "Skip to main content" link for keyboard power users
├── KeyboardShortcuts.tsx      # Global shortcut listener, help overlay dialog, & GlobalShortcutManager
├── TabOrderInspector.tsx      # Visual TAB navigation order inspector badge
├── AccessibleDialog.tsx       # WCAG 2.1 AA AccessibleDialog & AccessibleDrawer
├── AccessibleDropdown.tsx     # AccessibleDropdown, AccessibleTooltip, AccessibleTabs, & AccessibleAccordion
├── AccessibleTable.tsx        # AccessibleTable (caption, scope, headers) & AccessibleForm (aria-invalid, aria-describedby)
└── index.ts                   # Barrel export
```

---

## Key Features & Implementations

### 1. Screen Reader Live Announcements (`AccessibilityProvider.tsx` & `LiveRegion.tsx`)
- Provides `announce(message, priority)` hook enabling components to dispatch ARIA announcements for async data loads, save confirmations, and error alerts.

### 2. Keyboard Focus Trap & Lock (`FocusTrap.tsx`)
- Traps keyboard focus within open `AccessibleDialog` and `AccessibleDrawer` modals. Pressing <kbd>Tab</kbd> or <kbd>Shift+Tab</kbd> cycles focus exclusively between internal interactive elements.

### 3. Accessible Forms & Tables (`AccessibleForm.tsx` & `AccessibleTable.tsx`)
- Form inputs automatically bind `aria-invalid={true}` and `aria-describedby="input-id-error"` when validation errors occur.
- Data tables include hidden `<caption className="sr-only">`, `scope="col"` headers, and row hover indicators.

---

## Verification & Build Status

- **TypeScript Compilation**: `npx tsc --noEmit` → **0 errors**.
- **Production Build**: `npm run build` → **Passed cleanly**.
- **Git Commit**: `feat(ui): implement enterprise accessibility system`
- **Git Tag**: `v0.36.0-ui-ux-part3`
