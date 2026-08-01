from rest_framework.permissions import BasePermission


class IsWardenOrAdmin(BasePermission):
    """
    Allows access for wardens, staff members, or superusers.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)
        )


class IsStudentOrHostelStaff(BasePermission):
    """
    Students can view allocations, vacancy reports, and maintenance tickets.
    Staff/Wardens have full control.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
