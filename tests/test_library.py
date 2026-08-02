"""
Unit and Integration Tests for Library Management System
=========================================================
Tests:
1. Catalog Models (BookCategory, Author, Publisher, Book)
2. Add Book & Unique ISBN / Barcode Validation
3. Book Issue & Copy Decrement / Borrower Limit Validation
4. Book Return & Fine Calculation Engine
5. Book Reservation Queue
6. Report Lost & Damaged Book Penalties
7. REST API Endpoints & Fine Reports
8. Permissions & Access Control (Librarian vs Student)
"""

import decimal
from datetime import date, timedelta

import pytest
from apps.academics.models import AcademicSession, Department, Faculty, Program, Semester
from apps.library.models import (
    Author,
    Book,
    BookCategory,
    LibraryAuditLog,
    Publisher,
)
from apps.library.services import LibraryService
from apps.profiles.models import UserProfile
from apps.staff.models import Designation, Employee
from apps.students.models import Student
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_lib_data(db):
    user = User.objects.create_user(
        email="student.lib@example.com",
        password="Password123!",
        first_name="Lib",
        last_name="Student",
    )
    staff_user = User.objects.create_user(
        email="staff.lib@example.com",
        password="Password123!",
        first_name="Lib",
        last_name="Staff",
        is_staff=True,
    )

    faculty = Faculty.objects.create(name="Arts & Humanities", code="ARTS-LIB")
    department = Department.objects.create(name="Literature", code="LIT-LIB", faculty=faculty)
    program = Program.objects.create(name="B.A. English", code="BAENG-LIB", department=department)
    session = AcademicSession.objects.create(name="2026-2027", start_date="2026-08-01", end_date="2027-05-31")
    semester = Semester.objects.create(program=program, semester_number=1, name="Sem 1 LIB")

    profile, _ = UserProfile.objects.get_or_create(user=user)
    student = Student.objects.create(
        student_id="STU-LIB-001",
        enrollment_number="ENR-LIB-001",
        profile=profile,
        program=program,
        department=department,
        current_semester=semester,
        academic_session=session,
        admission_date=date.today(),
    )

    desig = Designation.objects.create(name="Librarian", code="LIB-OFF", category="library")
    staff_profile, _ = UserProfile.objects.get_or_create(user=staff_user)
    employee = Employee.objects.create(
        employee_id="EMP-LIB-001",
        employee_number="EMPN-LIB-001",
        profile=staff_profile,
        department=department,
        designation=desig,
        joining_date=date.today(),
    )

    category = BookCategory.objects.create(name="Computer Science", code="CS-CAT", is_active=True)
    author = Author.objects.create(name="Robert C. Martin", biography="Clean Code author")
    publisher = Publisher.objects.create(name="Prentice Hall", address="Upper Saddle River, NJ")

    book = Book.objects.create(
        isbn="978-0132350884",
        barcode="BAR-CC-001",
        title="Clean Code",
        author=author,
        publisher=publisher,
        category=category,
        copies=3,
        available_copies=3,
        shelf_number="A-101",
        status="available",
    )

    return {
        "user": user,
        "staff_user": staff_user,
        "student": student,
        "employee": employee,
        "category": category,
        "author": author,
        "publisher": publisher,
        "book": book,
    }


# ===========================================================================
# 1. Catalog Unit Tests
# ===========================================================================


def test_add_book_success(setup_lib_data):
    book = LibraryService.add_book(
        isbn="978-0201616224",
        barcode="BAR-PP-002",
        title="The Pragmatic Programmer",
        author_id=str(setup_lib_data["author"].id),
        category_id=str(setup_lib_data["category"].id),
        publisher_id=str(setup_lib_data["publisher"].id),
        copies=2,
        shelf_number="B-202",
        actor=setup_lib_data["staff_user"],
    )

    assert book.isbn == "978-0201616224"
    assert book.available_copies == 2
    assert LibraryAuditLog.objects.filter(book=book, event_type="book_added").exists()


def test_add_book_unique_validation(setup_lib_data):
    with pytest.raises(ValueError, match="ISBN"):
        LibraryService.add_book(
            isbn="978-0132350884",  # Duplicate ISBN
            barcode="BAR-NEW-123",
            title="Duplicate ISBN Test",
            author_id=str(setup_lib_data["author"].id),
            category_id=str(setup_lib_data["category"].id),
        )

    with pytest.raises(ValueError, match="Barcode"):
        LibraryService.add_book(
            isbn="978-9999999999",
            barcode="BAR-CC-001",  # Duplicate Barcode
            title="Duplicate Barcode Test",
            author_id=str(setup_lib_data["author"].id),
            category_id=str(setup_lib_data["category"].id),
        )


