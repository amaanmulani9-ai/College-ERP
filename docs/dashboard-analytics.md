# Enterprise Dashboard — Analytics & Data Hub Specification

**Version:** v0.20.3-ui-dashboard-final  
**Updated:** August 1, 2026

---

## 1. Analytics Hub Component

**File:** `frontend/src/components/dashboard/widgets/AnalyticsHub.tsx`  
**Route:** Embedded in any dashboard page as a reusable widget.

### Chart Definitions

| Chart ID | Title | Data Source (Backend Ready) |
|----------|-------|----------------------------|
| `student-growth` | Student Growth & Admissions | `GET /api/analytics/student-growth/` |
| `attendance-rate` | Attendance Rate Analytics | `GET /api/analytics/attendance/` |
| `fee-collection` | Fee Collection & Revenue | `GET /api/analytics/fee-collection/` |
| `library-circulation` | Library Circulation Metrics | `GET /api/analytics/library/` |
| `hostel-occupancy` | Hostel Occupancy Trends | `GET /api/analytics/hostel/` |
| `result-distribution` | Academic Result Distribution | `GET /api/analytics/results/` |

---

## 2. Chart Placeholder Pattern

All chart placeholders use `ChartPlaceholder.tsx` which renders:
- 7D / 30D / 90D time-range selector buttons
- Full chart area skeleton with gradient shimmer
- Loading indicator (for when real data is piped in)

**Integration path:** Replace `<ChartPlaceholder>` with actual `<BarChart>`, `<LineChart>`, or `<AreaChart>` from `recharts` when backend endpoints are live.

---

## 3. Role-Specific Analytics Visibility

| Dashboard | Charts Shown |
|-----------|-------------|
| Super Admin | All 6 charts |
| Principal | Student Growth, Attendance, Results |
| HOD | Attendance, Results (department-filtered) |
| Teacher | Attendance (class-filtered) |
| Accountant | Fee Collection, Revenue |
| Librarian | Library Circulation |
| Hostel Warden | Hostel Occupancy |
| Student | GPA Trend, Subject Attendance |
| Parent | Attendance, GPA |

---

## 4. AI Analytics Placeholders (v2 Roadmap)

These cards are labelled **Coming Soon** and require Gemini AI integration:

| AI Feature | Purpose |
|------------|---------|
| Attendance Predictor | Identify students at <75% risk |
| Fee Default Scorer | Pre-due-date risk flags |
| Academic Risk Alerts | Multi-subject decline detection |
| Institutional Trend AI | Admissions + retention + graduation forecast |

---

## 5. Performance Considerations

- All dashboard pages use `React.lazy()` + `<Suspense>` for code splitting
- `ChartPlaceholder` renders with zero JS chart library weight until data is present
- Analytics Hub grid uses CSS Grid with `xl:grid-cols-3` responsive breakpoints
