# Enterprise College ERP — Authentication UI Specification

**Version:** v0.20.2-ui-auth-part3  
**Updated:** August 1, 2026  
**Status:** Backend Integrated & Verified  

---

## 1. Overview

The Enterprise Authentication suite provides a multi-step registration wizard, password strength checking, a 6-digit OTP password recovery flow, and full integration with SimpleJWT backend APIs. It maintains complete frontend independence without altering backend endpoints, JWT handling, or database schemas.

---

## 2. Directory & Component Structure

```
frontend/src/
├── api/ & services/
│   └── authService.ts              # Axios interceptors, configurable storage & API client
├── context/
│   └── AuthContext.tsx             # React Context for user, roles, permissions & session
├── components/
│   └── auth/
│       ├── AuthCard.tsx              # Glassmorphism card container
│       ├── AuthInput.tsx             # Standard input field
│       ├── PasswordInput.tsx         # Password field with visibility toggle
│       ├── SocialButton.tsx          # Google/Microsoft SSO buttons
│       ├── AuthDivider.tsx font      # Visual form separator
│       ├── RememberMeCheckbox.tsx    # Remember me toggle
│       ├── RegistrationStepper.tsx   # 4-step wizard progress header
│       ├── PasswordStrengthMeter.tsx # Visual strength indicator
│       ├── PasswordChecklist.tsx     # 5-point password rule checklist
│       ├── OTPInput.tsx              # 6-digit numeric OTP input
│       ├── CountdownTimer.tsx        # Resend countdown timer
│       ├── SuccessCard.tsx           # Check-animated completion card
│       ├── AuthAlert.tsx             # Error/Success alert banners
│       ├── ProtectedRoute.tsx        # Authenticated route guard
│       ├── PublicRoute.tsx           # Guest-only route guard
│       └── RoleRoute.tsx             # RBAC role guard
├── layouts/
│   └── AuthLayout.tsx                # Split-screen branding layout
└── pages/
    └── auth/
        ├── LoginPage.tsx             # Primary login page
        ├── RegisterPage.tsx          # 4-Step Registration Wizard
        ├── ForgotPasswordPage.tsx    # Multi-Stage Recovery Flow
        ├── VerifyEmailPage.tsx       # Email verification page
        ├── AccessDeniedPage.tsx      # HTTP 403 Access Denied page
        └── SessionExpiredPage.tsx    # Session Timeout page
```

---

## 3. Verification & Quality Gate

- **TypeScript:** 0 type errors (`npx tsc --noEmit`)
- **Production Build:** Compiled cleanly via `npm run build`
- **Session Restoring:** Verified on browser refresh
- **Role Routing:** Configured for all 14 RBAC user personas
