# CODEBASE_ANALYSIS.md
# Enterprise College ERP — Per-App Codebase Analysis

**Version:** v0.20.0  
**Generated:** 2026-08-01  

---

## 1. Foundation Layer

---

### 1.1 `apps.tenancy` — Multi-Tenant SaaS Manager

**Purpose:** Provides the PostgreSQL schema-per-tenant isolation layer using `django-tenants`. Each institution ("client") gets a completely isolated database schema.

**Models:**
- `Client(TenantMixin)` — tenant entity: `schema_name`, `name`, `paid_until`, `on_trial`, `plan`
- `Domain(DomainMixin)` — maps domain/subdomain to a `Client`

**Key Configuration:**
- `TENANT_MODEL = "tenancy.Client"`, `TENANT_DOMAIN_MODEL = "tenancy.Domain"`
- `TenantMainMiddleware` resolves tenant from request HOST header
- `TenantLoggingMiddleware` logs each request with tenant context

**Strengths:**
- Correct schema-based isolation — no data leakage between tenants
- Middleware positioned correctly at top of stack
- Custom `TenantLoggingMiddleware` provides per-tenant observability

**Weaknesses:**
- No tenant provisioning REST API for self-signup (SaaS onboarding requires manual DB ops)
- `plan` field exists in model but is not used in any business logic enforcement
- No tenant billing/subscription enforcement at the application layer

---

### 1.2 `apps.authentication` — Identity & JWT Authentication

**Purpose:** Custom user model with email as primary identifier, JWT access/refresh tokens, brute-force lockout, email verification, and audit trail.

**Models:**
- `User(AbstractBaseUser, PermissionsMixin)` — UUID PK, email unique, failed_login_attempts, lockout_until
- `AuditLog` — records all auth events (login, logout, password changes, email verification)
- `TokenRecord` — tracks email verification and password reset tokens with expiry

**Key Features:**
- `is_locked_out()` method with 15-minute window after 5 failed attempts
- UUID primary keys throughout (secure, non-enumerable)
- `log_audit_event()` service is imported and reused by all 20 apps

**Strengths:**
- Email-first (no username required — modern UX)
- Proper JWT implementation with token rotation and blacklisting
- Audit trail on all authentication events
- Password validators configured (length, common password, numeric, similarity)

**Weaknesses:**
- `profile_photo` field on `User` model duplicates `UserProfile.profile_photo` (redundancy)
- `username` field exists but is optional — creates ambiguity in a pure email-based system
- `preferred_language` and `time_zone` on `User` are also on `UserPreferences` — double storage

---

### 1.3 `apps.core` — Infrastructure Health Checks

**Purpose:** Exposes system health endpoints for container orchestration and monitoring.

**Endpoints:**
- `GET /api/health/` — Overall status
- `GET /api/health/database/` — PostgreSQL connection + schema name
- `GET /api/health/redis/` — Redis ping/pong
- `GET /api/health/storage/` — Media directory write test
- `GET /api/health/readiness/` — Combined readiness (all 3 subsystems)

**Strengths:**
- Docker healthcheck uses `/api/health/` — correctly integrated
- Readiness check combines DB + cache + storage in one response
- Clean, minimal implementation (100 lines, no models)

**Weaknesses:**
- No authentication on health endpoints (by design, but intentional?)
- Health check version hardcoded as `"1.0.0"` while API root shows `"v0.20.0"` — inconsistency
- No Celery worker health check endpoint

---

## 2. Platform Layer

---

### 2.1 `apps.rbac` — Role-Based Access Control

**Purpose:** Dynamic permission matrix system with Redis caching. 14 institutional roles seeded per tenant.

**Models:**
- `Permission` — `code` (unique, dot-notation like `students.view`), `name`, `module`, `is_active`
- `Role` — `name`, `description`, `is_system_role`, M2M to `Permission`
- `UserRole` — links `User` to `Role` with timestamp

