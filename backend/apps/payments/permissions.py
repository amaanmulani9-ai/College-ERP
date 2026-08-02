from rest_framework.permissions import BasePermission


class IsPaymentOfficerOrAdmin(BasePermission):
    """
    Allows access to payment operations only for authenticated staff or superusers.
    Fee officers (is_staff) can manage payments and refunds.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)
        )


class IsStudentOrPaymentOfficer(BasePermission):
    """
    Students can view their own payment history.
    Staff can see all.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
