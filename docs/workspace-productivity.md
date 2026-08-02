# Enterprise Productivity & Collaboration Layer (`frontend/src/workspace/productivity/`)

## Overview

The **Enterprise Productivity & Collaboration Layer** adds a rich, collapsible right-sidebar hub to the ERP workspace — inspired by Microsoft Teams, Notion, ClickUp, Monday.com, and Linear. It operates entirely on the frontend with `localStorage` persistence. No backend API changes are needed.

---

## Directory Structure

| Component / File | Description |
|------------------|-------------|
| `WorkspaceProductivityHub.tsx` | Collapsible right sidebar with 10 tabs (Tasks, Notes, Notifications, Calendar, Reminders, Bookmarks, Activity, Favorites, Shortcuts, Templates). |
| `WorkspaceTasks.tsx` | Local task manager — create, complete, pin, prioritize (Low/Medium/High/Urgent), due dates, search, localStorage persistence. |
| `WorkspaceNotes.tsx` | Color-labelled notes — create, pin, archive, delete, autosave (600ms debounce), search. |
| `WorkspaceBookmarks.tsx` | ERP page bookmarks grouped by module — favorites, quick-open. |
| `WorkspaceCalendar.tsx` | Mini calendar grid, day event viewer, upcoming 5 events across Academic / Finance / Personal / Reminder types. |
| `WorkspaceReminders.tsx` | Reminders with Today / Tomorrow / This Week / Overdue / All filters; dismiss and remove. |
| `WorkspaceActivityFeed.tsx` | Recent modules, commands, searches, and tab history — timeAgo display. |
| `WorkspaceNotifications.tsx` | Notifications center grouped by System / Academic / Finance / HR / Transport / Library / AI — with Unread/Priority/Group filters and mark-all-read. |
| `WorkspaceWidgets.tsx` | Combined module: `WorkspaceFavorites`, `WorkspaceShortcuts`, `WorkspaceClipboard` (placeholder), `WorkspaceTemplates` (8 role-based presets). |

---

## Integration Points

- **WorkspaceShell.tsx**: Hub mounted as a collapsible right panel (`isOpen` + `onToggle` props). Toggle button exposed via collapsed icon strip.
- **App.tsx**: `/workspace/productivity` route added.

## Key Features

### Tasks
- Priority: Low · Medium · High · Urgent (color-coded)
- Pinned tasks section
- Completed section (collapsible)
- LocalStorage autosave

### Notes
- 6 color themes
- Autosave on edit (600ms debounce)
- Pin / Archive / Delete
- Search across title + body

### Notifications
- Groups: System / Academic / Finance / HR / Transport / Library / AI
- Filters: All / Unread / Priority
- Mark all read / dismiss individual

### Calendar
- Month grid with event dots
- Day event detail panel
- Upcoming events list

### Templates (Role-Based)
- Academic Officer · Faculty · Finance · Library · Hostel · Principal · Student · Parent

## Persistence
All Tasks and Notes use `localStorage` with project-namespaced keys. Activity Feed, Notifications, Bookmarks, Reminders, and Calendar use local state (seeded with realistic demo data).

## Routes
- `/workspace/productivity` → `WorkspaceProductivityHub` (standalone page)
- `/workspace` → `WorkspaceShell` (includes embedded Hub in right panel)
