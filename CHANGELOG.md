# Changelog

All notable changes to the Enterprise College ERP system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.14.0] - 2026-08-01

### Added
- **Enterprise Result Management System (`apps/results/`)**:
  - Models for `ResultScheme`, `StudentResult`, `SemesterResult`, and `ResultAuditLog`.
  - Automatic Grade & Credit Point calculation engine (`A+` to `F`, Grade Points 10.0 to 0.0).
  - SGPA and CGPA computation services.
  - Merit rank list generation for batch semester results.
  - Batch semester result publishing pipeline with status updates.
  - Transcript preview API and audit trail loggers.
  - Frontend React pages: `ResultDashboardPage`, `MarksEntryPage`, `PublishResultPage`, `StudentResultPage`.
  - Comprehensive unit test suite (`tests/test_results.py`).
  - System documentation (`docs/results.md`).

## [v0.13.0] - 2026-08-01

### Added
- **Enterprise Examination Management System (`apps/examinations/`)**:
  - Models for `ExamType`, `Exam`, `ExamSchedule`, `HallTicket`, `ExamAttendance`, `InvigilatorAssignment`, and `ExamAuditLog`.
  - Conflict engine for classroom and invigilator exam double-booking prevention.
  - Hall Ticket generation engine requiring valid admit passes before exam attendance marking.
  - Student exam schedule & faculty invigilator duty assignment APIs.
  - Frontend React pages: `ExamDashboardPage`, `ExamSchedulePage`, `HallTicketPage`.
  - Comprehensive unit test suite (`tests/test_examinations.py`).
  - System documentation (`docs/examinations.md`).

## [v0.12.0] - 2026-08-01

### Added
- **Enterprise Attendance Management System (`apps/attendance/`)**:
  - Models for `AttendanceSession`, `StudentAttendance`, `FacultyAttendance`, and `AttendanceAuditLog`.
  - Session locking engine preventing post-lock attendance modification.
  - Bulk & individual attendance marking endpoints.
  - Attendance percentage calculations & daily/monthly reporting service.
  - QR Attendance Token generation and Biometric Integration interface readiness.
  - Frontend React pages: `AttendanceDashboardPage`, `TakeAttendancePage`, `AttendanceReportsPage`.
  - Comprehensive unit test suite (`tests/test_attendance.py`).
  - System documentation (`docs/attendance.md`).

## [v0.11.0] - 2026-08-01

### Added
- **Enterprise Timetable Management System (`apps/timetable/`)**:
  - Models for `Building`, `Classroom`, `TimeSlot`, `Timetable`, and `TimetableAuditLog`.
  - Conflict Engine (`validators.py`, `services.py`) preventing Faculty double booking, Classroom double booking, and Batch double booking.
  - Multi-view APIs for Faculty schedule, Student schedule, Room occupancy, and Master Weekly schedule matrix.
  - Frontend React pages: `TimetableDashboardPage`, `WeeklyTimetablePage`, `ConflictViewerPage`.
  - Full unit test suite (`tests/test_timetable.py`).
  - System documentation (`docs/timetable.md`).

## [0.10.0] - 2026-07-31

### Added

#### **TASK-010: Enterprise Admissions Management System**
- Created `AdmissionApplication` model with auto-generated tenant-isolated `ADM-{YEAR}-{SEQ:06d}` application numbers, PII fields, academic intent mapping, previous qualification/CGPA tracking, guardian details, and 10-state workflow status (`draft`, `submitted`, `under_review`, `document_verification`, `interview`, `approved`, `rejected`, `waitlisted`, `enrolled`, `cancelled`).
- Implemented `ApplicationStatusHistory` model capturing every state transition, actor, remarks, and timestamp.
- Built `AdmissionDocument` model supporting 10 document types (`aadhaar`, `birth_certificate`, `marksheet`, `transfer_certificate`, `leaving_certificate`, `photo`, `signature`, `income_certificate`, `caste_certificate`, `other`) with approval/rejection review workflow.
- Created `SeatMatrix` model enforcing seat quota allocations per `(program, academic_session, category)` tuple to prevent over-enrollment.
- Implemented `AdmissionAuditLog` model providing a fine-grained audit trail of 13 admissions lifecycle event types.
- Developed service layer (`services.py`):
  - `generate_application_number()`
  - 10-state workflow transition engine with strict transition validation
  - Document review workflow (`review_document`)
  - Seat allocation with row-level locking (`allocate_seat`)
  - Full automated **Enrollment Pipeline** (`enroll_application`): Creates `User` account → `UserProfile` → `Student` (auto Student ID, semester mapping) → `Parent` (auto Parent code) → `StudentParentLink`.
