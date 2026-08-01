# MODULE_DEPENDENCY_MAP.md
# Enterprise College ERP — Module Dependency Graph

**Version:** v0.20.0  
**Generated:** 2026-08-01  

---

## 1. Dependency Hierarchy

The system has **four dependency tiers**. Higher tiers depend on lower tiers. Lower tiers never import from higher tiers.

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 4 — DOMAIN SERVICES                                       │
│  (Depend on: Auth, RBAC, Profiles, Academics, Students/Staff)   │
│                                                                 │
│  admissions  timetable  attendance  examinations                │
│  results     certificates  fees  payments  scholarships         │
│  library     hostel                                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │ depends on
┌─────────────────────────▼───────────────────────────────────────┐
│  TIER 3 — PEOPLE MANAGEMENT                                     │
│  (Depend on: Auth, RBAC, Profiles, Academics)                   │
│                                                                 │
│  students      staff       parents                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │ depends on
┌─────────────────────────▼───────────────────────────────────────┐
│  TIER 2 — CORE PLATFORM                                         │
│  (Depend on: Auth, Tenancy)                                     │
│                                                                 │
│  rbac         profiles        academics                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │ depends on
┌─────────────────────────▼───────────────────────────────────────┐
│  TIER 1 — FOUNDATION                                            │
│  (No app-level dependencies)                                    │
│                                                                 │
│  tenancy      authentication     core                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Dependency Graph

### Notation
- `→` = "imports from" or "has a ForeignKey to"
- `⊃` = "uses the service of"

```
tenancy         → django_tenants (TenantMixin, DomainMixin)
authentication  → tenancy (schema context)
core            → django.db.connection (schema health checks)

rbac            → authentication.User (ForeignKey: UserRole.user)
                  django.core.cache (Redis permission caching)

profiles        → authentication.User (OneToOne: UserProfile.user)
                  authentication.signals (post_save auto-create)

academics       → (no app-level FK dependencies — pure academic hierarchy)

students        → authentication.User (via profiles.UserProfile)
                  profiles.UserProfile (OneToOne)
                  academics.Program, academics.Department,
                  academics.Semester, academics.AcademicSession

staff           → profiles.UserProfile (OneToOne)
                  academics.Department
                  staff.Designation

parents         → students.Student (M2M via StudentParentLink)
                  authentication.User

admissions      → academics.Program, academics.Department,
                  academics.AcademicSession, academics.Semester
                  profiles.UserProfile (enrollment pipeline creates UserProfile)
                  students.Student (auto-created on enrollment)
                  parents.Parent (auto-created on enrollment)
                ⊃ admissions.services → students.services (Student ID generation)
                ⊃ admissions.services → parents.services (Parent creation)

timetable       → academics.Subject, academics.SubjectOffering,
                  academics.Semester, academics.Program
                  timetable.Building, timetable.Classroom, timetable.TimeSlot
                  staff.Employee (invigilator assignments via ExamSchedule)

attendance      → academics.Subject, academics.Semester
                  students.Student
                  staff.Employee (FacultyAttendance)
                  timetable.Timetable (session context)

examinations    → academics.Subject, academics.Semester, academics.Program
                  academics.AcademicSession
                  students.Student (HallTicket)
                  staff.Employee (InvigilatorAssignment)
                  timetable.Classroom (ExamSchedule.classroom)

results         → academics.Subject, academics.Semester, academics.Program
                  students.Student
                  examinations.HallTicket (required for attendance eligibility)
                ⊃ results.services → certificates (auto-publish triggers)

certificates    → students.Student
                  academics.Program, academics.Semester, academics.AcademicSession
                  results.SemesterResult, results.StudentResult (published check)

fees            → students.Student
                  academics.Program, academics.Semester, academics.AcademicSession
                  fees.FeeCategory, fees.FeeStructure

payments        → students.Student
                  fees.StudentFee (link to fee being paid)
                  fees.FeeReceipt (auto-generated on success)
                ⊃ payments.services → fees.services (FeeService.collect_fee)

scholarships    → students.Student
                  academics.AcademicSession
                  fees.StudentFee (scholarship deduction updates)
                ⊃ scholarships.services → fees.services (apply_scholarship_to_fees)

library         → students.Student (borrower)
                  staff.Employee (staff borrower)
                  library.Book, library.BookIssue, library.Reservation

hostel          → students.Student
                  staff.Employee (Warden)
                  fees.FeeCategory, fees.FeeStructure, fees.StudentFee
                ⊃ hostel.services → fees.services (auto-assign HOSTEL_FEE on allocation)
```

---

## 3. Module-by-Module Dependency Table

| Module | Depends On | Depended On By |
|:---|:---|:---|
| `tenancy` | django_tenants | authentication, all apps (schema context) |
| `authentication` | tenancy | rbac, profiles, all apps (User FK) |
| `core` | django.db | (health checks only, no business dependents) |
| `rbac` | authentication | All apps (permission checks) |
| `profiles` | authentication | students, staff, parents, admissions |
| `academics` | — | students, staff, admissions, timetable, attendance, examinations, results, certificates, fees, scholarships |
| `students` | profiles, academics | admissions, attendance, examinations, results, certificates, fees, payments, scholarships, library, hostel, parents |
| `staff` | profiles, academics | timetable, attendance, examinations, library, hostel |
| `parents` | students, authentication | admissions (enrollment creates Parent) |
| `admissions` | academics, profiles, students, parents | (no dependents) |
| `timetable` | academics, staff | attendance, examinations |
| `attendance` | academics, students, staff, timetable | (no dependents) |
| `examinations` | academics, students, staff, timetable | results, certificates |
| `results` | academics, students, examinations | certificates, scholarships (CGPA check) |
| `certificates` | students, academics, results | (no dependents) |
| `fees` | students, academics | payments, scholarships, hostel |
| `payments` | students, fees | (no dependents) |
| `scholarships` | students, academics, fees, results | (no dependents — reads CGPA from results) |
| `library` | students, staff | (no dependents) |
| `hostel` | students, staff, fees | (no dependents) |

