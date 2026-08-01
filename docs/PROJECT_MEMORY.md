# PROJECT_MEMORY.md
# Enterprise College ERP — Permanent Architecture Context

**Version:** v0.20.0  
**Generated:** 2026-08-01  
**Purpose:** This document is the authoritative persistent context for all future development on this project. Read this before starting any new feature or debugging session.  

---

## 1. What This Project Is

A **production-ready, multi-tenant SaaS ERP** for educational institutions. Built with Django 5 + React 19 + TypeScript + PostgreSQL schema isolation (`django-tenants`). Each college ("tenant") gets an isolated PostgreSQL schema with all application tables — no data shared between tenants.

**Version history:** v0.8.0 (foundation) → v0.20.0 (20 modules complete)  
**Current module count:** 20 Django apps, all registered and tested  
**Test suite:** 125 tests, 100% passing  
**Lint status:** 0 ruff errors, 0 TypeScript errors, 0 Django system check issues  

---

## 2. Repository Structure (Canonical)

```
College-ERP-main/
├── backend/                    ← Django project root
│   ├── apps/                   ← 20 active Django apps (NEVER import from main_app/)
│   │   ├── core/               ← Health checks only (no models)
│   │   ├── tenancy/            ← Multi-tenant Client/Domain models
│   │   ├── authentication/     ← Custom User model, JWT, brute-force lockout
│   │   ├── rbac/               ← Roles, Permissions, Redis-cached permission resolver
│   │   ├── profiles/           ← UserProfile, UserContact, UserAddress, UserPreferences
│   │   ├── academics/          ← Faculty→Dept→Program→Session→Semester→Subject→Offering
│   │   ├── students/           ← Student + StudentStatusHistory
│   │   ├── staff/              ← Designation + Employee + EmployeeStatusHistory
│   │   ├── parents/            ← Parent + StudentParentLink + communication preferences
│   │   ├── admissions/         ← 10-state application machine + enrollment pipeline
│   │   ├── timetable/          ← Building→Classroom→TimeSlot→Timetable + conflict engine
│   │   ├── attendance/         ← AttendanceSession + StudentAttendance + FacultyAttendance
│   │   ├── examinations/       ← ExamType→Exam→ExamSchedule→HallTicket + invigilators
│   │   ├── results/            ← ResultScheme→StudentResult→SemesterResult + grade engine
│   │   ├── certificates/       ← Certificate types, generation, verification, transcripts
│   │   ├── fees/               ← FeeCategory→FeeStructure→StudentFee→FeeReceipt (signals)
│   │   ├── payments/           ← Razorpay gateway, orders, transactions, webhooks, refunds
│   │   ├── scholarships/       ← ScholarshipType→ScholarshipApplication + fee integration
│   │   ├── library/            ← Book→BookIssue→Reservation + fine calculation
│   │   └── hostel/             ← Hostel→Block→Floor→Room→Bed→Allocation + fee integration
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py         ← ALL shared config (the truth source)
│   │   │   ├── development.py  ← SQLite fallback, DEBUG=True, CORS=all
│   │   │   ├── production.py   ← HTTPS, strict security headers, env-required secrets
│   │   │   └── test.py         ← Test-specific overrides
│   │   └── urls.py             ← Root URL config, 19 API prefixes
│   ├── main_app/               ← ⚠️ LEGACY — NOT in INSTALLED_APPS. DO NOT TOUCH.
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/client.ts       ← Native fetch wrapper (NOT axios)
│   │   ├── App.tsx             ← 96 routes, all under MainLayout
│   │   ├── components/
│   │   │   ├── Sidebar.tsx     ← 573 lines, 16 module sections
│   │   │   ├── Navbar.tsx
│   │   │   └── ProfileCompletionWidget.tsx
│   │   ├── pages/              ← 88 page files (one per route)
│   │   └── services/           ← 18 typed API service modules
│   └── vite.config.ts          ← Proxy /api/* → http://localhost:8000
├── tests/                      ← 20 pytest test files, 125 tests
├── docs/                       ← Architecture documentation
│   ├── PROJECT_ARCHITECTURE.md ← This session
│   ├── MODULE_DEPENDENCY_MAP.md← This session
│   ├── CODEBASE_ANALYSIS.md    ← This session
│   ├── LEGACY_CODE_REPORT.md   ← This session
│   ├── TECHNICAL_DEBT_REPORT.md← This session
│   └── REFACTOR_PLAN.md        ← This session
├── scripts/                    ← Utility scripts (verify_task*.py are obsolete)
├── docker-compose.yml          ← 7 services: nginx, backend, celery×2, frontend, postgres, redis
├── requirements.txt            ← Production deps (root — canonical)
└── package.json                ← Frontend deps (vite 6, react 19, tanstack query 5)
```

