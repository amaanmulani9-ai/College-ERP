from django.contrib import admin
from apps.assets.models import (
    AssetCategory,
    MaintenanceVendor,
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
    AssetDocument,
    QRCodeLabel,
    AssetAuditLog,
)
from apps.assets.services.asset_service import AssetService


class WarrantyInline(admin.StackedInline):
    model = Warranty
    extra = 0


class AssetDocumentInline(admin.TabularInline):
    model = AssetDocument
    extra = 0


class AssetAllocationInline(admin.TabularInline):
    model = AssetAllocation
    extra = 0


class QRCodeLabelInline(admin.StackedInline):
    model = QRCodeLabel
    extra = 0


@admin.register(AssetCategory)
class AssetCategoryAdmin(admin.ModelAdmin):
    list_display = ["category_code", "category_name", "useful_life_years", "depreciation_method", "status"]
    list_filter = ["depreciation_method", "status"]
    search_fields = ["category_code", "category_name"]


@admin.register(MaintenanceVendor)
class MaintenanceVendorAdmin(admin.ModelAdmin):
    list_display = ["vendor_name", "contact_person", "phone", "email", "amc_status"]
    list_filter = ["amc_status"]
    search_fields = ["vendor_name", "contact_person"]


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ["asset_code", "asset_name", "category", "department", "purchase_date", "purchase_cost", "current_value", "status"]
    list_filter = ["status", "category", "department"]
    search_fields = ["asset_code", "asset_name", "serial_number", "barcode"]
    inlines = [WarrantyInline, AssetDocumentInline, AssetAllocationInline, QRCodeLabelInline]
    actions = ["action_calculate_depreciation", "action_print_qr_placeholder", "action_mark_maintenance"]

    @admin.action(description="Calculate Straight Line Depreciation (10%)")
    def action_calculate_depreciation(self, request, queryset):
        count = 0
        for asset in queryset:
            AssetService.calculate_depreciation(asset_id=asset.id, method="Straight Line", annual_percentage=10.0, performed_by=request.user)
            count += 1
        self.message_user(request, f"Depreciation calculated for {count} asset(s).")

    @admin.action(description="Regenerate QR Code Labels")
    def action_print_qr_placeholder(self, request, queryset):
        count = 0
        for asset in queryset:
            qr_payload, printable_label = AssetService.generate_qr_payload(asset)
            asset.qr_code = qr_payload
            asset.save(update_fields=["qr_code"])
            QRCodeLabel.objects.update_or_create(
                asset=asset,
                defaults={"qr_payload": qr_payload, "printable_label": printable_label}
            )
            count += 1
        self.message_user(request, f"Regenerated QR Labels for {count} asset(s).")

    @admin.action(description="Mark Status as Maintenance")
    def action_mark_maintenance(self, request, queryset):
        updated = queryset.update(status="Maintenance")
        self.message_user(request, f"Marked {updated} asset(s) as Under Maintenance.")


@admin.register(AssetAllocation)
class AssetAllocationAdmin(admin.ModelAdmin):
    list_display = ["asset", "allocated_to_type", "employee", "department", "allocation_date", "status"]
    list_filter = ["status", "allocated_to_type"]
    search_fields = ["asset__asset_code", "asset__asset_name"]


@admin.register(AssetTransfer)
class AssetTransferAdmin(admin.ModelAdmin):
    list_display = ["asset", "from_department", "to_department", "transfer_date", "status"]
    list_filter = ["status"]
    search_fields = ["asset__asset_code"]


@admin.register(AssetMaintenance)
class AssetMaintenanceAdmin(admin.ModelAdmin):
    list_display = ["asset", "maintenance_type", "vendor", "cost", "service_date", "status"]
    list_filter = ["maintenance_type", "status"]
    search_fields = ["asset__asset_code", "remarks"]


@admin.register(MaintenanceSchedule)
class MaintenanceScheduleAdmin(admin.ModelAdmin):
    list_display = ["asset", "title", "frequency", "next_due_date", "status"]
    list_filter = ["frequency", "status"]


@admin.register(Warranty)
class WarrantyAdmin(admin.ModelAdmin):
    list_display = ["asset", "warranty_number", "provider", "start_date", "end_date", "status"]
    list_filter = ["status"]
    search_fields = ["warranty_number", "provider", "asset__asset_code"]


@admin.register(AssetDepreciation)
class AssetDepreciationAdmin(admin.ModelAdmin):
    list_display = ["asset", "method", "annual_percentage", "book_value", "accumulated_depreciation", "depreciation_date"]
    list_filter = ["method"]


@admin.register(AssetAudit)
class AssetAuditAdmin(admin.ModelAdmin):
    list_display = ["department", "auditor", "audit_date", "result", "status"]
    list_filter = ["result", "status"]


@admin.register(AssetDisposal)
class AssetDisposalAdmin(admin.ModelAdmin):
    list_display = ["asset", "method", "disposal_value", "disposed_date", "status"]
    list_filter = ["method", "status"]


@admin.register(AssetIncident)
class AssetIncidentAdmin(admin.ModelAdmin):
    list_display = ["asset", "incident_type", "severity", "resolved", "reported_date"]
    list_filter = ["incident_type", "severity", "resolved"]


@admin.register(AssetDocument)
class AssetDocumentAdmin(admin.ModelAdmin):
    list_display = ["asset", "document_type", "title", "uploaded_at"]
    list_filter = ["document_type"]


@admin.register(QRCodeLabel)
class QRCodeLabelAdmin(admin.ModelAdmin):
    list_display = ["asset", "created_at"]


@admin.register(AssetAuditLog)
class AssetAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    search_fields = ["action"]
