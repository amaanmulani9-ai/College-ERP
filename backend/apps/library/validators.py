"""
Library Validators
==================
- ISBN uniqueness & format check
- Barcode uniqueness check
- Book availability check
- Borrower issue limit check
"""

from typing import Optional


def validate_isbn_unique(isbn: str, exclude_id: Optional[str] = None) -> None:
    """Raise ValueError if ISBN already exists."""
    from .models import Book

    qs = Book.objects.filter(isbn=isbn)
    if exclude_id:
        qs = qs.exclude(id=exclude_id)
    if qs.exists():
        raise ValueError(f"Book with ISBN {isbn!r} already exists.")


def validate_barcode_unique(barcode: str, exclude_id: Optional[str] = None) -> None:
    """Raise ValueError if Barcode already exists."""
    from .models import Book

    qs = Book.objects.filter(barcode=barcode)
    if exclude_id:
        qs = qs.exclude(id=exclude_id)
    if qs.exists():
        raise ValueError(f"Book with Barcode {barcode!r} already exists.")


def validate_book_available(book) -> None:
    """Raise ValueError if book has 0 available copies or non-available status."""
    if book.available_copies <= 0:
        raise ValueError(f"No available copies for book '{book.title}'. (Available: 0)")
    if book.status not in ["available", "borrowed"]:
        raise ValueError(f"Book '{book.title}' is currently marked as {book.status!r} and cannot be issued.")


def validate_borrower_limit(
    student_id: Optional[str] = None, staff_id: Optional[str] = None, max_limit: int = 3
) -> None:
    """Ensure student or staff hasn't exceeded active issued books limit."""
    from .models import BookIssue

    if student_id:
        active_count = BookIssue.objects.filter(student_id=student_id, status="issued").count()
        if active_count >= max_limit:
            raise ValueError(f"Student has reached maximum active borrowing limit of {max_limit} books.")
    elif staff_id:
        active_count = BookIssue.objects.filter(staff_id=staff_id, status="issued").count()
        if active_count >= 5:  # Staff max limit 5
            raise ValueError("Staff member has reached maximum active borrowing limit of 5 books.")
    else:
        raise ValueError("Must specify either student_id or staff_id for borrower validation.")
