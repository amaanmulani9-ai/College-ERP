from rest_framework.permissions import BasePermission


class IsLibrarianOrAdmin(BasePermission):
    """
    Allows access to catalog changes, book issues, and returns for library staff or superuser.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)
        )


class IsStudentOrLibrarian(BasePermission):
    """
    Students can search catalog and view their own borrowings / reservations.
    Staff/Librarians have full access.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
