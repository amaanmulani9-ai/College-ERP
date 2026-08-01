"""
Transport Management System Models
====================================
Vehicle                     – Fleet vehicle records & status
Route                       – Bus routes & distance details
Stop                        – Route stops with sequence & timings
Driver                      – Driver profiles, license & medical expiries
VehicleAssignment           – Mapping driver, vehicle & route for a session
StudentTransportAllocation  – Student transport assignment & fee plan
TransportPass               – Digital transport passes with QR codes
VehicleMaintenance          # Odometer, service dates & costs
FuelLog                     – Fuel refill logs & mileage tracking
TransportAttendance         – Morning/Evening boarding attendance
TransportIncident           – Incident reporting & resolution tracking
TransportAuditLog           – Transport module audit logs
"""

import uuid
from django.conf import settings
from django.db import models
from apps.academics.models import AcademicSession
from apps.students.models import Student
from apps.staff.models import Employee


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Vehicle
# ---------------------------------------------------------------------------
class Vehicle(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("maintenance", "Under Maintenance"),
        ("retired", "Retired"),
    ]

    VEHICLE_TYPE_CHOICES = [
        ("bus", "Bus"),
        ("mini_bus", "Mini Bus"),
        ("van", "Van"),
        ("car", "Car"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_code = models.CharField(max_length=50, unique=True, db_index=True)
    registration_number = models.CharField(max_length=50, unique=True)
    vehicle_name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES, default="bus")
    capacity = models.PositiveIntegerField(default=40)
    manufacturer = models.CharField(max_length=100, blank=True, default="")
    model = models.CharField(max_length=100, blank=True, default="")
    purchase_date = models.DateField(null=True, blank=True)
    insurance_expiry = models.DateField(null=True, blank=True)
    fitness_expiry = models.DateField(null=True, blank=True)
    permit_expiry = models.DateField(null=True, blank=True)
    gps_enabled = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["vehicle_code"]
        verbose_name = "Vehicle"
        verbose_name_plural = "Vehicles"

    def __str__(self):
        return f"{self.vehicle_name} ({self.registration_number})"


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------
class Route(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    route_code = models.CharField(max_length=50, unique=True, db_index=True)
    route_name = models.CharField(max_length=150)
    source = models.CharField(max_length=150)
    destination = models.CharField(max_length=150)
    distance_km = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    estimated_duration_mins = models.PositiveIntegerField(default=60)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["route_code"]
        verbose_name = "Route"
        verbose_name_plural = "Routes"

    def __str__(self):
        return f"Route {self.route_code}: {self.route_name}"


# ---------------------------------------------------------------------------
# Stop
# ---------------------------------------------------------------------------
class Stop(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="stops")
    stop_name = models.CharField(max_length=150)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    sequence = models.PositiveIntegerField(default=1)
    pickup_time = models.TimeField(null=True, blank=True)
    drop_time = models.TimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["route", "sequence"]
        unique_together = ("route", "sequence")
        verbose_name = "Stop"
        verbose_name_plural = "Stops"

    def __str__(self):
        return f"{self.route.route_code} - Stop #{self.sequence}: {self.stop_name}"


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------
class Driver(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("on_leave", "On Leave"),
        ("suspended", "Suspended"),
        ("inactive", "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name="driver_profile")
    license_number = models.CharField(max_length=100, unique=True)
    license_expiry = models.DateField()
    phone = models.CharField(max_length=20)
    emergency_contact = models.CharField(max_length=20, blank=True, default="")
    experience_years = models.PositiveIntegerField(default=1)
    medical_expiry = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["employee__employee_id"]
        verbose_name = "Driver"
        verbose_name_plural = "Drivers"

    def __str__(self):
        return f"Driver: {self.employee.profile.user.get_full_name()} ({self.license_number})"


# ---------------------------------------------------------------------------
# VehicleAssignment
# ---------------------------------------------------------------------------
class VehicleAssignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="assignments")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="assignments")
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="assignments")
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name="vehicle_assignments")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Vehicle Assignment"
        verbose_name_plural = "Vehicle Assignments"

    def __str__(self):
        return f"{self.vehicle.vehicle_name} -> {self.route.route_name} ({self.driver})"


