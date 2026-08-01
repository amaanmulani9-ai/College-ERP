import uuid

from apps.academics.models import AcademicSession, Program, Semester
from apps.students.models import Student
from django.conf import settings
from django.db import models


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# Fee Category
# ---------------------------------------------------------------------------


class FeeCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Fee Category"
        verbose_name_plural = "Fee Categories"

    def __str__(self):
        return f"{self.name} ({self.code})"


# ---------------------------------------------------------------------------
# Fee Structure
# ---------------------------------------------------------------------------


class FeeStructure(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    academic_session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name="fee_structures")
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="fee_structures")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name="fee_structures")
    category = models.ForeignKey(FeeCategory, on_delete=models.CASCADE, related_name="fee_structures")

    amount = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("academic_session", "program", "semester", "category")
        ordering = ["program", "semester", "category"]
        verbose_name = "Fee Structure"
        verbose_name_plural = "Fee Structures"

    def __str__(self):
        return f"{self.program.code} S{self.semester.semester_number} - {self.category.name}: ${self.amount}"


# ---------------------------------------------------------------------------
# Student Fee
# ---------------------------------------------------------------------------


class StudentFee(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("partial", "Partial"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
        ("waived", "Waived"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="assigned_fees")
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.PROTECT, related_name="student_assignments")

    total_amount = models.FloatField(default=0.0)
    waiver_amount = models.FloatField(default=0.0)
    scholarship_amount = models.FloatField(default=0.0)
    paid_amount = models.FloatField(default=0.0)
    due_amount = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("student", "fee_structure")
        ordering = ["student__student_id", "fee_structure__category__name"]
        verbose_name = "Student Fee"
        verbose_name_plural = "Student Fees"

    def __str__(self):
        return f"{self.student.student_id} - {self.fee_structure.category.name}: Due ${self.due_amount} ({self.status})"


# ---------------------------------------------------------------------------
# Fee Installment
# ---------------------------------------------------------------------------


class FeeInstallment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name="installments")
    installment_no = models.IntegerField(default=1)
    amount = models.FloatField(default=0.0)
    due_date = models.DateField()
    fine_amount = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        unique_together = ("student_fee", "installment_no")
        ordering = ["student_fee", "installment_no"]
        verbose_name = "Fee Installment"
        verbose_name_plural = "Fee Installments"

    def __str__(self):
        return f"Installment #{self.installment_no} for {self.student_fee.student.student_id}: ${self.amount} due {self.due_date}"


# ---------------------------------------------------------------------------
# Fee Receipt
# ---------------------------------------------------------------------------


class FeeReceipt(models.Model):
    MODE_CHOICES = [
        ("cash", "Cash"),
        ("cheque", "Cheque"),
        ("bank_transfer", "Bank Transfer"),
        ("upi", "UPI"),
        ("online", "Online Payment"),
        ("draft", "Demand Draft"),
    ]

    STATUS_CHOICES = [
        ("success", "Success"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    receipt_number = models.CharField(max_length=100, unique=True, db_index=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="fee_receipts")
    student_fee = models.ForeignKey(
        StudentFee, on_delete=models.SET_NULL, null=True, blank=True, related_name="receipts"
    )
    installment = models.ForeignKey(
        FeeInstallment, on_delete=models.SET_NULL, null=True, blank=True, related_name="receipts"
    )

    payment_date = models.DateField(auto_now_add=True)
    amount = models.FloatField(default=0.0)
    payment_mode = models.CharField(max_length=25, choices=MODE_CHOICES, default="cash")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="success", db_index=True)
    remarks = models.CharField(max_length=255, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-payment_date", "-created_at"]
        verbose_name = "Fee Receipt"
        verbose_name_plural = "Fee Receipts"

    def __str__(self):
        return f"Receipt {self.receipt_number}: ${self.amount} from {self.student.student_id}"


# ---------------------------------------------------------------------------
# Fee Audit Log
# ---------------------------------------------------------------------------


class FeeAuditLog(models.Model):
    EVENT_CHOICES = [
        ("fee_assigned", "Fee Assigned"),
        ("payment_collected", "Payment Collected"),
        ("receipt_generated", "Receipt Generated"),
        ("fine_applied", "Fine Applied"),
        ("fee_updated", "Fee Updated"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_fee = models.ForeignKey(
        StudentFee, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs"
    )
    receipt = models.ForeignKey(FeeReceipt, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Fee Audit Log"
        verbose_name_plural = "Fee Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description} at {self.timestamp}"
