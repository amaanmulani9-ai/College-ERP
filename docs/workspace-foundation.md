# Enterprise Workspace Foundation (`frontend/src/workspace/`)

## Executive Summary

The **Enterprise Workspace Framework** transforms the ERP operating interface from a traditional single-page view into a modern multi-workspace, multi-tab console. It features persistent workspace state, dynamic tab management (open, close, pin, duplicate, reorder, restore, unsaved indicators), quick launcher, command palette search (`Ctrl+K`), flexible sidebar modes (expanded, collapsed, mini, floating), header badges (tenant & academic session), and real-time status telemetry.

---

## Directory Structure (`frontend/src/workspace/`)

| Component / File | Purpose |
|------------------|---------|
| `WorkspaceContext.tsx` | Global workspace context provider (sidebar modes, theme, pinned/favorite/recent modules, `localStorage` persistence). |
| `TabContext.tsx` | Tab management provider (tab opening, closing, pinning, duplicating, restoring, unsaved status tracking). |
| `WorkspaceLayout.tsx` | Root layout component wrapping children with `WorkspaceProvider` and `TabProvider`. |
| `WorkspaceShell.tsx` | Master shell organizing Header, Sidebar, Tabs, Content, and Footer. |
| `WorkspaceHeader.tsx` | Top workspace header bar (Breadcrumb, tenant badge, academic session badge, Quick Create, Search launcher, Notifications, Profile). |
| `WorkspaceSidebar.tsx` | Flexible sidebar supporting Expanded, Collapsible, Mini, and Floating navigation modes. |
| `WorkspaceTabs.tsx` | Multi-tab navigation header bar with scroll controls and restore closed tab actions. |
| `WorkspaceTab.tsx` | Individual tab component with active highlight, pin status, unsaved indicator dot, close button, and context menu. |
| `WorkspaceContent.tsx` | Content viewport rendering active workspace tab or default landing view. |
| `WorkspaceFooter.tsx` | Bottom status bar showing operational health, database tenant info, latency metrics, and shortcut hints. |
| `QuickLauncher.tsx` | Overlay modal for launching grouped ERP modules by category (Academics, Facilities, Careers, AI, Security). |
| `WorkspaceSearch.tsx` | Command palette / instant search (`Ctrl+K`) across modules, pages, students, staff, assets, and AI. |
| `WorkspaceHomePage.tsx` | Default workspace landing dashboard with welcome panel, continue working cards, recent shortcuts, and system health. |

---

## Key Keyboard Shortcuts

- **`Ctrl + K` / `Cmd + K`**: Open Instant Command Search & Quick Launcher.
- **`Ctrl + J` / `Cmd + J`**: Open Quick Launcher Overlay.
- **`Esc`**: Close Search or Quick Launcher modals.

---

## Verification & Compliance

- **TypeScript Type Checker**: `npx tsc --noEmit`
- **Frontend Production Build**: `npm run build`
