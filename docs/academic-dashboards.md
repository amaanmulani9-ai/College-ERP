# Enterprise College ERP — Academic Leadership Dashboards Specification

**Version:** v0.20.3-ui-dashboard-part3  
**Updated:** August 1, 2026  
**Status:** Principal, HOD, and Teacher Dashboards Complete  

---

## 1. Executive Summary

This specification outlines the specialized Academic Leadership Dashboards created for institutional executives (*Principal*), departmental chairs (*Head of Department / HOD*), and instructional faculty (*Teacher / Faculty*). Each dashboard utilizes shared widget libraries (`KPICard`, `ChartPlaceholder`, `ActivityFeed`, `AnnouncementPanel`, `CalendarWidget`) styled under the `DashboardLayout.tsx` framework.

---

## 2. Dashboard Specifications & Metrics

### 2.1 Principal Executive Dashboard (`/dashboard/principal`)
- **Focus:** Institution-wide academic performance, total enrollment, fee throughput, and graduation metrics.
- **KPI Metrics:** Total Students (2,450), Faculty (185), Active Departments (12), Programs (28), Courses (142), Attendance % (92.4%), Fee Collection % (88.5%), Graduation Rate (96.2%).
- **Key Sections:** Welcome Header with Report Generator, Academic Term Overview, Admissions & Exam Performance Trends, Real-Time Activity Feed & Bulletins.

### 2.2 Head of Department (HOD) Dashboard (`/dashboard/hod`)
- **Focus:** Departmental course progress, faculty workload allocation, student GPA curves, and internal assessment pass rates.
- **KPI Metrics:** Department Students (420), Faculty Members (24), Assigned Subjects (32), Active Today Classes (14), Attendance % (94.1%), Internal Pass Rate (91.0%), Research Projects (8), Course Completion (78.5%).
- **Key Actions:** Assign Faculty Subject, Approve Attendance, Publish Notice, View Department Analytics.

### 2.3 Teacher / Faculty Workbench (`/dashboard/teacher`)
- **Focus:** Daily lecture schedule, class attendance tracking, low attendance student alerts (&lt;75%), and grade upload shortcuts.
- **KPI Metrics:** Today's Classes (3), Assigned Subjects (3), Total Enrolled Students (160), Attendance Pending (1 Class), Active Assignments (6), Upcoming Mid-Terms (2).
- **Key Interactive Widgets:** Today's Timetable with class status (*Completed*, *Pending Attendance*, *Upcoming*), Low Attendance Alert List (&lt;75%), Daily Campus Calendar.

---

## 3. Verification & Quality Gate

- **TypeScript:** 0 type errors (`npx tsc --noEmit`)
- **Vite Build:** Compiled cleanly via `npm run build`
- **Route Bindings:** `/dashboard/principal`, `/dashboard/hod`, `/dashboard/teacher` bound under `<ProtectedRoute>` & `<DashboardLayout />`
