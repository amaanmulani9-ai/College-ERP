from apps.authentication.serializers import UserSerializer
from rest_framework import serializers

from .models import Permission, Role, UserRole


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = [
            "id",
            "code",
            "name",
            "description",
            "module",
            "action",
            "is_active",
            "is_system",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class RoleSerializer(serializers.ModelSerializer):
    permissions_count = serializers.IntegerField(source="permissions.count", read_only=True)

    class Meta:
        model = Role
        fields = [
            "id",
            "name",
            "description",
            "tenant_schema",
            "is_active",
            "is_system",
            "priority",
            "permissions",
            "permissions_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "tenant_schema", "created_at", "updated_at"]


class RoleDetailSerializer(RoleSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)


class UserRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserRole
        fields = ["id", "user", "role", "assigned_at"]
        read_only_fields = ["id", "assigned_at"]


class CloneRoleSerializer(serializers.Serializer):
    new_name = serializers.CharField(max_length=100, required=True)
    new_description = serializers.CharField(required=False, allow_blank=True)


class AssignRoleToUserSerializer(serializers.Serializer):
    role_id = serializers.UUIDField(required=True)


class AssignPermissionToRoleSerializer(serializers.Serializer):
    permission_id = serializers.UUIDField(required=True)
