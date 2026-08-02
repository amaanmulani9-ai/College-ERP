"""
Enterprise Asset Management System Service Layer
=================================================
Core business logic for Asset registration, allocation, transfer,
maintenance, depreciation calculation, physical audit, disposal,
incident logging, QR label generation, and audit logging.
"""

import decimal
import datetime
import json
from django.db import transaction
from django.utils import timezone
from apps.assets.models import (
    AssetCategory,
    Asset,
    AssetAllocation,
    AssetTransfer,
    AssetMaintenance,
    MaintenanceSchedule,
    Warranty,
    AssetDepreciation,
    AssetAudit,
    AssetDisposal,
    AssetIncident,
    QRCodeLabel,
    AssetAuditLog,
)


class AssetService:
    @staticmethod
    def log_audit(action, performed_by=None, details=None):
        """Creates an audit log entry for asset actions."""
        return AssetAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {}
        )

    @staticmethod
    def generate_qr_payload(asset):
        """Generates JSON QR payload string and printable label placeholder for an asset."""
        payload = {
            "asset_code": asset.asset_code,
            "asset_name": asset.asset_name,
            "category": asset.category.category_name if asset.category else "",
            "location": asset.location,
            "purchase_date": str(asset.purchase_date),
            "purchase_cost": str(asset.purchase_cost),
        }
        json_payload = json.dumps(payload)
        printable_label = (
            f"=== ASSET TAG ===\n"
            f"CODE: {asset.asset_code}\n"
            f"NAME: {asset.asset_name}\n"
            f"CAT: {asset.category.category_name if asset.category else 'N/A'}\n"
            f"LOC: {asset.location}\n"
            f"PAYLOAD: {json_payload}\n"
            f"================="
        )
        return json_payload, printable_label

    @classmethod
    @transaction.atomic
    def register_asset(cls, data, performed_by=None):
        """Registers a new fixed asset, generates QR label and writes audit log."""
        purchase_cost = decimal.Decimal(str(data.get("purchase_cost", "0.00")))
        current_value = decimal.Decimal(str(data.get("current_value", str(purchase_cost))))

        asset = Asset.objects.create(
            asset_code=data["asset_code"],
            asset_name=data["asset_name"],
            inventory_item_id=data.get("inventory_item_id"),
            category_id=data["category_id"],
            serial_number=data.get("serial_number", ""),
            barcode=data.get("barcode", f"BAR-{data['asset_code']}"),
            purchase_date=data.get("purchase_date", timezone.now().date()),
            purchase_cost=purchase_cost,
            current_value=current_value,
            location=data.get("location", "Main Store"),
            department_id=data.get("department_id"),
            supplier_id=data.get("supplier_id"),
            status=data.get("status", "Available"),
        )

        qr_payload, printable_label = cls.generate_qr_payload(asset)
        asset.qr_code = qr_payload
        asset.save(update_fields=["qr_code"])

        QRCodeLabel.objects.create(
            asset=asset,
            qr_payload=qr_payload,
            printable_label=printable_label
        )

        # Optional initial warranty setup
        warranty_no = data.get("warranty_number")
        if warranty_no:
            Warranty.objects.create(
                asset=asset,
                warranty_number=warranty_no,
                provider=data.get("warranty_provider", "Manufacturer"),
                start_date=data.get("warranty_start", asset.purchase_date),
                end_date=data.get("warranty_end", asset.purchase_date + datetime.timedelta(days=365)),
                coverage=data.get("warranty_coverage", "Full Parts and Service"),
                status="Active"
            )

        cls.log_audit(
            action=f"REGISTER_ASSET: {asset.asset_code}",
            performed_by=performed_by,
            details={"asset_id": str(asset.id), "asset_name": asset.asset_name, "cost": str(purchase_cost)}
        )

        return asset

    @classmethod
    @transaction.atomic
    def allocate_asset(cls, asset_id, allocation_data, performed_by=None):
        """Allocates an asset to an Employee, Department, Lab, Classroom, or Student."""
        asset = Asset.objects.get(id=asset_id)
        if asset.status in ["Disposed", "Lost"]:
            raise ValueError(f"Cannot allocate asset with status '{asset.status}'.")

        allocation = AssetAllocation.objects.create(
            asset=asset,
            allocated_to_type=allocation_data.get("allocated_to_type", "Employee"),
            employee_id=allocation_data.get("employee_id"),
            department_id=allocation_data.get("department_id"),
            student_id=allocation_data.get("student_id"),
            allocated_location=allocation_data.get("allocated_location", asset.location),
            allocation_date=allocation_data.get("allocation_date", timezone.now().date()),
            expected_return=allocation_data.get("expected_return"),
            status="Active",
            remarks=allocation_data.get("remarks", "")
        )

        asset.status = "Allocated"
        if allocation_data.get("allocated_location"):
            asset.location = allocation_data["allocated_location"]
        asset.save(update_fields=["status", "location"])

        cls.log_audit(
            action=f"ALLOCATE_ASSET: {asset.asset_code}",
            performed_by=performed_by,
            details={"allocation_id": str(allocation.id), "type": allocation.allocated_to_type}
        )

        return allocation

    @classmethod
    @transaction.atomic
    def return_asset(cls, allocation_id, return_data, performed_by=None):
        """Processes asset return from allocation."""
        allocation = AssetAllocation.objects.get(id=allocation_id)
        allocation.actual_return = return_data.get("actual_return", timezone.now().date())
        allocation.status = "Returned"
        if "remarks" in return_data:
            allocation.remarks += f"\nReturn Note: {return_data['remarks']}"
        allocation.save()

        asset = allocation.asset
        asset.status = "Available"
        asset.save(update_fields=["status"])

        cls.log_audit(
            action=f"RETURN_ASSET: {asset.asset_code}",
            performed_by=performed_by,
            details={"allocation_id": str(allocation.id)}
        )

        return allocation

    @classmethod
    @transaction.atomic
    def transfer_asset(cls, asset_id, transfer_data, performed_by=None):
        """Initiates an inter-departmental transfer request."""
        asset = Asset.objects.get(id=asset_id)
        transfer = AssetTransfer.objects.create(
            asset=asset,
            from_department_id=transfer_data["from_department_id"],
            to_department_id=transfer_data["to_department_id"],
            approved_by=performed_by,
            transfer_date=transfer_data.get("transfer_date", timezone.now().date()),
            reason=transfer_data.get("reason", "Inter-department transfer"),
            status=transfer_data.get("status", "Approved")
        )

        if transfer.status in ["Approved", "Completed"]:
            asset.department_id = transfer.to_department_id
            asset.save(update_fields=["department_id"])

        cls.log_audit(
            action=f"TRANSFER_ASSET: {asset.asset_code}",
            performed_by=performed_by,
            details={"transfer_id": str(transfer.id), "status": transfer.status}
        )

        return transfer

    @classmethod
    @transaction.atomic
    def schedule_maintenance(cls, asset_id, maintenance_data, performed_by=None):
        """Schedules or logs asset maintenance and updates status."""
        asset = Asset.objects.get(id=asset_id)
        maintenance = AssetMaintenance.objects.create(
            asset=asset,
            maintenance_type=maintenance_data.get("maintenance_type", "Preventive"),
            vendor_id=maintenance_data.get("vendor_id"),
            cost=decimal.Decimal(str(maintenance_data.get("cost", "0.00"))),
            service_date=maintenance_data.get("service_date", timezone.now().date()),
            next_service_date=maintenance_data.get("next_service_date"),
            status=maintenance_data.get("status", "Scheduled"),
            remarks=maintenance_data.get("remarks", "")
        )

        if maintenance.status in ["Scheduled", "In Progress"]:
            asset.status = "Maintenance"
            asset.save(update_fields=["status"])

        cls.log_audit(
            action=f"MAINTENANCE_SCHEDULE: {asset.asset_code}",
            performed_by=performed_by,
            details={"maintenance_id": str(maintenance.id), "cost": str(maintenance.cost)}
        )

        return maintenance

    @classmethod
    @transaction.atomic
    def complete_maintenance(cls, maintenance_id, completion_data, performed_by=None):
        """Marks maintenance as completed and restores asset status."""
        maintenance = AssetMaintenance.objects.get(id=maintenance_id)
        maintenance.status = "Completed"
        if "cost" in completion_data:
            maintenance.cost = decimal.Decimal(str(completion_data["cost"]))
        if "remarks" in completion_data:
            maintenance.remarks += f"\nCompletion Note: {completion_data['remarks']}"
        maintenance.save()

        asset = maintenance.asset
        asset.status = "Available"
        asset.save(update_fields=["status"])

        cls.log_audit(
            action=f"MAINTENANCE_COMPLETE: {asset.asset_code}",
            performed_by=performed_by,
            details={"maintenance_id": str(maintenance.id)}
        )

        return maintenance

    @classmethod
    @transaction.atomic
    def calculate_depreciation(cls, asset_id, method="Straight Line", annual_percentage=10.0, performed_by=None):
        """
        Calculates annual depreciation using Straight Line or Written Down Value method,
        updates asset current value, and records AssetDepreciation entry.
        """
        asset = Asset.objects.get(id=asset_id)
        percentage = decimal.Decimal(str(annual_percentage))
        current_val = asset.current_value

        if method == "Straight Line":
            # Annual depreciation = Purchase Cost * percentage / 100
            annual_dep = (asset.purchase_cost * percentage) / decimal.Decimal("100.00")
        else:
            # WDV = Current Value * percentage / 100
            annual_dep = (current_val * percentage) / decimal.Decimal("100.00")

        new_book_value = max(decimal.Decimal("0.00"), current_val - annual_dep)
        accumulated = asset.purchase_cost - new_book_value

        dep = AssetDepreciation.objects.create(
            asset=asset,
            method=method,
            annual_percentage=percentage,
            book_value=new_book_value,
            accumulated_depreciation=accumulated,
            depreciation_date=timezone.now().date()
        )

        asset.current_value = new_book_value
        asset.save(update_fields=["current_value"])

        cls.log_audit(
            action=f"CALCULATE_DEPRECIATION: {asset.asset_code}",
            performed_by=performed_by,
            details={"new_book_value": str(new_book_value), "method": method}
        )

        return dep

    @classmethod
    @transaction.atomic
    def perform_audit(cls, audit_data, performed_by=None):
        """Records a physical asset audit for a department."""
        audit = AssetAudit.objects.create(
            audit_date=audit_data.get("audit_date", timezone.now().date()),
            department_id=audit_data["department_id"],
            auditor=performed_by,
            result=audit_data.get("result", "Passed"),
            missing_assets=audit_data.get("missing_assets", []),
            remarks=audit_data.get("remarks", ""),
            status="Completed"
        )

        # Flag missing assets if any listed
        for asset_code in audit.missing_assets:
            Asset.objects.filter(asset_code=asset_code).update(status="Lost")

        cls.log_audit(
            action=f"PERFORM_AUDIT: Dept {audit.department_id}",
            performed_by=performed_by,
            details={"audit_id": str(audit.id), "result": audit.result}
        )

        return audit

    @classmethod
    @transaction.atomic
    def dispose_asset(cls, asset_id, disposal_data, performed_by=None):
        """Processes asset disposal (Auction, Scrap, Donation)."""
        asset = Asset.objects.get(id=asset_id)
        disposal_val = decimal.Decimal(str(disposal_data.get("disposal_value", "0.00")))

        disposal = AssetDisposal.objects.create(
            asset=asset,
            reason=disposal_data.get("reason", "End of useful life"),
            disposed_date=disposal_data.get("disposed_date", timezone.now().date()),
            disposal_value=disposal_val,
            approved_by=performed_by,
            method=disposal_data.get("method", "Scrap"),
            status="Disposed"
        )

        asset.status = "Disposed"
        asset.current_value = disposal_val
        asset.save(update_fields=["status", "current_value"])

        cls.log_audit(
            action=f"DISPOSE_ASSET: {asset.asset_code}",
            performed_by=performed_by,
            details={"disposal_id": str(disposal.id), "method": disposal.method, "value": str(disposal_val)}
        )

        return disposal

    @classmethod
    @transaction.atomic
    def log_incident(cls, asset_id, incident_data, performed_by=None):
        """Logs an asset incident (Damage, Loss, Theft, Repair)."""
        asset = Asset.objects.get(id=asset_id)
        incident = AssetIncident.objects.create(
            asset=asset,
            incident_type=incident_data.get("incident_type", "Damage"),
            description=incident_data.get("description", "Asset incident reported."),
            severity=incident_data.get("severity", "Medium"),
            resolved=incident_data.get("resolved", False)
        )

        if incident.incident_type in ["Loss", "Theft"]:
            asset.status = "Lost"
            asset.save(update_fields=["status"])
        elif incident.incident_type == "Damage":
            asset.status = "Maintenance"
            asset.save(update_fields=["status"])

        cls.log_audit(
            action=f"LOG_INCIDENT: {asset.asset_code}",
            performed_by=performed_by,
            details={"incident_id": str(incident.id), "type": incident.incident_type}
        )

        return incident

    @classmethod
    @transaction.atomic
    def soft_delete_asset(cls, asset_id, performed_by=None):
        """Soft deletes an asset."""
        asset = Asset.objects.get(id=asset_id)
        asset.is_deleted = True
        asset.save(update_fields=["is_deleted"])

        cls.log_audit(
            action=f"SOFT_DELETE_ASSET: {asset.asset_code}",
            performed_by=performed_by,
            details={"asset_id": str(asset.id)}
        )

        return True
