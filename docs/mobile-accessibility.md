# Enterprise Mobile Accessibility Specifications (WCAG 2.1 AA)

> **Document**: Mobile Accessibility Guide  
> **Target Standard**: WCAG 2.1 Level AA Compliance  
> **Module**: `frontend/src/mobile/final/MobileAccessibilityPanel.tsx`  

---

## Accessibility Principles & Standards

### 1. Minimum Touch Targets (48px × 48px)
All interactive buttons, icons, tabs, and form controls in the mobile suite enforce a minimum touch target height and width of **48px** to prevent mis-taps on phone screens.

### 2. High Contrast Ratios (4.5:1 Minimum)
Color pairings across dark, light, and system themes adhere to WCAG 2.1 Level AA requirements:
- Slate-100 text on Slate-950 background: **16.2:1 contrast ratio**
- Indigo-300 labels on Slate-900 containers: **7.4:1 contrast ratio**
- High contrast mode further boosts text contrast for outdoor sunlight visibility.

### 3. Screen Reader ARIA Semantics
- Alert banners use `role="alert"` and `aria-live="assertive"`.
- Switch toggles implement `role="switch"` and `aria-checked={value}`.
- Dialog overlays feature `role="dialog"` and `aria-modal="true"`.

### 4. Reduced Motion
Respects system `prefers-reduced-motion` settings and user toggle in `MobileAccessibilityPanel.tsx`, replacing slide transitions with static fades.
