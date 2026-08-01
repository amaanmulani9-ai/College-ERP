# Enterprise College ERP — Authentication UI Specification

**Version:** v0.20.2-ui-auth-part1  
**Updated:** August 1, 2026  
**Status:** Foundation Delivered & Verified  

---

## 1. Overview

The Enterprise Authentication suite provides a split-screen desktop and responsive mobile experience for institutional portal access. Built using React 19, TypeScript, and Framer Motion, it integrates with existing SimpleJWT and django-tenants backend authentication services without altering backend endpoints.

---

## 2. Directory & Component Structure

```
frontend/src/
├── components/
│   └── auth/
│       ├── AuthCard.tsx             # Glassmorphism container card
│       ├── AuthInput.tsx            # Form input with icons & validation messaging
│       ├── PasswordInput.tsx        # Password field with show/hide toggle
│       ├── SocialButton.tsx         # Google & Microsoft SSO placeholders
│       ├── AuthDivider.tsx          # "or continue with email" separator
│       └── RememberMeCheckbox.tsx   # Persistent session checkbox
├── layouts/
│   └── AuthLayout.tsx               # Split-screen desktop branding & layout
└── pages/
    └── auth/
        ├── LoginPage.tsx            # Primary institutional sign-in page
        ├── RegisterPage.tsx         # Tenant provisioning navigation
        ├── ForgotPasswordPage.tsx    # Password reset request form
        ├── VerifyEmailPage.tsx      # Email verification state page
        ├── AccessDeniedPage.tsx     # 403 RBAC permission denial page
        └── SessionExpiredPage.tsx   # JWT session timeout page
```

---

## 3. Key Design Features

### 3.1 Split-Screen Desktop Layout (`AuthLayout.tsx`)
- **Left Panel:** Institutional branding, platform benefits list, security compliance badges (ISO 27001, Schema Isolation), and system status uptime indicator.
- **Right Panel:** Centered, responsive glassmorphism card supporting light/dark theme switching.

### 3.2 Form Validation & States (`LoginPage.tsx`)
- Client-side email format and password length validation.
- Loading state spinner with disabled button behavior.
- Error banner for invalid credentials.
- Navigation links to `/forgot-password`, `/register`, and back to marketing site `/`.

---

## 4. Verification

- **TypeScript:** 0 type errors (`npx tsc --noEmit`)
- **Build:** Production bundle compiled with `npm run build`
- **Security:** Reuses existing JWT/SimpleJWT and RBAC contracts without altering backend API code.
