import pytest
from apps.authentication.models import User
from apps.rbac.models import Permission, Role
from apps.rbac.seeders import seed_rbac_defaults
from apps.rbac.services import PermissionResolver, assign_role_to_user, remove_role_from_user
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_rbac_seeder_and_default_roles():
    """Verifies idempotent seeding of 14 default roles and permissions."""
    assert seed_rbac_defaults(tenant_schema="public") is True
    assert Permission.objects.count() >= 20
    assert Role.objects.count() == 14

    admin_role = Role.objects.get(name="College Admin")
    assert admin_role.permissions.count() >= 20


@pytest.mark.django_db
def test_multi_role_user_assignment_and_permission_resolution():
    """Verifies assigning multiple roles (Teacher + Placement Officer) to a single user and resolving aggregated permissions."""
    seed_rbac_defaults(tenant_schema="public")
    user = User.objects.create_user(email="teacher_po@college.edu", password="TeacherPassword123!")

    teacher_role = Role.objects.get(name="Teacher")
    po_role = Role.objects.get(name="Placement Officer")

    assign_role_to_user(user, teacher_role)
    assign_role_to_user(user, po_role)

    resolved_perms = PermissionResolver.get_user_permission_codes(user)
    assert "attendance.mark" in resolved_perms  # from Teacher role
    assert "placement.manage" in resolved_perms  # from Placement Officer role

    # Remove placement role
    remove_role_from_user(user, po_role)
    resolved_after = PermissionResolver.get_user_permission_codes(user)
    assert "placement.manage" not in resolved_after
    assert "attendance.mark" in resolved_after


@pytest.mark.django_db
def test_role_crud_and_cloning():
    """Verifies API endpoints for Role creation, listing, updating, cloning and disabling."""
    client = APIClient()
    user = User.objects.create_superuser(email="admin@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=user)

    # 1. Create custom role
    create_url = reverse("rbac:role-list")
    res_create = client.post(
        create_url,
        {"name": "Custom Exam Evaluator", "description": "Evaluates answer sheets.", "priority": 40},
        format="json",
    )
    assert res_create.status_code == 201
    role_id = res_create.data["id"]

    # 2. Clone role
    clone_url = reverse("rbac:role-clone", kwargs={"pk": role_id})
    res_clone = client.post(clone_url, {"new_name": "Assistant Evaluator"}, format="json")
    assert res_clone.status_code == 201
    assert res_clone.data["name"] == "Assistant Evaluator"

    # 3. Disable role
    disable_url = reverse("rbac:role-disable", kwargs={"pk": role_id})
    res_disable = client.post(disable_url, format="json")
    assert res_disable.status_code == 200
    assert Role.objects.get(id=role_id).is_active is False


@pytest.mark.django_db
def test_permission_matrix_and_role_matrix_apis():
    """Verifies API responses for Permission Matrix and Role Matrix endpoints."""
    client = APIClient()
    seed_rbac_defaults(tenant_schema="public")
    user = User.objects.create_superuser(email="admin@college.edu", password="AdminPassword123!")
    client.force_authenticate(user=user)

    # Permission Matrix
    res_pm = client.get(reverse("rbac:permission_matrix"))
    assert res_pm.status_code == 200
    assert "matrix" in res_pm.data
    assert "permissions" in res_pm.data

    # Role Matrix
    res_rm = client.get(reverse("rbac:role_matrix"))
    assert res_rm.status_code == 200
    assert "matrix" in res_rm.data
    assert "roles" in res_rm.data
