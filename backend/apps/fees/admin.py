from django.contrib import admin
from django.utils.html import format_html

from .models import (
    FeeAuditLog,
    FeeCategory,
    FeeInstallment,
    FeeReceipt,
    FeeStructure,
    StudentFee,
)


# ---------------------------------------------------------------------------
# Inlines
# ---------------------------------------------------------------------------


class FeeInstallmentInline(admin.TabularInline):
    model = FeeInstallment
    extra = 0
    readonly_fields = ("fine_amount", "status")
    fields = ("installment_no", "amount", "due_date", "fine_amount", "status")
    ordering = ("installment_no",)


class FeeReceiptInline(admin.TabularInline):
    model = FeeReceipt
    extra = 0
    readonly_fields = ("receipt_number", "payment_date", "amount", "payment_mode", "status")
    fields = ("receipt_number", "payment_date", "amount", "payment_mode", "status")
    ordering = ("-payment_date",)


class FeeAuditLogInline(admin.TabularInline):
    model = FeeAuditLog
    extra = 0
    readonly_fields = ("event_type", "description", "actor", "timestamp")
    fields = ("event_type", "description", "actor", "timestamp")
    ordering = ("-timestamp",)
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


# ---------------------------------------------------------------------------
# ModelAdmins
# ---------------------------------------------------------------------------


@admin.register(FeeCategory)
class FeeCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "code")
    ordering = ("name",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ("category", "program_name", "semester_name", "academic_session", "amount", "is_active")
    list_filter = ("is_active", "category")
    search_fields = ("category__name", "program__name", "semester__name")
    ordering = ("academic_session", "program", "semester", "category")
    readonly_fields = ("created_at", "updated_at")

    def program_name(self, obj):
        return obj.program.name if obj.program else "—"
    program_name.short_description = "Program"

    def semester_name(self, obj):
        return obj.semester.name if obj.semester else "—"
    semester_name.short_description = "Semester"


@admin.register(StudentFee)
class StudentFeeAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "fee_structure",
        "total_amount",
        "paid_amount",
        "due_amount_display",
        "status",
        "created_at",
    )
    list_filter = ("status", "fee_structure__category")
    search_fields = ("student__user__email", "student__enrollment_number")
    ordering = ("-created_at",)
    readonly_fields = ("paid_amount", "due_amount", "created_at", "updated_at")
    inlines = [FeeInstallmentInline, FeeReceiptInline, FeeAuditLogInline]

    def due_amount_display(self, obj):
        color = "red" if obj.due_amount > 0 else "green"
        return format_html(
            '<span style="color: {};">₹ {}</span>', color, obj.due_amount
        )
    due_amount_display.short_description = "Due Amount"


@admin.register(FeeInstallment)
class FeeInstallmentAdmin(admin.ModelAdmin):
    list_display = ("student_fee", "installment_no", "amount", "due_date", "fine_amount", "status")
    list_filter = ("status",)
    search_fields = ("student_fee__student__user__email",)
    ordering = ("due_date",)
    readonly_fields = ("fine_amount",)


@admin.register(FeeReceipt)
class FeeReceiptAdmin(admin.ModelAdmin):
    list_display = (
        "receipt_number",
        "student",
        "amount",
        "payment_mode",
        "payment_date",
        "status",
    )
    list_filter = ("status", "payment_mode")
    search_fields = ("receipt_number", "student__user__email", "student__enrollment_number")
    ordering = ("-payment_date",)
    readonly_fields = ("receipt_number", "payment_date", "created_at")


@admin.register(FeeAuditLog)
class FeeAuditLogAdmin(admin.ModelAdmin):
    list_display = ("event_type", "student_fee", "receipt", "actor", "timestamp")
    list_filter = ("event_type",)
    search_fields = ("description", "student_fee__student__user__email")
    ordering = ("-timestamp",)
    readonly_fields = ("event_type", "description", "actor", "metadata", "timestamp")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
