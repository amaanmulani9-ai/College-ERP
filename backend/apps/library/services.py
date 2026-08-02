"""
Library Service
===============
Business logic for catalog, circulation, returns, fines, lost/damaged reporting, and reservations.

Methods:
    add_book()         – Add new book catalog item
    issue_book()       – Issue a copy to student or staff
    return_book()      – Process book return, compute overdue fine
    reserve_book()     – Place a reservation queue item
    calculate_fine()   – Compute fine amount based on days overdue
    lost_book()        – Mark issue/book as lost and charge lost fee
    damaged_book()     – Mark issue/book as damaged and charge damage fine
    book_history()     – Circulation history for a book or borrower
"""

import decimal
import logging
from datetime import date, timedelta
from typing import Any, Dict, List, Optional

from apps.staff.models import Employee
from apps.students.models import Student
from django.db import transaction

from .models import (
    Author,
    Book,
    BookCategory,
    BookIssue,
    LibraryAuditLog,
    Publisher,
    Reservation,
)
from .validators import (
    validate_barcode_unique,
    validate_book_available,
    validate_borrower_limit,
    validate_isbn_unique,
)

logger = logging.getLogger(__name__)

FINE_PER_DAY = decimal.Decimal("10.00")  # ₹10/day overdue fine
DEFAULT_ISSUE_DAYS = 14  # 14 days loan period


