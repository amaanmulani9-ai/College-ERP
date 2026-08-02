import uuid
from decimal import Decimal
from django.db import transaction
from django.db.models import Sum, Count
from apps.procurement.models import (
    PurchaseRequisition,
    PurchaseRequisitionItem,
    QuotationRequest,
    VendorQuotation,
    PurchaseOrder,
    PurchaseOrderItem,
    PurchaseInvoice,
    PurchasePayment,
    VendorContract,
    ProcurementApproval,
    ProcurementAuditLog,
)


class ProcurementService:
    @staticmethod
    def log_audit_event(action: str, performed_by=None, details=None):
        return ProcurementAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {},
        )

    @staticmethod
    @transaction.atomic
    def create_requisition(data: dict, requested_by) -> PurchaseRequisition:
        req = PurchaseRequisition.objects.create(
            requisition_number=data["requisition_number"],
            department_id=data["department_id"],
            requested_by=requested_by,
            priority=data.get("priority", "medium"),
            required_date=data["required_date"],
            status="pending",
        )

        for item_data in data.get("items", []):
            PurchaseRequisitionItem.objects.create(
                requisition=req,
                inventory_item_id=item_data["inventory_item_id"],
                quantity=item_data["quantity"],
                estimated_cost=Decimal(str(item_data.get("estimated_cost", "0.00"))),
                remarks=item_data.get("remarks", ""),
            )

        ProcurementService.log_audit_event("create_requisition", requested_by, {"req_id": str(req.id)})
        return req

    @staticmethod
    @transaction.atomic
    def approve_requisition(requisition_id: str, approver, comments: str = "") -> PurchaseRequisition:
        req = PurchaseRequisition.objects.get(id=requisition_id)
        req.status = "approved"
        req.save()

        ProcurementApproval.objects.create(
            object_type="PurchaseRequisition",
            object_id=requisition_id,
            approver=approver,
            level=1,
            status="approved",
            comments=comments,
        )

        ProcurementService.log_audit_event("approve_requisition", approver, {"req_id": requisition_id})
        return req

    @staticmethod
    @transaction.atomic
    def create_purchase_order(data: dict, performed_by) -> PurchaseOrder:
        po = PurchaseOrder.objects.create(
            po_number=data["po_number"],
            supplier_id=data["supplier_id"],
            purchase_requisition_id=data.get("purchase_requisition_id"),
            quotation_id=data.get("quotation_id"),
            expected_delivery=data["expected_delivery"],
            status="ordered",
        )

        subtotal = Decimal("0.00")
        tax_total = Decimal("0.00")

        for item in data.get("items", []):
            qty = item["quantity"]
            price = Decimal(str(item["unit_price"]))
            tax = Decimal(str(item.get("tax_amount", "0.00")))
            tot = (price * qty) + tax

            PurchaseOrderItem.objects.create(
                purchase_order=po,
                inventory_item_id=item["inventory_item_id"],
                quantity=qty,
                unit_price=price,
                tax_amount=tax,
                total_amount=tot,
            )

            subtotal += price * qty
            tax_total += tax

        po.subtotal = subtotal
        po.tax_total = tax_total
        po.grand_total = subtotal + tax_total
        po.save()

        if po.purchase_requisition:
            po.purchase_requisition.status = "converted"
            po.purchase_requisition.save()

        ProcurementService.log_audit_event("create_purchase_order", performed_by, {"po_id": str(po.id)})
        return po

    @staticmethod
    @transaction.atomic
    def process_invoice(data: dict, performed_by) -> PurchaseInvoice:
        invoice = PurchaseInvoice.objects.create(
            invoice_number=data["invoice_number"],
            supplier_id=data["supplier_id"],
            purchase_order_id=data["purchase_order_id"],
            invoice_date=data["invoice_date"],
            amount=Decimal(str(data["amount"])),
            gst_amount=Decimal(str(data.get("gst_amount", "0.00"))),
            payment_status="unpaid",
        )
        ProcurementService.log_audit_event("process_invoice", performed_by, {"invoice_id": str(invoice.id)})
        return invoice

    @staticmethod
    def get_procurement_dashboard_kpis() -> dict:
        pending_reqs = PurchaseRequisition.objects.filter(status="pending").count()
        total_pos = PurchaseOrder.objects.count()
        active_pos = PurchaseOrder.objects.filter(status="ordered").count()
        open_rfqs = QuotationRequest.objects.filter(status="open").count()
        pending_invoices = PurchaseInvoice.objects.filter(payment_status="unpaid").count()
        active_contracts = VendorContract.objects.filter(status="active").count()

        total_procurement_cost = PurchaseOrder.objects.aggregate(total=Sum("grand_total"))["total"] or Decimal("0.00")
        total_pending_payments = PurchaseInvoice.objects.filter(payment_status="unpaid").aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

        return {
            "pending_requisitions": pending_reqs,
            "total_purchase_orders": total_pos,
            "active_purchase_orders": active_pos,
            "open_rfqs": open_rfqs,
            "pending_invoices": pending_invoices,
            "active_contracts": active_contracts,
            "total_procurement_cost": float(total_procurement_cost),
            "pending_payments": float(total_pending_payments),
        }