**Key Features:**
- `PermissionResolver.get_user_permission_codes(user)` — Redis-first, DB-fallback
- Cache key: `rbac:{schema_name}:user:{user_id}:permissions` (1-hour TTL)
- `seed_rbac_defaults` management command populates 14 institutional roles
- Custom DRF permission classes: `RequirePermission`, `RequireAnyPermission`, `RequireAllPermissions`, `RequireRole`, `TenantOwnershipValidation`

**Strengths:**
- Schema-aware cache keys (tenant-safe)
- Superuser bypass (`Permission.objects.all()` for superusers)
- Cache invalidation on role assignment/removal

**Weaknesses:**
- No time-bounded role assignments (roles are permanent until manually removed)
- No role hierarchy (inheritance between roles is not supported)
- RBAC permissions are not enforced on the frontend (UI shows all menus regardless of role)
- `TenantOwnershipValidation` implementation not verified against current URL patterns

---

### 2.2 `apps.profiles` — Centralized User Identity

**Purpose:** Extended identity data beyond the `User` model — contact details, address, preferences, activity log, avatar, and completion percentage.

**Models:**
- `UserProfile` — core identity (bio, gender, profile photo, completion %)
- `UserContact` — phone, emergency contact
- `UserAddress` — permanent/current address fields
- `UserPreferences` — theme, language, timezone, notification toggles
- `ProfileActivity` — activity timeline events

**Key Features:**
- Auto-created via `post_save` signal on `User` creation
- Profile completion calculator (checks 9 fields: name, phone, gender, DOB, address, etc.)
- Avatar upload with 5MB limit and MIME type validation
- `FormParser` + `MultiPartParser` for multipart file upload endpoint

**Strengths:**
- Clean separation of identity vs. user account
- Signal-based auto-provisioning (no manual profile creation needed)
- Completion percentage is a good UX driver

**Weaknesses:**
- `UserProfile` and `User` both have `profile_photo` and language/timezone fields — data redundancy
- Profile completion calculator doesn't include avatar upload in its scoring
- `ProfileActivity` is never cleaned up — unbounded growth risk

---

### 2.3 `apps.academics` — Academic Structure Engine

**Purpose:** Hierarchical academic structure: Faculty → Department → Program → AcademicSession → Semester → Subject → SubjectOffering.

**Models:**
- `Faculty` — top-level organizational unit (e.g., "School of Engineering")
- `Department` — belongs to Faculty (e.g., "Computer Science")
- `Program` — belongs to Department, has degree_level (UG/PG/PhD/Diploma/Certificate)
- `AcademicSession` — academic year with `is_current` constraint (one active per tenant)
- `Semester` — belongs to Program, has semester_number
- `Subject` — belongs to Semester, has credits, is_elective flag
- `SubjectOffering` — junction model linking Subject to AcademicSession

**Key Features:**
- `SoftDeleteManager` on all models preventing orphan deletions
- Single active session enforcement (`is_current=True`)
- `services.py` is minimal (916 bytes) — mostly CRUD delegated to ViewSets

**Strengths:**
- Clean 7-level hierarchy reflects real academic structures
- Soft delete prevents cascading data loss
- `SubjectOffering` decouples subjects from sessions cleanly

**Weaknesses:**
- `services.py` is nearly empty — business logic lives in ViewSets (violates service layer pattern)
- No maximum semester number validation for Programs
- No elective enrollment management (SubjectOffering exists but no student-subject enrollment model)

---

## 3. People Layer

---

### 3.1 `apps.students` — Student Management

**Purpose:** Student entity linking academic identity to user profile with lifecycle state machine.

**Models:**
- `Student` — OneToOne to `UserProfile`, FK to Program/Department/Semester/AcademicSession. Auto-generated `student_id`
- `StudentStatusHistory` — state transition log (applicant → active → suspended → graduated → withdrawn → alumni)

