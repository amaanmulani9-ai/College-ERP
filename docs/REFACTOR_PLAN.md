# REFACTOR_PLAN.md
# Enterprise College ERP — Ordered Refactoring Plan

**Version:** v0.20.0  
**Generated:** 2026-08-01  
**Status:** PLAN ONLY — No code changes. Requires approval before execution.  

---

## Principles

1. **No business logic changes** — Every refactor must preserve existing API contracts
2. **Tests must stay green** — Run `pytest tests/` after each phase
3. **One phase at a time** — Do not start Phase N+1 until Phase N is verified
4. **Smallest possible diff** — Prefer surgical changes over large rewrites

---

## Phase 0: Pre-Refactor Safety Gate (Day 1)

**Objective:** Establish baselines before any change.

### 0.1 Measure Current Coverage

```bash
pip install pytest-cov
pytest tests/ --cov=apps --cov-report=html --cov-report=term
```

Record coverage per app. Target: ≥80% overall.

### 0.2 Snapshot API Response Shapes

For each critical endpoint, save current response JSON as a snapshot file in `tests/snapshots/`. These serve as regression detectors.

### 0.3 Tag a Baseline Release

```bash
git tag v0.20.0-pre-refactor
git push origin v0.20.0-pre-refactor
```

---

## Phase 1: Repository Hygiene (Day 1-2)

**Risk: ZERO** — No source code changes, only file deletion and configuration.

### 1.1 Add Build Artifacts to .gitignore

Add to `.gitignore`:
```
backend/bandit_report.json
backend/bandit_report.txt
backend/django_verification_report.txt
backend/htmlcov/
backend/db.sqlite3
backend/test.sqlite3
*.tsbuildinfo
frontend/dist/
```

Remove already-tracked files:
```bash
git rm --cached backend/bandit_report.json
git rm --cached backend/bandit_report.txt
git rm --cached backend/django_verification_report.txt
git rm -r --cached backend/htmlcov/
```

**Verification:** `git status` shows no tracked artifacts.

### 1.2 Archive `backend/main_app/` (Do NOT delete yet)

```bash
# Create archive branch
git checkout -b archive/main-app-legacy
git add backend/main_app/
git commit -m "chore: archive legacy main_app monolith"
git push origin archive/main-app-legacy

# Return to main and delete
git checkout main
git rm -r backend/main_app/
git commit -m "chore: remove legacy main_app (archived in archive/main-app-legacy branch)"
```

**Verification:** `python manage.py check` still passes. `pytest tests/` still passes (125 tests).

### 1.3 Archive Other Legacy Backend Root Files

Move to `scripts/dev/` or delete:
- `backend/append_missing_views.py`
- `backend/check_*.py` (5 files)
- `backend/test_erp_pages.py`
- `backend/update_*.py` (2 files)
- `backend/seed_erp_data.py` → move to `scripts/dev/seed_erp_data.py`
- `backend/seed_fresh_data.py` → move to `scripts/dev/seed_fresh_data.py`
- `backend/get_ecc_root.js` → delete (JavaScript in Python backend root)
- `backend/run_verification.ps1` → move to `scripts/`

### 1.4 Remove Superseded Verify Scripts

```bash
git rm scripts/verify_task2.py scripts/verify_task3.py scripts/verify_task4.py
git rm scripts/verify_task5.py scripts/verify_task6.py scripts/verify_task7.py scripts/verify_task8.py
git commit -m "chore: remove superseded task verify scripts (covered by pytest)"
```

### 1.5 Remove `axios` from Frontend

```bash
npm uninstall axios
```

**Verification:** `npx tsc --noEmit` passes. `npm run build` succeeds.

---

## Phase 2: Shared Utilities Extraction (Day 2-3)

**Risk: LOW** — Backward-compatible refactoring.

### 2.1 Create `apps/core/mixins.py` — Shared SoftDeleteManager

Extract the duplicated `SoftDeleteManager` class from 8 app `models.py` files into one place:

```python
# apps/core/mixins.py
class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
```

Then in each app: `from apps.core.mixins import SoftDeleteManager`

**Files to change:** `apps/academics/models.py`, `apps/admissions/models.py`, `apps/attendance/models.py`, `apps/certificates/models.py`, `apps/examinations/models.py`, `apps/results/models.py`, `apps/staff/models.py`, `apps/students/models.py`

**Verification:** `python manage.py check` + `pytest tests/` both pass.

### 2.2 Create `apps/core/audit.py` — Shared Audit Logging

The `log_audit_event()` function from `apps/authentication/services.py` is imported by virtually every app. Move it (or re-export it) from `apps/core/audit.py` to break the circular-feeling dependency chain.

```python
# apps/core/audit.py
from apps.authentication.services import log_audit_event  # re-export
```

This keeps backward compatibility while clarifying ownership.

---

## Phase 3: Security Fixes (Day 3-4)

**Risk: MEDIUM** — Requires testing in staging environment.

### 3.1 Fix URL Inconsistency for `apps.parents`

**File:** `backend/config/urls.py`

```python
# Change:
path("api/", include("apps.parents.urls")),
# To:
path("api/parents/", include("apps.parents.urls")),
```

Then verify `apps/parents/urls.py` does not double-prefix the routes.  
**Update `parentService.ts`** frontend service if any URL changed.  
**Verification:** All parent API tests pass. Frontend parent pages still work.

### 3.2 Add Rate Limiting to DRF

**File:** `backend/config/settings/base.py`

```python
REST_FRAMEWORK = {
    ...
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
}
```

**Verification:** `python manage.py check` passes. Test throttling behavior with curl.

