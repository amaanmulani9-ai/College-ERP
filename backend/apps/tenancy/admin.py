from django.contrib import admin

from .models import Client, Domain


class DomainInline(admin.TabularInline):
    model = Domain
    extra = 1


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "schema_name",
        "subscription_plan",
        "is_active",
        "contact_email",
        "created_at",
    )
    list_filter = ("is_active", "subscription_plan", "created_at")
    search_fields = ("name", "slug", "schema_name", "contact_email")
    readonly_fields = ("id", "created_at", "updated_at")
    inlines = [DomainInline]
    actions = ["suspend_colleges", "activate_colleges"]

    @admin.action(description="Suspend selected college tenants")
    def suspend_colleges(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f"Successfully suspended {count} college tenant(s).")

    @admin.action(description="Activate selected college tenants")
    def activate_colleges(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f"Successfully activated {count} college tenant(s).")


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ("domain", "tenant", "is_primary")
    list_filter = ("is_primary",)
    search_fields = ("domain", "tenant__name")
