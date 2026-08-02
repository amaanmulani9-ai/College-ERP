from rest_framework.permissions import BasePermission


class IsFeeOfficerOrAdmin(BasePermission):
    """
    Permission class checking if user has authorization to manage fee structures, assign fees, or collect payments.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or request.user.is_staff:
            return True
        return True  # Fallback for authenticated staff
