# LEGACY_CODE_REPORT.md
# Enterprise College ERP — Legacy Code Identification Report

**Version:** v0.20.0  
**Generated:** 2026-08-01  
**Status:** READ ONLY — No changes made  

---

## Executive Summary

The codebase contains **two distinct code generations**:
1. **Active `apps/` architecture** — 20 Django apps (~780 KB), fully registered in INSTALLED_APPS, tested, and deployed
2. **Legacy `main_app/` monolith** — original Django app (~572 KB), **NOT registered in INSTALLED_APPS**, **NOT mounted in URL patterns**, **completely dead**

Additionally, several configuration artifacts, debug scripts, and frontend inconsistencies were identified.

---

## 1. LEGACY: `backend/main_app/` — Complete Original Monolith

**Status:** DEAD CODE — Not installed, not mounted, not executed  
**Risk to remove:** LOW — Safe to delete after archival  

This is the original Django application built before the modular `apps/` refactor. None of the files are imported by any active code.

### 1.1 File Inventory

| File | Size | Content | Recommendation |
|:---|:---|:---|:---|
| `models.py` | 61 KB | Legacy ORM models duplicating all modern app models | Archive & Delete |
| `views.py` | 58 KB | Django template-based views (not DRF) | Archive & Delete |
| `hod_views.py` | 139 KB | 🔴 Largest file in codebase — Head of Department views (legacy) | Archive & Delete |
| `student_views.py` | 71 KB | Legacy student management views | Archive & Delete |
| `staff_views.py` | 32 KB | Legacy staff views | Archive & Delete |
| `urls.py` | 33 KB | Legacy URL patterns (not mounted) | Archive & Delete |
| `forms.py` | 10 KB | Django HTML forms (pre-DRF era) | Archive & Delete |
| `admin.py` | <1 KB | Legacy admin registration | Archive & Delete |
| `ai_helper.py` | 16 KB | AI integration experiment (pre-LangChain pattern) | Archive & Delete |
| `ai_views.py` | 11 KB | Legacy AI views | Archive & Delete |
| `analytics_engine.py` | 4.8 KB | Old analytics implementation | Archive & Delete |
| `analytics_helper.py` | 1.3 KB | Analytics utilities | Archive & Delete |
| `analytics_views.py` | 13 KB | Legacy analytics views | Archive & Delete |
| `backoffice_views.py` | 13.5 KB | Legacy back-office views | Archive & Delete |
| `chat_views.py` | 18 KB | Real-time chat experiment (Python-SocketIO) | Archive & Delete |
| `communication_helper.py` | 4.9 KB | Email/SMS helper | Archive & Delete |
| `context_processors.py` | 641 B | Template context processors (not needed in DRF) | Archive & Delete |
| `decorators.py` | 1.7 KB | Legacy view decorators | Archive & Delete |
| `digital_verification_service.py` | 3.5 KB | QR-based document verification prototype | Archive & Delete |
| `document_ocr_service.py` | 6.1 KB | pytesseract OCR prototype | Archive & Delete |
| `face_recognition_service.py` | 4.8 KB | Face recognition attendance prototype | Archive & Delete |
| `firebase_auth_service.py` | 2.2 KB | Firebase phone auth prototype | Archive & Delete |
| `finance_views.py` | 10 KB | Legacy finance views | Archive & Delete |
| `mobile_api_views.py` | 15 KB | Legacy mobile API views | Archive & Delete |
| `naac_nirf_reports.py` | 7.2 KB | NAAC/NIRF report generator prototype | Archive & Delete |
| `parent_views.py` | 11 KB | Legacy parent views | Archive & Delete |
| `placement_views.py` | 4.9 KB | Placement management prototype | Archive & Delete |
| `smart_views.py` | 11 KB | "Smart" views (unclear purpose) | Archive & Delete |
| `EmailBackend.py` | 934 B | Custom email backend | Archive & Delete |
| `EditResultView.py` | 1.8 KB | Legacy result edit view | Archive & Delete |
| `apps.py` | 90 B | App config (not in INSTALLED_APPS) | Archive & Delete |
| `tests.py` | 27 B | Empty test file | Archive & Delete |

