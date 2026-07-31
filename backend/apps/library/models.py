"""
Library Management System Models
================================
BookCategory – Book subject categories
Author       – Author records
Publisher    – Publisher details
Book         – Physical / catalog book items (ISBN & Barcode indexed)
BookIssue    – Active/Past book circulation & issue tracking
Reservation  – Book reservation queue for unavailable copies
LibraryAuditLog – Audit log for library actions
"""
import uuid

from django.conf import settings
from django.db import models

from apps.staff.models import Employee
from apps.students.models import Student


# ---------------------------------------------------------------------------
# Book Category
# ---------------------------------------------------------------------------

class BookCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Book Category"
        verbose_name_plural = "Book Categories"

    def __str__(self):
        return f"{self.name} ({self.code})"


# ---------------------------------------------------------------------------
# Author
# ---------------------------------------------------------------------------

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    biography = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Author"
        verbose_name_plural = "Authors"

    def __str__(self):
        return self.name


# ---------------------------------------------------------------------------
# Publisher
# ---------------------------------------------------------------------------

class Publisher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Publisher"
        verbose_name_plural = "Publishers"

    def __str__(self):
        return self.name


# ---------------------------------------------------------------------------
# Book
# ---------------------------------------------------------------------------

class Book(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("borrowed", "Borrowed"),
        ("reserved", "Reserved"),
        ("lost", "Lost"),
        ("damaged", "Damaged"),
        ("maintenance", "Maintenance"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    isbn = models.CharField(max_length=50, unique=True, db_index=True)
    barcode = models.CharField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=255)

    author = models.ForeignKey(Author, on_delete=models.PROTECT, related_name="books")
    publisher = models.ForeignKey(Publisher, on_delete=models.SET_NULL, null=True, blank=True, related_name="books")
    category = models.ForeignKey(BookCategory, on_delete=models.PROTECT, related_name="books")

    edition = models.CharField(max_length=50, default="1st Edition")
    language = models.CharField(max_length=50, default="English")
    copies = models.PositiveIntegerField(default=1)
    available_copies = models.PositiveIntegerField(default=1)
    shelf_number = models.CharField(max_length=50, blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]
        verbose_name = "Book"
        verbose_name_plural = "Books"

    def __str__(self):
        return f"{self.title} (ISBN: {self.isbn})"


# ---------------------------------------------------------------------------
# Book Issue (Circulation)
# ---------------------------------------------------------------------------

class BookIssue(models.Model):
    STATUS_CHOICES = [
        ("issued", "Issued"),
        ("returned", "Returned"),
        ("overdue", "Overdue"),
        ("lost", "Lost"),
        ("damaged", "Damaged"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.PROTECT, related_name="issues")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True, related_name="book_issues")
    staff = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True, related_name="book_issues")

    issue_date = models.DateField()
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="issued", db_index=True)
    remarks = models.CharField(max_length=255, blank=True, default="")
    issued_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="issued_books")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-issue_date"]
        verbose_name = "Book Issue"
        verbose_name_plural = "Book Issues"

    def __str__(self):
        borrower = self.student.student_id if self.student else (self.staff.employee_id if self.staff else "Unknown")
        return f"Issue #{str(self.id)[:8]} | {self.book.title} -> {borrower} ({self.status})"


# ---------------------------------------------------------------------------
# Reservation
# ---------------------------------------------------------------------------

class Reservation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("fulfilled", "Fulfilled"),
        ("cancelled", "Cancelled"),
        ("expired", "Expired"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reservations")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True, related_name="book_reservations")
    staff = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True, related_name="book_reservations")

    reserved_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-reserved_date"]
        verbose_name = "Reservation"
        verbose_name_plural = "Reservations"

    def __str__(self):
        borrower = self.student.student_id if self.student else (self.staff.employee_id if self.staff else "Unknown")
        return f"Reservation for {self.book.title} by {borrower} ({self.status})"


# ---------------------------------------------------------------------------
# Library Audit Log
# ---------------------------------------------------------------------------

class LibraryAuditLog(models.Model):
    EVENT_CHOICES = [
        ("book_added", "Book Added"),
        ("book_issued", "Book Issued"),
        ("book_returned", "Book Returned"),
        ("reservation_created", "Reservation Created"),
        ("fine_generated", "Fine Generated"),
        ("book_lost", "Book Reported Lost"),
        ("book_damaged", "Book Reported Damaged"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True, blank=True)
    issue = models.ForeignKey(BookIssue, on_delete=models.SET_NULL, null=True, blank=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    description = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Library Audit Log"
        verbose_name_plural = "Library Audit Logs"

    def __str__(self):
        return f"[{self.event_type}] {self.description[:60]} at {self.timestamp}"
