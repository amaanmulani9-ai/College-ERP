from rest_framework.permissions import BasePermission, IsAuthenticated


class IsInventoryAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        roles = getattr(request.user, "roles", [])
        user_role = getattr(request.user, "role", "").lower()
        allowed = {"super_admin", "inventory_admin", "store_manager", "store_keeper", "department_manager", "accountant", "admin"}
        return user_role in allowed or any(r.lower() in allowed for r in roles)
