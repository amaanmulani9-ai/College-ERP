from rest_framework import serializers

from .models import (
    Author,
    Book,
    BookCategory,
    BookIssue,
    LibraryAuditLog,
    Publisher,
    Reservation,
)


class BookCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategory
        fields = ["id", "name", "code", "description", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name", "biography", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ["id", "name", "address", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class BookSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    author_name = serializers.CharField(source="author.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    publisher_name = serializers.CharField(source="publisher.name", read_only=True, default="")

    class Meta:
        model = Book
        fields = [
            "id",
            "isbn",
            "barcode",
            "title",
            "author",
            "author_name",
            "publisher",
            "publisher_name",
            "category",
            "category_name",
            "edition",
            "language",
            "copies",
            "available_copies",
            "shelf_number",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "available_copies", "created_at", "updated_at"]


class BookIssueSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_isbn = serializers.CharField(source="book.isbn", read_only=True)
    student_id_str = serializers.CharField(source="student.student_id", read_only=True, default="")
    staff_employee_id = serializers.CharField(source="staff.employee_id", read_only=True, default="")

    class Meta:
        model = BookIssue
        fields = [
            "id",
            "book",
            "book_title",
            "book_isbn",
            "student",
            "student_id_str",
            "staff",
            "staff_employee_id",
            "issue_date",
            "due_date",
            "return_date",
            "fine_amount",
            "status",
            "status_display",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "issue_date", "return_date", "fine_amount", "status", "created_at", "updated_at"]


class ReservationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    book_title = serializers.CharField(source="book.title", read_only=True)

    class Meta:
        model = Reservation
        fields = [
            "id",
            "book",
            "book_title",
            "student",
            "staff",
            "reserved_date",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "reserved_date", "status", "created_at", "updated_at"]


class LibraryAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = LibraryAuditLog
        fields = ["id", "book", "issue", "actor", "actor_email", "event_type", "description", "timestamp"]
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Action Request Serializers
# ---------------------------------------------------------------------------


class IssueBookRequestSerializer(serializers.Serializer):
    book_id = serializers.UUIDField()
    student_id = serializers.UUIDField(required=False, allow_null=True)
    staff_id = serializers.UUIDField(required=False, allow_null=True)
    issue_days = serializers.IntegerField(default=14, min_value=1, max_value=90)
    remarks = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        if not attrs.get("student_id") and not attrs.get("staff_id"):
            raise serializers.ValidationError("Either student_id or staff_id must be provided.")
        return attrs


class ReturnBookRequestSerializer(serializers.Serializer):
    issue_id = serializers.UUIDField()
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class ReserveBookRequestSerializer(serializers.Serializer):
    book_id = serializers.UUIDField()
    student_id = serializers.UUIDField(required=False, allow_null=True)
    staff_id = serializers.UUIDField(required=False, allow_null=True)


class ReportLostBookSerializer(serializers.Serializer):
    issue_id = serializers.UUIDField()
    replacement_cost = serializers.DecimalField(max_digits=10, decimal_places=2)


class ReportDamagedBookSerializer(serializers.Serializer):
    issue_id = serializers.UUIDField()
    damage_penalty = serializers.DecimalField(max_digits=10, decimal_places=2)
