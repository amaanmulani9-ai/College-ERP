# TECHNICAL_DEBT_REPORT.md
# Enterprise College ERP — Technical Debt Analysis

**Version:** v0.20.0  
**Generated:** 2026-08-01  
**Status:** READ ONLY — Recommendations only, no code changed  

---

## Severity Legend

| Severity | Symbol | Meaning |
|:---|:---|:---|
| CRITICAL | 🔴 | Will cause production failures or data integrity issues |
| HIGH | 🟠 | Significant risk or maintainability problem |
| MEDIUM | 🟡 | Should be fixed in upcoming sprint |
| LOW | 🟢 | Nice to have, minimal risk |

---

## 1. Security Debt

### 1.1 🔴 Payment Gateway Secrets in Plain JSON

**Location:** `apps/payments/models.py` — `PaymentGateway.config` (JSONField)  
**Issue:** `key_id`, `key_secret`, `webhook_secret` are stored in an unencrypted PostgreSQL JSON column. Any database dump, DBA access, or ORM debug output exposes live payment credentials.  
**Recommendation:** Encrypt the `config` field using `django-encrypted-fields` or move secrets to environment variables / AWS Secrets Manager, storing only a secret reference in the DB.

### 1.2 🟠 JWT Secret Key Fallback

**Location:** `backend/config/settings/base.py` line 213  
```python
"SIGNING_KEY": str_env("JWT_SECRET_KEY", SECRET_KEY),
```
**Issue:** If `JWT_SECRET_KEY` is not set, JWT tokens are signed with the Django `SECRET_KEY`. If `SECRET_KEY` is also not set, the insecure fallback `"django-insecure-change-me-for-local-development-only"` is used. A production misconfiguration could silently use a known-bad key.  
**Recommendation:** In `production.py`, assert `JWT_SECRET_KEY` is explicitly set. Add startup validation.

### 1.3 🟠 No Authentication on Health Endpoints

**Location:** `apps/core/views.py`  
**Issue:** `GET /api/health/database/` and `GET /api/health/redis/` are publicly accessible without any authentication. They reveal database schema names and Redis connectivity.  
**Recommendation:** Either restrict to internal network via Nginx config, or add a shared secret header check.

### 1.4 🟠 No Rate Limiting on API Endpoints (Beyond Login)

**Location:** `config/settings/base.py` — REST_FRAMEWORK config  
**Issue:** Django REST Framework throttling is not configured. While login has brute-force protection, API endpoints like `/api/payments/orders/create-order/` or `/api/admissions/` have no rate limiting.  
**Recommendation:** Add `DEFAULT_THROTTLE_CLASSES` and `DEFAULT_THROTTLE_RATES` to DRF settings.

### 1.5 🟡 CORS_ALLOW_ALL_ORIGINS = True in development.py

**Location:** `config/settings/development.py` line 6  
**Issue:** `CORS_ALLOW_ALL_ORIGINS = True` is set in development settings. If a developer accidentally uses development settings in production, all origins can make credentialed requests.  
**Recommendation:** Explicitly set `CORS_ALLOWED_ORIGINS` with specific frontend URL in all non-production environments.

### 1.6 🟡 Bandit Security Scan Report Shows Issues

**Location:** `backend/bandit_report.txt` (39 KB report committed to repo)  
**Issue:** A 39KB Bandit security scan report is committed to the repository (should be in `.gitignore`). The report exists, suggesting security issues were found but not all may have been addressed.  
**Recommendation:** Review `bandit_report.txt`, address HIGH severity items, add report files to `.gitignore`.

---

## 2. Architecture Debt

### 2.1 🟠 URL Inconsistency: `apps.parents` Mount Point

