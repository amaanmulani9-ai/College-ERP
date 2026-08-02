import logging

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    Author,
    Book,
    BookCategory,
    BookIssue,
    LibraryAuditLog,
    Publisher,
    Reservation,
)
from .permissions import IsLibrarianOrAdmin, IsStudentOrLibrarian
from .serializers import (
    AuthorSerializer,
    BookCategorySerializer,
    BookIssueSerializer,
    BookSerializer,
    IssueBookRequestSerializer,
    LibraryAuditLogSerializer,
    PublisherSerializer,
    ReportDamagedBookSerializer,
    ReportLostBookSerializer,
    ReservationSerializer,
    ReserveBookRequestSerializer,
    ReturnBookRequestSerializer,
)
from .services import LibraryService

logger = logging.getLogger(__name__)


class BookCategoryViewSet(viewsets.ModelViewSet):
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializer
    permission_classes = [IsLibrarianOrAdmin]
    filterset_fields = ["is_active"]
    search_fields = ["name", "code"]


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsLibrarianOrAdmin]
    search_fields = ["name"]


class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [IsLibrarianOrAdmin]
    search_fields = ["name"]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().select_related("author", "publisher", "category")
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "category", "author", "publisher"]
    search_fields = ["title", "isbn", "barcode", "author__name"]

    @action(detail=False, methods=["get"], url_path="history", permission_classes=[IsStudentOrLibrarian])
    def history(self, request):
        """Fetch book circulation history."""
        book_id = request.query_params.get("book_id")
        student_id = request.query_params.get("student_id")
        data = LibraryService.book_history(book_id=book_id, student_id=student_id)
        return Response(data, status=status.HTTP_200_OK)


class BookIssueViewSet(viewsets.ModelViewSet):
    queryset = BookIssue.objects.all().select_related("book", "student", "staff", "issued_by")
    serializer_class = BookIssueSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "book", "student", "staff"]

    def get_permissions(self):
        if self.action in ["issue", "return_book", "lost", "damaged"]:
            return [IsLibrarianOrAdmin()]
        return super().get_permissions()

    @action(detail=False, methods=["post"], url_path="issue")
    def issue(self, request):
        """Issue book to student or staff."""
        serializer = IssueBookRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            issue_obj = LibraryService.issue_book(
                book_id=str(d["book_id"]),
                student_id=str(d["student_id"]) if d.get("student_id") else None,
                staff_id=str(d["staff_id"]) if d.get("staff_id") else None,
                issue_days=d.get("issue_days", 14),
                remarks=d.get("remarks", ""),
                actor=request.user,
            )
            return Response(BookIssueSerializer(issue_obj).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="return")
    def return_book(self, request):
        """Return book & compute overdue fine."""
        serializer = ReturnBookRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            returned = LibraryService.return_book(
                issue_id=str(d["issue_id"]),
                remarks=d.get("remarks", ""),
                actor=request.user,
            )
            return Response(BookIssueSerializer(returned).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="fines", permission_classes=[IsLibrarianOrAdmin])
    def fines_report(self, request):
        """List all issues with outstanding or paid fines."""
        issues = BookIssue.objects.filter(fine_amount__gt=0).select_related("book", "student", "staff")
        return Response(BookIssueSerializer(issues, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="lost")
    def lost(self, request):
        """Report book as lost and assess replacement cost."""
        serializer = ReportLostBookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            issue_obj = LibraryService.lost_book(
                issue_id=str(d["issue_id"]),
                replacement_cost=d["replacement_cost"],
                actor=request.user,
            )
            return Response(BookIssueSerializer(issue_obj).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="damaged")
    def damaged(self, request):
        """Report book as damaged and assess damage fine."""
        serializer = ReportDamagedBookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            issue_obj = LibraryService.damaged_book(
                issue_id=str(d["issue_id"]),
                damage_penalty=d["damage_penalty"],
                actor=request.user,
            )
            return Response(BookIssueSerializer(issue_obj).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all().select_related("book", "student", "staff")
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "book", "student", "staff"]

    @action(detail=False, methods=["post"], url_path="reserve")
    def reserve(self, request):
        """Reserve a book copy."""
        serializer = ReserveBookRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            res = LibraryService.reserve_book(
                book_id=str(d["book_id"]),
                student_id=str(d["student_id"]) if d.get("student_id") else None,
                staff_id=str(d["staff_id"]) if d.get("staff_id") else None,
                actor=request.user,
            )
            return Response(ReservationSerializer(res).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class LibraryAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LibraryAuditLog.objects.all().select_related("book", "issue", "actor")
    serializer_class = LibraryAuditLogSerializer
    permission_classes = [IsLibrarianOrAdmin]
    filterset_fields = ["event_type"]
    search_fields = ["description"]
