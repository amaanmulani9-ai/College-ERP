# Enterprise Progressive Web App (PWA) & Offline Experience

> **Module**: `frontend/src/mobile/pwa/`  
> **Version**: v0.35.0-ui-mobile-part4  
> **Integrations**: Reuses UI-008 Mobile Foundation, UI-005 Workspace, UI-006 Reporting, UI-007 Settings  
> **Part**: TASK-UI-008 Part 4/5  

---

## Overview

The **Enterprise Progressive Web App (PWA) & Offline Engine** equips the NITS College ERP with real-time connection monitoring, offline action queues, background sync policy controls, CacheStorage allocation management, service worker update dialogs, and cached offline view placeholders.

---

## Component & Architecture Map

```
frontend/src/mobile/pwa/
├── PWAContext.tsx               # PWAContext & PWAProvider managing online/offline states, install prompt & sync queue
├── usePWA.ts                    # React hook for accessing PWA context state
├── ConnectionMonitor.tsx        # Real-time network monitor displaying status, latency (ms), and connection type
├── OfflineBanner.tsx            # Dismissible offline alert banner with ARIA live assertive role
├── InstallPrompt.tsx            # Standalone PWA app installation dialog & active app status badge
├── UpdateAvailableDialog.tsx    # Service worker update available notification & instant restart trigger
├── CacheManager.tsx             # CacheStorage allocation metrics, refresh cache, and clear storage actions
├── SyncCenter.tsx               # Offline sync queue, pending items list, manual sync, and auto-sync policy toggle
├── PWASettings.tsx              # PWA preferences for auto-sync, Wi-Fi only, and mobile data downloads
├── OfflineDashboard.tsx         # Cached dashboard metric placeholders during offline mode
├── OfflineWorkspace.tsx         # Available cached workspace module launcher
├── OfflineReports.tsx           # Pre-downloaded offline PDF & XLSX report bundle viewer
├── OfflineSettings.tsx          # Offline settings configuration & reconciliation notes
├── OfflineCenter.tsx            # Master hub unifying connection monitor, sync center, cache manager, & offline views
└── index.ts                     # Barrel export
```

---

## Key Features & Implementations

### 1. Connection Monitoring & Latency (`ConnectionMonitor.tsx` & `PWAContext.tsx`)
- Detects `window.onLine` and `window.offLine` browser events.
- Tracks `navigator.connection` RTT latency in milliseconds and effective type (`4g`, `3g`, `2g`).
- Displays "Slow Connection" warning badge when latency exceeds 150ms.

### 2. Synchronization Engine (`SyncCenter.tsx`)
- **Sync Queue**: Tracks pending offline actions with timestamps and module labels.
- **Manual Sync**: Instant "Sync Now" trigger processing pending items into completed state.
- **Sync Policy**: Auto background sync and Wi-Fi-only sync policy toggles.

### 3. PWA Installation & Service Worker Updates (`InstallPrompt.tsx` & `UpdateAvailableDialog.tsx`)
- Intercepts `beforeinstallprompt` event for clean one-tap PWA installation.
- Notifies users when a new Service Worker update (v0.35.0) is available with an instant "Update Now" restart button.

### 4. Cache & Storage Management (`CacheManager.tsx`)
- Allocates up to 500 MB for offline IndexedDB/CacheStorage assets.
- Provides "Refresh Cache" (re-downloads static assets) and "Clear Cache" actions.

---

## Verification & Build Status

- **TypeScript Compilation**: `npx tsc --noEmit` → **0 errors**.
- **Production Build**: `npm run build` → **Passed cleanly**.
- **Git Commit**: `feat(ui): implement enterprise offline and pwa experience`
- **Git Tag**: `v0.35.0-ui-mobile-part4`
