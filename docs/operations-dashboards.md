# Enterprise College ERP — Operations Dashboards Specification

**Version:** v0.20.3-ui-dashboard-part5  
**Updated:** August 1, 2026  
**Status:** Accountant, Librarian & Hostel Warden Dashboards Delivered  

---

## 1. Overview

This specification covers the three Operational Role dashboards built for the Finance & Accounts officer, Library manager, and Hostel Warden. All three dashboards use the shared `DashboardLayout.tsx` framework and reuse the full widget library.

---

## 2. Dashboard Specifications

### 2.1 Accountant / Finance Officer Dashboard (`/dashboard/accountant`)

**Welcome Header:** Emerald gradient, Finance & Accounts badge, current financial period (Q2 FY 2026-2027), and quick action buttons (*Collect Fee Payment*, *Issue Receipt*, *Generate Report*).

**KPI Metrics (8 Cards)**
- Total Fee Collection YTD ($1.24M, +14.2%)
- Today's Collections ($48,200 — 22 Transactions)
- Pending Fee Dues ($142,800 — 284 Students)
- Overdue Payments ($38,500 — Past Due Date)
- Scholarships Disbursed ($86,400 — 142 Students)
- Refund Requests (8 Pending)
- Payment Success Rate (97.8%)
- Monthly Revenue ($420,000 — July 2026)

**Interactive Sections**
- **Outstanding Fees Table:** Student name, roll, program, amount due, due date, color-coded status (*Overdue* = red, *Pending* = amber), and action menu.
- **Recent Transactions Ledger:** Receipt number, student name, payment method, amount, status (*SUCCESS* = emerald, *PENDING* = amber).
- **Revenue Analytics Charts:** Fee Collection Trend + Payment Gateway Performance placeholders.

---

### 2.2 Librarian Dashboard (`/dashboard/library`)

**Welcome Header:** Amber gradient, Central Campus Library badge, holdings count (185,000 volumes), and quick action buttons (*Issue Book*, *Process Return*, *Search Catalog*).

**KPI Metrics (8 Cards)**
- Total Book Holdings (185,000 Volumes)
- Books Currently Issued (2,840 Active Borrowers)
- Returns Processed Today (124)
- Overdue Books (86)
- Fine Collection Today ($420.00)
- Reservation Queue (58 Books)
- Active Library Members (3,240)
- Digital E-Resources (42,000 via JSTOR, Springer, IEEE)

**Interactive Sections**
- **Today's Circulation Activity Log:** 4 cards showing issue, return, overdue, and reservation events with color-coded status badges and timestamps.
- **Library Analytics Charts:** Circulation Trend + Subject Category Popularity placeholders.

---

### 2.3 Hostel Warden Dashboard (`/dashboard/hostel`)

**Welcome Header:** Purple gradient, Rajiv Gandhi Residential Complex, capacity (1,020 beds), and quick action buttons (*Allocate Room*, *Maintenance*, *Visitor Log*).

**KPI Metrics (8 Cards)**
- Total Rooms (255 Rooms — Blocks A, B, C, D)
- Occupied Rooms (240 Rooms — 960 Beds)
- Available Vacancies (15 Rooms — 60 Beds)
- Total Residents (960 Students)
- Maintenance Requests (12 Pending — 3 High Priority)
- Visitor Entries Today (24 Visitors)
- Hostel Fees Pending ($28,400)
- Occupancy Rate (94.2% — Above 90% Target)

**Interactive Sections**
- **Open Maintenance Requests:** Student name, room, request type, priority badge (*High* = red, *Medium* = amber, *Low* = slate), and raise date.
- **Today's Resident Movements:** Check-in/out/leave-approval log with status badges.
- **Occupancy & Maintenance Charts:** Occupancy Trend + Maintenance Category Distribution placeholders.

---

## 3. Route Bindings

| Route | Page | RBAC Role |
|-------|------|-----------|
| `/dashboard/accountant` | `AccountantDashboardPage.tsx` | accountant / finance_officer |
| `/dashboard/library` | `LibrarianDashboardPage.tsx` | librarian |
| `/dashboard/hostel` | `HostelWardenDashboardPage.tsx` | hostel_warden |

---

## 4. Verification

- **TypeScript:** 0 type errors (`npx tsc --noEmit`)
- **Build:** Compiled cleanly via `npm run build`
