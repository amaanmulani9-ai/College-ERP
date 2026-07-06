import pytest
from django.urls import reverse
from main_app.tests.factories import CustomUserFactory, StaffFactory
from main_app.models import Admin, RulesRegulation

pytestmark = pytest.mark.django_db

class TestHODJobLetterViews:
    
    @pytest.fixture
    def admin_client(self, client):
        admin_user = CustomUserFactory(user_type='1', email='admin@test.com')
        Admin.objects.create(admin=admin_user)
        client.force_login(admin_user)
        return client

    def test_admin_job_letter_requires_login(self, client):
        url = reverse('admin_job_letter')
        response = client.get(url)
        assert response.status_code == 302
        assert 'login' in response.url.lower() or '/' in response.url

    def test_admin_job_letter_authenticated(self, admin_client):
        StaffFactory.create_batch(3)
        url = reverse('admin_job_letter')
        response = admin_client.get(url)
        assert response.status_code == 200
        assert 'all_staff' in response.context
        assert len(response.context['all_staff']) == 3

    def test_admin_print_job_letter_requires_login(self, client):
        staff = StaffFactory()
        url = reverse('admin_print_job_letter', kwargs={'staff_id': staff.id})
        response = client.get(url)
        assert response.status_code == 302
        assert 'login' in response.url.lower() or '/' in response.url

    def test_admin_print_job_letter_authenticated(self, admin_client):
        staff = StaffFactory()
        url = reverse('admin_print_job_letter', kwargs={'staff_id': staff.id})
        response = admin_client.get(url)
        assert response.status_code == 200
        assert 'staff' in response.context
        assert response.context['staff'] == staff
        assert 'employee_rules' in response.context
