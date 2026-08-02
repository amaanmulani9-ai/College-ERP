<!-- Generated: 2026-07-06 | Files scanned: 120 | Token estimate: ~400 -->
# Backend Architecture & Routing Map

The backend is built with Python 3.11+ using the Django 5.x framework. It utilizes a shared-model/tenant-model routing setup to separate institutional data.

## Key Source Files
- `backend/manage.py`: Django entry point (configures python path and settings).
- `backend/college_management_system/settings.py`: Core system configurations (database routing, OIDC backend, Celery parameters).
- `backend/main_app/models.py`: Database models for ERP objects (Students, Staff, Courses, Results, Library, Visitor Pass).
- `backend/main_app/hod_views.py`: HOD/Administrator views (batch management, staff/student enrollment, analytics exports).
- `backend/main_app/smart_views.py`: Smart Campus features views (QR codes generators, attendance scans, visitor verification).
- `backend/main_app/staff_views.py` & `student_views.py`: Portal views for teachers and students.

## Middleware Pipeline
```
Request
  |
  v  [django_tenants.middleware.main.TenantMainMiddleware] (Selects Postgres DB schema name based on Hostname)
  |
  v  [django.middleware.security.SecurityMiddleware]
  |
  v  [django.contrib.sessions.middleware.SessionMiddleware] (Redis/Cache sessions)
  |
  v  [django.middleware.locale.LocaleMiddleware] (Localization)
  |
  v  [django.middleware.common.CommonMiddleware]
  |
  v  [django.middleware.csrf.CsrfViewMiddleware]
  |
  v  [django.contrib.auth.middleware.AuthenticationMiddleware] (OIDC SSO + Django Session auth)
  |
  v  [django.contrib.messages.middleware.MessageMiddleware]
  |
  v  [whitenoise.middleware.WhiteNoiseMiddleware] (Fast static server)
  |
  v  [django.middleware.clickjacking.XFrameOptionsMiddleware]
  |
  v
Route Handler (View)
```

## Route Map (Major View Bindings)
```
/                                   -> views.login_page (OIDC SSO / manual login)
/admin/home/                        -> hod_views.admin_home (Main HOD Stats dashboard)
/admin/batches/                     -> hod_views.admin_manage_batches (Filters/Promotes semesters)
/admin/batches/print-ids/           -> hod_views.admin_print_batch_ids (Print multiple student ID cards)
/student/id-card/                   -> smart_views.student_id_card (Student digital flippable ID)
/staff/id-card/                     -> smart_views.staff_id_card (Staff digital flippable ID)
/student/id-card/qr/<id>/           -> smart_views.generate_student_qr (PNG QR code generator)
/staff/scanner/                     -> smart_views.staff_scanner_desk (HTML5 QR scanner dashboard)
/staff/scanner/attendance/          -> smart_views.scan_attendance_qr (API to log QR attendance)
/staff/scanner/library/             -> smart_views.scan_library_qr (API to issue/return books via QR)
/visitor/request/                   -> smart_views.visitor_pass_request (Visitor registration form)
/metrics/                           -> analytics_views.prometheus_metrics (Prometheus stats telemetry)
```
