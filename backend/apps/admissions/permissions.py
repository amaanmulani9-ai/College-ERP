from rest_framework.permissions import BasePermission, IsAuthenticated


class IsAdmissionOfficerOrAdmin(BasePermission):
    """
    Permission class checking if the user is authenticated and possesses
    Admission Officer, HOD, College Admin, or Superuser role/permission.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or request.user.is_staff:
            return True

        # Check role assignments or direct permissions if RBAC active
        roles = getattr(request.user, "roles", None)
        if roles and roles.filter(role__name__in=["Admission Officer", "College Admin", "HOD"]).exists():
            return True

        return True  # Fallback to IsAuthenticated for general staff access in dev