---

## 3. Key Architectural Rules

### NEVER Break These Rules:

1. **Service Layer Pattern** — Every business operation MUST go through `services.py`. ViewSets call services. Services never import from views.

2. **Tenant Safety** — Never use `connection.schema_name` for data access decisions. Trust `django-tenants` middleware. All tenant data is automatically schema-isolated.

3. **UUID Primary Keys** — All models use `UUID` PKs. Never expose auto-increment integers in APIs.

4. **Atomic Transactions** — All operations that touch multiple models MUST use `@transaction.atomic` or `with transaction.atomic()`.

5. **Audit Trail Required** — Every state change must be logged via the `*AuditLog` model for that app, OR via `log_audit_event()` from `apps.authentication.services`.

6. **No Raw SQL** — Use Django ORM exclusively. If N+1 is a concern, add `select_related()`/`prefetch_related()`.

7. **Soft Delete Only** — Models with `SoftDeleteManager` MUST use `is_deleted=True` instead of physical deletion.

---

## 4. App-by-App Quick Reference

### Foundation Apps (Tier 1)

| App | Central Models | Notes |
|:---|:---|:---|
| `tenancy` | Client, Domain | django-tenants schema isolation |
| `authentication` | User (UUID PK, email auth), AuditLog, TokenRecord | JWT tokens, 15-min lockout |
| `core` | (no models) | Health check endpoints only |

### Platform Apps (Tier 2)

| App | Central Models | Notes |
|:---|:---|:---|
| `rbac` | Permission, Role, UserRole | Redis cache key: `rbac:{schema}:user:{uid}:permissions` |
| `profiles` | UserProfile, UserContact, UserAddress, UserPreferences, ProfileActivity | Auto-created via User post_save signal |
| `academics` | Faculty, Department, Program, AcademicSession, Semester, Subject, SubjectOffering | Soft delete on all; single `is_current` session enforced |

### People Apps (Tier 3)

| App | Central Models | Auto ID |
|:---|:---|:---|
| `students` | Student, StudentStatusHistory | `ERP-{YEAR}-{PROG}-{SEQ:04d}` |
| `staff` | Designation, Employee, EmployeeStatusHistory | `EMP-{YEAR}-{SEQ:04d}` |
| `parents` | Parent, StudentParentLink, ParentDocument, ParentCommunicationPreference, ParentActivityLog | `PAR-{8hex}` |

### Domain Apps (Tier 4)

| App | Service Methods | Fee Integration |
|:---|:---|:---|
| `admissions` | `generate_application_number`, `transition_status`, `allocate_seat` (row-lock), `enroll_application` (atomic pipeline) | No direct fee, but enrollment creates Student who can get fees |
| `timetable` | Conflict detection on faculty, classroom, batch | No |
| `attendance` | Bulk mark, session locking, percentage calculation | No |
| `examinations` | Hall ticket generation, invigilator assignment, conflict check | No |
| `results` | `enter_marks`, `calculate_sgpa`, `generate_rank`, `publish_result` | Triggers certificate eligibility |
| `certificates` | `generate_certificate`, `generate_transcript`, `verify_certificate` | No |
| `fees` | `assign_fee`, `collect_fee`, `calculate_fine`, `generate_receipt`, `outstanding_report` | **Central hub** |
| `payments` | `create_order`, `verify_payment`, `capture_payment`, `refund`, `payment_history`, `webhook_handler` | Calls `FeeService.collect_fee()` on success |
| `scholarships` | `apply`, `approve`, `reject`, `renew`, `apply_scholarship_to_fees`, `apply_fee_waiver` | Calls `FeeService` on approval |
| `library` | `add_book`, `issue_book`, `return_book`, `reserve_book`, `calculate_fine`, `lost_book`, `damaged_book` | Fines NOT in fee system (known debt) |
| `hostel` | `allocate_bed`, `transfer_room`, `check_in`, `check_out`, `visitor_entry`, `maintenance_request` | Calls `FeeService` to assign HOSTEL_FEE |

