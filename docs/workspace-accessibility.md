# Enterprise Workspace Accessibility Guide

## Compliance

The Enterprise Workspace targets **WCAG 2.1 Level AA** compliance across all workspace components.

---

## Core Principles Applied

### 1. Perceivable
- All images and icons have descriptive `aria-label` or `alt` attributes
- Colour is never used as the only means of conveying information (icons + text labels used together)
- Text contrast ratios meet WCAG AA minimums (4.5:1 for normal text, 3:1 for large text)

### 2. Operable
- All interactive elements are reachable and operable via keyboard
- No keyboard traps — `Esc` always dismisses focused overlays
- Focus moves logically through dialogs; `aria-modal="true"` prevents background focus
- Skip-link pattern used at workspace shell level

### 3. Understandable
- All form inputs have visible labels (`<label>` or `aria-label`)
- Error messages are specific and actionable
- All status changes use `aria-live="polite"` (non-critical) or `aria-live="assertive"` (critical alerts like offline banner)

### 4. Robust
- All interactive elements use semantic HTML (`<button>`, `<input>`, `<nav>`, `<main>`)
- ARIA roles used only where native semantics are insufficient
- Components tested with keyboard-only navigation

---

## Accessibility Controls (`WorkspaceAccessibilityPanel`)

Open via: **Preferences → Accessibility**

| Control | Default | Effect |
|---------|---------|--------|
| Reduced Motion | Off | Disables CSS/JS animations for `prefers-reduced-motion` users |
| High Contrast | Off | Placeholder — increases foreground/background contrast ratios |
| Keyboard Navigation | On | Ensures all elements are Tab-reachable |
| Focus Indicators | On | Shows visible focus rings on all interactive elements |
| Screen Reader Hints | On | Adds extra `aria-description` attributes |
| Font Scale | 100% | Scales base font size from 80% to 150% |

---

## ARIA Usage

| Pattern | Implementation |
|---------|---------------|
| Dialogs | `role="dialog"`, `aria-modal="true"`, `aria-label` |
| Toggle switches | `role="switch"`, `aria-checked` |
| Tab panels | `aria-pressed` on tab buttons |
| Progress bars | `role="progressbar"`, `aria-valuenow/min/max` |
| Status regions | `role="status"` / `role="alert"` + `aria-live` |
| Navigation | `<nav aria-label="...">` |
| Sections | `aria-labelledby` referencing heading IDs |
| Star rating | `role="radiogroup"`, `role="radio"`, `aria-checked` |

---

## Keyboard Navigation Map

```
Tab              → Move focus forward
Shift+Tab        → Move focus backward
Enter / Space    → Activate button / toggle
Esc              → Close modal / panel
Arrow keys       → Navigate within compound widgets (tabs, sliders)
Home / End       → Jump to first/last item in lists
```

---

## Focus Management

- When a dialog opens, focus moves to the first interactive element inside it
- When a dialog closes, focus returns to the element that triggered it
- Modals trap focus within their boundary while open
- Offline banner and toast notifications use `role="alert"` to announce to screen readers automatically

---

## Reduced Motion

Components that respect `prefers-reduced-motion`:
- `WorkspaceOfflineBanner` — removes slide animation
- `WorkspaceTour` — step transitions become instant
- `WorkspaceOnboarding` — welcome card appears without zoom-in
- `WorkspacePreferences` — dialog appears without blur transition

The **Reduced Motion** toggle in `WorkspaceAccessibilityPanel` sets a `data-reduced-motion` attribute on `<html>` which CSS can target via `[data-reduced-motion] * { animation: none !important; transition: none !important; }`.
