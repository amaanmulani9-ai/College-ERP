# Enterprise Reporting & Analytics Framework (v0.33.0 Part 1)

## Overview

The **Enterprise Reporting & Analytics Framework** (`frontend/src/reporting/`) provides a centralized, reusable reporting engine utilized across all 30 ERP modules. It allows users across various roles (Super Admin, Principal, HOD, Teacher, Accountant, Warden, Librarian, etc.) to discover, parameterize, run, export, favorite, pin, and dock reports seamlessly within the workspace environment.

---

## Folder & Component Architecture

```
frontend/src/reporting/
├── types.ts                     # TypeScript definitions for reports, categories, filters & ranges
├── mockData.ts                  # Mock report definitions covering all 23 ERP categories
├── ReportingContext.tsx         # React Context for reporting state & capabilities
├── ReportingProvider.tsx        # Context Provider with LocalStorage & Workspace Tab integration
├── ReportingLayout.tsx          # Main Layout container with Sidebar, Toolbar & Breadcrumbs
├── ReportViewer.tsx             # Interactive Report Viewer with KPI cards, tables & charts
├── ReportSidebar.tsx            # Category & view filter sidebar (Desktop/Tablet/Mobile)
├── ReportToolbar.tsx            # Actions toolbar: Search, View switch, Export & Print
├── ReportBreadcrumbs.tsx        # Breadcrumb navigation bar with ARIA focus management
├── ReportingPage.tsx            # High-level route component
├── index.ts                     # Master barrel export
└── components/
    ├── ReportCard.tsx           # Individual report item card representation
    ├── ReportGrid.tsx           # Responsive Grid view layout
    ├── ReportTable.tsx          # Dense Table view layout with sorting
    ├── ReportFilters.tsx        # Parameter filter panel with preset saving
    ├── DateRangePicker.tsx      # Preset and custom date range selector
    ├── SavedReports.tsx         # User-saved custom parameter presets
    ├── RecentReports.tsx        # Recently accessed report history
    ├── FavoriteReports.tsx      # Starred favorite reports grid
    ├── ReportSearch.tsx         # Instant search bar with Ctrl+K shortcut
    └── ReportEmptyState.tsx     # Accessible empty search & view state
```

---

## 23 Supported ERP Report Categories

1. **Academic**: Course curriculum breakdown, subject credit loads
2. **Admissions**: Application funnels, seat matrix conversion rates
3. **Attendance**: Defaulter tracking, threshold alerts, medical leaves
4. **Examinations**: Seating arrangement, invigilator duty list, hall tickets
5. **Results**: SGPA/CGPA distribution, class ranker analytics
6. **Students**: Demographics, enrollment master directory
7. **Faculty**: Research output, publication logs, teaching loads
8. **HR**: Leave balances, performance appraisal, turnover rates
9. **Payroll**: Salary registers, tax withholding, net payouts
10. **Finance**: Balance sheet overview, institutional PnL
11. **Fees**: Outstanding dues, fine waivers, installment ledgers
12. **Payments**: Gateway transaction logs, reconciliation, chargebacks
13. **Transport**: Vehicle mileage tracking, fuel logs, route occupancy
14. **Library**: Book circulation, overdue fines, digital journal usage
15. **Hostel**: Room occupancy per block, mess fee collections
16. **Inventory**: Reorder thresholds, stock valuation, aging analysis
17. **Procurement**: RFQ comparisons, PO lifecycle, vendor contracts
18. **Assets**: Depreciation schedules, lab allocations, AMC coverage
19. **Placement**: Campus drives, CTC analytics, offer letter statistics
20. **Alumni**: Global directory, mentorship hours, donation logs
21. **Visitor**: Security gate passes, contractor access logs
22. **AI**: Token consumption analytics, copilot query latency
23. **System**: Audit logs, permission modification traces, active sessions

---

## Key Features & Capabilities

- **Catalog Search**: Real-time filtering by report title, code, module, or description. Global shortcut `Ctrl+K` or `Ctrl+F` focuses search.
- **Favorites & Pinning**: One-click star or pin reports for immediate access on the workspace home and sidebar.
- **Workspace Docking**: Dock reports to side or bottom panels for quick side-by-side reference while performing other administrative tasks.
- **Workspace Tab Integration**: Opens any report directly in a workspace tab utilizing the ERP `TabContext` system.
- **Saved Presets**: Save frequently used filter parameters (e.g., "CS Dept - Q3 Defaulters") with one click.
- **Export Capabilities**: Supports PDF, Excel (.xlsx), CSV, and JSON data exports.
- **Accessibility & Responsiveness**: Keyboard-navigable with ARIA roles (`role="toolbar"`, `role="search"`, `role="region"`), focus rings, and responsive drawer support across Mobile, Tablet, and Desktop screens.

---

## Verification & Build Compliance

- TypeScript Compilation: Passed with 0 errors (`npx tsc --noEmit`)
- Vite Production Build: Verified (`npm run build`)
