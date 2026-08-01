# Enterprise Human Resource Management System — Architecture & Specification

**Version:** v0.24.0  
**Updated:** August 1, 2026  
**Module:** `backend/apps/hr/` & `frontend/src/pages/hr/`

---

## 1. Overview

The Enterprise Human Resource Management System provides complete institutional oversight of employee lifecycle management, department structures, designations, leave management and entitlement balances, recruitment pipelines, digital onboarding checklists, annual performance appraisals, staff training programs, career promotions & transfers, exit clearances, disciplinary compliance, and HR audit logging.

---

## 2. Backend Architecture (`backend/apps/hr/`)

### Data Models
- **Department:** Institutional departments & HOD assignments (`department_code`, `department_name`, `head_of_department`, `status`).
- **Designation:** Job titles & hierarchy levels (`title`, `department`, `grade`, `hierarchy_level`).
- **EmploymentType:** Employment categories (Permanent, Contract, Visiting, Adjunct, Intern).
- **LeaveType & LeaveBalance & LeaveRequest:** Staff leave entitlement balances & workflow (`leave_type`, `start_date`, `end_date`, `reason`, `status`, `approved_by`).
- **HolidayCalendar & Shift & EmployeeShiftAssignment & AttendancePolicy:** Work schedules & holiday calendar.
- **RecruitmentJob & JobApplication & Interview & OfferLetter:** Job openings & recruitment pipelines (`title`, `department`, `candidate_name`, `email`, `offered_salary`).
- **EmployeeOnboarding & EmployeeDocument:** Joiner checklist & document verification.
- **PerformanceReview & PerformanceGoal:** Annual performance appraisals & KPI goals (`reviewer`, `review_cycle`, `rating`, `remarks`).
- **TrainingProgram & TrainingEnrollment:** Staff professional development workshops.
- **Promotion & Transfer:** Designation promotions & departmental transfers (`old_designation`, `new_designation`, `old_department`, `new_department`, `effective_date`).
- **Resignation & ExitInterview:** Exit management & clearance workflows.
- **DisciplinaryAction:** Misconduct incidents & warning actions (`category`, `reason`, `action_taken`, `status`).
- **HRAnnouncement & HRAuditLog:** HR broadcasts & system audit log.

### Service Layer (`services/hr_service.py`)
- `submit_leave_request()`, `approve_leave_request()`, `promote_employee()`, `transfer_employee()`, `log_audit_event()`, `get_hr_dashboard_kpis()`.

### REST API Endpoints (`/api/hr/`)
- `/api/hr/departments/`
- `/api/hr/designations/`
- `/api/hr/leave-types/`
- `/api/hr/leave-balances/`
- `/api/hr/leave-requests/` (with `/approve/` action)
- `/api/hr/recruitment-jobs/`
- `/api/hr/job-applications/`
- `/api/hr/offer-letters/`
- `/api/hr/onboarding/`
- `/api/hr/performance-reviews/`
- `/api/hr/training-programs/`
- `/api/hr/training-enrollments/`
- `/api/hr/promotions/`
- `/api/hr/transfers/`
- `/api/hr/resignations/`
- `/api/hr/disciplinary-actions/`
- `/api/hr/announcements/`
- `/api/hr/audit-logs/`
- `/api/hr/dashboard/kpis/`
- `/api/hr/reports/`

---

## 3. Frontend Pages (`frontend/src/pages/hr/`)

Built strictly using the Enterprise Design System (`@/design-system`):
- `HRDashboardPage.tsx` — Headcount summary, active job openings, pending leave approvals, onboarding progress.
- `DepartmentPage.tsx` — Department registry & HOD assignments.
- `DesignationPage.tsx` — Job title hierarchy & grade bands.
- `LeaveRequestPage.tsx` — Leave applications & approval management.
- `RecruitmentPage.tsx` — Job postings & candidate application tracking.
- `OnboardingPage.tsx` — New joiner document verification & orientation checklist.
- `PerformancePage.tsx` — Performance appraisal reviews & rating scores.
- `TrainingPage.tsx` — Staff workshops & training program enrollment.
- `PromotionTransferPage.tsx` — Faculty promotions & department transfers log.
- `ResignationExitPage.tsx` — Resignation notices & exit clearances.
- `DisciplinaryPage.tsx` — Compliance violations & disciplinary action register.
- `AnnouncementsPage.tsx` — Official HR circulars & institutional broadcasts.
- `ReportsPage.tsx` — Departmental headcount, leave utilization & compliance reports.

---

## 4. Verification & Testing

- **Backend Pytest:** `tests/test_hr.py` ➔ **All 6 tests passed (100%)**
- **TypeScript Audit:** `npx tsc --noEmit` ➔ **0 Errors**
- **Production Build:** `npm run build` ➔ **Clean Vite production build**