- Created REST APIs: `AdmissionApplicationViewSet` (CRUD, submit, approve, reject, transition, enroll, bulk approve, bulk reject, assign reviewer, audit log), `AdmissionDocumentViewSet`, `SeatMatrixViewSet`, `AdmissionDashboardView`.
- Registered `apps.admissions` in `SHARED_APPS` and `TENANT_APPS` ensuring complete multi-tenant schema isolation.
- Created initial Django migration `0001_initial.py`.
- Configured Django Admin with inline state histories, document reviews, audit logs, and bulk approval/rejection admin actions.
- Built comprehensive unit tests (`tests/test_admissions.py`) verifying application CRUD, application number generation, state machine transition constraints, document review, seat matrix locking, and automated Student+Parent enrollment pipeline.
- Created detailed system documentation in `docs/admissions.md`.

#### **Frontend — Admissions & Enrollment Console**
- Built `admissionService.ts` typed API client covering all admissions endpoints.
- Created `AdmissionsDashboardPage.tsx` with KPI metrics, status breakdown, and program demand fill rates.
- Built `ApplicationListPage.tsx` with search, status filters, selection checkboxes, and bulk approve/reject actions.
- Created `ApplicationDetailsPage.tsx` with state machine controls, document upload & review, workflow timeline, audit log, and one-click Enrollment execution.
- Created `CreateApplicationPage.tsx` with comprehensive form inputs for PII, program intent, previous qualifications, and guardian info.
- Built `DocumentVerificationPage.tsx` for Admissions Officers to review applicant document uploads.
- Created `SeatMatrixPage.tsx` to configure program capacity limits and view real-time seat availability.
- Wired all admissions routes (`/admissions`, `/admissions/applications`, `/admissions/applications/:id`, `/admissions/create`, `/admissions/documents`, `/admissions/seat-matrix`) in `App.tsx` and updated `Sidebar.tsx` navigation.

---

## [0.9.0] - 2026-07-31

### Added

#### **TASK-009: Enterprise Parent & Guardian Management System**
- Created `Parent` model with auto-generated tenant-isolated `PAR-XXXXXXXX` code, relationship type
  (`father`, `mother`, `guardian`, `grandfather`, `grandmother`, `uncle`, `aunt`, `sibling`, `other`),
  occupation, employer name, annual income, education level, and portal/notification toggles.
- Implemented `StudentParentLink` many-to-many through model with `is_primary_contact`,
  `is_emergency_contact`, and `can_pickup` flags — a single parent can be linked to multiple students (siblings).
- Built `ParentDocument` model supporting full upload, type classification, and staff review
  workflow (`pending → approved / rejected / expired`).
- Added `ParentCommunicationPreference` model with per-channel toggles (email, SMS, push, WhatsApp)
  and per-event subscriptions (attendance alerts, fee reminders, exam results, announcements,
  disciplinary notices, event invitations).
- Created `ParentActivityLog` model providing a complete tamper-evident audit trail of all parent
  lifecycle actions.
- Implemented service layer (`services.py`): `create_parent`, `verify_parent`, `soft_delete_parent`,
  `restore_parent`, `link_student_to_parent`, `unlink_student_from_parent` — all side-effect-free
  and audit-logged.
- Built `ParentViewSet` REST API with custom actions: `verify`, `restore`, `link-student`,
  `unlink-student`, `activity-log`.
- Built `ParentDocumentViewSet` REST API with `review` action for staff document approval.
- Added `ParentDashboardSummaryView` endpoint (`/api/parents/dashboard/`) returning aggregate counts:
  total, verified, unverified, portal-enabled, relationship breakdown, pending documents.
- Registered `apps.parents` in both `SHARED_APPS` and `TENANT_APPS` ensuring full multi-tenant
  schema isolation.
- Generated Django migration `0001_initial.py` covering all five parent models.
- Built Django Admin interfaces with inlines: student links, documents, communication preferences,
  activity log — all with full search and filter support.
- Added `apps/parents/urls.py` mounted at `/api/parents/` and `/api/parent-documents/`.

#### **Frontend — Parent Portal**
- Created `parentService.ts` typed API client covering all parent endpoints (CRUD, verify, restore,
  link-student, unlink-student, document upload/review, dashboard stats, activity log).
- Built `ParentListPage.tsx` with search, create form (inline), verify action, soft-delete, and
  rich dark glassmorphism UI.
- Built `ParentDetailsPage.tsx` with four-tab interface: Overview, Students (with inline link/unlink
  UI), Documents (status badges), Activity Log.
- Registered routes `/parents` and `/parents/:id` in the React Router.
- Added **Parent Portal** section to the sidebar with `HeartHandshake` icon.

### Fixed
- Added `*.tsbuildinfo` to `.gitignore` to prevent TypeScript incremental build artefacts from being tracked.

---

## [0.8.0] - 2026-07-31

### Added

