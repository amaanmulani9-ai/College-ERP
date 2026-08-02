from apps.authentication.services import log_audit_event
from django.core.cache import cache
from django.db import connection

from .models import Permission, UserRole


class PermissionResolver:
    """Resolves and caches permissions for a given user across all assigned roles."""

    CACHE_TTL = 3600  # 1 hour

    @classmethod
    def get_cache_key(cls, user_id):
        schema_name = getattr(connection, "schema_name", "public")
        return f"rbac:{schema_name}:user:{user_id}:permissions"

    @classmethod
    def get_user_permission_codes(cls, user):
        if not user or not user.is_authenticated:
            return set()

        if user.is_superuser:
            return set(Permission.objects.filter(is_active=True).values_list("code", flat=True))

        cache_key = cls.get_cache_key(user.id)
        cached_perms = cache.get(cache_key)
        if cached_perms is not None:
            return set(cached_perms)

        # Resolve permissions from active user roles
        role_ids = UserRole.objects.filter(user=user, role__is_active=True).values_list("role_id", flat=True)
        permission_codes = set(
            Permission.objects.filter(roles__id__in=role_ids, is_active=True).values_list("code", flat=True)
        )

        cache.set(cache_key, list(permission_codes), cls.CACHE_TTL)
        return permission_codes

    @classmethod
    def invalidate_user_cache(cls, user_id):
        cache_key = cls.get_cache_key(user_id)
        cache.delete(cache_key)


def assign_role_to_user(user, role, actor=None, request=None):
    user_role, created = UserRole.objects.get_or_create(user=user, role=role)
    PermissionResolver.invalidate_user_cache(user.id)

    if request:
        log_audit_event(
            request,
            event_type="role_assigned",
            user=actor or request.user,
            details={"target_user": str(user.id), "role_name": role.name, "role_id": str(role.id)},
        )
    return user_role


def remove_role_from_user(user, role, actor=None, request=None):
    UserRole.objects.filter(user=user, role=role).delete()
    PermissionResolver.invalidate_user_cache(user.id)

    if request:
        log_audit_event(
            request,
            event_type="role_removed",
            user=actor or request.user,
            details={"target_user": str(user.id), "role_name": role.name, "role_id": str(role.id)},
        )
    return True
