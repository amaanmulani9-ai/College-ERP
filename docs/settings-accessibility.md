# Enterprise Settings Accessibility Guide

> **Standard**: WCAG 2.1 Level AA Compliance  
> **Module**: `frontend/src/settings/final/SettingsAccessibilityPanel.tsx`  
> **Version**: v0.34.0-ui-settings-final  

---

## Overview

The Enterprise Settings Center is designed to meet **WCAG 2.1 Level AA** specifications to ensure all institution administrators, regardless of visual, auditory, motor, or cognitive abilities, can operate the ERP administration platform effectively.

---

## Key Accessibility Features

### 1. Keyboard Navigation & Focus Management
- **Full Tab Traversal**: All interactive controls (buttons, tabs, inputs, selects, radios, checkboxes, switches) are reachable using `Tab` and `Shift+Tab`.
- **Visible Focus Outlines**: Every interactive element includes high-visibility `focus-visible:outline` styling (indigo/cyan 2px ring).
- **Shortcut Trigger**: Pressing `?` or `Shift+?` anywhere within Settings brings up the keyboard shortcuts modal.
- **Escape Key Handling**: All modals (`SettingsShortcutsDialog`, `SettingsHelpCenter`, `SettingsFeedbackDialog`, `SettingsOnboarding`) dismiss cleanly on `Esc`.

### 2. Screen Reader Compatibility & ARIA Attributes
- **Landmarks & Regions**: The Settings container uses `role="region"` with `aria-label="Settings Finalization Center"`.
- **Tab Navigation**: Tab bars use `role="tablist"`, individual tabs use `role="tab"` with `aria-selected` state, and page panels use `role="tabpanel"` linked via `aria-controls`.
- **Custom Switches**: Custom toggle switches implement `role="switch"` with `aria-checked={value}`.
- **Alert Notifications**: The offline banner (`SettingsOfflineBanner`) and error boundary (`SettingsErrorBoundary`) use `role="alert"` and `aria-live="assertive"` for immediate screen reader announcement.
- **Dialog Modals**: All overlay popups implement `role="dialog"`, `aria-modal="true"`, and labeled headings.

### 3. Visual & Color Contrast Metrics
- **Body Text**: Minimum contrast ratio of `12.1:1` (Slate-100 on Slate-950), exceeding WCAG AAA.
- **Secondary Text & Icons**: Minimum contrast ratio of `4.6:1` (Slate-400 on Slate-900), meeting WCAG AA.
- **Focus Rings**: High contrast ring color (`#6366F1` / `#38BDF8`).
- **Non-Color Reliance**: All status indicators combine colors with descriptive text and icons (e.g. status dots + uppercase status text + icon).

### 4. Customization & User Control
- **Font Scaling**: Support for 4 scaling levels (`0.85x`, `1.0x`, `1.15x`, `1.30x`) with dynamic UI recalculation.
- **Reduced Motion**: Dedicated switch to disable CSS animations and transitions, automatically respecting `prefers-reduced-motion: reduce`.
- **Density Control**: Adjust padding and layout spacing (Compact, Comfortable, Spacious) to accommodate precision motor needs or low vision.

---

## Accessibility Audit Summary Table

| Category | Requirement | Implementation | Compliance |
|---|---|---|---|
| 1.4.3 Contrast (Minimum) | ≥ 4.5:1 text contrast | 12.1:1 body, 4.6:1 secondary | Pass (AA) |
| 2.1.1 Keyboard | All functionality via keyboard | Standard DOM focus & key listeners | Pass (AA) |
| 2.4.7 Focus Visible | Visual focus indicator | `focus-visible:outline-indigo-500` | Pass (AA) |
| 4.1.2 Name, Role, Value | Semantic ARIA attributes | `role="tab"`, `role="switch"`, `role="alert"` | Pass (AA) |
| 2.3.3 Animation from Interactions | Motion control | `animationLevel="none"` / reduced motion | Pass (AAA) |