**Location:** `backend/config/urls.py` line 48  
```python
path("api/", include("apps.parents.urls")),   # ← should be "api/parents/"
```
**Issue:** The parents app is mounted at `path("api/", ...)` instead of `path("api/parents/", ...)`. This means the actual URL prefix is determined solely by what's in `apps/parents/urls.py`. It works by coincidence but violates the consistent pattern of all other apps.  
**Recommendation:** Change to `path("api/parents/", include("apps.parents.urls"))` and verify `apps/parents/urls.py` does not repeat the prefix.

### 2.2 🟠 CGPA Calculation Is Incorrect for Multi-Semester Students

**Location:** `apps/results/services.py` — `calculate_sgpa()`  
**Issue:** When a student completes multiple semesters, CGPA is incorrectly set equal to the current SGPA rather than computing the weighted cumulative average across all semesters.  
**Recommendation:** Query all `SemesterResult` records for the student and compute:
```python
cgpa = sum(sr.sgpa * total_credits_that_semester for sr in all_semesters) / total_credits_all_semesters
```

### 2.3 🟠 No Frontend Authentication Guards

**Location:** `frontend/src/App.tsx`  
**Issue:** All 96 routes are accessible without authentication checks. The React app renders all pages for any user without checking if the JWT token is present or valid. API calls fail with 401, but the UI renders without redirect to login.  
**Recommendation:** Implement a `<ProtectedRoute>` component that checks `localStorage` for a valid JWT token and redirects to `/login` if absent or expired.

### 2.4 🟠 RBAC Not Enforced on Frontend

**Location:** `frontend/src/components/Sidebar.tsx`, all 96 routes  
**Issue:** All sidebar navigation links and routes are rendered for all users regardless of their role. A student can navigate to `/rbac/roles` or `/fees/structure` — the page loads and only the API call returns 403.  
**Recommendation:** Implement role-based sidebar filtering and route-level permission checks using the user's assigned permissions from the API.

### 2.5 🟡 `academics/services.py` Is Nearly Empty

**Location:** `backend/apps/academics/services.py` (916 bytes)  
**Issue:** The academics service layer is almost empty, with most logic directly in ViewSets. This breaks the service layer contract established by all other apps.  
**Recommendation:** Extract validation, soft-delete, and restore logic from `views.py` into `services.py`.

### 2.6 🟡 Dual `profile_photo` Fields

**Location:** `apps/authentication/models.py` (User.profile_photo) + `apps/profiles/models.py` (UserProfile.profile_photo)  
**Issue:** Profile photo is stored in two places: directly on `User` (using `FileField`) and also managed via the `profiles` app with full validation.  
**Recommendation:** Remove `profile_photo` from the `User` model. Make `UserProfile.profile_photo` the single source of truth. This requires a migration.

### 2.7 🟡 API Version Not in URL Path

**Location:** `config/urls.py` — all paths  
**Issue:** API paths use `/api/auth/` instead of `/api/v1/auth/`. No versioning strategy exists. Breaking API changes cannot be deployed without client disruption.  
**Recommendation:** Introduce `/api/v1/` prefix via URL namespacing. Current API can be served at both `/api/` and `/api/v1/` during transition.

---

## 3. Code Quality Debt

### 3.1 🟠 `main_app/` — 572KB of Dead Code

**Location:** `backend/main_app/`  
**Issue:** The original monolith (33 files, ~572KB) remains in the repository. `hod_views.py` alone is 139KB. This inflates repository size, confuses new developers, and can accidentally be imported.  
**Recommendation:** Archive in a `legacy/` branch or external archive, then delete from `main` branch.

### 3.2 🟠 Build Artifacts Committed to Repository

**Location:** `backend/bandit_report.json` (65KB), `backend/bandit_report.txt` (39KB), `backend/django_verification_report.txt` (696KB), `backend/htmlcov/`, `backend/db.sqlite3`, `backend/test.sqlite3`  
**Issue:** ~800KB of build/test artifacts are committed to the git repository. The `django_verification_report.txt` at 696KB is particularly egregious.  
**Recommendation:** Add all these to `.gitignore` and remove from git history with `git filter-branch` or BFG.

### 3.3 🟡 README Version Mismatch

