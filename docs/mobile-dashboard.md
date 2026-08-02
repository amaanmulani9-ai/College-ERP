# Enterprise Mobile Dashboards & Reporting

> **Module**: `frontend/src/mobile/dashboard/`  
> **Version**: v0.35.0-ui-mobile-part3  
> **Integrations**: Reuses UI-003 Dashboards, UI-006 Reporting, UI-004 Design System, UI-008 Mobile Foundation & Workspace  
> **Part**: TASK-UI-008 Part 3/5  

---

## Overview

The **Enterprise Mobile Dashboards & Reporting** engine provides touch-optimized role-aware dashboards (Super Admin, Principal, HOD, Teacher, Student, Parent), executive governance metrics, interactive charts (Line, Bar, Pie with touch tooltips and fullscreen mode), and a mobile report catalog with preview, export, and sharing features.

---

## Component & Architecture Map

```
frontend/src/mobile/dashboard/
├── MobileRoleSwitcher.tsx       # Role switcher for Super Admin, Principal, HOD, Teacher, Student, and Parent
├── MobileKPICarousel.tsx        # Swipeable KPI carousel with trend badges and role-aware metrics
├── MobileWidgetGrid.tsx         # Collapsible task approval and schedule widget cards
├── MobileQuickActions.tsx       # Touch action tiles (Attendance, Fee Receipt, Hall Tickets, AI Audit)
├── MobileActivityFeed.tsx       # Live real-time activity log feed
├── MobileAnnouncements.tsx      # Campus notices and official announcements
├── MobileCalendar.tsx           # Mini interactive academic event calendar
├── MobileAnalyticsCards.tsx     # Metric trend cards for mobile viewports
├── MobileChartViewer.tsx        # Interactive line/bar/pie charts with touch tooltips and fullscreen modal
├── MobileReportCatalog.tsx      # Searchable mobile report catalog with category filters
├── MobileReportViewer.tsx       # Mobile report preview with export & share triggers
├── MobileExecutiveDashboard.tsx # Cross-institutional summary, strategic goals, and risk alerts
├── MobileDashboardHome.tsx      # Main mobile dashboard assembling all role widgets
├── MobileDashboardShell.tsx     # Master shell orchestrating top tabs, views, and report modals
└── index.ts                     # Barrel export
```

---

## Key Features & Implementations

### 1. Role-Aware Dashboards (`MobileRoleSwitcher.tsx` & `MobileKPICarousel.tsx`)
- Role Switcher dropdown supporting **Super Admin**, **Principal**, **HOD**, **Teacher**, **Student**, and **Parent**.
- Dynamically switches KPI carousel metrics, trends, and quick actions based on active role context.

### 2. Touch Quick Actions & Collapsible Widgets (`MobileQuickActions.tsx` & `MobileWidgetGrid.tsx`)
- Touch target action tiles (≥56px) for common daily workflows.
- Collapsible widget cards allowing users to expand or collapse approval tasks and daily schedules.

### 3. Interactive Charts & Analytics (`MobileChartViewer.tsx` & `MobileAnalyticsCards.tsx`)
- Supports **Bar**, **Line**, and **Pie** chart representations.
- Touch Data Point Tooltips ("Selected Data Point: M5: 90 Count").
- Fullscreen modal toggle for in-depth chart examination on mobile screens.

### 4. Mobile Report Catalog & Viewer (`MobileReportCatalog.tsx` & `MobileReportViewer.tsx`)
- Searchable catalog categorized into Academic, Financial, and Administrative reports.
- Report viewer with data snapshot tables, format badges (PDF, XLSX, CSV), and export/share action triggers.

---

## Verification & Build Status

- **TypeScript Compilation**: `npx tsc --noEmit` → **0 errors**.
- **Production Build**: `npm run build` → **Passed cleanly**.
- **Git Commit**: `feat(ui): implement enterprise mobile dashboards and reporting`
- **Git Tag**: `v0.35.0-ui-mobile-part3`
