from rest_framework.permissions import BasePermission, IsAuthenticated


class IsTransportAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        roles = getattr(request.user, "roles", [])
        user_role = getattr(request.user, "role", "").lower()
        allowed = {"super_admin", "transport_admin", "transport_manager", "admin"}
        return user_role in allowed or any(r.lower() in allowed for r in roles)


class IsTransportAdminManagerOrDriver(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        user_role = getattr(request.user, "role", "").lower()
        allowed = {"super_admin", "transport_admin", "transport_manager", "driver", "faculty", "admin"}
        return user_role in allowed