**Location:** `README.md` line 3 (shows `v0.8.0`), `PROJECT_STATUS.md` (shows `v0.20.0`)  
**Issue:** The README.md badge and project description still reference v0.8.0, while the codebase is at v0.20.0. The README module list only shows 7 apps; the actual codebase has 20.  
**Recommendation:** Update README.md to reflect current version, all 20 modules, and the complete technology stack.

### 3.4 🟡 Health Check Version Inconsistency

**Location:** `apps/core/views.py` line 13 (`"version": "1.0.0"`) vs `config/urls.py` line 10 (`"version": "v0.20.0"`)  
**Issue:** Two different version strings are returned by different health endpoints.  
**Recommendation:** Extract version to a settings variable `API_VERSION = "v0.20.0"` and reference it in both places.

### 3.5 🟡 Dev Scripts Scattered in `backend/` Root

**Location:** `backend/append_missing_views.py`, `backend/check_*.py`, `backend/seed_*.py`, etc. (14 files)  
**Issue:** 14 development utility scripts are scattered in the Django backend root alongside `manage.py`. This makes the `backend/` directory look cluttered and confusing.  
**Recommendation:** Move to `scripts/dev/` or `scripts/maintenance/`, or delete if obsolete.

### 3.6 🟢 Duplicate `SoftDeleteManager` Class

**Location:** `apps/academics/models.py`, `apps/admissions/models.py`, `apps/attendance/models.py`, `apps/certificates/models.py`, `apps/examinations/models.py`, `apps/results/models.py`, `apps/staff/models.py`, `apps/students/models.py`  
**Issue:** `SoftDeleteManager` is copy-pasted into 8 different app models with identical implementation. Any change to the pattern must be made in 8 places.  
**Recommendation:** Extract to a shared base class in `apps/core/mixins.py` or `apps/core/managers.py`. Make it `class SoftDeleteManager(models.Manager)` in one place, import everywhere.

---

## 4. Performance Debt

### 4.1 🟠 No Database Indexing Strategy

**Location:** All `models.py` files  
**Issue:** Foreign key fields get automatic indexes in Django, but frequently queried fields like `Student.enrollment_number`, `Employee.employee_id`, `AdmissionApplication.application_number`, `Parent.parent_code`, `FeeReceipt.receipt_number`, `Certificate.certificate_number` have `db_index=True` only on some. Some lookup-heavy fields may be missing indexes.  
**Recommendation:** Audit all CharField/UUIDField FKs used in `filter()` and `get()` for `db_index=True`.

### 4.2 🟠 N+1 Query Risk in ViewSets

**Location:** Multiple ViewSet `list()` methods  
**Issue:** Several ViewSets retrieve related objects without `select_related()` or `prefetch_related()`, causing N+1 query patterns on list endpoints. For example, `StudentListPage` loading 25 students may trigger 25+ additional queries for profile/department data.  
**Recommendation:** Audit all ViewSet querysets for missing `select_related` on FK/O2O fields and `prefetch_related` on M2M/reverse FK fields.

### 4.3 🟡 RBAC Permission Cache Has No Granular Invalidation

**Location:** `apps/rbac/services.py` — `PermissionResolver`  
**Issue:** Permission cache is invalidated when a role is assigned/removed from a user. However, if a `Permission` object is updated (code changed, permission deactivated), the existing user permission caches are NOT invalidated — they'll serve stale permissions for up to 1 hour.  
**Recommendation:** Add a signal on `Permission.save()` and `Role.save()` that invalidates all affected user caches.

### 4.4 🟡 No Database Connection Pooling Configuration

**Location:** `config/settings/base.py`  
**Issue:** `conn_max_age=600` is set on the database connection but no PgBouncer connection pooler is deployed in the Docker compose setup. For multi-tenant applications with many schemas, connection overhead can be significant.  
**Recommendation:** Add PgBouncer service to Docker Compose in production configuration.

---

## 5. Maintainability Debt

