# Multi-Tenant SaaS Architecture Documentation

## 1. Architecture Overview

The **College ERP** platform utilizes PostgreSQL schema-level isolation powered by `django-tenants`. Each educational institution (college) operates within its own dedicated PostgreSQL schema, sharing a single Django codebase, web server, and application infrastructure.

```
PostgreSQL Database
  ├── Public Schema ('public')
  │     ├── tenancy_client (Tenant definitions: UUID, name, slug, schema_name, plan)
  │     └── tenancy_domain (Domain mappings: domain -> tenant_id)
  │
  ├── Tenant Schema A ('tenant_college_a')
  │     └── Institutional tables
  │
  └── Tenant Schema B ('tenant_college_b')
        └── Institutional tables
```

---

## 2. Schema Isolation

- **Shared Applications (`SHARED_APPS`)**: Installed exclusively in the `public` schema. Stores tenant definitions (`Client`), domain mappings (`Domain`), and SaaS system administration tables.
- **Tenant Applications (`TENANT_APPS`)**: Installed inside every individual tenant schema (`tenant_*`). Stores institutional ERP tables.

---

## 3. HTTP Request Lifecycle & Tenant Resolution

1. **Incoming Request**: Client sends an HTTP request (e.g. `collegea.localhost:8000`).
2. **Tenant Resolution Middleware (`TenantMainMiddleware`)**: Extracts `Host` header, queries `Domain` records in `public` schema, and matches active `Client`.
3. **Tenant Logging Middleware (`TenantLoggingMiddleware`)**: Logs `Host`, resolved `Client`, active `schema_name`, and request duration.
4. **Schema Switching**: Executes `SET search_path TO tenant_college_a, public;`.
5. **View Execution**: View handlers execute queries constrained strictly to the active schema search path.

---

## 4. How to Add a New College Tenant

### Option A: Via Management Command
```bash
python manage.py create_tenant --name "Stanford College" --slug "stanford" --schema "tenant_stanford" --domain "stanford.localhost" --email "admin@stanford.edu" --plan "enterprise"
```

### Option B: Via REST API Endpoint
```http
POST /api/tenancy/tenants/
Content-Type: application/json

{
  "name": "Harvard Institute",
  "slug": "harvard",
  "schema_name": "tenant_harvard",
  "contact_email": "admin@harvard.edu",
  "subscription_plan": "enterprise",
  "primary_domain": "harvard.localhost"
}
```

### Option C: Via Django SaaS Admin Panel
1. Access `http://localhost:8000/admin/`.
2. Navigate to **College Tenants** -> Click **Add College Tenant**.
3. Fill in College Name, Slug, Schema Name, and Add Primary Domain Inline.

---

## 5. How to Migrate Tenants

To run schema migrations across all tenant schemas:

```bash
# Using django-tenants management command:
python manage.py migrate_schemas

# Or using custom wrapper:
python manage.py migrate_tenants
```

To migrate a specific tenant schema only:
```bash
python manage.py migrate_schemas --schema=tenant_stanford
```

---

## 6. Common Troubleshooting

| Issue | Root Cause | Remediation |
| :--- | :--- | :--- |
| **`404 Not Found` / Tenant Not Resolved** | Domain not registered in `public` schema. | Map domain using `python manage.py create_tenant` or Django Admin. |
| **`Relation does not exist` Error** | App missing in `TENANT_APPS` or unmigrated schema. | Run `python manage.py migrate_schemas`. |
| **Cross-Tenant Data Leakage** | Raw SQL query missing search path safety. | Avoid hardcoding schema names in SQL; rely on Django ORM models. |
