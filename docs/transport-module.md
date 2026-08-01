# Enterprise Transport Management System — Architecture & Specification

**Version:** v0.22.0  
**Updated:** August 1, 2026  
**Module:** `backend/apps/transport/` & `frontend/src/pages/transport/`

---

## 1. Overview

The Enterprise Transport Management System provides educational institutions with end-to-end fleet tracking, bus route and stop management, driver credential oversight, student transport allocations, QR-enabled digital transport passes, vehicle maintenance & fuel logging, daily attendance registers, and safety incident reporting.

---

## 2. Backend Architecture (`backend/apps/transport/`)

### Data Models
- **Vehicle:** Fleet records (`vehicle_code`, `registration_number`, `vehicle_type`, `capacity`, `insurance_expiry`, `fitness_expiry`, `permit_expiry`, `gps_enabled`, `status`). Supports soft deletion.
- **Route:** Bus route definitions (`route_code`, `route_name`, `source`, `destination`, `distance_km`, `estimated_duration_mins`, `is_active`).
- **Stop:** Sequential route stops (`stop_name`, `sequence`, `pickup_time`, `drop_time`, `latitude`, `longitude`).
- **Driver:** Employee driver profile (`license_number`, `license_expiry`, `experience_years`, `medical_expiry`, `status`).
- **VehicleAssignment:** Links `Driver`, `Vehicle`, `Route`, and `AcademicSession`.
- **StudentTransportAllocation:** Student bus allocations with boarding/dropping stops and fee plan.
- **TransportPass:** Digital pass with encrypted QR payload (`qr_code_data`, `expiry_date`, `status`).
- **VehicleMaintenance:** Servicing history, odometer readings, vendor names, and repair costs.
- **FuelLog:** Fuel fill logs, litres, cost, and calculated mileage (km/L).
- **TransportAttendance:** Boarding attendance register (`trip_type`: Morning/Evening, `status`: Boarded/Dropped/Absent).
- **TransportIncident:** Safety & breakdown logs (`category`, `severity`, `description`, `resolved`).
- **TransportAuditLog:** System audit trails.

### Service Layer (`services/transport_service.py`)
- `create_vehicle()`, `allocate_student()`, `assign_route()`, `issue_pass()`, `record_maintenance()`, `record_fuel_entry()`, `mark_attendance()`, `log_incident()`, `soft_delete_vehicle()`, `get_transport_dashboard_kpis()`.

### REST API Endpoints (`/api/transport/`)
- `/api/transport/vehicles/` (CRUD)
- `/api/transport/routes/` (CRUD)
- `/api/transport/stops/` (CRUD)
- `/api/transport/drivers/` (CRUD)
- `/api/transport/assignments/` (CRUD)
- `/api/transport/allocations/` (CRUD)
- `/api/transport/passes/` (Read-only / QR Pass View)
- `/api/transport/maintenance/` (CRUD)
- `/api/transport/fuel-logs/` (CRUD)
- `/api/transport/attendance/` (CRUD)
- `/api/transport/incidents/` (CRUD)
- `/api/transport/dashboard/kpis/` (KPI Summary)
- `/api/transport/reports/` (Vehicle, Fuel, Maintenance, Attendance reports)

---

## 3. Frontend Pages (`frontend/src/pages/transport/`)

Built strictly using the Enterprise Design System (`@/design-system`):
- `TransportDashboardPage.tsx` — Real-time fleet KPIs, compliance expiry warnings, live status
- `VehicleListPage.tsx` — Fleet registry & vehicle registration modal
- `RouteListPage.tsx` — Route path & stop sequence manager
- `DriverListPage.tsx` — Driver profiles & license expiry tracker
- `StudentAllocationPage.tsx` — Student bus seat allocation & fee plan assignment
- `TransportPassesPage.tsx` — Digital bus pass list & QR code modal
- `MaintenanceLogPage.tsx` — Vehicle servicing & repair cost logs
- `FuelLogsPage.tsx` — Fuel fill-up logs & mileage efficiency tracker
- `TransportAttendancePage.tsx` — Morning/Evening bus boarding register
- `IncidentReportsPage.tsx` — Fleet breakdown & incident resolution log

---

## 4. Verification & Testing

- **Backend Pytest:** `tests/test_transport.py` ➔ **All 7 tests passed (100%)**
- **TypeScript Audit:** `npx tsc --noEmit` ➔ **0 Errors**
- **Production Build:** `npm run build` ➔ **Clean Vite build**
