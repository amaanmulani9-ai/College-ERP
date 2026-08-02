from rest_framework import serializers
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


class AssetCategorySerializer(serializers.ModelSerializer):
    parent_category_name = serializers.CharField(source="parent_category.category_name", read_only=True)

    class Meta:
        model = AssetCategory
        fields = [
            "id",
            "category_code",
            "category_name",
            "parent_category",
            "parent_category_name",
            "useful_life_years",
            "depreciation_method",
            "description",
            "status",
            "created_at",
        ]


class MaintenanceVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceVendor
        fields = "__all__"


class AssetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    supplier_name = serializers.CharField(source="supplier.company_name", read_only=True)
    inventory_item_name = serializers.CharField(source="inventory_item.item_name", read_only=True)

    class Meta:
        model = Asset
        fields = [
            "id",
            "asset_code",
            "asset_name",
            "inventory_item",
            "inventory_item_name",
            "category",
            "category_name",
            "serial_number",
            "barcode",
            "qr_code",
            "purchase_date",
            "purchase_cost",
            "current_value",
            "location",
            "department",
            "department_name",
            "supplier",
            "supplier_name",
            "status",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class AssetAllocationSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)
    asset_name = serializers.CharField(source="asset.asset_name", read_only=True)
    employee_name = serializers.SerializerMethodField()
    department_name = serializers.CharField(source="department.name", read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = AssetAllocation
        fields = [
            "id",
            "asset",
            "asset_code",
            "asset_name",
            "allocated_to_type",
            "employee",
            "employee_name",
            "department",
            "department_name",
            "student",
            "student_name",
            "allocated_location",
            "allocation_date",
            "expected_return",
            "actual_return",
            "status",
            "remarks",
            "created_at",
        ]

    def get_employee_name(self, obj):
        if obj.employee:
            return f"{obj.employee.first_name} {obj.employee.last_name}".strip()
        return None

    def get_student_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}".strip()
        return None


class AssetTransferSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)
    asset_name = serializers.CharField(source="asset.asset_name", read_only=True)
    from_department_name = serializers.CharField(source="from_department.name", read_only=True)
    to_department_name = serializers.CharField(source="to_department.name", read_only=True)

    class Meta:
        model = AssetTransfer
        fields = [
            "id",
            "asset",
            "asset_code",
            "asset_name",
            "from_department",
            "from_department_name",
            "to_department",
            "to_department_name",
            "approved_by",
            "transfer_date",
            "reason",
            "status",
            "created_at",
        ]


class AssetMaintenanceSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)
    asset_name = serializers.CharField(source="asset.asset_name", read_only=True)
    vendor_name = serializers.CharField(source="vendor.vendor_name", read_only=True)

    class Meta:
        model = AssetMaintenance
        fields = [
            "id",
            "asset",
            "asset_code",
            "asset_name",
            "maintenance_type",
            "vendor",
            "vendor_name",
            "cost",
            "service_date",
            "next_service_date",
            "status",
            "remarks",
            "created_at",
        ]


class MaintenanceScheduleSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)

    class Meta:
        model = MaintenanceSchedule
        fields = "__all__"


class WarrantySerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)

    class Meta:
        model = Warranty
        fields = "__all__"


class AssetDepreciationSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)

    class Meta:
        model = AssetDepreciation
        fields = "__all__"


class AssetAuditSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    auditor_email = serializers.CharField(source="auditor.email", read_only=True)

    class Meta:
        model = AssetAudit
        fields = "__all__"


class AssetDisposalSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)
    asset_name = serializers.CharField(source="asset.asset_name", read_only=True)

    class Meta:
        model = AssetDisposal
        fields = "__all__"


class AssetIncidentSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)

    class Meta:
        model = AssetIncident
        fields = "__all__"


class AssetDocumentSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)

    class Meta:
        model = AssetDocument
        fields = "__all__"


class QRCodeLabelSerializer(serializers.ModelSerializer):
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)

    class Meta:
        model = QRCodeLabel
        fields = "__all__"


class AssetAuditLogSerializer(serializers.ModelSerializer):
    performed_by_email = serializers.CharField(source="performed_by.email", read_only=True)

    class Meta:
        model = AssetAuditLog
        fields = "__all__"
