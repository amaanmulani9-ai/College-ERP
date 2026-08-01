# Enterprise College ERP — Authentication Architecture & API Flow Specification

**Version:** v0.20.2-ui-final  
**Updated:** August 1, 2026  
**Status:** Complete & Production Ready  

---

## 1. Authentication Architecture Overview

The College ERP authentication layer implements OAuth2/JWT token-based authentication integrated with PostgreSQL schema-isolated multi-tenancy and Django REST Framework RBAC permissions.

---

## 2. Token Lifecycle & Storage Policy

### 2.1 Configurable Token Storage (`tokenStorage`)
- **Remember Me Enabled:** Access & Refresh tokens stored in `localStorage`.
- **Remember Me Disabled:** Access & Refresh tokens stored in `sessionStorage`.
- **Security Constraint:** Passwords and secrets are never stored client-side.

### 2.2 Token Interception & Silent Refresh (`axiosClient`)
- **Authorization Header:** All outgoing requests automatically attach `Authorization: Bearer <accessToken>`.
- **401 Unauthorized Interceptor:** Intercepts 401 response status codes and queues concurrent requests while issuing a single refresh POST to `/api/auth/token/refresh/`.
- **Retry Mechanism:** Upon successful token renewal, queued requests are retried once.
- **Unauthorized Event Broadcast:** If token refresh fails or refresh token is missing, token storage is cleared and an `auth:unauthorized` event triggers redirect to `/login`.

---

## 3. Session Timeout & Inactivity Protocol

- **Inactivity Warning:** Listens to user interactions and displays a 60-second modal before token revocation.
- **Cross-Tab Sync:** Monitors storage events to broadcast logout actions across all open browser tabs.

---

## 4. Role-Based Redirect Mapping

| User Role | Default Landing Route |
|:---|:---|
| **Super Admin** | `/dashboard` |
| **College Admin / Admin** | `/dashboard` |
| **Principal** | `/dashboard` |
| **HOD** | `/dashboard` |
| **Teacher / Faculty** | `/dashboard` |
| **Student** | `/dashboard` |
| **Parent** | `/dashboard` |
| **Accountant / Finance** | `/dashboard` |
| **Librarian** | `/library` |
| **Hostel Warden** | `/hostel` |
| **Staff** | `/dashboard` |