# ---------------------------------------------------------------------------
# StudentTransportAllocation
# ---------------------------------------------------------------------------
class StudentTransportAllocation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="transport_allocations")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="allocations")
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="allocations")
    boarding_stop = models.ForeignKey(Stop, on_delete=models.PROTECT, related_name="boarding_allocations")
    dropping_stop = models.ForeignKey(Stop, on_delete=models.PROTECT, related_name="dropping_allocations")
    fee_plan = models.CharField(max_length=50, default="Annual")
    pass_number = models.CharField(max_length=50, unique=True, db_index=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Student Allocation"
        verbose_name_plural = "Student Allocations"

    def __str__(self):
        return f"Allocation: {self.student.student_id} -> {self.route.route_code}"


# ---------------------------------------------------------------------------
# TransportPass
# ---------------------------------------------------------------------------
class TransportPass(models.Model):
    STATUS_CHOICES = [
        ("valid", "Valid"),
        ("expired", "Expired"),
        ("revoked", "Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    allocation = models.OneToOneField(StudentTransportAllocation, on_delete=models.CASCADE, related_name="pass_card")
    qr_code_data = models.TextField(blank=True, default="")
    issue_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="valid", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Transport Pass"
        verbose_name_plural = "Transport Passes"

    def __str__(self):
        return f"Pass {self.allocation.pass_number} [{self.status}]"


# ---------------------------------------------------------------------------
# VehicleMaintenance
# ---------------------------------------------------------------------------
class VehicleMaintenance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="maintenance_logs")
    service_date = models.DateField()
    odometer_reading = models.PositiveIntegerField(default=0)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    vendor = models.CharField(max_length=150)
    next_service_date = models.DateField(null=True, blank=True)
    remarks = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-service_date"]
        verbose_name = "Vehicle Maintenance"
        verbose_name_plural = "Vehicle Maintenances"

    def __str__(self):
        return f"Maintenance: {self.vehicle.vehicle_name} on {self.service_date}"


# ---------------------------------------------------------------------------
# FuelLog
# ---------------------------------------------------------------------------
class FuelLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="fuel_logs")
    fuel_date = models.DateField()
    litres = models.DecimalField(max_digits=8, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    mileage_kml = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    vendor = models.CharField(max_length=150, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fuel_date"]
        verbose_name = "Fuel Log"
        verbose_name_plural = "Fuel Logs"

    def __str__(self):
        return f"Fuel: {self.vehicle.vehicle_name} - {self.litres}L on {self.fuel_date}"


# ---------------------------------------------------------------------------
# TransportAttendance
# ---------------------------------------------------------------------------
class TransportAttendance(models.Model):
    TRIP_CHOICES = [
        ("morning", "Morning Pickup"),
        ("evening", "Evening Drop"),
    ]

    STATUS_CHOICES = [
        ("boarded", "Boarded"),
        ("dropped", "Dropped"),
        ("absent", "Absent"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    allocation = models.ForeignKey(StudentTransportAllocation, on_delete=models.CASCADE, related_name="attendances")
    date = models.DateField()
    trip_type = models.CharField(max_length=20, choices=TRIP_CHOICES, default="morning")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="boarded")
    marked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ("allocation", "date", "trip_type")
        verbose_name = "Transport Attendance"
        verbose_name_plural = "Transport Attendances"

    def __str__(self):
        return f"Attendance: {self.allocation.student.student_id} - {self.trip_type} [{self.status}]"


# ---------------------------------------------------------------------------
# TransportIncident
# ---------------------------------------------------------------------------
class TransportIncident(models.Model):
    SEVERITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="incidents")
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name="incidents")
    date = models.DateTimeField()
    category = models.CharField(max_length=100)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default="medium")
    resolved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Transport Incident"
        verbose_name_plural = "Transport Incidents"

    def __str__(self):
        return f"Incident: {self.category} ({self.vehicle.vehicle_name}) [{self.severity}]"


# ---------------------------------------------------------------------------
# TransportAuditLog
# ---------------------------------------------------------------------------
class TransportAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Transport Audit Log"
        verbose_name_plural = "Transport Audit Logs"

    def __str__(self):
        return f"[{self.timestamp}] {self.action}"
