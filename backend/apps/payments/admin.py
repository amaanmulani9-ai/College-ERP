from django.contrib import admin

from .models import (
    PaymentAuditLog,
    PaymentGateway,
    PaymentOrder,
    PaymentTransaction,
    Refund,
    WebhookLog,
)

# ---------------------------------------------------------------------------
# Inlines
# ---------------------------------------------------------------------------


class PaymentTransactionInline(admin.TabularInline):
    model = PaymentTransaction
    extra = 0
    readonly_fields = ("transaction_id", "gateway_payment_id", "amount", "currency", "status", "paid_at")
    fields = ("transaction_id", "amount", "currency", "status", "paid_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class RefundInline(admin.TabularInline):
    model = Refund
    extra = 0
    readonly_fields = ("refund_id", "amount", "reason", "status", "processed_at")
    fields = ("refund_id", "amount", "reason", "status", "processed_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class PaymentAuditLogInline(admin.TabularInline):
    model = PaymentAuditLog
    extra = 0
    readonly_fields = ("event_type", "description", "actor", "timestamp")
    fields = ("event_type", "description", "actor", "timestamp")
    ordering = ("-timestamp",)
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


# ---------------------------------------------------------------------------
# Model Admins
# ---------------------------------------------------------------------------


@admin.register(PaymentGateway)
class PaymentGatewayAdmin(admin.ModelAdmin):
    list_display = ("name", "provider", "is_active", "created_at")
    list_filter = ("provider", "is_active")
    search_fields = ("name", "provider")
    readonly_fields = ("id", "created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("id", "name", "provider", "is_active")}),
        ("Configuration (do not store plaintext secrets here)", {"fields": ("config",), "classes": ("collapse",)}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(PaymentOrder)
class PaymentOrderAdmin(admin.ModelAdmin):
    list_display = ("order_id", "student", "amount", "currency", "status", "gateway", "created_at")
    list_filter = ("status", "gateway", "currency")
    search_fields = ("order_id", "student__student_id")
    readonly_fields = ("id", "order_id", "gateway_response", "created_at", "updated_at")
    ordering = ("-created_at",)
    inlines = [PaymentTransactionInline, PaymentAuditLogInline]


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "transaction_id",
        "student",
        "amount",
        "currency",
        "status",
        "gateway",
        "paid_at",
        "created_at",
    )
    list_filter = ("status", "gateway", "currency")
    search_fields = ("transaction_id", "order_id", "gateway_payment_id", "student__student_id")
    readonly_fields = (
        "id",
        "transaction_id",
        "gateway_payment_id",
        "gateway_signature",
        "gateway_response",
        "paid_at",
        "created_at",
        "updated_at",
    )
    ordering = ("-created_at",)
    inlines = [RefundInline, PaymentAuditLogInline]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(WebhookLog)
class WebhookLogAdmin(admin.ModelAdmin):
    list_display = ("event_type", "event_id", "gateway", "is_processed", "processing_error", "received_at")
    list_filter = ("is_processed", "event_type", "gateway")
    search_fields = ("event_id", "event_type")
    readonly_fields = (
        "id",
        "gateway",
        "event_id",
        "event_type",
        "payload",
        "headers",
        "is_processed",
        "processing_error",
        "received_at",
    )
    ordering = ("-received_at",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ("refund_id", "transaction", "amount", "status", "initiated_by", "processed_at", "created_at")
    list_filter = ("status",)
    search_fields = ("refund_id", "transaction__transaction_id")
    readonly_fields = ("id", "refund_id", "gateway_response", "processed_at", "created_at", "updated_at")
    ordering = ("-created_at",)


@admin.register(PaymentAuditLog)
class PaymentAuditLogAdmin(admin.ModelAdmin):
    list_display = ("event_type", "description_short", "actor", "timestamp")
    list_filter = ("event_type",)
    search_fields = ("description", "transaction__transaction_id")
    readonly_fields = ("id", "transaction", "order", "actor", "event_type", "description", "metadata", "timestamp")
    ordering = ("-timestamp",)

    def description_short(self, obj):
        return obj.description[:60]

    description_short.short_description = "Description"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
