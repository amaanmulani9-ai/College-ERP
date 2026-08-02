# Enterprise Mobile Experience Foundation

> **Module**: `frontend/src/mobile/`  
> **Version**: v0.35.0-ui-mobile-part1  
> **Target Standards**: Microsoft 365 Mobile, Linear Mobile, Slack Mobile, ClickUp Mobile  
> **Part**: TASK-UI-008 Part 1/5  

---

## Overview

The **Enterprise Mobile Experience Foundation** introduces an adaptive, touch-first mobile infrastructure for the NITS College ERP platform. Designed to run on smartphones, tablets, and foldable devices, the mobile architecture reuses all existing design system tokens (`UI-001`), RBAC security controls (`UI-002`), role dashboards (`UI-004`), Enterprise Workspace (`UI-005`), Enterprise Reporting (`UI-006`), and Enterprise Settings (`UI-007`).

---

## Component & Architecture Map

```
frontend/src/mobile/
├── DeviceDetector.ts            # Phone, Tablet, Desktop, Orientation, Touch, & Safe-Area Notch detection
├── ResponsiveContext.tsx        # ResponsiveContext & Provider with live window resize & breakpoint tracking
├── MobileContext.tsx            # MobileContext & Provider for active tabs, swipe drawer, AI, Search, & Quick Create
├── useMobile.ts                 # React hook for consuming MobileContext state
├── SafeAreaProvider.tsx         # Notch padding & iOS/Android safe area inset container
├── MobileHeader.tsx             # Sticky mobile header with Tenant Switcher, Search, AI, Notifications & Avatar
├── MobileFooter.tsx             # Mobile footer with quick links, encryption badge & copyright
├── MobileBottomNavigation.tsx   # 48px touch-target bottom tab bar with active pill indicator & badges
├── MobileDrawer.tsx             # Categorised swipeable navigation drawer with backdrop overlay
├── MobileSidebar.tsx            # Navigation rail layout for tablet and landscape viewports
├── MobileTopTabs.tsx            # Horizontally scrollable sub-navigation tab bar
├── MobileFloatingActionButton.tsx # Speed dial FAB with expandable quick action menu & backdrop
├── MobileShell.tsx              # Provider shell wrapping tree in Responsive, Mobile & SafeArea contexts
├── MobileLayout.tsx             # Master layout combining sticky header, bottom nav, FAB & main content area
├── ResponsiveDashboard.tsx      # Stacked KPI carousel for phones, adaptive grid & touch quick action cards
├── ResponsiveTable.tsx          # Card mode for phones, full table mode for tablets, search & custom renderers
├── PWAInstallBanner.tsx         # PWA install prompt trigger, connection status & offline alert
├── MobileFoundationCenter.tsx   # Mobile hub showcasing live device metrics, preview toggle & components
└── index.ts                     # Barrel export
```

---

## Key Features & Implementations

### 1. Device & Viewport Detector (`DeviceDetector.ts`)
- Detects Device Category (`phone` < 640px, `tablet` 640–1023px, `desktop` ≥ 1024px).
- Tracks Orientation (`portrait` vs `landscape`).
- Identifies Touch Capability (`ontouchstart` or `navigator.maxTouchPoints > 0`).
- Calculates Safe-Area Insets (notch detection for iPhone X+ and punch-hole Android devices).

### 2. Context & Navigation (`MobileContext.tsx` & `MobileBottomNavigation.tsx`)
- Bottom Navigation bar with 48px touch targets adhering to WCAG 2.1 AA.
- Customizable tab bar supporting `dashboard`, `workspace`, `reports`, `notifications`, `profile`, and custom user tabs.
- Active pill indicator and unread notification badges.

### 3. Swipeable Navigation Drawer (`MobileDrawer.tsx`)
- Categorized sections: Core Platform, Academic Modules, Administration, and System Tools.
- Tenant header, user role card, sign out trigger, and touch-dismiss backdrop.

### 4. Speed Dial FAB (`MobileFloatingActionButton.tsx`)
- Floating action button in bottom right with smooth 45° rotation toggle.
- Expandable speed dial menu for Ask AI Copilot, Add Student, Collect Fee, and Take Attendance.

### 5. Adaptive Data & Widgets (`ResponsiveTable.tsx` & `ResponsiveDashboard.tsx`)
- **Card Mode**: Converts tabular data rows into touch-friendly cards on phone viewports.
- **KPI Swipe Carousel**: Single-featured KPI slide with swipe dot indicators for phone screens.
- **Adaptive Grid**: Dynamically scales metrics across 1, 2, or 4 columns based on screen width.

### 6. PWA & Offline Readiness (`PWAInstallBanner.tsx`)
- Intercepts `beforeinstallprompt` browser event to show install banner.
- Real-time offline alert indicator using `window.addEventListener('offline'/'online')`.

---

## Verification & Build Status

- **TypeScript Compilation**: `npx tsc --noEmit` → **0 errors**.
- **Production Build**: `npm run build` → **Passed cleanly**.
- **Git Commit**: `feat(ui): implement enterprise mobile foundation`
- **Git Tag**: `v0.35.0-ui-mobile-part1`
