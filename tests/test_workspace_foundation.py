import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_health_check_endpoint(client):
    """Verifies that the health check endpoint returns 200 OK."""
    url = reverse("core:health")
    response = client.get(url)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "college-erp-api"

def test_workspace_settings_configuration():
    """Verifies essential framework configurations."""
    from django.conf import settings
    assert "rest_framework" in settings.INSTALLED_APPS
    assert "django_tenants" in settings.SHARED_APPS
    assert "corsheaders" in settings.INSTALLED_APPS
    assert "whitenoise.middleware.WhiteNoiseMiddleware" in settings.MIDDLEWARE
