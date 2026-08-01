from django.db import connection
from rest_framework.permissions import BasePermission

from .models import UserRole
from .services import PermissionResolver


class RequirePermission(BasePermission):
    """DRF Permission Class enforcing a specific required permission code."""

    def __init__(self, permission_code=None):
        self.permission_code = permission_code

    def __call__(self):
        return self

    def has_permission(self, request, view):
        required_perm = getattr(view, "required_permission", self.permission_code)
        if not required_perm:
            return True

        user_perms = PermissionResolver.get_user_permission_codes(request.user)
        return required_perm in user_perms


class RequireAnyPermission(BasePermission):
    """DRF Permission Class enforcing at least one matching permission code."""

    def __init__(self, permission_codes=None):
        self.permission_codes = permission_codes or []

    def __call__(self):
        return self

    def has_permission(self, request, view):
        required_perms = getattr(view, "required_any_permissions", self.permission_codes)
        if not required_perms:
            return True

        user_perms = PermissionResolver.get_user_permission_codes(request.user)
        return any(perm in user_perms for perm in required_perms)


class RequireAllPermissions(BasePermission):
    """DRF Permission Class enforcing all specified permission codes."""

    def __init__(self, permission_codes=None):
        self.permission_codes = permission_codes or []

    def __call__(self):
        return self

    def has_permission(self, request, view):
        required_perms = getattr(view, "required_all_permissions", self.permission_codes)
        if not required_perms:
            return True

        user_perms = PermissionResolver.get_user_permission_codes(request.user)
        return all(perm in user_perms for perm in required_perms)


class RequireRole(BasePermission):
    """DRF Permission Class enforcing assignment of a specific role."""

    def __init__(self, role_name=None):
        self.role_name = role_name

    def __call__(self):
        return self

    def has_permission(self, request, view):
        role_name = getattr(view, "required_role", self.role_name)
        if not role_name or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        return UserRole.objects.filter(user=request.user, role__name=role_name, role__is_active=True).exists()


class TenantOwnershipValidation(BasePermission):
    """Validates that requested objects belong strictly to the active tenant schema context."""

    def has_object_permission(self, request, view, obj):
        active_schema = getattr(connection, "schema_name", "public")
        obj_schema = getattr(obj, "tenant_schema", None)

        if obj_schema and obj_schema != active_schema and active_schema != "public":
            return False
        return True
