# Enterprise Role-Based Access Control (RBAC) Documentation

## 1. System Architecture & Database Design

The **College ERP RBAC Engine** provides a scalable, multi-tenant authorization framework supporting **granular permissions**, **multi-role user assignments**, **automatic tenant seeding**, and **Redis-backed permission caching**.

### Data Models (`apps/rbac/models.py`)

#### `Permission`
Catalog of fine-grained application actions:
- `id`: UUID Primary Key
- `code`: Unique identifier string (e.g. `students.view`, `attendance.mark`, `fees.collect`, `roles.manage`)
- `name`: Display name
- `module`: Target functional area (e.g. `students`, `attendance`, `fees`, `library`, `placement`, `exams`)
- `action`: CRUD/Operation verb (`view`, `create`, `update`, `delete`, `mark`, `collect`, `issue`)
- `is_active`, `is_system`: Boolean flags

#### `Role`
Tenant-scoped role definitions:
- `id`: UUID Primary Key
- `name`: Role title (e.g. `College Admin`, `Teacher`, `Student`, `Placement Officer`)
- `tenant_schema`: Active PostgreSQL schema context (`public` or tenant schema)
- `priority`: Hierarchy integer weight
- `permissions`: Many-to-Many relationship with `Permission`
- `is_active`, `is_system`: Status flags

#### `UserRole`
Associates user accounts with zero or more roles:
- `user`: Foreign key to `authentication.User`
- `role`: Foreign key to `Role`
- `assigned_at`: Assignment timestamp

---

## 2. Default Roles Catalog (14 Seeded Tenant Roles)

Every college tenant automatically seeds 14 standard institutional roles (`apps/rbac/seeders.py`):

1. **College Admin** (Priority 100) — Full tenant administrative scope.
2. **HOD** (Priority 90) — Head of Department academic & faculty management.
3. **Teacher** (Priority 80) — Faculty attendance marking, exam result entry & student view.
4. **Student** (Priority 10) — View attendance, grades, fee receipts & library catalog.
5. **Parent** (Priority 10) — Student progress monitoring portal.
6. **Alumni** (Priority 10) — Placement network & alumni events.
7. **Recruiter** (Priority 50) — Corporate campus drive access.
8. **Accountant** (Priority 70) — Fee collection, receipts, ledger & refunds.
9. **Librarian** (Priority 70) — Library book cataloging, issuance & return tracking.
10. **Hostel Warden** (Priority 60) — Hostel occupancy & student safety notices.
11. **Transport Manager** (Priority 60) — Vehicle fleet, routes & transit alerts.
12. **Placement Officer** (Priority 75) — Corporate drives, student resumes & placement offers.
13. **Admission Officer** (Priority 75) — Applicant verification & onboarding.
14. **Back Office** (Priority 50) — Support & administrative operations.

---

## 3. Authorization Engine & Permission Resolver

### Fast Permission Resolution (`PermissionResolver`)
When an authorized user requests a protected endpoint:
1. `PermissionResolver.get_user_permission_codes(user)` queries Redis/Django cache key `rbac:<schema>:user:<user_id>:permissions`.
2. If cache hit: Returns cached set of permission code strings immediately.
3. If cache miss: Executes optimized SQL join across active `UserRole` -> `Role` -> `Permission` tables, caches the result array for 1 hour, and returns the set.
4. Any role assignment change, role edit, or permission modification automatically invalidates `rbac:<schema>:user:<user_id>:permissions`.

### DRF Reusable Permission Classes (`apps/rbac/permissions.py`)

- **`RequirePermission("students.view")`**: Enforces specific single permission.
- **`RequireAnyPermission(["attendance.mark", "attendance.edit"])`**: Enforces at least one matching permission code.
- **`RequireAllPermissions(["fees.collect", "fees.refund"])`**: Enforces all specified permission codes.
- **`RequireRole("Teacher")`**: Enforces specific role membership.
- **`TenantOwnershipValidation`**: Ensures cross-tenant object ownership boundaries are respected.

```python
# Example Usage in DRF Views
from rest_framework.views import APIView
from apps.rbac.permissions import RequirePermission

class StudentListView(APIView):
    permission_classes = [RequirePermission("students.view")]

    def get(self, request):
        ...
```

---

## 4. REST API Endpoint Reference

| Endpoint Path | Method | Action / Purpose |
| :--- | :--- | :--- |
| `/api/rbac/roles/` | `GET / POST` | List & create tenant roles |
| `/api/rbac/roles/<id>/` | `GET / PUT / DELETE` | Retrieve, update or delete role |
| `/api/rbac/roles/<id>/clone/` | `POST` | Duplicate role with all granted permissions |
| `/api/rbac/roles/<id>/disable/` | `POST` | Disable role and purge user authorization caches |
| `/api/rbac/roles/<id>/assign-permission/` | `POST` | Add permission code to role |
| `/api/rbac/roles/<id>/remove-permission/` | `POST` | Revoke permission code from role |
| `/api/rbac/permissions/` | `GET / POST` | Catalog of system permissions |
| `/api/rbac/users/<user_id>/roles/` | `POST / DELETE` | Assign or remove role for user |
| `/api/rbac/matrix/permissions/` | `GET` | Role ↔ Permission Matrix visual dataset |
| `/api/rbac/matrix/roles/` | `GET` | User ↔ Role Matrix visual dataset |