**Key Features:**
- Auto Student ID: `ERP-{YEAR}-{PROGRAM_CODE}-{SEQUENCE:04d}` (tenant-isolated via DB max+1)
- Bulk import/export placeholder (`BulkImportExportPage` exists but endpoint is not fully implemented)
- Dashboard summary endpoint: total, active, suspended counts

**Strengths:**
- Clean lifecycle state machine with full history
- Auto ID generation is deterministic and tenant-safe

**Weaknesses:**
- No `guardian_name`/`guardian_contact` fields on Student itself (contact is via Parents app — correct but requires Parents module to be set up first)
- Bulk import CSV processing is a frontend stub — no backend CSV ingestion endpoint implemented
- No program-capacity check (can enroll unlimited students)

---

### 3.2 `apps.staff` — Staff & HR Management

**Purpose:** Employee entity with designation catalog and lifecycle state machine.

**Models:**
- `Designation` — ranks with `designation_type` (teaching, non_teaching, administration, finance, library, it_support, hostel, transport, security)
- `Employee` — OneToOne to `UserProfile`, FK to Department/Designation. Auto `employee_id`
- `EmployeeStatusHistory` — state log (active → on_leave → suspended → resigned → retired → terminated)

**Strengths:**
- Clean parallel structure to students (same patterns, same idioms)
- Designation type catalog supports all institutional departments

**Weaknesses:**
- No payroll/salary fields on Employee model (no compensation management)
- No leave management integration (EmployeeStatus has `on_leave` but no leave request workflow)

---

### 3.3 `apps.parents` — Parent & Guardian Management

**Purpose:** Parent/guardian entity with multi-student linking, document verification, communication preferences, and activity audit trail.

**Models:**
- `Parent` — auto `PAR-XXXXXXXX` code, relationship_type, occupation, annual_income, portal_access toggle
- `StudentParentLink` — M2M through model: is_primary_contact, is_emergency_contact, can_pickup
- `ParentDocument` — upload with approval workflow (pending → approved/rejected/expired)
- `ParentCommunicationPreference` — per-channel (email, SMS, push, WhatsApp) + per-event toggles
- `ParentActivityLog` — tamper-evident audit trail

**URL Inconsistency:** Mounted at `path("api/", ...)` instead of `path("api/parents/", ...)` — causing the effective URL to be `/api/parents/` but the prefix in `urls.py` is wrong.

**Strengths:**
- M2M design correctly supports one parent linked to multiple children
- Communication preference model is comprehensive and forward-thinking

**Weaknesses:**
- URL mounting inconsistency (see Technical Debt Report)
- `annual_income` stored as plain float — no currency/locale handling
- No WhatsApp or push notification implementation behind the preference toggles

---

## 4. Domain Layer

---

### 4.1 `apps.admissions` — Admissions Management

**Purpose:** Full 10-state application workflow from draft to enrollment, with document verification, seat matrix, and automated enrollment pipeline.

**Models:**
- `AdmissionApplication` — 10-state machine, auto `ADM-{YEAR}-{SEQ:06d}`, PII fields, academic intent
- `ApplicationStatusHistory` — captures every state transition
- `AdmissionDocument` — 10 document types with staff approval workflow
- `SeatMatrix` — per (program, session, category) quota with row-level locking
- `AdmissionAuditLog` — 13 event types

**Services (`services.py` — 20KB, largest service file):**
- `generate_application_number()` — tenant-isolated sequence
- 10-state transition engine with strict `ALLOWED_TRANSITIONS` map
- `allocate_seat()` — row-level locking via `select_for_update()`
- `enroll_application()` — atomic: creates User + UserProfile + Student + Parent + StudentParentLink

**Strengths:**
- The enrollment pipeline is the most complex and well-implemented service in the codebase
- `select_for_update()` prevents race conditions on seat allocation
- State machine prevents invalid transitions