---

## 4. Critical Dependency Paths

### 4.1 Student Financial Pipeline

```
Student
  └─► StudentFee (fees)
        └─► PaymentOrder (payments)
              └─► PaymentTransaction (payments)
                    └─► FeeReceipt (fees) ← auto-generated
        └─► Scholarship (scholarships)
              └─► StudentFee.scholarship_amount updated
        └─► HostelAllocation (hostel)
              └─► StudentFee (HOSTEL_FEE) ← auto-created
```

### 4.2 Admissions → Enrollment Pipeline

```
AdmissionApplication (admissions)
  └─► [approve] → SeatMatrix.allocated_seats++
  └─► [enroll]  → User created (authentication)
                → UserProfile created (profiles)
                → Student created (students) [auto Student ID]
                → Parent created (parents) [auto Parent code]
                → StudentParentLink created (parents)
```

### 4.3 Academic Output Pipeline

```
ResultScheme (results)
  └─► StudentResult (marks entry)
        └─► SemesterResult (SGPA/CGPA computed)
              └─► Certificate.Transcript (certificates)
              └─► Scholarship eligibility check (CGPA threshold)
```

### 4.4 Examination → Certificate Flow

```
ExamSchedule (examinations)
  └─► HallTicket (examinations) ← required for attendance eligibility
        └─► ExamAttendance (examinations)
              └─► StudentResult.status validation (results)
                    └─► Certificate generation allowed (certificates)
```

---

## 5. Cross-App Service Dependencies

```python
# payments/services.py imports from fees/services.py
from apps.fees.services import FeeService
FeeService.collect_fee(...)  # on payment verification

# scholarships/services.py imports from fees/services.py
from apps.fees.services import FeeService
FeeService.apply_scholarship_discount(...)  # on scholarship approval

# hostel/services.py imports from fees/services.py
from apps.fees.services import FeeService
FeeService.assign_fee(...)  # on bed allocation

# admissions/services.py imports from students/services.py
from apps.students.services import StudentService
StudentService.create(...)  # on enrollment pipeline

# admissions/services.py imports from parents/services.py
from apps.parents.services import ParentService
ParentService.create_parent(...)  # on enrollment pipeline

# All apps import from authentication/services.py
from apps.authentication.services import log_audit_event
log_audit_event(...)  # audit trail across all apps
```

---

## 6. Frontend Service Dependencies

| Frontend Service | Backend Endpoints | React Pages Using It |
|:---|:---|:---|
| `authService.ts` | `/api/auth/` | LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage |
| `profileService.ts` | `/api/profiles/` | MyProfilePage, EditProfilePage, ProfileCompletionWidget |
| `rbacService.ts` | `/api/rbac/` | RolesPage, RoleDetailsPage, PermissionsPage, PermissionMatrixPage, AssignRolesPage |
| `academicService.ts` | `/api/academics/` | FacultyMgmt, DeptMgmt, ProgramMgmt, SessionsMgmt, SemesterMgmt, SubjectMgmt, OfferingsPage |
| `studentService.ts` | `/api/students/` | StudentList, StudentDetails, CreateStudent, StudentStats, BulkImport |
| `staffService.ts` | `/api/staff/` | EmployeeList, EmployeeDetails, CreateEmployee, DesignationMgmt, EmployeeStats |
| `parentService.ts` | `/api/parents/` | ParentList, ParentDetails |
| `admissionService.ts` | `/api/admissions/` | AdmissionsDashboard, ApplicationList, ApplicationDetails, CreateApplication, DocVerification, SeatMatrix |
| `timetableService.ts` | `/api/timetable/` | TimetableDashboard, WeeklyTimetable, ConflictViewer |
| `attendanceService.ts` | `/api/attendance/` | AttendanceDashboard, TakeAttendance, AttendanceReports |
| `examService.ts` | `/api/examinations/` | ExamDashboard, ExamSchedule, HallTicket |
| `resultService.ts` | `/api/results/` | ResultDashboard, MarksEntry, PublishResult, StudentResult |
| `certificateService.ts` | `/api/certificates/` | CertificateDashboard, GenerateCertificate, StudentCerts, Verification |
| `feeService.ts` | `/api/fees/` | FeeDashboard, FeeStructure, CollectFee, OutstandingReport |
| `paymentService.ts` | `/api/payments/` | PaymentDashboard, PayFees, PaymentHistory, TransactionDetails, RefundHistory |
| `scholarshipService.ts` | `/api/scholarships/` | ScholarshipDashboard, ScholarshipTypes, StudentScholarships, ScholarshipApplications, Renewals, EligibilityChecker |
| `libraryService.ts` | `/api/library/` | LibraryDashboard, Books, BookCategories, AuthorsPublishers, IssueBook, ReturnBook, Reservations, FineReport |
| `hostelService.ts` | `/api/hostel/` | HostelDashboard, Hostels, BlocksRooms, StudentAllocation, VisitorRegister, HostelMaintenance, VacancyReport |