class LibraryService:

    # ------------------------------------------------------------------
    # 1. Add Book
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def add_book(
        isbn: str,
        barcode: str,
        title: str,
        author_id: str,
        category_id: str,
        publisher_id: Optional[str] = None,
        edition: str = "1st Edition",
        language: str = "English",
        copies: int = 1,
        shelf_number: str = "",
        actor=None,
    ) -> Book:
        """Add new book to library catalog."""
        validate_isbn_unique(isbn)
        validate_barcode_unique(barcode)

        author = Author.objects.get(pk=author_id)
        category = BookCategory.objects.get(pk=category_id, is_active=True)
        publisher = Publisher.objects.get(pk=publisher_id) if publisher_id else None

        book = Book.objects.create(
            isbn=isbn,
            barcode=barcode,
            title=title,
            author=author,
            category=category,
            publisher=publisher,
            edition=edition,
            language=language,
            copies=copies,
            available_copies=copies,
            shelf_number=shelf_number,
            status="available",
        )

        _log_audit(
            book=book,
            actor=actor,
            event_type="book_added",
            description=f"Book '{title}' (ISBN: {isbn}) added to catalog with {copies} copies.",
        )
        return book

    # ------------------------------------------------------------------
    # 2. Issue Book
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def issue_book(
        book_id: str,
        student_id: Optional[str] = None,
        staff_id: Optional[str] = None,
        issue_days: int = DEFAULT_ISSUE_DAYS,
        remarks: str = "",
        actor=None,
    ) -> BookIssue:
        """
        Issue a book copy to a student or staff.
        Checks book availability and borrower issue limits.
        Decrements available_copies.
        """
        try:
            book = Book.objects.select_for_update().get(pk=book_id)
        except Book.DoesNotExist:
            raise ValueError(f"Book {book_id!r} not found.")

        validate_book_available(book)
        validate_borrower_limit(student_id=student_id, staff_id=staff_id)

        student = Student.objects.get(pk=student_id) if student_id else None
        staff = Employee.objects.get(pk=staff_id) if staff_id else None

        today = date.today()
        due_date = today + timedelta(days=issue_days)

        issue = BookIssue.objects.create(
            book=book,
            student=student,
            staff=staff,
            issue_date=today,
            due_date=due_date,
            status="issued",
            remarks=remarks,
            issued_by=actor,
        )

        # Decrement available copies
        book.available_copies -= 1
        if book.available_copies == 0:
            book.status = "borrowed"
        book.save(update_fields=["available_copies", "status", "updated_at"])

        # Fulfill reservation if borrower had a pending reservation
        Reservation.objects.filter(
            book=book,
            student=student,
            staff=staff,
            status="pending",
        ).update(status="fulfilled")

        _log_audit(
            book=book,
            issue=issue,
            actor=actor,
            event_type="book_issued",
            description=f"Book '{book.title}' issued to {student or staff}. Due on {due_date}.",
        )
        return issue

    # ------------------------------------------------------------------
    # 3. Return Book
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def return_book(
        issue_id: str,
        return_date: Optional[date] = None,
        remarks: str = "",
        actor=None,
    ) -> BookIssue:
        """
        Process book return:
        1. Calculate fine if returned after due_date.
        2. Set issue status to 'returned'.
        3. Increment book.available_copies.
        """
        try:
            issue = BookIssue.objects.select_for_update().select_related("book").get(pk=issue_id)
        except BookIssue.DoesNotExist:
            raise ValueError(f"BookIssue {issue_id!r} not found.")

        if issue.status == "returned":
            raise ValueError("Book has already been returned.")

        actual_return_date = return_date or date.today()
        fine = LibraryService.calculate_fine(issue.due_date, actual_return_date)

        issue.return_date = actual_return_date
        issue.fine_amount = fine
        issue.status = "returned"
        if remarks:
            issue.remarks = remarks
        issue.save()

        # Increment available copies
        book = issue.book
        book.available_copies += 1
        if book.status == "borrowed" and book.available_copies > 0:
            book.status = "available"
        book.save(update_fields=["available_copies", "status", "updated_at"])

        _log_audit(
            book=book,
            issue=issue,
            actor=actor,
            event_type="book_returned",
            description=f"Book '{book.title}' returned on {actual_return_date}. Fine: ₹{fine}",
        )
        return issue

    # ------------------------------------------------------------------
    # 4. Reserve Book
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def reserve_book(
        book_id: str,
        student_id: Optional[str] = None,
        staff_id: Optional[str] = None,
        actor=None,
    ) -> Reservation:
        """Place a reservation queue entry for a book."""
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            raise ValueError(f"Book {book_id!r} not found.")

        student = Student.objects.get(pk=student_id) if student_id else None
        staff = Employee.objects.get(pk=staff_id) if staff_id else None

        # Check existing pending reservation
        exists = Reservation.objects.filter(
            book=book,
            student=student,
            staff=staff,
            status="pending",
        ).exists()
        if exists:
            raise ValueError("You already have a pending reservation for this book.")

        res = Reservation.objects.create(
            book=book,
            student=student,
            staff=staff,
            status="pending",
        )

        _log_audit(
            book=book,
            actor=actor,
            event_type="reservation_created",
            description=f"Reservation created for '{book.title}' by {student or staff}.",
        )
        return res

    # ------------------------------------------------------------------
    # 5. Calculate Fine
    # ------------------------------------------------------------------

    @staticmethod
    def calculate_fine(
        due_date: date, return_date: Optional[date] = None, fine_rate: decimal.Decimal = FINE_PER_DAY
    ) -> decimal.Decimal:
        """Compute fine for overdue returns."""
        actual_date = return_date or date.today()
        if actual_date <= due_date:
            return decimal.Decimal("0.00")
        days_overdue = (actual_date - due_date).days
        return decimal.Decimal(days_overdue) * fine_rate

    # ------------------------------------------------------------------
    # 6. Report Lost Book
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def lost_book(issue_id: str, replacement_cost: decimal.Decimal, actor=None) -> BookIssue:
        """Mark issued book as lost and assess replacement fee."""
        try:
            issue = BookIssue.objects.select_for_update().select_related("book").get(pk=issue_id)
        except BookIssue.DoesNotExist:
            raise ValueError(f"BookIssue {issue_id!r} not found.")

        issue.status = "lost"
        issue.fine_amount = replacement_cost
        issue.save()

        book = issue.book
        if book.copies > 0:
            book.copies -= 1
        book.status = "lost" if book.available_copies == 0 else book.status
        book.save(update_fields=["copies", "status", "updated_at"])

        _log_audit(
            book=book,
            issue=issue,
            actor=actor,
            event_type="book_lost",
            description=f"Book '{book.title}' reported lost. Replacement cost assessed: ₹{replacement_cost}",
        )
        return issue

    # ------------------------------------------------------------------
    # 7. Report Damaged Book
    # ------------------------------------------------------------------

    @staticmethod
    @transaction.atomic
    def damaged_book(issue_id: str, damage_penalty: decimal.Decimal, actor=None) -> BookIssue:
        """Mark returned book as damaged and assess damage fine."""
        try:
            issue = BookIssue.objects.select_for_update().select_related("book").get(pk=issue_id)
        except BookIssue.DoesNotExist:
            raise ValueError(f"BookIssue {issue_id!r} not found.")

        issue.status = "damaged"
        issue.fine_amount = damage_penalty
        issue.save()

        book = issue.book
        book.status = "damaged"
        book.save(update_fields=["status", "updated_at"])

        _log_audit(
            book=book,
            issue=issue,
            actor=actor,
            event_type="book_damaged",
            description=f"Book '{book.title}' reported damaged. Penalty assessed: ₹{damage_penalty}",
        )
        return issue

    # ------------------------------------------------------------------
    # 8. Book History Query
    # ------------------------------------------------------------------

    @staticmethod
    def book_history(book_id: Optional[str] = None, student_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch circulation log filtered by book or student."""
        qs = BookIssue.objects.select_related("book", "student", "staff")
        if book_id:
            qs = qs.filter(book_id=book_id)
        if student_id:
            qs = qs.filter(student_id=student_id)

        return list(
            qs.order_by("-issue_date").values(
                "id",
                "book__title",
                "book__isbn",
                "student__student_id",
                "staff__employee_id",
                "issue_date",
                "due_date",
                "return_date",
                "fine_amount",
                "status",
            )
        )


def _log_audit(book=None, issue=None, actor=None, event_type="", description=""):
    return LibraryAuditLog.objects.create(
        book=book,
        issue=issue,
        actor=actor,
        event_type=event_type,
        description=description,
    )
