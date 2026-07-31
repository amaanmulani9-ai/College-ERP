import pytest
from django.urls import reverse
from apps.tenancy.models import Client, Domain


@pytest.mark.django_db
def test_tenant_creation_and_domain_mapping():
    """Verifies that Client and Domain models store tenant information properly."""
    tenant = Client.objects.create(
        name="Apex College of Technology",
        slug="apex-tech",
        schema_name="tenant_apex",
        contact_email="admin@apex.edu",
        subscription_plan="enterprise",
        is_active=True,
    )
    domain = Domain.objects.create(
        domain="apex.localhost",
        tenant=tenant,
        is_primary=True,
    )

    assert tenant.schema_name == "tenant_apex"
    assert tenant.subscription_plan == "enterprise"
    assert domain.tenant.name == "Apex College of Technology"
    assert domain.is_primary is True


@pytest.mark.django_db
def test_tenancy_api_list_and_create(client):
    """Verifies tenancy REST API list and creation endpoints."""
    # List Tenants
    url = reverse("tenancy:tenant-list")
    response = client.get(url)
    assert response.status_code == 200

    # Create Tenant via API
    payload = {
        "name": "Beacon State University",
        "slug": "beacon-state",
        "schema_name": "tenant_beacon",
        "contact_email": "info@beacon.edu",
        "subscription_plan": "standard",
        "primary_domain": "beacon.localhost",
    }
    response = client.post(url, payload, content_type="application/json")
    assert response.status_code == 201
    assert response.json()["name"] == "Beacon State University"
    assert Client.objects.filter(schema_name="tenant_beacon").exists()


@pytest.mark.django_db
def test_tenancy_api_deactivate(client):
    """Verifies tenant deactivation action endpoint."""
    tenant = Client.objects.create(
        name="Crestwood Academy",
        slug="crestwood",
        schema_name="tenant_crestwood",
        is_active=True,
    )
    deactivate_url = reverse("tenancy:tenant-deactivate", kwargs={"pk": tenant.pk})
    response = client.post(deactivate_url)
    assert response.status_code == 200
    tenant.refresh_from_db()
    assert tenant.is_active is False


@pytest.mark.django_db
def test_structured_health_endpoints(client):
    """Verifies detailed subsystem health endpoints."""
    res_db = client.get(reverse("core:health_database"))
    assert res_db.status_code == 200
    assert res_db.json()["status"] == "healthy"

    res_cache = client.get(reverse("core:health_redis"))
    assert res_cache.status_code == 200
    assert res_cache.json()["status"] == "healthy"

    res_storage = client.get(reverse("core:health_storage"))
    assert res_storage.status_code == 200
    assert res_storage.json()["status"] == "healthy"