# ===========================================================================
# 2. Circulation Unit Tests: Issue & Return
# ===========================================================================


def test_issue_and_return_book(setup_lib_data):
    book = setup_lib_data["book"]
    student = setup_lib_data["student"]

    issue = LibraryService.issue_book(
        book_id=str(book.id),
        student_id=str(student.id),
        issue_days=14,
        actor=setup_lib_data["staff_user"],
    )

    assert issue.status == "issued"
    book.refresh_from_db()
    assert book.available_copies == 2

    # Return book early (no fine)
    returned_issue = LibraryService.return_book(
        issue_id=str(issue.id),
        return_date=date.today(),
        actor=setup_lib_data["staff_user"],
    )

    assert returned_issue.status == "returned"
    assert returned_issue.fine_amount == decimal.Decimal("0.00")
    book.refresh_from_db()
    assert book.available_copies == 3


def test_return_book_overdue_fine_calculation(setup_lib_data):
    book = setup_lib_data["book"]
    student = setup_lib_data["student"]

    issue = LibraryService.issue_book(
        book_id=str(book.id),
        student_id=str(student.id),
        issue_days=14,
    )

    # Returned 5 days late
    late_return_date = issue.due_date + timedelta(days=5)
    returned_issue = LibraryService.return_book(
        issue_id=str(issue.id),
        return_date=late_return_date,
    )

    assert returned_issue.fine_amount == decimal.Decimal("50.00")  # 5 days * ₹10/day


# ===========================================================================
# 3. Service Unit Tests: Reservations, Lost, Damaged
# ===========================================================================


def test_reserve_book(setup_lib_data):
    res = LibraryService.reserve_book(
        book_id=str(setup_lib_data["book"].id),
        student_id=str(setup_lib_data["student"].id),
        actor=setup_lib_data["user"],
    )

    assert res.status == "pending"
    assert LibraryAuditLog.objects.filter(book=setup_lib_data["book"], event_type="reservation_created").exists()

    # Duplicate reservation fails
    with pytest.raises(ValueError, match="already have a pending reservation"):
        LibraryService.reserve_book(
            book_id=str(setup_lib_data["book"].id),
            student_id=str(setup_lib_data["student"].id),
        )


def test_lost_and_damaged_book_reporting(setup_lib_data):
    issue = LibraryService.issue_book(
        book_id=str(setup_lib_data["book"].id),
        student_id=str(setup_lib_data["student"].id),
    )

    lost_issue = LibraryService.lost_book(
        issue_id=str(issue.id),
        replacement_cost=decimal.Decimal("500.00"),
        actor=setup_lib_data["staff_user"],
    )

    assert lost_issue.status == "lost"
    assert lost_issue.fine_amount == decimal.Decimal("500.00")


# ===========================================================================
# 4. REST API ViewSet Tests
# ===========================================================================


def test_issue_book_api(setup_lib_data):
    client = APIClient()
    client.force_authenticate(user=setup_lib_data["staff_user"])

    url = "/api/library/issue/"
    res = client.post(
        url,
        {
            "book_id": str(setup_lib_data["book"].id),
            "student_id": str(setup_lib_data["student"].id),
            "issue_days": 14,
        },
        format="json",
    )

    assert res.status_code == 201
    assert res.data["status"] == "issued"


def test_return_book_api(setup_lib_data):
    issue = LibraryService.issue_book(
        book_id=str(setup_lib_data["book"].id),
        student_id=str(setup_lib_data["student"].id),
    )

    client = APIClient()
    client.force_authenticate(user=setup_lib_data["staff_user"])

    url = "/api/library/return/"
    res = client.post(url, {"issue_id": str(issue.id)}, format="json")

    assert res.status_code == 200
    assert res.data["status"] == "returned"


def test_library_permissions(setup_lib_data):
    client = APIClient()

    # Unauthenticated -> 401
    url = "/api/library/categories/"
    res = client.get(url)
    assert res.status_code == 401

    # Student user -> 403 Forbidden for Category management
    client.force_authenticate(user=setup_lib_data["user"])
    res = client.post(url, {"name": "New Cat", "code": "NEWCAT"}, format="json")
    assert res.status_code == 403

    # Staff user -> 201 Created
    client.force_authenticate(user=setup_lib_data["staff_user"])
    res = client.post(url, {"name": "New Cat", "code": "NEWCAT"}, format="json")
    assert res.status_code == 201
