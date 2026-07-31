# Release Notes — v0.9.0

**Release Name:** Parent Management Module  
**Release Date:** July 31, 2026  
**Previous Version:** v0.8.0  
**Branch:** `main`  
**Commit:** `7e88855`  
**Tag:** `v0.9.0`

---

## Overview

v0.9.0 ships the **Enterprise Parent & Guardian Management System** (TASK-009), the ninth production module of the College ERP SaaS platform. This release establishes the foundational data layer and API surface for the Parent Portal, enabling institutions to manage parent/guardian profiles, link them to multiple students, verify identities, collect supporting documents, and configure granular notification preferences — all within tenant-isolated database schemas.

---

## What's New

### Backend — `apps/parents/`

#### Models

| Model | Description |
| :--- | :--- |
| `Parent` | Core entity. Auto-generated `PAR-XXXXXXXX` code. Stores relationship type, occupation, education, income, verification state, portal & notification toggles, soft-delete. |
| `StudentParentLink` | M2M through model linking `Parent` ↔ `Student`. Flags: `is_primary_contact`, `is_emergency_contact`, `can_pickup`. One parent can be linked to multiple students (sibling support). |
| `ParentDocument` | Document upload model with type classification (`id_proof`, `address_proof`, `income_certificate`, `relationship_certificate`, `court_order`, `other`) and 4-state review workflow: `pending → approved / rejected / expired`. |
| `ParentCommunicationPreference` | Per-channel toggles (email, SMS, push, WhatsApp) + per-event subscriptions (attendance alerts, fee reminders, exam results, announcements, disciplinary notices, event invitations). |
| `ParentActivityLog` | Tamper-evident audit trail. Captures 11 event types with actor, IP address, timestamp, and JSON metadata. |

#### Service Layer (`services.py`)

| Function | Description |
| :--- | :--- |
| `generate_parent_code()` | Collision-safe `PAR-XXXXXXXX` code generator. |
| `create_parent()` | Creates parent with auto-generated code + default communication preferences. |
| `verify_parent()` | Sets `is_verified=True`, stamps `verified_at`, `verified_by`. |
| `soft_delete_parent()` | Sets `is_deleted=True`, logs the event. |
| `restore_parent()` | Clears `is_deleted`, logs the event. |
| `link_student_to_parent()` | Creates or updates `StudentParentLink`. Logs the action. |
| `unlink_student_from_parent()` | Removes the link. Logs the action. |

All service functions emit `ParentActivityLog` entries and (optionally) pass through to the authentication audit log.

#### REST API Endpoints

```
GET    /api/parents/                            List all parents (search, filter)
POST   /api/parents/                            Create parent + user account
GET    /api/parents/{id}/                       Retrieve parent detail
PATCH  /api/parents/{id}/                       Update parent fields
DELETE /api/parents/{id}/                       Soft delete
POST   /api/parents/{id}/verify/                Verify parent identity
POST   /api/parents/{id}/restore/               Restore soft-deleted record
POST   /api/parents/{id}/link-student/          Link student to parent
DELETE /api/parents/{id}/unlink-student/        Remove student link
GET    /api/parents/{id}/activity-log/          Full audit trail
GET    /api/parents/dashboard/                  Aggregate statistics
POST   /api/parent-documents/                   Upload parent document
GET    /api/parent-documents/?parent={id}       List documents for a parent
POST   /api/parent-documents/{id}/review/       Staff document approval/rejection
```

#### Django Admin

Full admin support with inlines:
- **StudentParentLink** — tabular inline per parent
- **ParentDocument** — tabular inline per parent
- **ParentCommunicationPreference** — stacked inline per parent
- **ParentActivityLog** — read-only admin with timestamp and actor

#### Multi-Tenant Integration

`apps.parents` registered in both `SHARED_APPS` and `TENANT_APPS`. All parent data is fully schema-isolated per tenant. No cross-tenant data leakage possible.

---

### Frontend — React / TypeScript

#### `parentService.ts`

Fully typed API client with interfaces for `ParentItem`, `CommunicationPrefs`, `StudentParentLink`, `ParentDocument`, `ParentDashboardStats`. Covers all 14 backend endpoints.

#### `ParentListPage.tsx` (`/parents`)

- Searchable table with columns: Code, Name, Email, Relationship, Occupation, Verified badge, Portal status, Actions
- Inline create form with relationship, education level, occupation fields
- One-click **Verify** action per parent row
- Soft-delete with confirmation prompt
- Animated loading spinner + empty state

#### `ParentDetailsPage.tsx` (`/parents/:id`)

Four-tab interface:
- **Overview** — Identity, Portal & Notification settings, Record timestamps
- **Students** — Linked students table + inline link form (UUID input, primary/emergency checkboxes)
- **Documents** — Document table with type, number, status badges, upload/expiry dates
- **Activity Log** — Chronological audit trail with actor, timestamp, event type badge

#### Sidebar

Added **Parent Portal** section with `HeartHandshake` icon from Lucide.

---

## Repository Changes

| File | Change |
| :--- | :--- |
| `backend/apps/parents/__init__.py` | New — App init |
| `backend/apps/parents/apps.py` | New — AppConfig |
| `backend/apps/parents/models.py` | New — 5 models |
| `backend/apps/parents/services.py` | New — Service layer |
| `backend/apps/parents/serializers.py` | New — Read/write serializers |
| `backend/apps/parents/views.py` | New — ViewSets + dashboard view |
| `backend/apps/parents/urls.py` | New — URL routing |
| `backend/apps/parents/admin.py` | New — Django admin |
| `backend/apps/parents/migrations/0001_initial.py` | New — Initial migration |
| `backend/config/settings/base.py` | Modified — Added `apps.parents` to SHARED & TENANT apps |
| `backend/config/urls.py` | Modified — Mounted `/api/` parents routes |
| `frontend/src/services/parentService.ts` | New — API client |
| `frontend/src/pages/ParentListPage.tsx` | New — List page |
| `frontend/src/pages/ParentDetailsPage.tsx` | New — Detail page |
| `frontend/src/App.tsx` | Modified — Added parent imports and routes |
| `frontend/src/components/Sidebar.tsx` | Modified — Added Parent Portal section |
| `.gitignore` | Modified — Added `*.tsbuildinfo` |

**Total:** 17 files changed, 2,032 insertions, 1 deletion

---

## Verification Results

| Check | Status |
| :--- | :--- |
| `python manage.py check` | ✅ 0 issues |
| `python manage.py makemigrations` | ✅ 0001_initial generated |
| `npx tsc --noEmit` | ✅ 0 errors |
| Secrets scan | ✅ No hardcoded secrets |
| Untracked files | ✅ None (tsbuildinfo gitignored) |
| Git status | ✅ Clean |

---

## Breaking Changes

None. This is an additive release — no existing models, APIs, or database schemas are modified.

---

## Upgrade Notes

When running the application with an active PostgreSQL instance, apply migrations to all tenant schemas:

```bash
python manage.py migrate_schemas --shared
python manage.py migrate_schemas
```

No data seeding is required for the parents module. Parent communication preferences are auto-created via `get_or_create` on first parent creation.

---

## Next Release — v0.10.0 (Planned)

**TASK-010: Admissions & Enrollment Engine**  
Application submission portal, document verification, merit ranking, and enrollment confirmation workflow.
