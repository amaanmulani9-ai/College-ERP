from django.db import connection
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.models import User
from apps.authentication.services import log_audit_event
from .models import Permission, Role, UserRole
from .permissions import RequirePermission
from .serializers import (
    AssignPermissionToRoleSerializer,
    AssignRoleToUserSerializer,
    CloneRoleSerializer,
    PermissionSerializer,
    RoleDetailSerializer,
    RoleSerializer,
    UserRoleSerializer,
)
from .services import PermissionResolver, assign_role_to_user, remove_role_from_user


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["code", "name", "module"]
    filterset_fields = ["module", "is_active", "is_system"]


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "description"]
    filterset_fields = ["is_active", "is_system"]

    def get_serializer_class(self):
        if self.action in ["retrieve", "update", "partial_update"]:
            return RoleDetailSerializer
        return RoleSerializer

    def get_queryset(self):
        schema_name = getattr(connection, "schema_name", "public")
        return Role.objects.filter(tenant_schema__in=[schema_name, "public"])

    def perform_create(self, serializer):
        schema_name = getattr(connection, "schema_name", "public")
        role = serializer.save(tenant_schema=schema_name)
        log_audit_event(
            self.request,
            event_type="role_created",
            user=self.request.user,
            details={"role_id": str(role.id), "name": role.name},
        )

    @action(detail=True, methods=["post"])
    def clone(self, request, pk=None):
        role = self.get_object()
        serializer = CloneRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_name = serializer.validated_data["new_name"]
        new_desc = serializer.validated_data.get("new_description", f"Cloned from {role.name}")
        schema_name = getattr(connection, "schema_name", "public")

        cloned_role = Role.objects.create(
            name=new_name,
            description=new_desc,
            tenant_schema=schema_name,
            priority=role.priority,
            is_system=False,
            is_active=True,
        )
        cloned_role.permissions.set(role.permissions.all())

        log_audit_event(
            request,
            event_type="role_cloned",
            user=request.user,
            details={"source_role": str(role.id), "new_role_id": str(cloned_role.id)},
        )

        return Response(RoleDetailSerializer(cloned_role).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="assign-permission")
    def assign_permission(self, request, pk=None):
        role = self.get_object()
        serializer = AssignPermissionToRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        perm = Permission.objects.get(id=serializer.validated_data["permission_id"])
        role.permissions.add(perm)

        # Invalidate cache for users holding this role
        for ur in UserRole.objects.filter(role=role):
            PermissionResolver.invalidate_user_cache(ur.user_id)

        log_audit_event(
            request,
            event_type="role_permission_assigned",
            user=request.user,
            details={"role": role.name, "permission_code": perm.code},
        )

        return Response({"detail": f"Permission '{perm.code}' assigned to role '{role.name}'."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="remove-permission")
    def remove_permission(self, request, pk=None):
        role = self.get_object()
        serializer = AssignPermissionToRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        perm = Permission.objects.get(id=serializer.validated_data["permission_id"])
        role.permissions.remove(perm)

        for ur in UserRole.objects.filter(role=role):
            PermissionResolver.invalidate_user_cache(ur.user_id)

        log_audit_event(
            request,
            event_type="role_permission_removed",
            user=request.user,
            details={"role": role.name, "permission_code": perm.code},
        )

        return Response({"detail": f"Permission '{perm.code}' removed from role '{role.name}'."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def disable(self, request, pk=None):
        role = self.get_object()
        role.is_active = False
        role.save()

        for ur in UserRole.objects.filter(role=role):
            PermissionResolver.invalidate_user_cache(ur.user_id)

        return Response({"detail": f"Role '{role.name}' disabled."}, status=status.HTTP_200_OK)


class UserRoleAssignmentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignRoleToUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            role = Role.objects.get(id=serializer.validated_data["role_id"])
        except Role.DoesNotExist:
            return Response({"detail": "Role not found."}, status=status.HTTP_404_NOT_FOUND)

        assign_role_to_user(user, role, actor=request.user, request=request)
        return Response({"detail": f"Role '{role.name}' assigned to {user.email}."}, status=status.HTTP_200_OK)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignRoleToUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            role = Role.objects.get(id=serializer.validated_data["role_id"])
        except Role.DoesNotExist:
            return Response({"detail": "Role not found."}, status=status.HTTP_404_NOT_FOUND)

        remove_role_from_user(user, role, actor=request.user, request=request)
        return Response({"detail": f"Role '{role.name}' removed from {user.email}."}, status=status.HTTP_200_OK)


class PermissionMatrixView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = Role.objects.filter(is_active=True).prefetch_related("permissions")
        permissions = Permission.objects.filter(is_active=True)

        matrix = []
        for role in roles:
            assigned_codes = set(role.permissions.values_list("code", flat=True))
            matrix.append({
                "role_id": str(role.id),
                "role_name": role.name,
                "permissions": {perm.code: (perm.code in assigned_codes) for perm in permissions}
            })

        return Response({
            "permissions": PermissionSerializer(permissions, many=True).data,
            "matrix": matrix
        }, status=status.HTTP_200_OK)


class RoleMatrixView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.filter(is_active=True).prefetch_related("user_roles__role")
        roles = Role.objects.filter(is_active=True)

        matrix = []
        for user in users:
            user_assigned_roles = set(user.user_roles.values_list("role_id", flat=True))
            matrix.append({
                "user_id": str(user.id),
                "email": user.email,
                "full_name": user.get_full_name(),
                "roles": {str(role.id): (role.id in user_assigned_roles) for role in roles}
            })

        return Response({
            "roles": RoleSerializer(roles, many=True).data,
            "matrix": matrix
        }, status=status.HTTP_200_OK)
