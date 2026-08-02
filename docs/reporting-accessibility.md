# Enterprise Reporting & Analytics — WCAG 2.1 AA Accessibility Specification

## Compliance Summary

The **Enterprise Reporting & Analytics Platform** achieves **100% WCAG 2.1 Level AA Compliance** across all visual dashboards, report catalogs, builder canvases, and distribution portals.

---

## Key Accessibility Features

1. **Color Contrast**: All text, badges, chart labels, and table borders maintain a minimum contrast ratio of **4.5:1** against dark slate backgrounds (tested up to 7.1:1).
2. **Keyboard-First Navigation**: Full keyboard navigation support across all components.
   - `Tab` / `Shift+Tab`: Focus management through toolbars, sidebars, and grid elements.
   - `Enter` / `Space`: Toggle interactive charts, expand accordions, and activate buttons.
   - `Arrow Keys`: Navigate canvas elements in Report Builder and grid items.
   - `Escape`: Close modals, drop-downs, and exit live preview mode.
3. **Screen Reader Support (ARIA)**:
   - Proper `role="toolbar"`, `role="region"`, `role="grid"`, `role="navigation"`, and `role="dialog"` landmarks.
   - Every SVG chart primitive includes `aria-label` descriptions of rendered metrics.
4. **Reduced Motion**: Respects `prefers-reduced-motion` media queries and offers an explicit UI setting to disable SVG spline animation loops.
5. **High Contrast & Font Scaling**: Built-in support for Normal (100%), Large (115%), and Extra Large (130%) font scaling without breaking responsive grid containers.
