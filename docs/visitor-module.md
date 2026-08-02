# Enterprise Visitor Management System (apps/visitor)

## Executive Summary

The **Enterprise Visitor Management System** manages campus visitor registrations, Government ID verification, host employee appointments, digital QR code gate passes, entrance/exit timestamps across all campus gates, visitor vehicle registration with parking slot allocation, inward courier delivery tracking, maintenance contractors, priority emergency visitor clearance, restricted area access grants, visitor security blacklists, visitor feedback, security guard shift rosters, and gate analytics reporting.

---

## Data Models Summary (`apps/visitor/models.py`)

| Model | Description |
|-------|-------------|
| `Visitor` | Core visitor profile with Govt ID type/number, photo, company, and soft deletion. |
| `VisitorDocument` | Visitor identity document scans and verification status. |
| `VisitorVehicle` | Visitor vehicle license plate, vehicle type, and assigned parking slot. |
| `VisitPurpose` | Institutional visit purposes (Meeting, Admission Inquiry, Interview, Vendor Visit, etc.). |
| `Appointment` | Scheduled visitor appointments with host staff/faculty and approval statuses. |
| `GatePass` | Digital QR Code gate passes with validity duration and issue timestamps. |
| `EntryExitLog` | Gate check-in and check-out logs recorded by security officers. |
| `Delivery` | Inward courier and parcel delivery tracking for staff and students. |
| `Contractor` | Facility maintenance contractors, supervisors, contract validity, and allowed campus zones. |
| `ContractorPass` | Long-term security passes issued to maintenance contractors. |
| `EmergencyVisitor` | Priority access clearance for ambulances, police, fire units, and government officials. |
| `RestrictedAreaAccess` | Temporary high-security access grants for server rooms and laboratories. |
| `VisitorBlacklist` | Security blacklist records blocking high-risk individuals from campus entry. |
| `VisitorFeedback` | Visitor experience ratings and comments. |
| `SecurityOfficer` | Campus security guard shifts, assigned gates, and duty rosters. |
| `VisitorNotification` | SMS and Email notification logs sent to visitors and host employees. |
| `VisitorAuditLog` | Comprehensive security audit log for visitor operations. |

---

## Core Service API (`apps/visitor/services/visitor_service.py`)

- `VisitorService.register_visitor(data, performed_by)`
- `VisitorService.create_appointment(data, performed_by)`
- `VisitorService.approve_appointment(appointment_id, performed_by)`
- `VisitorService.generate_gate_pass(visitor_id, appointment_id, expiry_hours, performed_by)`
- `VisitorService.check_in_visitor(visitor_id, gate, gate_pass_id, remarks, performed_by)`
- `VisitorService.check_out_visitor(log_id, performed_by)`
- `VisitorService.bulk_check_out(performed_by)`
- `VisitorService.register_vehicle(data, performed_by)`
- `VisitorService.log_delivery(data, performed_by)`
- `VisitorService.manage_contractor(data, performed_by)`
- `VisitorService.blacklist_visitor(visitor_id, reason, performed_by)`
- `VisitorService.is_blacklisted(visitor_id)`
- `VisitorService.compute_dashboard_kpis()`
- `VisitorService.soft_delete_visitor(visitor_id, performed_by)`

---

## REST Endpoints (`/api/visitor/`)

- `/api/visitor/visitors/` — Visitor Profiles
- `/api/visitor/documents/` — Visitor Documents
- `/api/visitor/vehicles/` — Visitor Vehicles
- `/api/visitor/purposes/` — Visit Purposes
- `/api/visitor/appointments/` — Visitor Appointments (`/approve/`)
- `/api/visitor/gate-passes/` — Digital QR Gate Passes
- `/api/visitor/logs/` — Entry / Exit Logs (`/check_in/`, `/check_out/`, `/bulk_checkout/`)
- `/api/visitor/deliveries/` — Courier Deliveries
- `/api/visitor/contractors/` — Maintenance Contractors
- `/api/visitor/contractor-passes/` — Contractor Passes
- `/api/visitor/emergency-visitors/` — Emergency Visitor Logs
- `/api/visitor/restricted-access/` — Restricted Area Access Grants
- `/api/visitor/blacklist/` — Visitor Blacklist Records
- `/api/visitor/feedbacks/` — Visitor Feedback Ratings
- `/api/visitor/security-officers/` — Security Guard Roster
- `/api/visitor/notifications/` — Visitor Notifications
- `/api/visitor/audit-logs/` — Security Audit Logs
- `/api/visitor/dashboard/kpis/` — Security & Visitor Dashboard KPIs
- `/api/visitor/reports/` — Security Reports Suite

---

## Frontend Navigation & Pages (`frontend/src/pages/visitor/`)

1. **`VisitorDashboardPage.tsx`** — Command center KPIs, quick action security hubs, and live activity feed.
2. **`VisitorsPage.tsx`** — Visitor directory, company details, and Govt ID verification.
3. **`AppointmentsPage.tsx`** — Visitor appointment scheduling and host employee approvals.
4. **`GatePassPage.tsx`** — Digital QR gate pass generation and pass status tracking.
5. **`EntryExitPage.tsx`** — Gate entry & exit timestamps and security officer logs.
6. **`VehiclePage.tsx`** — Visitor vehicle registry and campus parking slot allocations.
7. **`DeliveryPage.tsx`** — Courier delivery parcel inward log and recipient tracking.
8. **`ContractorPage.tsx`** — Maintenance contractors, supervisors, and zone permissions.
9. **`EmergencyVisitorsPage.tsx`** — Priority ambulance, police, and fire emergency entry log.
10. **`BlacklistPage.tsx`** — Blocked visitor directory and security risk alerts.
11. **`FeedbackPage.tsx`** — Visitor hospitality ratings and feedback comments.
12. **`SecurityOfficersPage.tsx`** — Guard rosters, shifts, and assigned gate duties.
13. **`ReportsPage.tsx`** — Security & Visitor Reports suite (Daily Visitors, Dept Visits, Gate Activity, Deliveries, Contractors, Security Roster, Blacklist).

---

## Verification & Compliance

- **Backend Unit & Integration Tests**: `venv\Scripts\python.exe -m pytest tests/test_visitor.py`
- **TypeScript Type Checker**: `npx tsc --noEmit`
- **Frontend Production Build**: `npm run build`
