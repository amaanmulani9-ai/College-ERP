# PROJECT_ARCHITECTURE.md
# Enterprise College ERP — Complete Architecture Reference

**Version:** v0.20.0  
**Generated:** 2026-08-01  
**Status:** Production-Ready  

---

## 1. Executive Overview

The Enterprise College ERP is a **full-stack, multi-tenant SaaS platform** for educational institutions. It was designed and built iteratively over 20 development tasks (v0.8.0 → v0.20.0), evolving from a single-institution Django app into a schema-isolated multi-tenant SaaS product.

The system serves **three primary user classes**:
- **Institutional Administrators** — Full system control, RBAC management, tenant setup
- **Academic Staff** — Attendance, exams, results, timetable, certificates
- **Students and Parents** — Fee payment, result viewing, hostel/library access

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│              React 19 + TypeScript + Vite SPA                   │
│         (88 pages, 18 Axios services, 573-line Sidebar)         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (Nginx proxy)
┌────────────────────────────▼────────────────────────────────────┐
│                         NGINX (Port 80)                          │
│         Static file serving + Reverse proxy routing             │
│    /api/* → Django backend    /  → React frontend dist           │
└──────┬────────────────────────────────────────┬─────────────────┘
       │                                        │
┌──────▼─────────────────┐        ┌─────────────▼──────────────┐
│   DJANGO BACKEND        │        │   FRONTEND BUILD (Nginx)   │
│   Django 5.0 + DRF      │        │   React 19 / Vite build    │
│   Python 3.13+          │        │   WhiteNoise static files  │
│   Gunicorn WSGI         │        └────────────────────────────┘
│   Port 8000             │
│                         │
│   ┌─────────────────┐   │
│   │ TenantMainMW    │   │    ┌─────────────────────────────┐
│   │ TenantLogging   │   │    │    POSTGRESQL 16              │
│   │ SecurityMW      │   │    │    Schema-per-Tenant         │
│   │ CORS            │   ├───►│    public schema (tenancy)   │
│   │ WhiteNoise      │   │    │    tenant schemas (all apps) │
│   │ CSRF            │   │    └─────────────────────────────┘
│   │ JWT Auth        │   │
│   └─────────────────┘   │    ┌─────────────────────────────┐
│                         │    │    REDIS 7                   │
│   20 Django Apps        ├───►│    RBAC permission cache     │
│   (apps.*)              │    │    Session storage           │
│                         │    │    Celery broker             │
│   18 Service Layers     │    │    Celery result backend     │
│   90 API ViewSets       │    └─────────────────────────────┘
│   95 API URL routes     │
│                         │    ┌─────────────────────────────┐
│   Celery Worker         ├───►│    CELERY                   │
│   Celery Beat           │    │    Async task queue         │
└─────────────────────────┘    └─────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
|:---|:---|:---|:---|
| Backend Framework | Django | 5.0.14 | ORM, admin, middleware |
| REST API | Django REST Framework | ≥3.15 | ViewSets, serializers, permissions |
| Authentication | SimpleJWT | latest | Access/refresh tokens, rotation, blacklisting |
| Multi-Tenancy | django-tenants | ≥3.6.1 | PostgreSQL schema isolation |
| Frontend Framework | React | 19.x | Component-based SPA |
| Language | TypeScript | 5.x | Static typing |
| Build Tool | Vite | 6.x | Dev server + production bundler |
| CSS | Tailwind CSS + Vanilla | 4.x | Dark glassmorphism design system |
| Data Fetching | TanStack React Query | 5.x | Cache-aware data fetching |
| HTTP Client | Fetch API (native) | — | Custom apiRequest wrapper |
| Icons | Lucide React | 0.468 | Consistent icon library |
| Router | React Router DOM | 7.x | Client-side routing |
| Database | PostgreSQL | 16 | Primary data store |
| Cache / Broker | Redis | 7 | RBAC cache + Celery |
| Task Queue | Celery | 5.3.0 | Async + scheduled tasks |
| PDF Generation | ReportLab + xhtml2pdf | — | Certificate/receipt PDFs |
| Payment Gateway | Razorpay SDK | ≥1.4.0 | Payment processing |
| Static Serving | WhiteNoise | 6.12.0 | Compressed static assets |
| Containerization | Docker + Compose | — | Service orchestration |
| Proxy | Nginx | 1.27-alpine | Routing + SSL termination |
| Process Manager | Gunicorn | 26.0.0 | WSGI server |

---

## 4. Django Architecture

### 4.1 Settings Hierarchy

```
backend/config/settings/
├── base.py         ← All shared config (SHARED_APPS, TENANT_APPS, JWT, Redis, Celery)
├── development.py  ← Overrides base: SQLite fallback, LocMemCache, DEBUG=True
├── production.py   ← Overrides base: strict security headers, HTTPS, SMTP
└── test.py         ← Test-specific overrides
```

**Key architectural decision:** `development.py` strips `django_tenants` when `USE_SQLITE=true`, allowing instant local dev without PostgreSQL. This is a deliberate dual-mode setup.

### 4.2 App Registration (SHARED_APPS + TENANT_APPS)

All 20 business apps are registered in **both** `SHARED_APPS` and `TENANT_APPS`, meaning every app has schema-isolated tables per tenant:

```python
SHARED_APPS = (
    "django_tenants", "apps.tenancy",           # SaaS layer
    # Django contrib apps ...
    "apps.core",        "apps.authentication",  # Infrastructure
    "apps.rbac",        "apps.profiles",        # Identity & Access
    "apps.academics",   "apps.students",        # Academic core
    "apps.staff",       "apps.parents",         # People
    "apps.admissions",  "apps.timetable",       # Operations
    "apps.attendance",  "apps.examinations",    # Tracking
    "apps.results",     "apps.certificates",    # Academic outputs
    "apps.fees",        "apps.payments",        # Finance
    "apps.scholarships","apps.library",         # Support services
    "apps.hostel",                               # Residential
)
```

### 4.3 Middleware Stack (Ordered)

```
1. TenantMainMiddleware      ← Resolves tenant from domain → sets DB schema
2. TenantLoggingMiddleware   ← Logs request metadata per tenant
3. SecurityMiddleware        ← Django security headers
4. CorsMiddleware            ← Cross-origin control
5. WhiteNoiseMiddleware      ← Static file serving
6. SessionMiddleware         ← Redis-backed sessions
7. CommonMiddleware          ← URL normalization
8. CsrfViewMiddleware        ← CSRF protection
9. AuthenticationMiddleware  ← User attachment from JWT
10. MessageMiddleware        ← Flash messages
11. XFrameOptionsMiddleware  ← Clickjacking protection
```

### 4.4 Service Layer Pattern

Every Django app follows the **Repository/Service pattern**:

```
app/
├── models.py       ← Django ORM models, custom managers
├── services.py     ← Business logic (atomic, no HTTP context)
├── validators.py   ← Input validation rules
├── serializers.py  ← DRF serializers (in/out data contracts)
├── views.py        ← ViewSets (thin controllers, delegate to services)
├── permissions.py  ← Custom DRF permission classes
├── signals.py      ← Post-save hooks (profile auto-creation, fee sync)
├── admin.py        ← Django admin registration with inlines
└── urls.py         ← URL patterns via DefaultRouter
```

### 4.5 Authentication Architecture

```
Login Request
     │
     ▼
CustomLoginView (POST /api/auth/login/)
     │── Validates email + password
     │── Checks lockout_until (5 failed attempts → 15 min lockout)
     │── Creates AuditLog event
     │
     ▼
SimpleJWT TokenObtainPairView
     │── Returns: access_token (60 min) + refresh_token (7 days)
     │── Refresh tokens rotate on use
     │── Blacklist applied on rotation
     │
     ▼
RBAC Permission Check
     │── PermissionResolver.get_user_permission_codes(user)
     │── Redis cache key: rbac:{schema}:user:{user_id}:permissions
     │── Cache TTL: 1 hour
     │── Fallback: DB query → UserRole → Role → Permission
```

---

## 5. Multi-Tenancy Architecture

```
Request arrives at Nginx
     │
     ▼
TenantMainMiddleware reads HOST header
     │── Looks up Domain table in "public" schema
     │── Identifies Client (tenant)
     │── Sets django.db.connection.schema_name = tenant.schema_name
     │
     ▼
All subsequent DB queries go to tenant's private schema
     │── tables: auth_user, rbac_role, students_student, fees_studentfee, etc.
     │
     ▼
Public schema only contains:
     │── django_tenants tables
     │── tenancy.Client, tenancy.Domain
```

**Tenant Model:**
- `Client(TenantMixin)` — tenant entity with `schema_name`, `name`, `plan`
- `Domain(DomainMixin)` — maps domain/subdomain to a Client

---

## 6. REST API Architecture

### 6.1 API Root

`GET /` returns a health payload listing all 19 API endpoint prefixes.

### 6.2 URL Structure

| Prefix | App | Notes |
|:---|:---|:---|
| `/api/health/` | core | DB, Redis, storage, readiness checks |
| `/api/tenancy/` | tenancy | Tenant CRUD (superuser-only) |
| `/api/auth/` | authentication | Login, register, JWT, password reset, email verify |
| `/api/rbac/` | rbac | Roles, permissions, matrix, user role assignments |
| `/api/profiles/` | profiles | Profile CRUD, avatar, preferences, activity log |
| `/api/academics/` | academics | Faculty, dept, program, session, semester, subject, offering |
| `/api/students/` | students | Student CRUD, dashboard, status history |
| `/api/staff/` | staff | Employee CRUD, designation, HR dashboard |
| `/api/parents/` | parents | Parent CRUD, verify, link students, doc review |
| `/api/admissions/` | admissions | Application state machine, document review, seat matrix |
| `/api/timetable/` | timetable | Buildings, rooms, slots, schedule, conflict check |
| `/api/attendance/` | attendance | Sessions, bulk mark, reports, percentage |
| `/api/examinations/` | examinations | Exam types, schedules, hall tickets, invigilators |
| `/api/results/` | results | Marks entry, SGPA/CGPA, rank list, publish |
| `/api/certificates/` | certificates | Generate, download, verify, transcript |
| `/api/fees/` | fees | Categories, structures, student fees, receipts, outstanding |
| `/api/payments/` | payments | Gateway orders, verify, refunds, webhooks, history |
| `/api/scholarships/` | scholarships | Types, apply, approve, renew, eligibility |
| `/api/library/` | library | Books, issue, return, reserve, fines, lost/damaged |
| `/api/hostel/` | hostel | Allocation, transfer, check-in/out, visitors, maintenance |

**Note:** `apps.parents` is mounted at `path("api/", ...)` (not `/api/parents/`) — this is a URL inconsistency (see Technical Debt Report).

### 6.3 DRF Configuration

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [JWTAuthentication, SessionAuthentication],
    "DEFAULT_PERMISSION_CLASSES": [IsAuthenticated],
    "DEFAULT_PAGINATION_CLASS": PageNumberPagination,
    "PAGE_SIZE": 25,
    "DEFAULT_RENDERER_CLASSES": [JSONRenderer],    # no BrowsableAPIRenderer in production
}
```

---

## 7. Frontend Architecture

### 7.1 Application Shell

```
frontend/
├── src/
│   ├── main.tsx          ← React 19 root mount
│   ├── App.tsx           ← BrowserRouter + QueryClientProvider + 88 routes
│   ├── api/
│   │   └── client.ts     ← Native fetch wrapper (apiRequest<T>)
│   ├── config/
│   │   └── env.ts        ← VITE_BACKEND_URL env var
│   ├── layouts/
│   │   └── MainLayout.tsx← Shell with Sidebar + Navbar + Outlet
│   ├── components/
│   │   ├── Sidebar.tsx   ← 573-line nav tree (16 module sections)
│   │   ├── Navbar.tsx    ← Top bar
│   │   └── ProfileCompletionWidget.tsx
│   ├── pages/            ← 88 page components
│   ├── services/         ← 18 typed API service modules
│   └── styles/           ← Global CSS + Tailwind config
```

### 7.2 Routing Structure

All routes are wrapped in `<MainLayout>` (authenticated shell). There is **no route guard** implemented — authentication is enforced only at the API level.

| Section | Routes | Pages |
|:---|:---|:---|
| Auth | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` | 5 |
| Profile | `/profile/me`, `/profile/edit`, `/profile/preferences`, `/profile/timeline` | 4 |
| Students | `/students`, `/students/create`, `/students/:id`, statistics, import-export | 5 |
| Staff | `/staff`, `/staff/create`, `/staff/:id`, designations, statistics | 5 |
| Academics | `/academics/faculties`, departments, programs, sessions, semesters, subjects, offerings | 7 |
| RBAC | `/rbac/roles`, roles/:id, permissions, matrix, assign-roles | 5 |
| Parents | `/parents`, `/parents/:id` | 2 |
| Admissions | `/admissions`, applications, applications/:id, create, documents, seat-matrix | 6 |
| Timetable | `/timetable`, weekly, conflict-checker | 3 |
| Attendance | `/attendance`, take, reports | 3 |
| Examinations | `/examinations`, schedules, hall-tickets | 3 |
| Results | `/results`, entry, publish, student | 4 |
| Certificates | `/certificates`, generate, student-certs, verify | 4 |
| Fees | `/fees`, structure, collect, outstanding | 4 |
| Payments | `/payments`, pay, history, details, refunds | 5 |
| Scholarships | `/scholarships`, types, student, applications, renewals, eligibility | 6 |
| Library | `/library`, books, categories, authors-publishers, issue, return, reservations, fines | 8 |
| Hostel | `/hostel`, buildings, blocks-rooms, allocations, visitors, maintenance, vacancy | 7 |

**Total: 96 registered routes, 88 unique page files**

### 7.3 Data Fetching Pattern

```typescript
// Standard pattern across all 18 services
const { data, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.list
});

// Service layer uses native fetch (NOT axios despite package.json listing it)
async function apiRequest<T>(path, options): Promise<T> {
    const response = await fetch(`${env.apiBaseUrl}${path}`, { ... });
    return response.json();
}
```

**Note:** `axios` is listed in `package.json` dependencies but the actual API client uses the native `fetch` API via the custom `apiRequest` wrapper. Axios is effectively unused.

### 7.4 State Management

- **Server state:** TanStack React Query v5 (primary state management)
- **Local UI state:** React `useState` / `useReducer` (per-component)
- **No global client state store** (Redux/Zustand/Jotai) — not needed at current scale
- **Auth state:** JWT tokens stored in localStorage (implicit in service calls)

---

## 8. Database Architecture

### 8.1 Schema Strategy

```
PostgreSQL Server
├── public schema
│   ├── django_tenants_client (tenant registry)
│   ├── django_tenants_domain (domain-to-tenant mapping)
│   └── django_migrations (shared migrations only)
│
├── tenant_alpha schema  (e.g., ABC College)
│   ├── authentication_user
│   ├── rbac_role, rbac_permission, rbac_userrole
│   ├── profiles_userprofile, profiles_usercontact, ...
│   ├── academics_faculty, academics_department, ...
│   ├── students_student, students_studentstatushistory
│   ├── fees_studentfee, fees_feereceipt, fees_feeauditlog
│   ├── payments_paymentorder, payments_paymenttransaction, ...
│   └── (all 90 model tables)
│
└── tenant_beta schema   (e.g., XYZ University)
    └── (identical schema structure, isolated data)
```

### 8.2 Model Count by App

| App | Models |
|:---|:---|
| academics | 7 (Faculty, Department, Program, AcademicSession, Semester, Subject, SubjectOffering) |
| admissions | 5 (AdmissionApplication, ApplicationStatusHistory, AdmissionDocument, SeatMatrix, AdmissionAuditLog) |
| attendance | 4 (AttendanceSession, StudentAttendance, FacultyAttendance, AttendanceAuditLog) |
| authentication | 3 (User, AuditLog, TokenRecord) |
| certificates | 4 (CertificateType, Certificate, Transcript, CertificateAuditLog) |
| examinations | 7 (ExamType, Exam, ExamSchedule, HallTicket, ExamAttendance, InvigilatorAssignment, ExamAuditLog) |
| fees | 6 (FeeCategory, FeeStructure, StudentFee, FeeInstallment, FeeReceipt, FeeAuditLog) |
| hostel | 10 (Hostel, Block, Floor, Room, Bed, Warden, HostelAllocation, Visitor, MaintenanceRequest, HostelAuditLog) |
| library | 7 (BookCategory, Author, Publisher, Book, BookIssue, Reservation, LibraryAuditLog) |
| parents | 5 (Parent, StudentParentLink, ParentDocument, ParentCommunicationPreference, ParentActivityLog) |
| payments | 6 (PaymentGateway, PaymentOrder, PaymentTransaction, WebhookLog, Refund, PaymentAuditLog) |
| profiles | 5 (UserProfile, UserContact, UserAddress, UserPreferences, ProfileActivity) |
| rbac | 3 (Permission, Role, UserRole) |
| results | 4 (ResultScheme, StudentResult, SemesterResult, ResultAuditLog) |
| scholarships | 5 (ScholarshipType, Scholarship, ScholarshipApplication, ScholarshipRenewal, ScholarshipAuditLog) |
| staff | 3 (Designation, Employee, EmployeeStatusHistory) |
| students | 2 (Student, StudentStatusHistory) |
| tenancy | 2 (Client, Domain) |
| timetable | 5 (Building, Classroom, TimeSlot, Timetable, TimetableAuditLog) |
| core | 0 (views only — health checks) |

**Total: 93 Django models** (excluding Managers)

---

## 9. Infrastructure & DevOps

### 9.1 Docker Compose Services

```
nginx          ← Port 80, static files, reverse proxy
backend        ← Django/Gunicorn :8000, health check every 30s
celery_worker  ← Async task processor
celery_beat    ← Scheduled task scheduler
frontend       ← Nginx serving React build on :80
postgres       ← PostgreSQL 16 with health check
redis          ← Redis 7 with AOF persistence
```

### 9.2 Docker Volumes

| Volume | Contents |
|:---|:---|
| postgres_data | All database data |
| redis_data | Redis AOF persistence |
| static_data | Django collectstatic output |
| media_data | User-uploaded files (avatars, documents) |
| logs_data | Rotating Django log files |

### 9.3 Production Security Headers

```python
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
```

---

## 10. Cross-Cutting Concerns

### 10.1 Audit Trail Pattern

Every major app has its own `*AuditLog` model. The `apps.authentication.services.log_audit_event()` function is used across apps to record actions. Each audit log captures: actor, event_type, timestamp, tenant_schema, IP, details.

### 10.2 Soft Delete Pattern

Apps with soft-delete requirements (academics, admissions, attendance, certificates, examinations, results, staff, students) implement `SoftDeleteManager` with `is_deleted=False` default filter.

### 10.3 ID Generation Patterns

- **Students:** `ERP-{YEAR}-{PROGRAM_CODE}-{SEQUENCE:04d}` (tenant-isolated)
- **Employees:** `EMP-{YEAR}-{SEQUENCE:04d}` (tenant-isolated)
- **Parents:** `PAR-{random_8_hex}` 
- **Admissions:** `ADM-{YEAR}-{SEQUENCE:06d}` (tenant-isolated)
- **Fee Receipts:** `RCPT-{YEAR}-{random_8_hex}`

### 10.4 Fee Integration Points

The `fees` app is the **central financial hub** integrated by:
- `payments` → auto-generates FeeReceipt on payment success
- `scholarships` → updates StudentFee.scholarship_amount on approval
- `hostel` → auto-assigns StudentFee (HOSTEL_FEE) on bed allocation

---

## 11. Legacy Code

### 11.1 `backend/main_app/` — The Original Monolith

The `main_app` directory contains the **original Django application** from before the refactor to the modular `apps/` architecture. It is **not registered in INSTALLED_APPS** and is **completely dead code**.

Key files (all dormant):
- `views.py` (58 KB) — Django template-based views
- `hod_views.py` (139 KB) — The largest single file in the codebase
- `student_views.py` (71 KB) — Legacy student management views
- `models.py` (61 KB) — Legacy ORM models (duplicated in `apps/`)
- `urls.py` (33 KB) — Legacy URL patterns (not mounted)
- `ai_helper.py`, `ai_views.py` — Old AI integration experiments
- `face_recognition_service.py` — Legacy facial recognition prototype
- `firebase_auth_service.py` — Legacy Firebase auth prototype

**Total legacy payload: ~572 KB of dormant Python code (33 files)**

---

## 12. Quality Metrics Summary

| Metric | Value |
|:---|:---|
| Backend Python files | 237 |
| Backend Python bytes | ~780 KB |
| Frontend TSX/TS files | 97 |
| Frontend bytes | ~643 KB |
| Django apps (active) | 20 |
| Django models | 93 |
| Service classes/modules | 18 |
| REST API ViewSet classes | 97 |
| Registered URL routes | ~95 |
| React pages | 88 |
| Frontend routes | 96 |
| Test files | 20 |
| Tests (all passing) | 125 |
| Ruff lint errors | 0 |
| TypeScript errors | 0 |
| Django system check issues | 0 |
