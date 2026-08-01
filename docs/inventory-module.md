# Enterprise Inventory & Store Management System — Architecture & Specification

**Version:** v0.25.0  
**Updated:** August 1, 2026  
**Module:** `backend/apps/inventory/` & `frontend/src/pages/inventory/`

---

## 1. Overview

The Enterprise Inventory & Store Management System provides complete institutional stock lifecycle control across categories, warehouses, suppliers, item catalogs, quantity tracking, stock movements (Receive, Issue, Transfer, Adjust, Return), purchase requisitions, goods receipt notes (GRN), reorder alerts, stock valuation, and audit logging.

---

## 2. Backend Architecture (`backend/apps/inventory/`)

### Data Models
- **Category:** Taxonomy hierarchy (`category_code`, `category_name`, `parent_category`).
- **Warehouse:** Physical stores & department stockrooms (`warehouse_code`, `warehouse_name`, `location`, `manager`).
- **Supplier:** Vendor directory (`supplier_code`, `company_name`, `contact_person`, `gst_number`, `phone`, `email`).
- **InventoryItem:** Item catalog (`item_code`, `item_name`, `unit`, `sku`, `barcode`, `min_stock`, `reorder_level`, `status`).
- **ItemStock:** Quantity balances & valuation (`quantity_on_hand`, `reserved_quantity`, `available_quantity`, `average_cost`).
- **StockMovement:** Audit trail of all receipts, disbursements, transfers & returns.
- **PurchaseRequest & PurchaseRequestItem:** Departmental store requisitions (`request_number`, `department`, `requested_by`, `status`).
- **GoodsReceipt:** Verified vendor delivery notes (`grn_number`, `supplier`, `received_date`).
- **IssueVoucher & IssueItem:** Disbursed item vouchers to departments.
- **ReturnVoucher & ReturnItem:** Item returns back into store stock.
- **StockAdjustment:** Stock count reconciliations & write-offs.
- **ReorderRule & StockAudit & InventoryAuditLog:** Threshold alerts & system audit logs.

### Service Layer (`services/inventory_service.py`)
- `create_item()`, `receive_stock()`, `issue_stock()`, `get_inventory_dashboard_kpis()`, `log_audit_event()`.

### REST API Endpoints (`/api/inventory/`)
- `/api/inventory/categories/`
- `/api/inventory/warehouses/`
- `/api/inventory/suppliers/`
- `/api/inventory/items/` (with `/receive_stock/` & `/issue_stock/` actions)
- `/api/inventory/stocks/`
- `/api/inventory/movements/`
- `/api/inventory/purchase-requests/`
- `/api/inventory/goods-receipts/`
- `/api/inventory/issue-vouchers/`
- `/api/inventory/return-vouchers/`
- `/api/inventory/adjustments/`
- `/api/inventory/reorder-rules/`
- `/api/inventory/audit-logs/`
- `/api/inventory/dashboard/kpis/`
- `/api/inventory/reports/`

---

## 3. Frontend Pages (`frontend/src/pages/inventory/`)

Built strictly using the Enterprise Design System (`@/design-system`):
- `InventoryDashboardPage.tsx` — KPI summary cards, catalog items, stock valuation, reorder warnings.
- `CategoryPage.tsx` — Category taxonomy & sub-categories.
- `WarehousePage.tsx` — Institutional warehouse stores & physical locations.
- `SupplierPage.tsx` — Approved vendor directory & GST details.
- `InventoryItemsPage.tsx` — Item master catalog & safety stock thresholds.
- `StockPage.tsx` — Real-time live quantity balances & unit valuation.
- `PurchaseRequestPage.tsx` — Departmental purchase requisitions & approval tracking.
- `GoodsReceiptPage.tsx` — Goods Receipt Notes (GRN) & physical verification.
- `IssueVoucherPage.tsx` — Departmental stock disbursements.
- `ReturnVoucherPage.tsx` — Store returns & item condition logging.
- `StockAdjustmentPage.tsx` — Reconciliations & stock write-offs.
- `ReorderAlertsPage.tsx` — Automated low-stock alerts & PR triggers.
- `ReportsPage.tsx` — Valuation reports, warehouse audits & movement logs.

---

## 4. Verification & Testing

- **Backend Pytest:** `tests/test_inventory.py` ➔ **All 7 tests passed (100%)**
- **TypeScript Audit:** `npx tsc --noEmit` ➔ **0 Errors**
- **Production Build:** `npm run build` ➔ **Clean Vite production build**
