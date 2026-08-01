from django.contrib import admin

from .models import (
    Author,
    Book,
    BookCategory,
    BookIssue,
    LibraryAuditLog,
    Publisher,
    Reservation,
)


@admin.register(BookCategory)
class BookCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "code")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "isbn",
        "barcode",
        "author",
        "category",
        "copies",
        "available_copies",
        "shelf_number",
        "status",
    )
    list_filter = ("status", "category", "language")
    search_fields = ("title", "isbn", "barcode", "author__name")
    readonly_fields = ("id", "available_copies", "created_at", "updated_at")


@admin.register(BookIssue)
class BookIssueAdmin(admin.ModelAdmin):
    list_display = ("book", "student", "staff", "issue_date", "due_date", "return_date", "fine_amount", "status")
    list_filter = ("status",)
    search_fields = ("book__title", "student__student_id", "staff__employee_id")
    readonly_fields = ("id", "issue_date", "return_date", "fine_amount", "created_at", "updated_at")


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("book", "student", "staff", "reserved_date", "status")
    list_filter = ("status",)
    search_fields = ("book__title", "student__student_id")
    readonly_fields = ("id", "reserved_date", "created_at", "updated_at")


@admin.register(LibraryAuditLog)
class LibraryAuditLogAdmin(admin.ModelAdmin):
    list_display = ("event_type", "book", "description_short", "actor", "timestamp")
    list_filter = ("event_type",)
    search_fields = ("description", "book__title")
    readonly_fields = ("id", "book", "issue", "actor", "event_type", "description", "timestamp")

    def description_short(self, obj):
        return obj.description[:60]

    description_short.short_description = "Description"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
