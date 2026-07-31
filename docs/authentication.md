# Enterprise Authentication & Identity Management Documentation

## 1. Overview & Architecture

The **College ERP Authentication & Identity System** delivers secure, multi-tenant authentication using **Django REST Framework (DRF)**, **SimpleJWT**, and custom user models (`authentication.User`).

Each college tenant maintains independent user databases in its dedicated PostgreSQL schema. Cross-tenant authentication is strictly prevented at the schema isolation layer.

---

## 2. Custom User Model

Primary Identifier: `email` (unique per tenant).

### Model Schema Attributes (`apps/authentication/models.py`)
- `id`: UUID Primary Key (`uuid.uuid4`)
- `email`: Normalized Email Address (Unique)
- `username`: Optional display handle
- `first_name`, `last_name`, `phone_number`
- `profile_photo`, `date_of_birth`, `gender`
- `preferred_language` (default: `"en"`), `time_zone` (default: `"UTC"`)
- `is_email_verified` (Boolean)
- `failed_login_attempts` (Counter for account lockout)
- `lockout_until` (Timestamp threshold for account lockout)
- `is_active`, `is_staff`, `is_superuser`
- `created_at`, `updated_at`

---

## 3. JWT Token Lifecycle

Authentication utilizes **JSON Web Tokens (JWT)**:

- **Access Token**: Short-lived (60 minutes). Included in `Authorization: Bearer <token>` HTTP headers.
- **Refresh Token**: Long-lived (7 days). Used to issue new access tokens via `/api/auth/token/refresh/`.
- **Token Rotation & Blacklisting**: On refresh or logout (`/api/auth/logout/`), the old refresh token is immediately blacklisted in the `token_blacklist` database table.

---

## 4. Email Verification & Password Reset Flows

### Email Verification Flow
1. User registers via `POST /api/auth/register/`.
2. A cryptographically random URL token (`TokenRecord`) is created.
3. System dispatches verification email to `user.email`.
4. User clicks link and posts token to `POST /api/auth/verify-email/`.
5. `user.is_email_verified` transitions to `True`.

### Password Reset Flow
1. User requests reset via `POST /api/auth/forgot-password/` providing email.
2. System issues a 1-hour expiration token (`TokenRecord`) and dispatches reset email.
3. User submits token and new password to `POST /api/auth/reset-password/`.
4. System validates enterprise password policies and updates user credentials.

---

## 5. Security Policies & Audit Logging

### Enterprise Password Strength Policy (`validators.py`)
- Minimum length: 8 characters
- At least 1 uppercase letter (`A-Z`)
- At least 1 lowercase letter (`a-z`)
- At least 1 numerical digit (`0-9`)
- At least 1 special symbol (`!@#$%^&*...`)

### Account Lockout Protection
- Tracks `failed_login_attempts`.
- After **5 consecutive failed attempts**, the account is locked for **15 minutes** (`lockout_until`).

### Audit Logging (`AuditLog`)
Every security-sensitive operation logs structured audit trails:
- Events logged: `login_success`, `login_failure`, `logout`, `password_change`, `password_reset_request`, `password_reset_confirm`, `email_verified`.
- Captures: `User`, `IP Address`, `User Agent`, `Tenant Schema`, `Timestamp`, `Details`.

---

## 6. API Endpoint Reference

| Endpoint Path | Method | Description | Access Control |
| :--- | :--- | :--- | :--- |
| `/api/auth/register/` | `POST` | Register new user account | Public |
| `/api/auth/login/` | `POST` | Authenticate user & issue JWT tokens | Public |
| `/api/auth/logout/` | `POST` | Blacklist refresh token & logout | Authenticated |
| `/api/auth/token/refresh/` | `POST` | Issue new access token using refresh token | Public |
| `/api/auth/verify-email/` | `POST` | Verify email address using token | Public |
| `/api/auth/forgot-password/` | `POST` | Request password reset token email | Public |
| `/api/auth/reset-password/` | `POST` | Reset password using token | Public |
| `/api/auth/change-password/` | `POST` | Change password for authenticated user | Authenticated |
| `/api/auth/profile/` | `GET / PATCH` | View & update user profile | Authenticated |