**Weaknesses:**
- No merit-list ranking algorithm (manual approval flow only)
- No online fee payment integration at admissions stage
- Document upload is stored locally — no cloud storage integration

---

### 4.2 `apps.timetable` — Timetable Management

**Purpose:** Building/classroom inventory, weekly schedule creation with multi-dimensional conflict detection.

**Models:**
- `Building` → `Classroom` (physical infrastructure)
- `TimeSlot` — defines reusable time periods (day, start, end)
- `Timetable` — (Subject, Classroom, TimeSlot, Semester, Program, week_number)
- `TimetableAuditLog`

**Key Features:**
- Conflict engine detects: faculty double-booking, classroom double-booking, batch double-booking
- Multiple schedule view APIs: faculty schedule, student schedule, room occupancy, weekly matrix

**Strengths:**
- Three-axis conflict detection is comprehensive
- Reusable TimeSlot model prevents time period duplication

**Weaknesses:**
- No recurrence/template pattern for timetables (must re-enter each semester)
- `week_number` field — no clear mapping to academic calendar dates
- No online timetable sharing/export feature

---

### 4.3 `apps.attendance` — Attendance Tracking

**Purpose:** Session-based attendance tracking with locking, bulk marking, and percentage reporting.

**Models:**
- `AttendanceSession` — (Subject, Date, Semester) context with `is_locked` flag
- `StudentAttendance` — per-student per-session: present/absent/late/excused
- `FacultyAttendance` — faculty present/absent per session
- `AttendanceAuditLog`

**Key Features:**
- Session locking prevents post-lock modification
- QR token generation interface (implementation ready, delivery not wired)
- Biometric integration interface ready (hook exists, no actual hardware integration)

**Weaknesses:**
- QR attendance token generation exists but QR scanning receipt is not implemented end-to-end
- No automated deficit alert (< 75% attendance triggers no automated notification)
- No leave of absence integration

---

### 4.4 `apps.examinations` — Examination Management

**Purpose:** Exam type registry, schedule management, hall ticket generation, invigilator assignments, and exam attendance.

**Models:**
- `ExamType` — (Midterm, Endterm, Practical, Viva, Quiz, Supplementary)
- `Exam` — links ExamType to Semester + AcademicSession
- `ExamSchedule` — (Exam, Subject, Classroom, Date, TimeSlot) with conflict check
- `HallTicket` — student admission pass with status (generated/issued/cancelled/invalid)
- `ExamAttendance` — per-student per-schedule: present/absent/malpractice
- `InvigilatorAssignment` — links Employee to ExamSchedule
- `ExamAuditLog`

**Key Features:**
- Hall ticket generation enforces student eligibility before attendance marking
- Classroom and invigilator double-booking prevention

**Weaknesses:**
- No online exam module integration (MCQ/quiz engine)
- No seating arrangement auto-generator

---

### 4.5 `apps.results` — Result Management

**Purpose:** Marks entry, grade calculation, SGPA/CGPA computation, merit ranking, and batch publishing.

**Models:**
- `ResultScheme` — (Program, Semester, Subject) defines max marks and passing threshold
- `StudentResult` — per-student per-subject: internal_marks, external_marks, grade, grade_point, credit_point, status
- `SemesterResult` — per-student per-semester: SGPA, CGPA, rank, result_status
- `ResultAuditLog`

**Grade Calculation (implemented in services.py):**
- A+ (≥90) = 10.0, A (80-89) = 9.0, B+ (70-79) = 8.0, B (60-69) = 7.0, C (50-59) = 6.0, D (45-49) = 5.0, E (40-44) = 4.0, F (<40) = 0.0
- SGPA = ΣCreditPoints / ΣCredits (rounded to 2 decimal places)
- CGPA is set equal to SGPA for single-semester students (cumulative grows across semesters)

**Strengths:**
- Grade calculation is clean and tested (8 tests in test_results.py)
- Merit rank generation correctly ranks across all students in a semester