### 3.3 Protect Health Endpoints (Optional)

Add an internal token check or restrict in Nginx to `allow 10.0.0.0/8; deny all;`.

### 3.4 Fix JWT Secret Key Validation

**File:** `backend/config/settings/production.py`

```python
from apps.authentication.utils import verify_jwt_secret
JWT_SECRET_KEY = str_env("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY must be explicitly set in production")
```

---

## Phase 4: Model Layer Cleanup (Day 4-6)

**Risk: MEDIUM** — Requires database migrations.

### 4.1 Remove `profile_photo` from `User` Model

**File:** `apps/authentication/models.py`

1. Create migration to remove `User.profile_photo`
2. Confirm all usages reference `user.profile.profile_photo` instead
3. Update any admin or template references

**Verification:** `python manage.py check` + `python manage.py makemigrations --check` (no pending) + `pytest tests/`.

### 4.2 Remove Redundant `preferred_language` and `time_zone` from `User`

Same process — these are already on `UserPreferences`.

### 4.3 Add Missing Database Indexes

Audit and add `db_index=True` to high-frequency lookup fields:
- `Employee.employee_id`
- `Parent.parent_code`
- `AdmissionApplication.application_number`
- `Certificate.certificate_number`
- `FeeReceipt.receipt_number`
- `PaymentOrder.order_id`
- `PaymentTransaction.transaction_id`

**Verification:** `python manage.py makemigrations` creates index migrations. `pytest tests/` passes.

---

## Phase 5: Business Logic Fixes (Day 6-8)

**Risk: MEDIUM** — Must not break existing test suite.

### 5.1 Fix CGPA Multi-Semester Calculation

**File:** `apps/results/services.py` — `calculate_sgpa()` method

```python
# After saving current SemesterResult, recompute CGPA:
all_semester_results = SemesterResult.objects.filter(student=student)
total_credit_points = sum(sr.sgpa * total_credits_for_that_semester for sr in all_semester_results)
total_credits = sum(total_credits_for_that_semester for sr in all_semester_results)
cgpa = round(total_credit_points / total_credits, 2) if total_credits > 0 else 0.0
semester_result.cgpa = cgpa
```

**Verification:** Add a new test case in `tests/test_results.py` for a 2-semester student. Verify CGPA is the weighted average, not just SGPA of the latest semester.

### 5.2 Populate `academics/services.py`

Extract all validation and business logic from `academics/views.py` into `academics/services.py`. ViewSets should call service methods.

### 5.3 Integrate Library Fines with Fee System

**File:** `apps/library/services.py` — `return_book()` and `calculate_fine()`

When a fine > 0 is assessed, create a `StudentFee` (category: `LIBRARY_FINE`) via `FeeService`.

---

## Phase 6: Frontend Fundamentals (Day 8-10)

**Risk: LOW** — UI-only changes, no API changes.

### 6.1 Implement `<ProtectedRoute>` Component

Create `frontend/src/components/ProtectedRoute.tsx`:

```tsx
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = localStorage.getItem('access_token');
    if (!token) return <Navigate to="/login" replace />;
    return <>{children}</>;
};
```

Wrap all non-auth routes in `App.tsx` with `<ProtectedRoute>`.

### 6.2 Implement Sidebar RBAC Filtering

Fetch user permissions from `/api/rbac/my-permissions/` on login. Store in React Query cache. Filter `Sidebar.tsx` menu items based on required permissions per module.

### 6.3 Fix Axios Import

Remove unused import from any files that reference axios (if any slipped through) after uninstalling the package.

---

## Phase 7: Infrastructure Improvements (Day 10-12)

**Risk: LOW** — DevOps only.

### 7.1 Add Celery Tasks for Obvious Async Work

Define tasks in a new `apps/notifications/tasks.py` (or per-app `tasks.py`):
- `send_fee_reminder()` — triggered on `StudentFee` overdue
- `generate_certificate_pdf()` — async PDF rendering
- `send_attendance_deficit_alert()` — student below 75%

### 7.2 Configure PgBouncer in Production Docker Compose

Add `pgbouncer` service between Django and PostgreSQL for connection pooling.

### 7.3 Configure pytest-cov

Add to `backend/pytest.ini`:
```ini
[pytest]
addopts = --cov=apps --cov-report=term-missing --cov-fail-under=80
```

---

## Phase 8: Documentation Updates (Day 12)

### 8.1 Update README.md

- Update version badge to v0.20.0
- Add all 20 modules to the features list
- Update repository structure diagram
- Update roadmap to reflect completed tasks

### 8.2 Update PROJECT_STATUS.md

- Remove "Upcoming Roadmap" items that are now complete (TASK-010 through TASK-020 done)
- Update Backend Apps Inventory table with all 20 apps
- Add "Next Phase" section for future features

### 8.3 Fix Health Check Version String

Set `API_VERSION = "v0.20.0"` in settings and use it in `core/views.py`.

---

## Estimated Timeline

| Phase | Duration | Risk | Priority |
|:---|:---|:---|:---|
| 0: Safety Gate | 0.5 days | None | Must Do |
| 1: Repository Hygiene | 1 day | Zero | Must Do |
| 2: Shared Utilities | 1 day | Low | Should Do |
| 3: Security Fixes | 1.5 days | Medium | Must Do |
| 4: Model Layer | 2 days | Medium | Should Do |
| 5: Business Logic | 2 days | Medium | Should Do |
| 6: Frontend Fundamentals | 2 days | Low | Should Do |
| 7: Infrastructure | 2 days | Low | Could Do |
| 8: Documentation | 0.5 days | None | Must Do |
| **Total** | **~12 days** | | |
