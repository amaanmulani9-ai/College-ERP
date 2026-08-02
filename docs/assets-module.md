# Enterprise Asset Management System (apps/assets)

## Executive Summary

The **Enterprise Asset Management System** provides comprehensive end-to-end fixed asset management for higher education institutions. The system supports tracking of institutional assets such as computers, laboratory equipment, furniture, projectors, printers, vehicles, AC units, biometric devices, and networking gear across their complete lifecycle:

```
Procurement → Allocation → Maintenance → Transfer → Audit → Disposal
```

---

## Architecture & Reused Domain Models

The module is built with clean Django multi-tenant architecture and DRF service layers while reusing existing domain models:
- **`InventoryItem` & `Supplier`**: From `apps.inventory.models`
- **`Department`**: From `apps.academics.models`
- **`Employee`**: From `apps.staff.models`
- **`Student`**: From `apps.students.models`

---

## Data Models Summary (`apps/assets/models.py`)

| Model | Description |
|-------|-------------|
| `AssetCategory` | Classification with useful life defaults & depreciation method (Straight Line / WDV). |
| `Asset` | Master fixed asset entity with serial number, barcode, QR code, valuation, and status. |
| `AssetAllocation` | Custody assignment to Employees, Departments, Labs, Classrooms, or Students. |
| `AssetTransfer` | Inter-departmental transfer requests and approval workflow. |
| `AssetMaintenance` | Preventive, Corrective, and Emergency service records with vendor & cost logs. |
| `MaintenanceVendor` | External service provider & AMC status directory. |
| `MaintenanceSchedule` | Recurring preventive maintenance calendar & due dates. |
| `Warranty` | OEM warranty card, provider, coverage terms, and expiry monitor. |
| `AssetDepreciation` | Financial book value calculation ledger (Straight Line & Written Down Value). |
| `AssetAudit` | Physical departmental inventory verification audit & missing asset flagging. |
| `AssetDisposal` | Decommissioning & disposal workflow via Auction, Scrap, or Donation. |
| `AssetIncident` | Damage, loss, theft, and repair incident reporting. |
| `AssetDocument` | Document attachments (Invoices, Warranty Cards, AMC Agreements, Service Reports). |
| `QRCodeLabel` | SVG / JSON payload QR tags and printable label data. |
| `AssetAuditLog` | System audit trail tracking all asset state mutations. |

---

## Core Service API (`apps/assets/services/asset_service.py`)

- `AssetService.register_asset(data, performed_by)`
- `AssetService.allocate_asset(asset_id, allocation_data, performed_by)`
- `AssetService.return_asset(allocation_id, return_data, performed_by)`
- `AssetService.transfer_asset(asset_id, transfer_data, performed_by)`
- `AssetService.schedule_maintenance(asset_id, maintenance_data, performed_by)`
- `AssetService.complete_maintenance(maintenance_id, completion_data, performed_by)`
- `AssetService.calculate_depreciation(asset_id, method, annual_percentage, performed_by)`
- `AssetService.perform_audit(audit_data, performed_by)`
- `AssetService.dispose_asset(asset_id, disposal_data, performed_by)`
- `AssetService.log_incident(asset_id, incident_data, performed_by)`
- `AssetService.soft_delete_asset(asset_id, performed_by)`

---

## REST Endpoints (`/api/assets/`)

- `/api/assets/categories/` — Asset Category CRUD
- `/api/assets/items/` — Asset Register CRUD (`/allocate/`, `/transfer/`, `/schedule_maintenance/`, `/calculate_depreciation/`, `/dispose/`, `/log_incident/`, `/qr_label/`)
- `/api/assets/allocations/` — Asset Allocations (`/return_asset/`)
- `/api/assets/transfers/` — Asset Transfers
- `/api/assets/maintenances/` — Asset Maintenance (`/complete/`)
- `/api/assets/vendors/` — Maintenance Vendors
- `/api/assets/schedules/` — Maintenance Schedules
- `/api/assets/warranties/` — Asset Warranties
- `/api/assets/depreciations/` — Financial Depreciation (`/calculate_all/`)
- `/api/assets/audits/` — Physical Asset Verification Audits
- `/api/assets/disposals/` — Decommissioning & Disposals
- `/api/assets/incidents/` — Damage & Loss Incidents
- `/api/assets/documents/` — Asset Documents
- `/api/assets/qr-labels/` — QR Printable Tags
- `/api/assets/dashboard/kpis/` — Asset Dashboard KPIs
- `/api/assets/reports/` — Comprehensive Asset Reports Suite

---

## Frontend Navigation & Pages (`frontend/src/pages/assets/`)

1. **`AssetsDashboardPage.tsx`** — Dashboard KPIs, quick action cards, and asset catalog table.
2. **`AssetCategoryPage.tsx`** — Categories, useful life terms, and depreciation defaults.
3. **`AssetsPage.tsx`** — Master asset register list and detail modals.
4. **`AllocationPage.tsx`** — Active allocations and return processing.
5. **`TransferPage.tsx`** — Inter-departmental transfer requests.
6. **`MaintenancePage.tsx`** — Maintenance logs, service dates, and AMC vendor tracking.
7. **`WarrantyPage.tsx`** — Warranty card registry and expiration alerts.
8. **`DepreciationPage.tsx`** — Straight Line & WDV depreciation calculator and ledger.
9. **`AuditPage.tsx`** — Physical inventory audits and auditor sign-off.
10. **`DisposalPage.tsx`** — Auction, Scrap, and Donation disposals.
11. **`IncidentsPage.tsx`** — Damage, loss, and theft incident reporting.
12. **`QRLabelsPage.tsx`** — QR Code & Barcode printable tag generator.
13. **`ReportsPage.tsx`** — Full asset reporting suite.

---

## Verification & Compliance

- **Backend Unit & Integration Tests**: `pytest tests/test_assets.py`
- **Frontend Type Safety**: `npx tsc --noEmit`
- **Frontend Production Build**: `npm run build`
