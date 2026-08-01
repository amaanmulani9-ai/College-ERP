# Enterprise College ERP — Authentication UI Specification

**Version:** v0.20.2-ui-auth-part2  
**Updated:** August 1, 2026  
**Status:** Registration Wizard & Password Recovery Flow Complete  

---

## 1. Overview

The Enterprise Authentication suite provides a multi-step registration wizard, password strength checking, and a 6-digit OTP password recovery flow. It maintains complete frontend independence without altering backend endpoints, JWT handling, or database schemas.

---

## 2. Directory & Component Structure

```
frontend/src/
├── components/
│   └── auth/
│       ├── AuthCard.tsx              # Glassmorphism card container
│       ├── AuthInput.tsx             # Standard input field
│       ├── PasswordInput.tsx         # Password field with visibility toggle
│       ├── SocialButton.tsx          # Google/Microsoft SSO buttons
│       ├── AuthDivider.tsx           # Visual form separator
│       ├── RememberMeCheckbox.tsx    # Remember me toggle
│       ├── RegistrationStepper.tsx   # 4-step wizard progress header
│       ├── PasswordStrengthMeter.tsx # Visual strength indicator (Weak, Fair, Strong, Excellent)
│       ├── PasswordChecklist.tsx     # 5-point password rule checklist
│       ├── OTPInput.tsx              # 6-digit numeric OTP input (auto-focus, paste support)
│       ├── CountdownTimer.tsx        # Resend countdown timer
│       ├── SuccessCard.tsx           # Check-animated completion card
│       └── AuthAlert.tsx             # Error/Success alert banners
├── layouts/
│   └── AuthLayout.tsx                # Split-screen branding layout
└── pages/
    └── auth/
        ├── LoginPage.tsx             # Primary login page
        ├── RegisterPage.tsx          # 4-Step Registration Wizard (Personal, Institution, Security, Review)
        ├── ForgotPasswordPage.tsx    # Multi-Stage Recovery Flow (Email -> OTP -> New Password -> Success)
        ├── VerifyEmailPage.tsx       # Email verification page
        ├── AccessDeniedPage.tsx      # HTTP 403 Access Denied page
        └── SessionExpiredPage.tsx    # Session Timeout page
```

---

## 3. Key Flows (Part 2 Additions)

### 3.1 Registration Wizard (`RegisterPage.tsx`)
- **Step 1 (Personal):** First Name, Last Name, Email, Mobile Number.
- **Step 2 (Institution):** Tenant Selection, RBAC Role Selection, Department, Terms & Privacy Acceptance.
- **Step 3 (Security):** Create Password, Password Strength Meter, Password Checklist, Confirm Password.
- **Step 4 (Review & Submit):** Account Summary Review & `SuccessCard` confirmation.

### 3.2 Password Recovery Flow (`ForgotPasswordPage.tsx`)
- **Stage 1 (Email):** Institutional email input.
- **Stage 2 (OTP Verification):** 6-digit auto-advancing `OTPInput` with `CountdownTimer` and resend handler.
- **Stage 3 (New Password):** Create new password with rule checklist and validation.
- **Stage 4 (Success):** Confirmation card with direct link back to `/login`.

---

## 4. Verification & Quality Gate

- **TypeScript:** 0 type errors (`npx tsc --noEmit`)
- **Production Build:** Compiled cleanly via `npm run build`
