# Big Data Student Management (Batches & Academic Years)

## Problem
Currently, the system is designed for small-scale operations (one class, one course). In real colleges, a single course (like MSCIT or BCA) can have 100-200 students per year across multiple admission years (e.g., 2019, 2020, 2021). This lack of segmentation makes it extremely difficult for administrators and staff to search, filter, and manage large student datasets effectively.

## Evidence
- Administrator observation: Managing 200+ students in a single flat course list without batch or year segmentation makes search and filtering unusable.
- Real college data structures require divisions (e.g., Batch A, Batch B of 100 students each) and historical tracking (previous year vs current year).

## Users
- **Primary**: College Administrators and Staff who need to register, manage, and search large volumes of student records.
- **Not for**: Individual students.

## Hypothesis
We believe **adding Academic Year/Session and Batch/Division segmentation to courses and registrations** will **solve the data management and searchability problem** for **administrators**.
We'll know we're right when **administrators can successfully filter and manage 200+ students per course using year and batch filters**.

## Success Metrics
| Metric | Target | How measured |
|---|---|---|
| Search/Filter Time | < 5 seconds | Time taken to find a specific cohort |
| Bulk Import Success | 100% | Ability to import 100+ students into a specific year/batch |

## Scope
**MVP** — Add Academic Year and Batch/Division models/fields to support large student cohorts. Update registration forms, search filters, and bulk CSV import logic to utilize these new fields.

**Out of scope**
- Automated batch size limits (e.g., auto-splitting a batch when it reaches 100 students). Administrators will manually assign batches.
- Complex timetable generation based on new batches (can be deferred to a later feature).

## Delivery Milestones
<!-- Business outcomes, not engineering tasks. /plan turns each into a plan. -->
<!-- Status: pending | in-progress | complete -->

| # | Milestone | Outcome | Status | Plan |
|---|---|---|---|---|
| 1 | Database Schema Update | Year and Batch fields added to models | pending | — |
| 2 | Registration & Course Forms | UI updated to accept Year and Batch | pending | — |
| 3 | Search & Filtering | Admins can filter students by Year/Batch | pending | — |
| 4 | Bulk CSV Import | CSV upload supports Year and Batch mapping | pending | — |

## Open Questions
- [ ] Do we need a dedicated `Batch` model, or should `batch_name` and `academic_year` just be simple string/choice fields on the `Student` model?
- [ ] Should the CSV import feature allow creating new batches on the fly, or must they be pre-defined by the admin?

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Data migration issues with existing students | High | High | Set default values (e.g., "General", "Current Year") for existing records during migration. |

---
*Status: DRAFT — requirements only. Implementation planning pending via /plan.*
