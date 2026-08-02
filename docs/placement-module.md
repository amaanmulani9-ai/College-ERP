# Enterprise Placement & Career Development System (apps/placement)

## Executive Summary

The **Enterprise Placement & Career Development System** manages institutional campus recruitment drives, corporate recruiter relations, student eligibility, drive application pipelines, interview scheduling, offer letters, corporate internships, placement analytics, resume reviews, mock interviews, and career counselling for higher education institutions.

---

## Data Models Summary (`apps/placement/models.py`)

| Model | Description |
|-------|-------------|
| `Company` | Corporate recruiting company directory with industry, package range, and status. |
| `CompanyContact` | HR and campus recruiter contact directory. |
| `CampusDrive` | Campus recruitment drive schedule, CTC package, job role, and drive dates. |
| `DriveEligibility` | Academic CGPA cutoffs, backlog limits, allowed departments, and passing year rules. |
| `StudentApplication` | Candidate drive application pipeline (Applied, Shortlisted, Interview, Selected, Rejected). |
| `Shortlist` | Drive round shortlisting records. |
| `InterviewSchedule` | Round schedules, panel assignments, dates, time slots, and interview links. |
| `InterviewRound` | Defined round sequence for recruitment drives. |
| `InterviewFeedback` | Technical, communication, and HR evaluation scorecards. |
| `OfferLetter` | Job offer letters with CTC compensation packages and joining dates. |
| `OfferAcceptance` | Candidate offer response (Accepted, Rejected, Pending). |
| `Internship` | Corporate internships, duration, stipend, and industry mentors. |
| `InternshipEvaluation` | Corporate internship performance and attendance evaluations. |
| `PlacementRecord` | Verified placed student records. |
| `PlacementStatistics` | Annual placement %, highest CTC, average CTC, and offers issued summary. |
| `PlacementEvent` | Pre-placement talks, workshops, and placement events calendar. |
| `CareerCounselling` | 1-on-1 career guidance sessions and domain alignment. |
| `Resume` | Student resume version control, skill tags, and project showcase. |
| `ResumeReview` | Coordinator resume review, score, and suggestions. |
| `MockInterview` | Faculty mock interview technical and HR scoring scorecards. |
| `PlacementAuditLog` | Audit trail for placement operations. |

---

## Core Service API (`apps/placement/services/placement_service.py`)

- `PlacementService.register_company(data, performed_by)`
- `PlacementService.create_campus_drive(data, performed_by)`
- `PlacementService.check_eligibility(student_id, drive_id)`
- `PlacementService.apply_for_drive(student_id, drive_id, resume_id, performed_by)`
- `PlacementService.shortlist_students(drive_id, student_ids, round_number, performed_by)`
- `PlacementService.schedule_interview(data, performed_by)`
- `PlacementService.issue_offer(data, performed_by)`
- `PlacementService.respond_to_offer(offer_id, status, remarks, performed_by)`
- `PlacementService.register_internship(data, performed_by)`
- `PlacementService.compute_placement_statistics(academic_year)`
- `PlacementService.soft_delete_company(company_id, performed_by)`

---

## REST Endpoints (`/api/placement/`)

- `/api/placement/companies/` — Corporate Recruiters
- `/api/placement/drives/` — Campus Recruitment Drives (`/check_eligibility/`, `/apply/`, `/shortlist/`)
- `/api/placement/eligibility/` — Drive Eligibility Criteria
- `/api/placement/applications/` — Candidate Application Pipeline
- `/api/placement/shortlists/` — Round Shortlists
- `/api/placement/interviews/` — Interview Schedules
- `/api/placement/rounds/` — Interview Rounds
- `/api/placement/interview-feedback/` — Interview Evaluation Scorecards
- `/api/placement/offers/` — Offer Letters (`/respond/`)
- `/api/placement/acceptances/` — Offer Acceptances
- `/api/placement/internships/` — Corporate Internships
- `/api/placement/internship-evaluations/` — Internship Evaluations
- `/api/placement/records/` — Placement Records
- `/api/placement/statistics/` — Annual Placement Analytics (`/compute/`)
- `/api/placement/events/` — Placement Events & PPTs
- `/api/placement/counselling/` — Career Counselling Sessions
- `/api/placement/resumes/` — Student Resumes
- `/api/placement/resume-reviews/` — Resume Reviews
- `/api/placement/mock-interviews/` — Faculty Mock Interviews
- `/api/placement/logs/` — Audit Logs
- `/api/placement/dashboard/kpis/` — Placement Dashboard KPIs
- `/api/placement/reports/` — Comprehensive Placement Reports Suite

---

## Frontend Navigation & Pages (`frontend/src/pages/placement/`)

1. **`PlacementDashboardPage.tsx`** — Dashboard KPIs, active campus drives, and quick action cards.
2. **`CompanyPage.tsx`** — Corporate recruiter directory, contact details, and package range.
3. **`CampusDrivesPage.tsx`** — Campus recruitment drive calendar and CTC details.
4. **`EligibilityPage.tsx`** — CGPA thresholds, backlog limits, and allowed departments.
5. **`ApplicationsPage.tsx`** — Student drive applications pipeline tracker.
6. **`InterviewPage.tsx`** — Interview schedules, panel info, and evaluation feedback.
7. **`OffersPage.tsx`** — Offer letters, CTC packages, joining dates, and responses.
8. **`InternshipPage.tsx`** — Corporate stipend internships and mentor logs.
9. **`ResumePage.tsx`** — Resume builder placeholder, skill tags, and approval status.
10. **`MockInterviewPage.tsx`** — Faculty mock interview scorecards.
11. **`CareerCounsellingPage.tsx`** — 1-on-1 career guidance logs.
12. **`StatisticsPage.tsx`** — Annual placement %, CTC analytics, and department statistics.
13. **`ReportsPage.tsx`** — Full placement reporting suite.

---

## Verification & Compliance

- **Backend Unit & Integration Tests**: `venv\Scripts\python.exe -m pytest tests/test_placement.py`
- **TypeScript Type Checker**: `npx tsc --noEmit`
- **Frontend Production Build**: `npm run build`
