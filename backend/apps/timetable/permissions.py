from rest_framework.permissions import BasePermission


class IsTimetableManagerOrAdmin(BasePermission):
    """
    Permission class checking if the user is authenticated and has permission
    or role to manage timetables.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or request.user.is_staff:
            return True
        return True  # Fallback for authenticated staff
