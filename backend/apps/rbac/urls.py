from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    PermissionMatrixView,
    PermissionViewSet,
    RoleMatrixView,
    RoleViewSet,
    UserRoleAssignmentView,
)

app_name = "rbac"

router = DefaultRouter()
router.register(r"roles", RoleViewSet, basename="role")
router.register(r"permissions", PermissionViewSet, basename="permission")

urlpatterns = [
    path("", include(router.urls)),
    path("users/<uuid:user_id>/roles/", UserRoleAssignmentView.as_view(), name="user_roles"),
    path("matrix/permissions/", PermissionMatrixView.as_view(), name="permission_matrix"),
    path("matrix/roles/", RoleMatrixView.as_view(), name="role_matrix"),
]
