# Enterprise College ERP — Student & Parent Dashboards Specification

**Version:** v0.20.3-ui-dashboard-part4  
**Updated:** August 1, 2026  
**Status:** Student & Parent Dashboards Delivered  

---

## 1. Overview

This specification covers the personalized Student Portal and Parent Guardian dashboards. Both dashboards use the shared `DashboardLayout.tsx` framework and reuse the established widget library — `KPICard`, `ChartPlaceholder`, `AnnouncementPanel`, and `CalendarWidget`.

---

## 2. Dashboard Specifications

### 2.1 Student Portal Dashboard (`/dashboard/student`)

**Welcome Header**
- Personalized avatar with student initials, roll number badge (`CS2026-042`), program, semester, and active academic session.
- Quick Actions: *View Timetable*, *View Grade Results*, *Download Certificate*.

**KPI Metrics (8 Cards)**
- Overall Attendance (94.2%, +1.2%)
- Cumulative GPA (3.88 / 4.0, +0.12)
- Earned Credits (92 / 160 — 57.5% Degree Progress)
- Outstanding Fees ($0.00 — Fully Paid)
- Library Books Issued (2 Books, Due in 12 Days)
- Hostel Allocation (Block C, Room 304)
- Scholarship Status (25% Merit Waiver Active)
- Certificates Issued (4 QR-Verified)

**Interactive Sections**
- **Today's Timetable:** 3-card lecture schedule with *Active Now* pulse highlight for current class, plus status badges (*Completed*, *Upcoming*).
- **Subject-wise Attendance Tracker:** Progress bars per subject with attendance percentage bars (CS302: 92.8%, CS401: 100.0%, CS505: 91.6%).
- **Academic Performance Chart:** Semester GPA trend placeholder.
- **Campus Bulletins & Calendar:** Reuses `AnnouncementPanel.tsx` and `CalendarWidget.tsx`.

---

### 2.2 Parent Guardian Dashboard (`/dashboard/parent`)

**Welcome Header**
- Displays parent name, linked child name and roll number, child program, and active session.
- Quick Actions: *Pay Fee Invoice*, *Download Fee Receipt*, *Contact Faculty*.

**KPI Metrics (8 Cards)**
- Child Attendance Rate (94.2%)
- Cumulative GPA (3.88)
- Outstanding Fee Dues ($0.00)
- Hostel Residence (Block C, Room 304)
- Library Books Borrowed (2 Books, Zero Fines)
- Scholarship Awarded (25% Merit Waiver)
- Disciplinary Alerts (0 — Clean Record)
- Upcoming Mid-Terms (2 Exams, Aug 15)

**Interactive Sections**
- **Fee Receipts & Payment Audit Table:** Scrollable table of recent payments with receipt numbers, amounts, dates, PAID status badges, and PDF download buttons.
- **Performance & Attendance Charts:** Monthly attendance chart and semester GPA trend chart placeholders.
- **Institutional Bulletins & Calendar:** Reuses `AnnouncementPanel.tsx` and `CalendarWidget.tsx`.

---

## 3. Route Bindings

| Route | Page | Layout | Auth |
|-------|------|---------|------|
| `/dashboard/student` | `StudentDashboardPage.tsx` | `DashboardLayout` | `ProtectedRoute` |
| `/dashboard/parent` | `ParentDashboardPage.tsx` | `DashboardLayout` | `ProtectedRoute` |

---

## 4. Verification & Quality Gate

- **TypeScript:** 0 type errors (`npx tsc --noEmit`)  
- **Vite Build:** Compiled cleanly via `npm run build`  