**Total legacy size: ~572 KB across 33 files**  
**Migration status:** Fully superseded by `apps/` architecture

### 1.2 Other Legacy Directories in `backend/`

| Directory/File | Status | Notes |
|:---|:---|:---|
| `backend/college_management_system/` | LEGACY | Appears to be another Django project skeleton |
| `backend/saas_admin/` | LEGACY | Older SaaS admin interface |
| `backend/shared/` | LEGACY | Shared utilities from original monolith |
| `backend/seed_erp_data.py` | DEV ARTIFACT | Seeding scripts in backend root (should be in `scripts/`) |
| `backend/seed_fresh_data.py` | DEV ARTIFACT | Duplicate seeding script |
| `backend/append_missing_views.py` | DEV SCRIPT | One-off code generation helper |
| `backend/check_all_templates.py` | DEV SCRIPT | Template validation script |
| `backend/check_extends_includes.py` | DEV SCRIPT | Template inheritance checker |
| `backend/check_render.py` | DEV SCRIPT | Render.com deployment checker |
| `backend/check_sidebar.py` | DEV SCRIPT | Sidebar validation script |
| `backend/check_templates.py` | DEV SCRIPT | Another template checker |
| `backend/test_erp_pages.py` | DEV SCRIPT | Ad-hoc page testing script |
| `backend/update_certificates_html.py` | DEV SCRIPT | HTML update helper |
| `backend/update_default_passwords.py` | DEV SCRIPT | Password update utility |
| `backend/get_ecc_root.js` | DEV SCRIPT | JavaScript utility in Python backend root |
| `backend/run_verification.ps1` | DEV SCRIPT | PowerShell verification script |
| `backend/bandit_report.json` | BUILD ARTIFACT | Security scan output (65 KB) — should be in .gitignore |
| `backend/bandit_report.txt` | BUILD ARTIFACT | Security scan text report (39 KB) — should be in .gitignore |
| `backend/django_verification_report.txt` | BUILD ARTIFACT | 696 KB verification report — definitely in wrong location |
| `backend/htmlcov/` | BUILD ARTIFACT | HTML coverage report directory — should be in .gitignore |
| `backend/db.sqlite3` | BUILD ARTIFACT | Development SQLite DB — should be in .gitignore |
| `backend/test.sqlite3` | BUILD ARTIFACT | Test SQLite DB — should be in .gitignore |
| `backend/requirements/` | LEGACY | Old requirements directory (superseded by root `requirements.txt`) |
| `backend/requirements.txt` | DUPLICATE | Backend-local requirements.txt (root requirements.txt is canonical) |

---

## 2. DEPRECATED: `scripts/verify_task*.py` — Old Verification Scripts

| File | Status |
|:---|:---|
| `scripts/verify_task2.py` | Superseded by pytest test suite |
| `scripts/verify_task3.py` | Superseded by pytest test suite |
| `scripts/verify_task4.py` | Superseded by pytest test suite |
| `scripts/verify_task5.py` | Superseded by pytest test suite |
| `scripts/verify_task6.py` | Superseded by pytest test suite |
| `scripts/verify_task7.py` | Superseded by pytest test suite |
| `scripts/verify_task8.py` | Superseded by pytest test suite |

These scripts were written before the pytest test suite existed. They are still referenced in the README but are now fully superseded by `tests/`. They can be removed.

---

## 3. DEPRECATED: `scripts/fix_html_linter.py` and `scripts/check_sidebar.py`

These are one-off development maintenance scripts with no relevance to the current architecture.

---

## 4. UNUSED FRONTEND DEPENDENCY: `axios`

`package.json` lists `axios` as a production dependency, but the actual HTTP client implementation uses the native `fetch` API via `src/api/client.ts`. Axios is never imported in any source file.

