# Enterprise College ERP — Authentication Security & UX Specification

**Version:** v0.20.2-ui-final  
**Updated:** August 1, 2026  
**Status:** TASK-UI-002 Complete & Verified  

---

## 1. Executive Security Architecture

The College ERP authentication system provides defense-in-depth protection for institutional tenants, incorporating token expiration management, inactivity timeouts, cross-tab synchronization, and RBAC role verification.

---

## 2. Session Management & Security Policies

### 2.1 Inactivity Timeout & Warning (`SessionTimeoutModal.tsx`)
- **Inactivity Detection:** Listens to mouse movement, keypresses, touches, and scroll events across active windows.
- **Countdown Warning:** Renders a 60-second warning modal before forcing token cleanup.
- **Extend Session Action:** Issues a silent token refresh POST call when the user clicks "Stay Logged In".
- **Immediate Logout:** Clears tokens and redirects on explicit "Logout Now" click or countdown expiry.

### 2.2 Cross-Tab Logout Synchronization
- Uses the Browser `window.addEventListener('storage')` API monitoring the `accessToken` key.
- Clearing tokens in one tab automatically invalidates session state across all open browser tabs simultaneously.

---

## 3. Account Security Features

### 3.1 Security Settings Center (`/profile/security`)
- Displays current device platform, browser version, internal IP address, and active JWT status.
- Audit log tracking recent authentication events (*Success*, *Token Renewed*, *Session Revoked*).

### 3.2 Active Session Control (`/sessions`)
- Displays all authenticated devices with IP addresses and last active timestamps.
- "Terminate All Other Sessions" capability.

### 3.3 Password Change Lifecycle (`/change-password`)
- Verification of current password.
- Live strength meter and 5-point security rule checklist before accepting updates.

---

## 4. Verification & Final Sign-Off

- **TypeScript:** 0 type errors (`npx tsc --noEmit`)
- **Production Build:** Compiled cleanly via `npm run build`
- **Security Compliance:** 100% compliant with zero backend API or JWT mutations.
