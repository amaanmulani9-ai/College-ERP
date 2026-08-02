# Settings System Administration Center

> **Module**: `frontend/src/settings/system/`
> **Version**: v0.34.0-ui-settings-part5
> **Access**: Super Admin only
> **Part**: TASK-UI-007 Part 5/6

---

## Overview

The **Enterprise System Administration Center** is the master operations hub for the NITS ERP platform.
It provides real-time infrastructure monitoring, backup & restore management, tamper-evident audit
trails, job queue control, cache management, database diagnostics, and a structured disaster recovery
runbook — all in one centralized interface.

---

## Architecture

```
frontend/src/settings/system/
├── types.ts                   # All TypeScript interfaces
├── mockSystemData.ts          # Rich mock data for all pages
├── SystemSettingsCenter.tsx   # Hub component with 13-tab nav
├── SystemDashboardPage.tsx    # Platform overview & service grid
├── HealthMonitoringPage.tsx   # Per-service health + sparklines
├── MaintenanceModePage.tsx    # Enable/disable, custom message, whitelist
├── BackupCenterPage.tsx       # Manual/scheduled backups + history
├── RestoreCenterPage.tsx      # Recovery point selection + restore flow
├── AuditLogPage.tsx           # Security/config/system audit trail
├── ActivityLogPage.tsx        # User action log per module
├── StorageManagementPage.tsx  # Bucket usage + cleanup wizard
├── JobQueuePage.tsx           # Celery job monitor + retry/cancel
├── CacheManagementPage.tsx    # Redis key stats + flush/warm
├── DatabaseManagementPage.tsx # Table stats, connections, optimize
├── DisasterRecoveryPage.tsx   # Recovery runbook + contacts
├── SystemInformationPage.tsx  # Versions, environment, license, browser
└── index.ts                   # Barrel export
```

---

## Pages

### 1. System Dashboard (`SystemDashboardPage`)
- Platform health score badge (Healthy / Degraded / Critical)
- CPU, Memory, Disk, API request metrics (placeholder with progress bars)
- Live service status grid (all 9 services with latency & uptime)
- Storage overview summary (DB size, Redis memory, Queue depth, total storage)

### 2. Health Monitoring (`HealthMonitoringPage`)
- Category filter: All / API / Database / Redis / Email / AI / Payments / Storage
- Per-service cards with animated status dots, uptime %, latency
- Real SVG sparkline charts from last-10 latency history
- Colour coding: green ≤200ms, amber >200ms

### 3. Maintenance Mode (`MaintenanceModePage`)
- Toggle button with live activation state
- Custom user-facing message editor (textarea)
- Admin whitelist (comma-separated emails)
- Scheduled maintenance window list with affected modules
- Emergency Maintenance instant activation

### 4. Backup Center (`BackupCenterPage`)
- Trigger: Manual Full Backup, Incremental, Edit Schedule
- Summary cards: schedule, cadence, last size, RPO/RTO targets
- Retention policy matrix (Full/Incremental/Schema-Only)
- Backup history table with type badges, status, download button

### 5. Restore Center (`RestoreCenterPage`)
- Destructive-action warning banner
- Radio-button recovery point selector showing all completed backups
- Mandatory dual-confirmation checkbox before restore
- Animated progress bar during restore simulation
- Post-restore success state + validation reminder

### 6. Audit Log (`AuditLogPage`)
- Filters: text search, category (Security/Config/System), date range
- Stats row: total events, security events, config changes, blocked actions
- Colour-coded log entries by category with result badges
- CSV export button

### 7. Activity Log (`ActivityLogPage`)
- Per-module colour badges: Admissions, Fees, Reports, Settings, Library, HR, Backups
- Filters: text search, module select, date
- Chronological activity feed with user, action, detail

### 8. Storage Management (`StorageManagementPage`)
- Total storage progress bar with percentage
- Bucket legend with category colours
- Per-bucket progress bars: Uploads, Reports, Media, Logs, Backups
- Cleanup wizard button and per-bucket cleanup actions

### 9. Job Queue (`JobQueuePage`)
- Stats: Running, Pending, Completed, Failed
- Filter tabs with counts
- Animated pulsing dot for Running jobs
- Retry button for Failed jobs
- Cancel button for Running/Pending jobs

### 10. Cache Management (`CacheManagementPage`)
- Flush All / Warm Cache global actions
- Per-key hit-rate progress bars with miss/hit counts
- Size, TTL display per key
- Per-key flush with visual cleared state

### 11. Database Management (`DatabaseManagementPage`)
- Overview: PostgreSQL version, rows, size, connections
- PgBouncer connection pool bar
- Table stats table: rows, size, indexes, last vacuum
- Optimization actions: REINDEX, Slow Query analysis

### 12. Disaster Recovery (`DisasterRecoveryPage`)
- RTO/RPO targets and last DR test date
- Interactive 9-step recovery checklist (stateful checkboxes)
- Progress bar tracking completed steps
- Emergency recovery contacts with tel: and mailto: links

### 13. System Information (`SystemInformationPage`)
- Platform Versions: Django, Python, PostgreSQL, Redis, Celery, React, Node.js
- Environment: deployment region, build SHA, timestamp, CI/CD
- Tenant & License: name, ID, tier, expiry, support, data residency
- Client Environment: browser UA, screen resolution, viewport, connection type

---

## Accessibility

- Tab navigation uses `role="tab"`, `aria-selected`, `aria-controls`
- Tab panels use `role="tabpanel"` with `aria-label`
- All interactive elements have `focus-visible` outlines
- Icon-only buttons have `title` attributes
- `aria-label` on the main region container

---

## Integration

### SettingsLayout Routing
```tsx
const isSystem =
  activeCategory === "System" ||
  activeCategory === "Audit Logs" ||
  activeCategory === "Backups" ||
  activeCategory === "General" ||
  selectedPage?.category === "System" ||
  selectedPage?.category === "Audit Logs" ||
  selectedPage?.category === "Backups";

// Renders:
{isSystem && <SystemSettingsCenter />}
```

### Barrel Export
```ts
// settings/index.ts
export * from "./system";
```

---

## Git

```
feat(ui): implement enterprise system administration center

- 13 pages: Dashboard, Health, Maintenance, Backup, Restore,
  Audit Log, Activity Log, Storage, Job Queue, Cache,
  Database, Disaster Recovery, System Info
- Full ARIA role/tab accessibility
- Responsive: desktop / tablet / mobile
- No backend changes

Tag: v0.34.0-ui-settings-part5
```