**File:** [package.json](file:///c:/Users/Amaan/OneDrive/Desktop/College-ERP-main/College-ERP-main/package.json)  
**Recommendation:** Remove `axios` from `dependencies` in next dependency audit.

---

## 5. UNUSED BACKEND DEPENDENCIES in `requirements.txt`

The root `requirements.txt` includes several packages that appear unused in the active `apps/` codebase:

| Package | Installed For | Current Usage Status |
|:---|:---|:---|
| `langchain==0.1.16` | AI integration | Not used in `apps/` — was for legacy `ai_helper.py` |
| `chromadb>=0.4.24` | Vector DB for AI | Not used in `apps/` |
| `mozilla-django-oidc==3.0.0` | OIDC/SSO auth | Not configured in settings |
| `pymongo==4.6.3` | MongoDB | Not used anywhere |
| `python-socketio==5.8.0` | WebSockets | Was for legacy `chat_views.py` |
| `meilisearch==0.28.0` | Search engine | Not configured in settings |
| `pytesseract>=0.3.10` | OCR | Was for legacy `document_ocr_service.py` |
| `django-storages==1.14.4` | Cloud storage | Settings use local FileSystemStorage |
| `boto3==1.34.84` | AWS S3 | Not configured in settings |
| `face-recognition` (not listed) | Face recognition | `face_recognition_service.py` references it but it's not in requirements |

**Recommendation:** A requirements audit and split into `requirements/base.txt`, `requirements/optional.txt`, `requirements/dev.txt` is needed.

---

## 6. PLACEHOLDER / STUB CODE IN ACTIVE APPS

### 6.1 Payment Gateway Stubs

`backend/apps/payments/gateways.py` contains stub implementations:

```python
class StripeGateway(BaseGateway):
    def create_order(self, ...):
        raise NotImplementedError("Stripe integration not yet implemented")

class PhonePeGateway(BaseGateway):
    def create_order(self, ...):
        raise NotImplementedError("PhonePe integration not yet implemented")
```

These are architecturally correct stubs (not dead code), but will cause runtime errors if `GatewayFactory.get("stripe", config)` is called.

### 6.2 Bulk Import/Export Placeholder

`BulkImportExportPage.tsx` is a complete frontend page but the backend CSV ingestion endpoint is not implemented. The page exists but cannot do actual bulk operations.

### 6.3 QR Attendance Token

`AttendanceSession` has a `qr_token` field and the service generates tokens, but the mobile QR scanning flow is not implemented end-to-end.

### 6.4 Certificate PDF Generation

`certificates/services.py` prepares a PDF payload dictionary but does not call `xhtml2pdf` or `ReportLab` to render an actual PDF binary. The download endpoint returns JSON, not a PDF stream.

---

## 7. ARTIFACT FILES TO ADD TO .gitignore

```gitignore
# Build artifacts (currently committed)
backend/bandit_report.json
backend/bandit_report.txt
backend/django_verification_report.txt
backend/htmlcov/
backend/db.sqlite3
backend/test.sqlite3
backend/*.pyc
backend/__pycache__/
backend/.pytest_cache/
backend/.ruff_cache/
```

---

## 8. MIGRATION REQUIREMENTS

If `main_app/` is deleted in future:

1. **No Django migrations are affected** — `main_app` was not in `INSTALLED_APPS` so its migrations were never applied to any active schema.
2. **No active code imports from `main_app`** — all `apps/` modules are self-contained.
3. **Git history preserved** — deletion does not affect git log.
4. **Recommended:** Archive the entire `main_app/` directory into a `legacy/` folder or a separate branch before permanent deletion, for historical reference.

---

## 9. Summary Table

| Category | Count | Action |
|:---|:---|:---|
| Dead code files (main_app) | 33 files, ~572 KB | Archive then delete |
| Dead directories (backend root) | 6+ dirs | Evaluate then clean |
| Dev artifact scripts (backend root) | 14 scripts | Move to `scripts/dev/` or delete |
| Build artifacts committed to repo | 4 large files | Add to .gitignore + delete |
| Superseded verify scripts | 7 files | Delete (pytest covers all) |
| Unused npm packages | 1 (`axios`) | Remove from package.json |
| Unused pip packages | 9+ packages | Remove from requirements.txt |
| Placeholder stubs (active apps) | 4 areas | Document as `TODO: implement` |
