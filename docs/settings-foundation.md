# Enterprise Settings Center — Foundation & Architecture (v0.34.0 Part 1)

## Overview

The **Enterprise Settings Center** (`frontend/src/settings/`) provides a centralized, administration hub for all ERP configurations across 27 categories. It consolidates platform-wide preferences, security rules, module parameters, third-party integrations, database backups, and audit logs into a unified, accessible workspace.

---

## Directory & Component Architecture

```
frontend/src/settings/
├── types.ts                   # Data definitions for 27 setting categories, pages, & layout state
├── mockData.ts                # Setting page registry dataset for all 27 categories
├── SettingsContext.tsx        # React Context & hook (`useSettings()`)
├── SettingsProvider.tsx       # State provider managing favorites, pinned items & LocalStorage
├── SettingsSidebar.tsx        # Collapsible category navigation sidebar with quick view decks
├── SettingsToolbar.tsx        # Top control bar with instant search (`Ctrl+,`), grid/list toggle & workspace tab
├── SettingsBreadcrumbs.tsx    # Navigation trail (`Enterprise → Settings Hub → [Category]`)
├── SettingsSearch.tsx         # Instant search modal with code & tag filtering
├── SettingsHome.tsx           # Settings dashboard homepage with stats & page cards
├── SettingsLayout.tsx         # Main layout composer for home overview vs active config forms
├── SettingsPage.tsx           # Top-level route entry point
└── index.ts                   # Master barrel export
```

---

## 27 Supported Setting Categories

1. **General**: Timezone, language, date formats, currency.
2. **Institution**: Accreditation IDs, NAAC/NIRF registration, campus addresses.
3. **Academic**: Semester calendars, credit hour limits, GPA scales.
4. **Users**: Directory account provisioning for staff, faculty, students, parents.
5. **Roles & Permissions**: RBAC permission matrices & role hierarchies.
6. **Authentication**: SAML, OAuth, Google Workspace, Entra ID, 2FA.
7. **Security**: IP whitelisting, CORS origins, API keys, session timeouts.
8. **Notifications**: Twilio SMS, Firebase Push, SMTP email credentials.
9. **Finance**: Chart of accounts, fiscal year, tax rates, bank accounts.
10. **Fees**: Payment gateways (Razorpay, Stripe), late fee rules, installment plans.
11. **Payroll**: Salary bands, PF, ESI deductions, payslip templates.
12. **Library**: Checkout limits, loan periods, overdue fine rates.
13. **Hostel**: Room allocations, warden assignments, mess pricing.
14. **Transport**: Bus route rates, GPS API endpoints, driver rosters.
15. **Inventory**: Warehouses, SKU categories, reorder caps.
16. **Procurement**: Purchase order workflows, vendor ratings.
17. **Assets**: Depreciation rates, QR code tagging, AMC schedules.
18. **HR**: Staff designations, leave policies, appraisal metrics.
19. **Placement**: CGPA cutoffs, company tiers, CTC tracking.
20. **Alumni**: Alumni network portal, donation gateways.
21. **Visitor**: Gate pass printing, host approvals, VIP pre-registration.
22. **AI**: Anthropic/OpenAI API keys, model routing, monthly token caps.
23. **Branding**: Logos, favicon, primary brand colors, custom CSS overrides.
24. **Integrations**: WhatsApp API, Google Classroom, Canvas LMS, Zoom Webhooks.
25. **System**: Cache purge, DB indexing, background worker status.
26. **Audit Logs**: Immutable admin action audit logs, IP access history.
27. **Backups**: AWS S3 backups, PostgreSQL dumps, point-in-time recovery.

---

## Key Shortcuts & Workspace Features

- `Ctrl + ,`: Trigger global settings instant search modal.
- **Starred Favorites**: Quick access deck stored in LocalStorage.
- **Pinned Shortcuts**: Sidebar quick links deck.
- **Workspace Integration**: Open any setting page in a workspace tab.

---

## Verification & Build Compliance

- TypeScript Compilation: Passed with **0 errors** (`npx tsc --noEmit`)
- Vite Production Build: Verified (`npm run build`)
- Git Tag: `v0.34.0-ui-settings-part1`
