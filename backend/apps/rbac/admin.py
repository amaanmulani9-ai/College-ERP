from django.contrib import admin

from .models import Permission, Role, UserRole


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "module", "action", "is_active", "is_system")
    list_filter = ("module", "is_active", "is_system")
    search_fields = ("code", "name", "module")
    ordering = ("module", "code")


class RolePermissionInline(admin.TabularInline):
    model = Role.permissions.through
    extra = 1


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name", "tenant_schema", "priority", "is_active", "is_system", "created_at")
    list_filter = ("tenant_schema", "is_active", "is_system")
    search_fields = ("name", "description")
    ordering = ("-priority", "name")
    filter_horizontal = ("permissions",)


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "assigned_at")
    list_filter = ("role", "assigned_at")
    search_fields = ("user__email", "role__name")