### 5.1 🟠 Celery Configured but No Tasks Defined

**Location:** `config/settings/base.py` — Celery settings, `docker-compose.yml` — celery_worker, celery_beat  
**Issue:** Celery is fully configured (broker URL, result backend, beat schedule) and deployed as two Docker services. However, no actual Celery tasks are defined anywhere in `apps/`. The workers are running but have nothing to do.  
**Recommendation:** Either define Celery tasks for obvious async work (email sending, fine calculation, PDF generation, certificate issuance), or remove Celery from the stack until tasks are needed.

### 5.2 🟠 Missing `apps.core.urls` for API Root

**Location:** `config/urls.py` line 40: `path("api/", include("apps.core.urls"))`  
**Issue:** The core app urls only expose 5 health check routes. The pattern `path("api/", ...)` means any URL mis-mapping under the core could shadow other apps that also start with `api/`.  

### 5.3 🟡 Library Fines Not Integrated with Fee System

**Location:** `apps/library/services.py` — `calculate_fine()`, `return_book()`  
**Issue:** Library overdue fines are calculated and stored on `BookIssue.fine_amount` but are NOT created as `StudentFee` or `FeeReceipt` records. Library fines and academic fees are on separate tracks with no reconciliation.  
**Recommendation:** When a fine is assessed, call `FeeService.create_fee_category("library_fine")` and create a `StudentFee` record so all financial obligations are consolidated.

### 5.4 🟡 No Celery Task for Overdue Fine Recalculation

**Location:** `apps/fees/models.py`, `apps/library/services.py`  
**Issue:** Overdue fines accrue daily but are only calculated at time of return/payment action. There's no scheduled job that recalculates outstanding fines nightly and notifies students.  
**Recommendation:** Define a Celery beat task `@shared_task` for nightly fine recalculation and student notification.

### 5.5 🟢 `axios` Listed as Dependency but Never Used

**Location:** `package.json`  
**Issue:** `axios` is in `dependencies` but the frontend uses native `fetch` via a custom `apiRequest` wrapper in `src/api/client.ts`. `axios` is dead weight adding ~13KB to the bundle.  
**Recommendation:** Remove `axios` from `package.json`.

---

## 6. Testing Debt

### 6.1 🟠 No End-to-End (E2E) Tests

**Issue:** The test suite covers unit and integration tests via pytest, but there are no Playwright or Selenium E2E tests covering critical user flows (login, pay fees, submit application, generate certificate).  
**Recommendation:** Add Playwright E2E tests for at minimum: login flow, student enrollment pipeline, fee payment, certificate generation.

### 6.2 🟡 Frontend Has Zero Tests

**Issue:** The 88-page React frontend has no test files, no Vitest configuration, and no Testing Library setup.  
**Recommendation:** Set up Vitest + React Testing Library. Start with critical service layer functions (API call mocking) and key page components.

### 6.3 🟡 No `main_app` Tests (Expected — It's Dead Code)

**Location:** `backend/main_app/tests.py` — 27 bytes, effectively empty  
**Issue:** The legacy app has no tests. (This is expected since it's dead code.)  
**Recommendation:** Delete with the rest of `main_app/`.

### 6.4 🟢 Test Coverage Not Measured

**Issue:** `pytest-cov` is not configured. While 125 tests pass, coverage percentage is unknown. By the AGENTS.md rule, 80%+ coverage is required.  
**Recommendation:** Add `pytest-cov` to dev requirements, configure in `pytest.ini` with `--cov=apps --cov-report=html`.

---

## 7. Debt Summary

| Priority | Count | Estimated Effort |
|:---|:---|:---|
| 🔴 CRITICAL | 1 | High — requires secrets management changes |
| 🟠 HIGH | 11 | Medium per item — architectural or security fixes |
| 🟡 MEDIUM | 12 | Small-medium — focused improvements |
| 🟢 LOW | 4 | Trivial — quick fixes |
| **TOTAL** | **28 issues** | |
