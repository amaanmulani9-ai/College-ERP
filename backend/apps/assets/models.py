"""
Enterprise Asset Management System Models
===========================================
Covers AssetCategory, Asset, AssetAllocation, AssetTransfer, AssetMaintenance,
MaintenanceVendor, MaintenanceSchedule, Warranty, AssetDepreciation, AssetAudit,
AssetDisposal, AssetIncident, AssetDocument, QRCodeLabel, and AssetAuditLog.
"""

import uuid
from django.conf import settings
from django.db import models
from apps.inventory.models import InventoryItem, Supplier
from apps.academics.models import Department
from apps.staff.models import Employee
from apps.students.models import Student


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Asset Category & Vendors
# ---------------------------------------------------------------------------
class AssetCategory(models.Model):
    DEPRECIATION_METHOD_CHOICES = [
        ("straight_line", "Straight Line"),
        ("written_down_value", "Written Down Value"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category_code = models.CharField(max_length=50, unique=True, db_index=True)
    category_name = models.CharField(max_length=150)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="subcategories")
    useful_life_years = models.PositiveIntegerField(default=5)
    depreciation_method = models.CharField(max_length=30, choices=DEPRECIATION_METHOD_CHOICES, default="straight_line")
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, default="active", db_index=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["category_code"]
        verbose_name = "Asset Category"
        verbose_name_plural = "Asset Categories"

    def __str__(self):
        return f"{self.category_name} ({self.category_code})"


class MaintenanceVendor(models.Model):
    AMC_STATUS_CHOICES = [
        ("active", "Active"),
        ("expired", "Expired"),
        ("none", "None"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vendor_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    amc_status = models.CharField(max_length=20, choices=AMC_STATUS_CHOICES, default="active")
    address = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["vendor_name"]
        verbose_name = "Maintenance Vendor"
        verbose_name_plural = "Maintenance Vendors"

    def __str__(self):
        return f"{self.vendor_name} ({self.contact_person})"


# ---------------------------------------------------------------------------
# Core Asset Model
# ---------------------------------------------------------------------------
class Asset(models.Model):
    STATUS_CHOICES = [
        ("Available", "Available"),
        ("Allocated", "Allocated"),
        ("Maintenance", "Maintenance"),
        ("Disposed", "Disposed"),
        ("Lost", "Lost"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset_code = models.CharField(max_length=50, unique=True, db_index=True)
    asset_name = models.CharField(max_length=200)
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.SET_NULL, null=True, blank=True, related_name="assets")
    category = models.ForeignKey(AssetCategory, on_delete=models.PROTECT, related_name="assets")
    serial_number = models.CharField(max_length=100, blank=True, default="")
    barcode = models.CharField(max_length=100, blank=True, default="")
    qr_code = models.TextField(blank=True, default="")
    purchase_date = models.DateField()
    purchase_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    current_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    location = models.CharField(max_length=200, blank=True, default="Main Campus")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="assets")
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name="assets")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Available", db_index=True)
    
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["asset_code"]
        verbose_name = "Asset"
        verbose_name_plural = "Assets"

    def __str__(self):
        return f"{self.asset_name} [{self.asset_code}]"


# ---------------------------------------------------------------------------
# Allocation & Transfer
# ---------------------------------------------------------------------------
class AssetAllocation(models.Model):
    ALLOCATED_TYPE_CHOICES = [
        ("Employee", "Employee"),
        ("Department", "Department"),
        ("Lab", "Lab"),
        ("Classroom", "Classroom"),
        ("Student", "Student"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Returned", "Returned"),
        ("Overdue", "Overdue"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="allocations")
    allocated_to_type = models.CharField(max_length=20, choices=ALLOCATED_TYPE_CHOICES, default="Employee")
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="asset_allocations")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="allocated_assets")
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name="asset_allocations")
    allocated_location = models.CharField(max_length=200, blank=True, default="")
    allocation_date = models.DateField()
    expected_return = models.DateField(null=True, blank=True)
    actual_return = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active", db_index=True)
    remarks = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-allocation_date"]
        verbose_name = "Asset Allocation"
        verbose_name_plural = "Asset Allocations"

    def __str__(self):
        return f"Allocation: {self.asset.asset_name} -> {self.allocated_to_type}"


class AssetTransfer(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Completed", "Completed"),
        ("Rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="transfers")
    from_department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="transfers_from")
    to_department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="transfers_to")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    transfer_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-transfer_date"]
        verbose_name = "Asset Transfer"
        verbose_name_plural = "Asset Transfers"

    def __str__(self):
        return f"Transfer: {self.asset.asset_code} ({self.from_department.name} -> {self.to_department.name})"


# ---------------------------------------------------------------------------
# Maintenance & Warranty
# ---------------------------------------------------------------------------
class AssetMaintenance(models.Model):
    MAINTENANCE_TYPE_CHOICES = [
        ("Preventive", "Preventive"),
        ("Corrective", "Corrective"),
        ("Emergency", "Emergency"),
    ]

    STATUS_CHOICES = [
        ("Scheduled", "Scheduled"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="maintenances")
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES, default="Preventive")
    vendor = models.ForeignKey(MaintenanceVendor, on_delete=models.SET_NULL, null=True, blank=True, related_name="serviced_assets")
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    service_date = models.DateField()
    next_service_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Scheduled", db_index=True)
    remarks = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-service_date"]
        verbose_name = "Asset Maintenance"
        verbose_name_plural = "Asset Maintenances"

    def __str__(self):
        return f"Maintenance: {self.asset.asset_name} ({self.maintenance_type}) [{self.status}]"


class MaintenanceSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ("Monthly", "Monthly"),
        ("Quarterly", "Quarterly"),
        ("Bi-Annually", "Bi-Annually"),
        ("Annually", "Annually"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Paused", "Paused"),
        ("Completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="schedules")
    title = models.CharField(max_length=150)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default="Quarterly")
    next_due_date = models.DateField()
    last_performed_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    class Meta:
        ordering = ["next_due_date"]
        verbose_name = "Maintenance Schedule"
        verbose_name_plural = "Maintenance Schedules"

    def __str__(self):
        return f"Schedule: {self.title} for {self.asset.asset_code}"


class Warranty(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Expired", "Expired"),
        ("Claimed", "Claimed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, related_name="warranty")
    warranty_number = models.CharField(max_length=100)
    provider = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    coverage = models.TextField(blank=True, default="Full Parts and Service")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active", db_index=True)

    class Meta:
        verbose_name = "Warranty"
        verbose_name_plural = "Warranties"

    def __str__(self):
        return f"Warranty: {self.warranty_number} ({self.asset.asset_code})"


# ---------------------------------------------------------------------------
# Depreciation, Audits & Disposals
# ---------------------------------------------------------------------------
class AssetDepreciation(models.Model):
    METHOD_CHOICES = [
        ("Straight Line", "Straight Line"),
        ("Written Down Value", "Written Down Value"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="depreciations")
    method = models.CharField(max_length=30, choices=METHOD_CHOICES, default="Straight Line")
    annual_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    book_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    accumulated_depreciation = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    depreciation_date = models.DateField()

    class Meta:
        ordering = ["-depreciation_date"]
        verbose_name = "Asset Depreciation"
        verbose_name_plural = "Asset Depreciations"

    def __str__(self):
        return f"Depreciation: {self.asset.asset_code} Book Value: {self.book_value}"


class AssetAudit(models.Model):
    RESULT_CHOICES = [
        ("Passed", "Passed"),
        ("Discrepancy", "Discrepancy"),
        ("Failed", "Failed"),
    ]

    STATUS_CHOICES = [
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    audit_date = models.DateField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="asset_audits")
    auditor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, default="Passed")
    missing_assets = models.JSONField(default=list, blank=True)
    remarks = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="In Progress")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-audit_date"]
        verbose_name = "Asset Audit"
        verbose_name_plural = "Asset Audits"

    def __str__(self):
        return f"Audit: {self.department.name} on {self.audit_date} [{self.result}]"


class AssetDisposal(models.Model):
    METHOD_CHOICES = [
        ("Auction", "Auction"),
        ("Scrap", "Scrap"),
        ("Donation", "Donation"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Disposed", "Disposed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, related_name="disposal")
    reason = models.TextField()
    disposed_date = models.DateField()
    disposal_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default="Scrap")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")

    class Meta:
        ordering = ["-disposed_date"]
        verbose_name = "Asset Disposal"
        verbose_name_plural = "Asset Disposals"

    def __str__(self):
        return f"Disposal: {self.asset.asset_code} ({self.method})"


# ---------------------------------------------------------------------------
# Incidents, Documents & QR Code Labels
# ---------------------------------------------------------------------------
class AssetIncident(models.Model):
    INCIDENT_TYPE_CHOICES = [
        ("Damage", "Damage"),
        ("Loss", "Loss"),
        ("Theft", "Theft"),
        ("Repair", "Repair"),
    ]

    SEVERITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="incidents")
    incident_type = models.CharField(max_length=20, choices=INCIDENT_TYPE_CHOICES, default="Damage")
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default="Medium")
    resolved = models.BooleanField(default=False)
    reported_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-reported_date"]
        verbose_name = "Asset Incident"
        verbose_name_plural = "Asset Incidents"

    def __str__(self):
        return f"Incident: {self.incident_type} on {self.asset.asset_code}"


class AssetDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ("Invoice", "Invoice"),
        ("Warranty Card", "Warranty Card"),
        ("AMC Agreement", "AMC Agreement"),
        ("Service Report", "Service Report"),
        ("Manual", "Manual"),
        ("Placeholder Upload", "Placeholder Upload"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPE_CHOICES, default="Invoice")
    title = models.CharField(max_length=150)
    file_url = models.CharField(max_length=300, blank=True, default="/media/assets/placeholder.pdf")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Asset Document"
        verbose_name_plural = "Asset Documents"

    def __str__(self):
        return f"Doc: {self.title} ({self.asset.asset_code})"


class QRCodeLabel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, related_name="qr_label")
    qr_payload = models.TextField()
    printable_label = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "QR Code Label"
        verbose_name_plural = "QR Code Labels"

    def __str__(self):
        return f"QR Label: {self.asset.asset_code}"


class AssetAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Asset Audit Log"
        verbose_name_plural = "Asset Audit Logs"

    def __str__(self):
        return f"[{self.timestamp}] Action: {self.action}"
