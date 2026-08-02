# Institution & Academic Configuration Center (v0.34.0 Part 2)

## Overview

The **Institution & Academic Configuration Center** (`frontend/src/settings/institution/`) centralizes all organizational, academic structure, campus infrastructure, session management, and calendar scheduling into a single administration suite.

---

## Directory & Component Architecture

```
frontend/src/settings/institution/
├── types.ts                          # Data definitions for institution profile, campuses, & academic structure
├── mockInstitutionData.ts           # Datasets for 13 institution & academic pages
├── InstitutionProfilePage.tsx       # Primary organizational details & NAAC/NIRF accreditation
├── CampusManagementPage.tsx          # Multi-campus, building, & room allocation
├── AcademicStructurePage.tsx        # Visual hierarchy tree (Faculty → School → Dept → Program → Course → Cohort)
├── AcademicSessionPage.tsx          # Term open/close & academic session status
├── DepartmentManagementPage.tsx     # Department codes, faculty counts & HOD assignments
├── ProgramManagementPage.tsx        # UG, PG, Diploma, Certificate & PhD degree catalog
├── CourseConfigurationPage.tsx      # Course credits, theory/lab split & syllabus
├── SemesterConfigurationPage.tsx    # Odd/Even registration, examination & result windows
├── SectionManagementPage.tsx       # Student section allocation (A, B, C) & class advisors
├── ClassroomManagementPage.tsx      # Lecture hall, smart lab & auditorium seating capacities
├── CalendarConfigurationPage.tsx    # Academic calendar event scheduling
├── WorkingDaysPage.tsx              # Weekly timetable schedule & half-day rules
├── HolidayConfigurationPage.tsx     # National, state, academic & emergency closures
├── InstitutionSettingsCenter.tsx    # Master tabbed navigation hub
└── index.ts                          # Master barrel export
```

---

## 13 Supported Configuration Pages

1. **Institution Profile**: Name, short name, NAAC A++ / NIRF rank #12, tax ID, timezone, currency.
2. **Campus Management**: Multiple campuses, buildings count, total capacities, and status.
3. **Academic Structure**: Interactive visual organizational tree.
4. **Academic Sessions**: Open/close current academic year 2026-2027, past, and upcoming sessions.
5. **Departments**: HOD assignment, professor count, enrolled student metrics.
6. **Programs**: UG, PG, Diploma, Certificate, PhD credits, duration, eligibility.
7. **Courses**: Course codes, credits, theory vs lab split, core vs elective.
8. **Semester Configuration**: Registration, examination, and result windows.
9. **Section Management**: Class advisor assignments, room allocation.
10. **Classroom Management**: Lecture halls, smart labs, seating capacity, AV equipment.
11. **Academic Calendar**: Admissions, exams, convocation, orientation events.
12. **Working Days**: Weekly timetable schedule (Mon-Fri full day, Sat half day).
13. **Holiday Management**: National, state, academic holidays, emergency closures.

---

## Verification & Build Compliance

- TypeScript Compilation: Passed with **0 errors** (`npx tsc --noEmit`)
- Vite Production Build: Verified (`npm run build`)
- Git Tag: `v0.34.0-ui-settings-part2`