#### **TASK-001: Enterprise Workspace Initialization**
- Built clean multi-app Django 5 backend + React 19 + TypeScript + Vite + Tailwind CSS frontend architecture.
- Added core system health check endpoints (`/api/health/`).
- Configured Vite with proxy rules for backend API routing.

#### **TASK-002: Multi-Tenant SaaS Architecture**
- Integrated PostgreSQL schema-based isolation using `django-tenants`.
- Implemented tenant management commands (`create_tenant`, `delete_tenant`, `list_tenants`, `migrate_tenants`).
- Created tenant resolution logging middleware (`TenantLoggingMiddleware`).
- Configured tenant health endpoints (`/api/health/database/`, `/api/health/redis/`, `/api/health/storage/`).

#### **TASK-003: Enterprise Authentication & Identity Management**
- Implemented custom User model using email as primary identifier with SimpleJWT authentication.
- Added access & refresh token rotation and blacklisting support.
- Built rate limiting & 5-attempt account lockout mechanism (15 minutes window).
- Added `AuditLog` and `TokenRecord` models for secure email verification and password resets.
- Added React auth components: `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `VerifyEmailPage`, `ProfilePage`.

#### **TASK-004: Enterprise Role-Based Access Control (RBAC)**
- Created `Permission`, `Role`, and `UserRole` models.
- Built idempotent RBAC seeder (`seed_rbac_defaults`) populating 14 institutional roles for every tenant.
- Implemented `PermissionResolver` with Redis/Django caching (`rbac:<schema>:user:<user_id>:permissions`).
- Created DRF permission classes (`RequirePermission`, `RequireAnyPermission`, `RequireAllPermissions`, `RequireRole`, `TenantOwnershipValidation`).
- Added Permission Matrix APIs and React management pages (`RolesPage`, `PermissionsPage`, `PermissionMatrixPage`, `RoleDetailsPage`, `AssignRolesPage`).

#### **TASK-005: Enterprise User Profile & Identity Management**
- Implemented `UserProfile`, `UserContact`, `UserAddress`, `UserPreferences`, and `ProfileActivity` models auto-created via `post_save` signals.
- Built profile avatar upload & deletion API with 5MB size limit and MIME type validation (`FormParser`, `MultiPartParser`).
- Implemented dynamic profile completion percentage calculator.
- Added React pages: `MyProfilePage`, `EditProfilePage`, `UserPreferencesPage`, `ActivityTimelinePage`, `ProfileCompletionWidget`.

#### **TASK-006: Academic Structure Engine**
- Built complete academic hierarchy: `Faculty` -> `Department` -> `Program` -> `AcademicSession` -> `Semester` -> `Subject` -> `SubjectOffering`.
- Implemented soft deletion safeguards preventing orphan entity deletions.
- Enforced single active current session rule per tenant.
- Built REST CRUD ViewSets with soft delete & restore capabilities.
- Added React pages: `FacultyManagementPage`, `DepartmentManagementPage`, `ProgramManagementPage`, `AcademicSessionsPage`, `SemesterManagementPage`, `SubjectManagementPage`, `SubjectOfferingsPage`.

#### **TASK-007: Enterprise Student Management System**
- Created `Student` entity linked one-to-one with `UserProfile` and referencing academic entities (`Program`, `Department`, `Semester`, `AcademicSession`).
- Implemented auto-generated tenant-isolated Student ID formula (`ERP-YEAR-PROGRAM-SEQUENCE`).
- Added `StudentStatusHistory` state transition auditing (`applicant`, `active`, `suspended`, `graduated`, `withdrawn`, `alumni`).
- Created REST APIs & Dashboard Summary endpoints (`/api/students/dashboard-summary/`, bulk CSV placeholders).
- Added React pages: `StudentListPage`, `StudentDetailsPage`, `CreateStudentPage`, `StudentStatisticsPage`, `BulkImportExportPage`.

#### **TASK-008: Enterprise Staff & Employee Management System**
- Created `Designation` entity defining institutional ranks and categories (`teaching`, `non_teaching`, `administration`, `finance`, `library`, `it_support`, `hostel`, `transport`, `security`).
- Created `Employee` entity linked one-to-one with `UserProfile` and referencing `Department` and `Designation`.
- Implemented auto-generated tenant-isolated Employee ID formula (`EMP-YEAR-SEQUENCE`).
- Added `EmployeeStatusHistory` state transition auditing (`active`, `on_leave`, `suspended`, `resigned`, `retired`, `terminated`).
- Created REST APIs & HR Dashboard Summary endpoints (`/api/staff/dashboard-summary/`).
- Added React pages: `EmployeeListPage`, `EmployeeDetailsPage`, `CreateEmployeePage`, `DesignationManagementPage`, `EmployeeStatisticsPage`.
