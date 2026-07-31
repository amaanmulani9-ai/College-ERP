from rest_framework.permissions import BasePermission


class IsScholarshipOfficerOrAdmin(BasePermission):
    """
    Allows access to scholarship approvals and type management only for staff/admin.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )


class IsStudentOrScholarshipOfficer(BasePermission):
    """
    Students can view/submit their own applications.
    Staff/Admin can access all records.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
