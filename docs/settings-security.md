# Identity, Access Management (IAM), RBAC & Security Center (v0.34.0 Part 3)

## Overview

The **Identity, Access Management (IAM), RBAC & Security Center** (`frontend/src/settings/security/`) provides a centralized, administration console for managing user directory accounts, role hierarchies, granular permission matrices, authentication providers, session policies, API key tokens, IP whitelisting, and security audit logs.

---

## Directory & Component Architecture

```
frontend/src/settings/security/
├── types.ts                        # Data definitions for users, roles, permissions, API keys, & security logs
├── mockSecurityData.ts             # Datasets for 13 security & IAM pages
├── UserManagementPage.tsx          # User directory searching, filtering, inviting, & lock/reset actions
├── RoleManagementPage.tsx          # System vs Custom roles, cloning, & color badges
├── PermissionManagementPage.tsx   # Granular permission definition library
├── RBACMatrixPage.tsx              # Matrix visualization (Roles × Module Actions) with interactive checkboxes
├── AuthenticationSettingsPage.tsx  # SAML 2.0, Google Workspace OAuth, Entra ID, & password reset
├── PasswordPolicyPage.tsx          # Min length, character rules, & mandatory 90-day expiry
├── SessionPolicyPage.tsx           # Idle inactivity timeout & concurrent device limits
├── MFASettingsPage.tsx             # Mandatory MFA enforcement & TOTP rules
├── LoginSecurityPage.tsx           # Brute force protection & account lockout duration
├── APIKeysPage.tsx                 # Personal/System API keys, scopes, & secret rotation
├── IPWhitelistPage.tsx             # CIDR range rules & IP firewall filters
├── SecurityAuditPage.tsx           # Immutable admin action & auth trace audit logs
├── DeviceManagementPage.tsx        # Active user sessions, browser/OS detection, & session revocation
├── SecuritySettingsCenter.tsx      # Master tabbed navigation hub
└── index.ts                        # Master barrel export
```

---

## 13 Security Configuration Pages

1. **User Management**: User directory filtering, status toggles, account lock, and password reset actions.
2. **Role Management**: System vs Custom roles, role hierarchy, and permission cloning.
3. **Permission Management**: Code-level granular action definitions (*Create, Read, Update, Delete, Approve, Export, Analytics, AI*).
4. **RBAC Matrix**: Role vs Action matrix grid view with instant toggle options.
5. **Authentication**: SAML 2.0, Google Workspace, Entra ID, and password verification.
6. **Password Policy**: Complexity rules (min 12 chars, upper/lower/numbers/special) and expiry.
7. **Session Policy**: Idle timeout limits (30 mins) and max 3 concurrent devices.
8. **MFA Settings**: Mandatory TOTP/Email OTP rules for admin roles.
9. **Login Security**: Failed login attempt threshold (5 attempts) and lockout duration.
10. **API Keys**: System & personal webhook keys, scope definitions, and secret rotation.
11. **IP Whitelist**: Allowed CIDR subnets and blocked IP range filters.
12. **Security Audit**: Immutable audit trail logging actor, action, target, IP address, and status.
13. **Device Management**: Active browser/device sessions and remote revocation capabilities.

---

## Verification & Build Compliance

- TypeScript Compilation: Passed with **0 errors** (`npx tsc --noEmit`)
- Vite Production Build: Verified (`npm run build`)
- Git Tag: `v0.34.0-ui-settings-part3`