**Weaknesses:**
- CGPA computation is simplistic — doesn't properly aggregate across multiple semesters for the same student (sets CGPA = SGPA rather than computing running average weighted by credits)
- No grade moderation/normalization workflow
- No supplementary exam result flow

---

### 4.6 `apps.certificates` — Certificate & Transcript Management

**Purpose:** Issue, download, and publicly verify academic certificates. Generate official transcripts.

**Models:**
- `CertificateType` — (Bonafide, Leaving, Character, Degree, Marksheet, Migration)
- `Certificate` — unique `certificate_number`, linked to Student, has issue date, validity period
- `Transcript` — computed from SemesterResult records (CGPA, credits, SGPA per semester)
- `CertificateAuditLog`

**Key Features:**
- Public verification endpoint: `GET /api/certificates/verify/{number}/` (no auth required)
- PDF download payload endpoint: `GET /api/certificates/download/{id}/`
- Published results enforcement: academic certificates require `SemesterResult.result_status = "pass"`

**Weaknesses:**
- PDF generation payload is prepared but actual PDF rendering via xhtml2pdf/ReportLab is not yet wired to the API (returns JSON payload, not binary PDF stream)
- No certificate template customization per tenant
- No digital signature on generated PDFs (pyHanko is installed but not used in `apps/` layer)

---

### 4.7 `apps.fees` — Fee Management

**Purpose:** Fee structure engine, student fee assignment, collection, installment splitting, overdue fine calculation, receipt generation, and post-payment signal sync.

**Models:**
- `FeeCategory` — (Tuition, Hostel, Library, Exam, etc.)
- `FeeStructure` — (Program + Semester + Category + AcademicSession) → amount, unique constraint
- `StudentFee` — per-student: total_amount, paid_amount, due_amount, scholarship_amount, status
- `FeeInstallment` — installment schedule (30-day intervals)
- `FeeReceipt` — immutable receipt with unique `RCPT-{YEAR}-{hex}` number
- `FeeAuditLog`

**Key Features:**
- Post-save signal on `FeeReceipt` auto-updates `StudentFee.paid_amount`, `due_amount`, `status`
- Fine engine: `amount × fine_rate% × days_overdue`
- Overpayment guard: raises `ValueError` if payment > `due_amount`
- Duplicate assignment prevention via `validate_no_duplicate_assignment()`

**Strengths:**
- The most tested module: 30 tests in `test_fees.py`
- Receipt immutability enforced at model level

**Weaknesses:**
- Installment reminders/notifications not implemented (installments created but no alert system)
- Fine calculation is manual — no automated daily fine recalculation job (Celery task not created)
- No partial payment plan tracking beyond installment splits

---

### 4.8 `apps.payments` — Payment Gateway Integration

**Purpose:** Payment gateway abstraction layer with Razorpay integration, order management, signature verification, webhook processing, and refunds.

**Models:**
- `PaymentGateway` — gateway config storage (provider, key_id, key_secret, webhook_secret in JSON)
- `PaymentOrder` — gateway order: student, student_fee, amount, status (created/attempted/paid/failed)
- `PaymentTransaction` — confirmed transaction with gateway IDs, signatures, status
- `WebhookLog` — idempotent webhook event log
- `Refund` — refund record with gateway refund ID, status, processing timestamp
- `PaymentAuditLog` — full audit trail

**Key Features:**
- Provider abstraction: `BaseGateway → RazorpayGateway` + stubs for Stripe, PhonePe, UPI
- HMAC-SHA256 signature verification
- Webhook idempotency via `event_id` deduplication
- Auto FeeReceipt generation via `FeeService.collect_fee()` on payment success

**Strengths:**
- Clean gateway abstraction pattern — adding Stripe is just another `BaseGateway` subclass
- Idempotent webhook handling correctly returns existing log on duplicate
- Atomic transaction wrapping all payment state changes

