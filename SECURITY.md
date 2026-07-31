# Security Policy

## 1. Reporting Security Vulnerabilities

If you discover a security vulnerability within the Enterprise College ERP platform, please **DO NOT** open a public issue. Instead, send an email to `security@college-erp.org` or notify the repository maintainers directly.

We review all security reports within **24 hours** and aim to release a patch within **7 business days**.

---

## 2. Supported Versions

| Version | Supported | Security Updates |
| :--- | :---: | :--- |
| `v0.8.x` | Yes | Active security support |
| `< v0.8.0` | No | Upgrade required |

---

## 3. Security Architecture Overview

### Authentication Security:
- **JWT (SimpleJWT)**: Access tokens (5 min lifetime) & Refresh tokens (24 hours lifetime) with token rotation & blacklisting.
- **Brute Force Lockout**: 5 consecutive failed login attempts trigger an automated **15-minute account lockout**.

### Role-Based Access Control (RBAC):
- Fine-grained permission evaluations performed at the view layer using custom DRF permission classes (`RequirePermission`, `RequireRole`).
- Permission evaluation results are cached in Redis under tenant-isolated keys (`rbac:<tenant_schema>:user:<user_id>:permissions`).

### Multi-Tenant Isolation:
- Schema-level PostgreSQL separation via `django-tenants`.
- Cross-tenant queries are blocked at the database connection routing layer.

### Secret Management:
- Environment variables (`.env`) strictly control database credentials, secret keys, and API tokens. `.env` files are excluded from Git version control.
