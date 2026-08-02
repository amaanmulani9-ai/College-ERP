# Enterprise Procurement & Purchase Management System — Architecture & Specification

**Version:** v0.26.0  
**Updated:** August 1, 2026  
**Module:** `backend/apps/procurement/` & `frontend/src/pages/procurement/`

---

## 1. Overview

The Enterprise Procurement & Purchase Management System provides complete institutional oversight over material requisitions, multi-tier approvals, RFQ floating, vendor quotations, L1 quotation matrix comparisons, purchase orders, purchase invoices, accounts payable payment tracking, vendor contracts, contract renewals, and procurement spend analytics.

---

## 2. Backend Architecture (`backend/apps/procurement/`)

### Model Integration
Reuses `Supplier`, `GoodsReceipt`, `InventoryItem`, and `Warehouse` from `apps.inventory` and `Department` from `apps.academics`.

### Data Models
- **PurchaseRequisition & PurchaseRequisitionItem:** Material requisitions (`requisition_number`, `department`, `requested_by`, `priority`, `required_date`, `status`).
- **QuotationRequest (RFQ):** Requests for quotation sent to suppliers (`rfq_number`, `issue_date`, `closing_date`, `status`).
- **VendorQuotation:** Bids submitted by vendor suppliers (`quoted_amount`, `delivery_days`, `warranty_months`, `terms`, `status`).
- **QuotationComparison:** L1 evaluation matrix & contract award notes (`winning_supplier`, `comparison_matrix`).
- **PurchaseOrder & PurchaseOrderItem:** Institutional PO generation (`po_number`, `supplier`, `expected_delivery`, `subtotal`, `tax_total`, `grand_total`, `status`).
- **PurchaseInvoice:** Vendor invoices & GST matching (`invoice_number`, `supplier`, `purchase_order`, `invoice_date`, `amount`, `payment_status`).
- **PurchasePayment:** Accounts payable disbursements (`invoice`, `payment_date`, `payment_method`, `reference_number`, `amount`).
- **VendorContract & ContractRenewal:** Vendor SLA contracts & renewal notices (`contract_number`, `supplier`, `start_date`, `end_date`, `status`).
- **ProcurementApproval & ProcurementAuditLog:** Multi-level approval logs & audit trail.

### Service Layer (`services/procurement_service.py`)
- `create_requisition()`, `approve_requisition()`, `create_purchase_order()`, `process_invoice()`, `get_procurement_dashboard_kpis()`, `log_audit_event()`.

### REST API Endpoints (`/api/procurement/`)
- `/api/procurement/requisitions/` (with `/approve/` action)
- `/api/procurement/rfqs/`
- `/api/procurement/quotations/`
- `/api/procurement/comparisons/`
- `/api/procurement/orders/`
- `/api/procurement/invoices/`
- `/api/procurement/payments/`
- `/api/procurement/contracts/`
- `/api/procurement/renewals/`
- `/api/procurement/approvals/`
- `/api/procurement/audit-logs/`
- `/api/procurement/dashboard/kpis/`
- `/api/procurement/reports/`

---

## 3. Frontend Pages (`frontend/src/pages/procurement/`)

Built strictly using the Enterprise Design System (`@/design-system`):
- `ProcurementDashboardPage.tsx` — KPI summary cards, pending requisitions, spend metrics, active POs.
- `PurchaseRequisitionPage.tsx` — Departmental store requisitions & budget allocation.
- `ApprovalPage.tsx` — Multi-tier approval interface for HODs, Finance & Principal.
- `RFQPage.tsx` — Bidding RFQ floatation & deadline tracking.
- `QuotationPage.tsx` — Received vendor bids, warranties & lead times.
- `QuotationComparisonPage.tsx` — L1 price matrix & contract awarding.
- `PurchaseOrderPage.tsx` — Purchase orders generation & fulfillment status.
- `InvoicePage.tsx` — Vendor tax invoice verification & AP matching.
- `PaymentsPage.tsx` — NEFT / RTGS payment disbursements to suppliers.
- `VendorContractsPage.tsx` — Vendor SLA contracts & renewal notices.
- `ReportsPage.tsx` — Departmental spend analytics & supplier audit reports.

---

## 4. Verification & Testing

- **Backend Pytest:** `tests/test_procurement.py` ➔ **All 6 tests passed (100%)**
- **TypeScript Audit:** `npx tsc --noEmit` ➔ **0 Errors**
- **Production Build:** `npm run build` ➔ **Clean Vite production build**
