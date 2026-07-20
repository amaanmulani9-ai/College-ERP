<!-- Generated: 2026-07-06 | Files scanned: 120 | Token estimate: ~300 -->
# High-Level Architecture Map

This project is a multi-tenant College ERP (Enterprise Resource Planning) platform built with a Django SaaS backend, a web frontend, and a mobile application client.

## System Diagram (Docker Services)

```
        +----------------------------------------+
        |                 NGINX                  | (Port 80)
        +----------------------------------------+
                            |
           +----------------+----------------+
           |                                 |
           v                                 v
+---------------------+            +--------------------+
|   Django Web App    |            |      Keycloak      | (OIDC Auth, Port 8080)
|  (Gunicorn, Port 80)|            +--------------------+
+---------------------+
     |      |      |
     |      |      +--------+
     |      |               |
     v      v               v
+--------+ +-------------+ +--------------------+
|  Redis | | PostgreSQL  | |   Other Services   |
| (6379) | | (15, 5432)  | | - MinIO (S3, 9000) |
+--------+ +-------------+ | - Meilisearch (7700)
                           | - Ollama (LLM, 11434)
                           | - Chromadb (8001)
                           +--------------------+
```

## Service Boundaries & Routing
- **Reverse Proxy**: NGINX routes traffic on Port 80 to the Django application and maps statics/media.
- **Authentication**: Keycloak manages OIDC single sign-on (SSO) authentication. Django uses `mozilla-django-oidc` middleware to verify tokens.
- **Caching**: Redis is utilized for cache storage, Django cache sessions, and as the message broker for Celery tasks.
- **Database**: PostgreSQL 15 stores shared metadata (public schema) and individual college tenant databases (demo, etc.) using schema isolation.

## Data Flow (Multi-Tenant)
1. User sends request to `http://localhost:8000/`.
2. NGINX forwards headers to Django.
3. Django Tenant Middleware (`django_tenants.middleware.main.TenantMainMiddleware`) intercepts the host name (`localhost`).
4. Django queries `saas_admin.Domain` in the `public` schema to match the tenant (`demo` tenant schema).
5. Connections are dynamically routed to the matching PostgreSQL schema.
