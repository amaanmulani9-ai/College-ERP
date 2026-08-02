# Enterprise Workspace Docking System (`frontend/src/workspace/docking/`)

## Executive Summary

The **Enterprise Workspace Docking System** transforms the ERP into a desktop-like multi-window operating environment. Inspired by VS Code, JetBrains IDEs, Microsoft Teams, SAP Fiori, and Salesforce Lightning, it supports draggable windows, dockable zones (Left/Right/Top/Bottom/Center/Floating), split views, named layout presets, persistent state via `localStorage`, and a Ctrl+Tab window switcher.

---

## Directory Structure (`frontend/src/workspace/docking/`)

| Component / File | Purpose |
|------------------|---------|
| `WorkspaceManager.tsx` | Global context — window registry, open/close/focus/pin/duplicate/dock, layout save/reset, `localStorage` persistence. |
| `WorkspaceGrid.tsx` | Top-level canvas rendering docked and floating windows; minimized taskbar strip. |
| `WorkspaceDock.tsx` | Dock zone layout manager for Left / Right / Top / Bottom / Center zones. |
| `WorkspaceWindow.tsx` | Individual draggable, resizable, dockable window with title bar, minimize/maximize/close/pin controls, and context menu. |
| `WorkspacePanel.tsx` | Panel frame wrapping module content. |
| `WorkspaceSplitter.tsx` | Drag-based adjustable horizontal/vertical divider. |
| `WorkspaceTabsManager.tsx` | Per-window tab management supporting open/close/create tabs inside each window. |
| `WorkspaceMiniMap.tsx` | Overview minimap placeholder showing active window positions. |
| `WorkspaceLayouts.tsx` | Layout preset switcher (Default, Analytics, Administration, Academic, Finance, Library, Custom) with save/delete/reset. |
| `WindowSwitcher.tsx` | `Ctrl+Tab` keyboard window cycler overlay. |
| `WindowNavPanels.tsx` | Side panel components: `OpenWindowsPanel`, `PinnedWindowsPanel`, `RecentWindowsPanel`. |
| `DockingConsolePage.tsx` | Full assembled docking workspace page (`/workspace/docking`). |

---

## Key Keyboard Shortcuts

- **`Ctrl + Tab`**: Open Window Switcher overlay.
- **`Esc`**: Dismiss Window Switcher.

## Dock Zones

- `left` → Left panel strip (w-72)
- `right` → Right panel strip (w-72)
- `top` → Top panel strip (h-48)
- `bottom` → Bottom panel strip (h-48)
- `center` → Floating/layered over center canvas
- `floating` → Absolute positioned overlay (Phase 4+)

## Layout Presets

| Preset ID | Use Case |
|-----------|----------|
| `default` | Standard home panel |
| `analytics` | Data dashboards |
| `administration` | HR/payroll/admin |
| `academic` | Timetable/exams |
| `finance` | Fees/payments |
| `library` | Book catalog/issue |
| `custom` | User-saved arrangements |

## Route

`/workspace/docking` → `DockingConsolePage`

## Verification

- `npx tsc --noEmit` → 0 errors
- `npm run build` → production build success