**Weaknesses:**
- Payment gateway config stored in plain JSON field — secret keys not encrypted at rest
- Stripe, PhonePe, UPI stubs installed but return `NotImplementedError`
- No payment retry logic for failed orders
- Webhook endpoint is not verified as deployed in `urls.py` (route count shows 6 paths, but webhook URL needs verification)

---

### 4.9 `apps.scholarships` — Scholarship Management

**Purpose:** Scholarship type registry, application/approval workflow, fee deduction integration, and renewal management.

**Models:**
- `ScholarshipType` — (Government, Private, Merit, Sports, Minority, NeedBased, FeeWaiver)
- `Scholarship` — active scholarship instance for a student
- `ScholarshipApplication` — application with eligibility checks (CGPA, income cap)
- `ScholarshipRenewal` — annual renewal with updated CGPA/income verification
- `ScholarshipAuditLog`

**Key Features:**
- `apply_scholarship_to_fees()` — auto-updates `StudentFee.scholarship_amount`, recalculates `due_amount`
- `apply_fee_waiver()` — marks fee as `waived` or `paid` on 100% scholarship
- `calculate_discount()` — percentage-based or fixed-amount discount
- One-active-scholarship-per-type enforcement

**Strengths:**
- Fee integration is tight and correct — discount immediately reflected in StudentFee
- 11 tests covering end-to-end scholarship lifecycle

**Weaknesses:**
- CGPA check reads from `SemesterResult` — if no SemesterResult exists, eligibility check may incorrectly pass
- No disbursement tracking (money-in workflow for government scholarships)

---

### 4.10 `apps.library` — Library Management

**Purpose:** Book catalog, circulation engine (issue/return), reservation queue, fine calculation, and lost/damaged book workflows.

**Models:**
- `BookCategory`, `Author`, `Publisher` — catalog metadata
- `Book` — ISBN, barcode (unique per tenant), total_copies, available_copies
- `BookIssue` — borrower, book, issue_date, due_date, return_date, status, fine_amount
- `Reservation` — waitlist queue with hold_expiry
- `LibraryAuditLog`

**Key Features:**
- Loan limits: 3 books for students, 5 for staff
- Overdue fine: ₹10.00/day calculated on return
- Reservation queue: hold fulfilled on return
- Lost book: replacement cost charged, available_copies decremented
- Damaged book: penalty assessed

**Strengths:**
- Complete circulation lifecycle is well-modeled
- Unique ISBN + barcode constraints per tenant prevent catalog pollution

**Weaknesses:**
- Fine collection is logged but not integrated with `fees.StudentFee` (library fines are a separate track from academic fees)
- No RFID/barcode scanner integration endpoint
- No inter-library loan workflow

---

### 4.11 `apps.hostel` — Hostel Management

**Purpose:** Multi-building hostel inventory management, bed allocation with fee integration, visitor register, maintenance ticketing, and room transfers.

**Models:**
- `Hostel` → `Block` → `Floor` → `Room` → `Bed` (5-level physical hierarchy)
- `Warden` — staff member responsible for a hostel
- `HostelAllocation` — student-to-bed assignment with check-in/check-out dates
- `Visitor` — visitor register with entry/exit times
- `MaintenanceRequest` — room maintenance ticket with priority and status
- `HostelAuditLog`

**Key Features:**
- One active allocation per student (enforced at service level)
- Auto-assigns `StudentFee` under `HOSTEL_FEE` category on bed allocation
- Room transfer: old bed freed, new bed assigned, fee updated
- Capacity enforcement at room level

**Strengths:**
- 5-level physical hierarchy correctly models real hostel structures
- Fee integration is a good design choice (hostel stay auto-creates fee obligation)

**Weaknesses:**
- No mess/dining management integration
- No room preference system (students can't request specific rooms)
- Visitor register lacks biometric/photo capture integration
- Maintenance request has no SLA enforcement
