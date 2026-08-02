# Enterprise Command Palette & Global Search (`frontend/src/workspace/command/`)

## Executive Summary

The **Enterprise Command Palette and Global Search Framework** delivers a VS Code, Raycast, and Linear-inspired keyboard navigation system. It enables instant command execution, fuzzy search across all 30 ERP modules, quick actions (Create Student, Add Staff, Collect Fee, Register Visitor, Ask AI), activity history, pinned/favorite shortcuts, and multi-pane search previews.

---

## Directory Structure (`frontend/src/workspace/command/`)

| Component / File | Purpose |
|------------------|---------|
| `CommandPalette.tsx` | Master command palette modal triggered by `Ctrl+K` or `Cmd+K`. |
| `CommandInput.tsx` | Search input bar with category filters, query clear button, and `ESC` shortcut tag. |
| `CommandItem.tsx` | Search result card displaying title, description, module badge, icon, and quick action buttons. |
| `CommandGroup.tsx` | Category header grouping (Quick Actions, Modules, Finance, AI, Facilities). |
| `CommandResults.tsx` | Keyboard index navigation handler and search results viewport. |
| `CommandFooter.tsx` | Bottom keyboard hints bar (`↑↓ Navigate`, `↵ Execute`, `Ctrl+↵ Open in New Tab`). |
| `RecentCommands.tsx` | Search history and recently executed commands panel. |
| `FavoriteCommands.tsx` | Pinned & favorite commands panel. |
| `GlobalSearchOverlay.tsx` | Multi-pane global ERP search overlay with category filters and side detail preview. |
| `SearchBar.tsx` | Input bar component for global search overlays. |
| `SearchFilters.tsx` | Filter pills bar for scoping search to Students, Staff, Fees, Library, Assets, AI, etc. |
| `SearchResults.tsx` | Detailed result list for global search overlays. |
| `SearchPreview.tsx` | Side detail preview panel showing route paths, module descriptions, and launch buttons. |
| `RecentActivityPanel.tsx` | Panel displaying recent pages, recent records, and recent searches. |
| `FavoritesPanel.tsx` | Panel displaying pinned and favorite shortcuts. |

---

## Key Keyboard Shortcuts

- **`Ctrl + K` / `Cmd + K`**: Toggle Command Palette modal.
- **`↑` / `↓`**: Navigate up/down through search result items.
- **`Enter`**: Execute selected command / open module tab.
- **`Ctrl + Enter`**: Open selected module in new workspace tab.
- **`Esc`**: Dismiss Command Palette or Global Search overlay.

---

## Verification & Compliance

- **TypeScript Type Checker**: `npx tsc --noEmit`
- **Frontend Production Build**: `npm run build`
