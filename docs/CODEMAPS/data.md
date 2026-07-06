<!-- Generated: 2026-07-06 | Scanned models: 18 | Token estimate: ~350 -->
# Database Schema & Models Map

The database is built on PostgreSQL utilizing the `django-tenants` package to support schema-level multi-tenancy.

## Schema Partitioning
- **Public Schema (`public`)**: Holds shared saas configuration.
  - `saas_admin.Client` (stores tenant definitions: name, schema_name, paid_until)
  - `saas_admin.Domain` (stores domain-to-tenant mappings: domain, tenant_id)
- **Tenant Schemas (`demo`, etc.)**: Holds all the actual operational records for that college.

## Main Model Relationships (Tenant Schemas)

```
        +--------------+ 1
        |  CustomUser  |<-----------------------+
        +--------------+                        |
               |                                |
               | 1 (admin_id)                   | 1 (admin_id)
               v                                v
       +---------------+                +---------------+
       |    Student    |                |     Staff     |
       +---------------+                +---------------+
          |          |                     |
          | N        | N                   | N
          v          v                     v
   +----------+ +-----------+       +-----------+
   |  Course  | |  Session  |       |  Subject  |
   +----------+ +-----------+       +-----------+
```

## Model Descriptions
- **CustomUser**: The core user authentication model extending Django `AbstractUser` (email, user_type: `1=Admin`, `2=Staff`, `3=Student`, `4=Parent`, gender, profile_pic).
- **Student**: Student-specific profiles (associated with Course and Session). Includes `batch_year` (e.g. 2026), `current_semester` (e.g. 1), and `id_card_code` (unique QR/barcode token).
- **Staff**: Teachers/Employees profiles (associated with Course/Department). Includes `id_card_code` (unique token).
- **Course**: College programs (e.g. Computer Science).
- **Subject**: Course classes (associated with Course and the Staff teaching it).
- **Session**: Academic calendar terms (start_year, end_year).
- **Attendance & AttendanceReport**: Logs student attendance. QR check-in links to these tables.
- **FeeRecord & FeePayment**: Invoices and payments for students.
- **VisitorPass**: Log of visitors requested and HOD approval. Contains `pass_code` verified at security desk.
- **IssuedBook**: Library logs connecting student emails to book ISBNs.