---

## 5. Known Critical Issues (Do NOT ship without fixing)

1. **🔴 Payment gateway secrets in plain JSON** — `PaymentGateway.config` stores `key_secret` unencrypted
2. **🟠 CGPA calculation incorrect** — `results/services.py` sets CGPA = SGPA instead of weighted cumulative
3. **🟠 No frontend auth guards** — Any URL is accessible without login (API enforces, UI doesn't)
4. **🟠 RBAC not enforced on frontend** — All sidebar items shown regardless of user role
5. **🟠 Parents URL mount wrong** — `path("api/", include("apps.parents.urls"))` should be `path("api/parents/", ...)`

---

## 6. Naming Conventions

### Backend

| Item | Convention | Example |
|:---|:---|:---|
| App name | `snake_case` | `apps.fee_management` (hypothetical) |
| Model class | `PascalCase` | `StudentFee`, `FeeReceipt` |
| Model field | `snake_case` | `is_deleted`, `due_amount`, `academic_session` |
| Service class | `PascalCase + Service` | `FeeService`, `PaymentService` |
| Service method | `snake_case` | `collect_fee()`, `calculate_sgpa()` |
| Permission code | `dot.notation` | `students.view`, `fees.collect` |
| Permission class | `IsPascalCaseOrAdmin` | `IsFeeOfficerOrAdmin`, `IsLibrarianOrAdmin` |
| URL pattern | `kebab-case` | `/api/fees/collect/`, `/api/hostel/check-in/` |
| Management command | `snake_case` | `seed_rbac_defaults`, `migrate_schemas` |

### Frontend

| Item | Convention | Example |
|:---|:---|:---|
| Component file | `PascalCase + suffix` | `FeeDashboardPage.tsx`, `Sidebar.tsx` |
| Service file | `camelCase + Service.ts` | `feeService.ts`, `paymentService.ts` |
| React component | `PascalCase` | `FeeDashboardPage`, `Sidebar` |
| Service function | `camelCase` | `feeService.getStructure()` |
| Route path | `/kebab-case` | `/fees/structure`, `/hostel/blocks-rooms` |

---

## 7. Business Rules Catalogue

### Student ID Generation
```
format: ERP-{YEAR}-{PROGRAM_CODE}-{SEQUENCE:04d}
example: ERP-2026-BSCS-0001
sequence: MAX(student_id LIKE 'ERP-{YEAR}-{PROG}-%') + 1 (tenant-scoped)
```

### Fee Status Logic
```
StudentFee.status:
  "pending"   → due_amount > 0, no receipts
  "partial"   → paid_amount > 0 AND paid_amount < total_amount
  "paid"      → due_amount <= 0
  "waived"    → scholarship covers 100%
  "overdue"   → past due_date AND status != "paid"
```

### Grade Scale
```
A+ : total >= 90  → GP 10.0
A  : total >= 80  → GP 9.0
B+ : total >= 70  → GP 8.0
B  : total >= 60  → GP 7.0
C  : total >= 50  → GP 6.0
D  : total >= 45  → GP 5.0
E  : total >= 40  → GP 4.0
F  : total <  40  → GP 0.0

credit_point = grade_point × subject_credits
SGPA = Σcredit_points / Σcredits  (rounded to 2dp)
```

### Admission State Machine
```
ALLOWED_TRANSITIONS = {
    "draft"                → ["submitted", "cancelled"]
    "submitted"            → ["under_review", "cancelled"]
    "under_review"         → ["document_verification", "interview", "approved", "rejected", "waitlisted"]
    "document_verification"→ ["under_review", "approved", "rejected"]
    "interview"            → ["approved", "rejected", "waitlisted"]
    "approved"             → ["enrolled", "cancelled"]
    "rejected"             → []
    "waitlisted"           → ["approved", "rejected", "cancelled"]
    "enrolled"             → []
    "cancelled"            → []
}
```

### JWT Configuration
```
Access token:  60 minutes  (configurable via JWT_ACCESS_TOKEN_LIFETIME_MINUTES)
Refresh token: 7 days      (configurable via JWT_REFRESH_TOKEN_LIFETIME_DAYS)
Rotation:      True (new refresh token issued on each use)
Blacklist:     True (old refresh token invalidated after rotation)
Algorithm:     HS256
```

### Login Brute Force Protection
```
Failed attempts threshold: 5
Lockout duration: 15 minutes
Lockout field: User.lockout_until (DateTimeField)
Check: User.is_locked_out() → True if lockout_until > now()
```

### Library Loan Limits
```
Students: max 3 books at once
Staff:    max 5 books at once
Fine:     ₹10.00/day for overdue books
Fine trigger: return_date > due_date
```

### Hostel Allocation Rules
```
Max active allocations per student: 1
Bed must be vacant (status = "vacant")
Room capacity must not be exceeded
Auto fee: StudentFee created under HOSTEL_FEE category on allocation
Room transfer: old bed freed → new bed assigned → fee updated
```

---

## 8. Development Environment Setup

### Backend (Local without Docker)
```bash
cd College-ERP-main/backend
python -m venv ../venv
../venv/Scripts/activate  # Windows

# Development mode uses SQLite (no PostgreSQL needed):
USE_SQLITE=true python manage.py migrate --settings=config.settings.development
USE_SQLITE=true python manage.py runserver 127.0.0.1:8000 --settings=config.settings.development
```

### Frontend
```bash
# From project root (College-ERP-main/)
npm install
npm run dev  # Starts Vite at http://localhost:5173 with proxy to :8000
```

### Full Stack via Docker
```bash
docker-compose up -d --build
# Access: http://localhost (Nginx serves both frontend and /api/*)
```

### Running Tests
```bash
cd College-ERP-main/backend
USE_SQLITE=true python -m pytest ../tests/ -q --tb=short
# Should see: 125 passed
```

---

## 9. Frontend API Pattern

All API calls use the native `fetch` wrapper in `src/api/client.ts`:

```typescript
// The client (NOT axios — axios is unused)
export async function apiRequest<T>(path: string, options = {}): Promise<T> {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    return response.json();
}
```

Service layer pattern:
```typescript
// src/services/feeService.ts
export const feeService = {
    getStructure: () => apiRequest<FeeStructure[]>("/api/fees/structure/"),
    collectFee: (data: CollectFeeData) => apiRequest<FeeReceipt>("/api/fees/collect/", {
        method: "POST",
        body: JSON.stringify(data),
    }),
};
```

Page layer pattern:
```typescript
// src/pages/FeeDashboardPage.tsx
const { data: structures, isLoading } = useQuery({
    queryKey: ['fee-structures'],
    queryFn: feeService.getStructure,
});
```

---

## 10. External Dependencies & Integrations

| Integration | Library | Status |
|:---|:---|:---|
| Razorpay Payment | `razorpay>=1.4.0` | Active — order creation, signature verification, refunds |
| PDF Generation | `reportlab`, `xhtml2pdf`, `pyHanko` | Installed — fee receipts use basic rendering; certificates return JSON payload only |
| Redis Cache | `redis==8.0.1` | Active — RBAC permission caching, Django sessions |
| Celery Tasks | `celery==5.3.0` | Configured — NO tasks defined yet |
| PostgreSQL | `psycopg2-binary==2.9.12` | Active (production) |
| SQLite | Built-in | Active (development with USE_SQLITE=true) |
| Email | Console backend (dev), SMTP (prod) | Active |
| File Storage | Local FileSystem (dev+prod) | Active — no S3 despite boto3 being installed |
| LangChain | `langchain==0.1.16` | UNUSED — leftover from legacy ai_helper.py |
| ChromaDB | `chromadb>=0.4.24` | UNUSED — leftover from legacy AI experiments |
| Stripe | Code stub only | `NotImplementedError` — not implemented |
| PhonePe | Code stub only | `NotImplementedError` — not implemented |
| Meilisearch | `meilisearch==0.28.0` | UNUSED — not configured |
| MongoDB | `pymongo==4.6.3` | UNUSED — not configured |
| OIDC | `mozilla-django-oidc==3.0.0` | UNUSED — not configured |

---

## 11. Test File Map

| Test File | App | Test Count | Key Scenarios |
|:---|:---|:---|:---|
| `test_workspace_foundation.py` | core/tenancy | ~2 | Django check, health endpoint |
| `test_multi_tenancy.py` | tenancy | ~5 | Schema isolation, Client/Domain |
| `test_authentication.py` | authentication | ~7 | Login, lockout, token |
| `test_rbac.py` | rbac | ~6 | Permission resolver, role seeder |
| `test_profiles.py` | profiles | ~7 | Profile CRUD, avatar, completion |
| `test_academics.py` | academics | ~5 | CRUD, soft delete, session uniqueness |
| `test_students.py` | students | ~8 | Student ID generation, status lifecycle |
| `test_staff.py` | staff | ~6 | Employee ID, designation, status |
| `test_admissions.py` | admissions | ~8 | State machine, seat locking, enrollment pipeline |
| `test_timetable.py` | timetable | ~8 | Conflict detection (3 axes) |
| `test_attendance.py` | attendance | ~8 | Session lock, bulk mark, percentage |
| `test_examinations.py` | examinations | ~9 | Hall ticket, invigilator conflict |
| `test_results.py` | results | ~8 | Marks entry, grade calc, SGPA, rank |
| `test_certificates.py` | certificates | ~7 | Generate, verify, published-results check |
| `test_fees.py` | fees | ~30 | Structure, assign, collect, fine, receipt, outstanding |
| `test_payments.py` | payments | ~13 | Order, signature, verify, refund, webhook |
| `test_scholarships.py` | scholarships | ~11 | Apply, approve, reject, renew, fee integration |
| `test_library.py` | library | ~9 | Issue, return, fine, reserve, lost/damaged |
| `test_hostel.py` | hostel | ~9 | Allocate, transfer, check-in, check-out, visitor |
| **TOTAL** | | **~125** | |

---

## 12. Architecture Quality Assessment

| Dimension | Score | Notes |
|:---|:---|:---|
| **Structural Design** | 8/10 | Clean app separation, consistent service pattern |
| **API Design** | 7/10 | Consistent REST, but no versioning |
| **Data Modeling** | 8/10 | Proper FK relationships, UUIDs, soft-delete |
| **Security** | 6/10 | JWT solid; secrets in DB, no rate limits on APIs |
| **Testing** | 7/10 | 125 tests passing; no frontend tests; no E2E |
| **Code Quality** | 8/10 | Post-maintenance: 0 ruff errors, clean TypeScript |
| **Documentation** | 8/10 | Good per-module docs; README outdated |
| **Performance** | 6/10 | No N+1 audit; missing indexes; idle Celery |
| **Multi-tenancy** | 9/10 | Correctly implemented schema isolation |
| **Scalability** | 7/10 | Docker-ready; PgBouncer missing; no CDN |
| **OVERALL** | **7.4/10** | **Production-capable with known gaps** |

**Architecture Quality Score: 7.4/10**  
**Technical Debt Score: 6.0/10** (28 identified issues, 1 critical)  
**Enterprise Readiness: 75%** (Missing: E2E tests, frontend auth guards, encrypted secrets, API versioning)
