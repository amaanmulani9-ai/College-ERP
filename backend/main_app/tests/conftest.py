import pytest
from django.utils import timezone
from main_app.models import CustomUser

@pytest.fixture(autouse=True)
def timezone_settings(settings):
    """Ensure consistent timezone."""
    settings.TIME_ZONE = 'UTC'

@pytest.fixture
def student_user(db):
    """Create a student test user."""
    return CustomUser.objects.create_user(
        email='student@example.com',
        password='studentpass123',
        user_type='3',
        first_name='Student',
        last_name='User'
    )

@pytest.fixture
def admin_user(db):
    """Create an admin test user."""
    return CustomUser.objects.create_superuser(
        email='admin@example.com',
        password='adminpass123',
        user_type='1',
        first_name='Admin',
        last_name='User'
    )

@pytest.fixture
def staff_user(db):
    """Create a staff test user."""
    return CustomUser.objects.create_user(
        email='staff@example.com',
        password='staffpass123',
        user_type='2',
        first_name='Staff',
        last_name='User'
    )

@pytest.fixture
def authenticated_student_client(client, student_user):
    """Return an authenticated student client."""
    client.force_login(student_user)
    return client

@pytest.fixture
def authenticated_admin_client(client, admin_user):
    """Return an authenticated admin client."""
    client.force_login(admin_user)
    return client

@pytest.fixture
def authenticated_staff_client(client, staff_user):
    """Return an authenticated staff client."""
    client.force_login(staff_user)
    return client
