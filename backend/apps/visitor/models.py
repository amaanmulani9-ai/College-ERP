"""
Enterprise Visitor Management System Models
=============================================
Covers Visitor, VisitorDocument, VisitorVehicle, Appointment, VisitPurpose,
GatePass, EntryExitLog, Delivery, Contractor, ContractorPass, EmergencyVisitor,
RestrictedAreaAccess, VisitorBlacklist, VisitorFeedback, SecurityOfficer,
VisitorNotification, and VisitorAuditLog.
"""

import uuid
from django.conf import settings
from django.db import models
from apps.staff.models import Employee
from apps.academics.models import Department


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# 1. Visitor Profiles, Documents & Vehicles
# ---------------------------------------------------------------------------
class Visitor(models.Model):
    GOVT_ID_CHOICES = [
        ("Aadhaar", "Aadhaar Card"),
        ("PAN", "PAN Card"),
        ("Passport", "Passport"),
        ("Driving License", "Driving License"),
        ("Voter ID", "Voter ID"),
        ("Other", "Other Government ID"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor_id = models.CharField(max_length=50, unique=True, db_index=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=30, db_index=True)
    email = models.EmailField(blank=True, default="")
    photo = models.CharField(max_length=300, blank=True, default="/media/visitors/default.png")
    company = models.CharField(max_length=150, blank=True, default="Self / Individual")
    govt_id_type = models.CharField(max_length=30, choices=GOVT_ID_CHOICES, default="Aadhaar")
    govt_id_number = models.CharField(max_length=50, blank=True, default="")
    address = models.TextField(blank=True, default="")

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Visitor Profile"
        verbose_name_plural = "Visitor Profiles"

    def __str__(self):
        return f"{self.first_name} {self.last_name} [{self.visitor_id}] ({self.mobile})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class VisitorDocument(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending Verification"),
        ("Verified", "Verified"),
        ("Rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=50, default="Govt ID Scan")
    document_number = models.CharField(max_length=100)
    expiry_date = models.DateField(null=True, blank=True)
    verification_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Verified")

    class Meta:
        verbose_name = "Visitor Document"
        verbose_name_plural = "Visitor Documents"

    def __str__(self):
        return f"Doc: {self.document_type} - {self.visitor.get_full_name()}"


class VisitorVehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ("Two-Wheeler", "Two-Wheeler / Bike"),
        ("Four-Wheeler", "Four-Wheeler / Car"),
        ("Commercial", "Commercial Truck / Delivery Van"),
        ("Bus/Van", "Bus / Transport Shuttle"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="vehicles")
    vehicle_number = models.CharField(max_length=50, db_index=True)
    vehicle_type = models.CharField(max_length=30, choices=VEHICLE_TYPE_CHOICES, default="Four-Wheeler")
    parking_slot = models.CharField(max_length=50, default="Visitor Parking Slot V-12")

    class Meta:
        verbose_name = "Visitor Vehicle"
        verbose_name_plural = "Visitor Vehicles"

    def __str__(self):
        return f"{self.vehicle_number} ({self.vehicle_type}) - {self.visitor.get_full_name()}"


# ---------------------------------------------------------------------------
# 2. Visit Purpose & Appointments
# ---------------------------------------------------------------------------
class VisitPurpose(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["name"]
        verbose_name = "Visit Purpose"
        verbose_name_plural = "Visit Purposes"

    def __str__(self):
        return self.name


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending Approval"),
        ("Approved", "Approved"),
        ("Checked In", "Checked In"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="appointments")
    host_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="visitor_appointments")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    purpose = models.CharField(max_length=150, default="Meeting")
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["scheduled_date", "scheduled_time"]
        verbose_name = "Visitor Appointment"
        verbose_name_plural = "Visitor Appointments"

    def __str__(self):
        return f"Appt: {self.visitor.get_full_name()} with {self.host_employee.employee_id} on {self.scheduled_date}"


# ---------------------------------------------------------------------------
# 3. Digital Gate Pass & Entry/Exit Logs
# ---------------------------------------------------------------------------
class GatePass(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active Pass"),
        ("Expired", "Expired"),
        ("Revoked", "Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pass_number = models.CharField(max_length=50, unique=True, db_index=True)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="gate_passes")
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name="gate_passes")
    qr_code_payload = models.CharField(max_length=300, default="QR-GATEPASS-VALID")
    issue_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active", db_index=True)

    class Meta:
        ordering = ["-issue_date"]
        verbose_name = "Digital Gate Pass"
        verbose_name_plural = "Digital Gate Passes"

    def __str__(self):
        return f"Pass {self.pass_number} -> {self.visitor.get_full_name()} [{self.status}]"


class EntryExitLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="entry_exit_logs")
    gate_pass = models.ForeignKey(GatePass, on_delete=models.SET_NULL, null=True, blank=True, related_name="logs")
    gate = models.CharField(max_length=100, default="Main Gate A")
    check_in = models.DateTimeField(auto_now_add=True, db_index=True)
    check_out = models.DateTimeField(null=True, blank=True, db_index=True)
    security_officer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    remarks = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["-check_in"]
        verbose_name = "Entry / Exit Log"
        verbose_name_plural = "Entry / Exit Logs"

    def __str__(self):
        return f"Log: {self.visitor.get_full_name()} @ {self.gate} (In: {self.check_in})"


# ---------------------------------------------------------------------------
# 4. Deliveries, Contractors & Emergency Visitors
# ---------------------------------------------------------------------------
class Delivery(models.Model):
    STATUS_CHOICES = [
        ("Received", "Received at Security Gate"),
        ("Handed Over", "Handed Over to Recipient"),
        ("Returned", "Returned to Courier"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    courier_company = models.CharField(max_length=150, default="FedEx / BlueDart / Amazon")
    tracking_number = models.CharField(max_length=100, db_index=True)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_deliveries")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    delivery_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Received")
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-received_at"]
        verbose_name = "Courier Delivery"
        verbose_name_plural = "Courier Deliveries"

    def __str__(self):
        return f"Delivery: {self.tracking_number} ({self.courier_company}) -> {self.recipient.email}"


class Contractor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.CharField(max_length=150)
    supervisor = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    areas_allowed = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Maintenance Contractor"
        verbose_name_plural = "Maintenance Contractors"

    def __str__(self):
        return f"Contractor: {self.company} (Supervisor: {self.supervisor})"


class ContractorPass(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contractor = models.ForeignKey(Contractor, on_delete=models.CASCADE, related_name="passes")
    pass_number = models.CharField(max_length=50, unique=True, db_index=True)
    validity = models.DateField()

    class Meta:
        verbose_name = "Contractor Pass"
        verbose_name_plural = "Contractor Passes"

    def __str__(self):
        return f"Contractor Pass: {self.pass_number} ({self.contractor.company})"


class EmergencyVisitor(models.Model):
    TYPE_CHOICES = [
        ("Hospital", "Medical Ambulance / Hospital"),
        ("Police", "Police Department"),
        ("Fire", "Fire & Rescue Services"),
        ("Government", "Government Inspection Authority"),
    ]

    PRIORITY_CHOICES = [
        ("High", "High Priority"),
        ("Critical", "Critical Emergency"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="emergency_visits")
    hospital_or_dept = models.CharField(max_length=150)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default="Hospital")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="Critical")
    details = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Emergency Visitor"
        verbose_name_plural = "Emergency Visitors"

    def __str__(self):
        return f"Emergency: {self.type} [{self.priority}] -> {self.visitor.get_full_name()}"


# ---------------------------------------------------------------------------
# 5. Restricted Access, Blacklists, Feedback & Officers
# ---------------------------------------------------------------------------
class RestrictedAreaAccess(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="restricted_accesses")
    area = models.CharField(max_length=150, default="Server Room / High Security Lab")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expiry = models.DateTimeField()

    class Meta:
        verbose_name = "Restricted Area Access"
        verbose_name_plural = "Restricted Area Access Grants"

    def __str__(self):
        return f"Restricted Access: {self.visitor.get_full_name()} -> {self.area}"


class VisitorBlacklist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="blacklist_records")
    reason = models.TextField()
    blocked_date = models.DateField(auto_now_add=True)
    blocked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-blocked_date"]
        verbose_name = "Visitor Blacklist Record"
        verbose_name_plural = "Visitor Blacklist Records"

    def __str__(self):
        return f"BLACKLISTED: {self.visitor.get_full_name()} (Reason: {self.reason[:30]})"


class VisitorFeedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="feedbacks")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    comments = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Visitor Feedback"
        verbose_name_plural = "Visitor Feedbacks"

    def __str__(self):
        return f"Feedback {self.rating}/5 from {self.visitor.get_full_name()}"


class SecurityOfficer(models.Model):
    SHIFT_CHOICES = [
        ("Morning", "Morning Shift (06:00 - 14:00)"),
        ("Afternoon", "Afternoon Shift (14:00 - 22:00)"),
        ("Night", "Night Shift (22:00 - 06:00)"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="security_assignments")
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES, default="Morning")
    gate = models.CharField(max_length=100, default="Main Gate A")

    class Meta:
        verbose_name = "Security Officer Assignment"
        verbose_name_plural = "Security Officer Roster"

    def __str__(self):
        return f"Officer: {self.employee.employee_id} ({self.shift} @ {self.gate})"


class VisitorNotification(models.Model):
    STATUS_CHOICES = [
        ("Sent", "Sent"),
        ("Failed", "Failed"),
        ("Pending", "Pending"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name="notifications")
    sms_payload = models.TextField(blank=True, default="")
    email_payload = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Sent")

    class Meta:
        verbose_name = "Visitor Notification Log"
        verbose_name_plural = "Visitor Notification Logs"

    def __str__(self):
        return f"Notification to {self.visitor.get_full_name()} [{self.status}]"


class VisitorAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Visitor Audit Log"
        verbose_name_plural = "Visitor Audit Logs"

    def __str__(self):
        return f"[{self.timestamp}] Action: {self.action}"
