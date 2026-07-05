import pytest
from django.urls import reverse
from main_app.tests.factories import StudentFactory, StaffFactory

pytestmark = pytest.mark.django_db

class TestStudentViews:
    def test_student_home_requires_login(self, client):
        """Test that student home redirects if not logged in."""
        url = reverse('student_home')
        response = client.get(url)
        assert response.status_code == 302 # Redirect to login

    def test_student_home_authenticated(self, authenticated_student_client):
        """Test student home page for an authenticated student."""
        # Create a full student profile for the authenticated user
        user = authenticated_student_client.session['_auth_user_id']
        StudentFactory(admin_id=user)
        
        url = reverse('student_home')
        response = authenticated_student_client.get(url)
        
        assert response.status_code == 200
        assert 'total_attendance' in response.context
        assert 'attendance_present' in response.context

class TestStaffViews:
    def test_staff_home_requires_login(self, client):
        """Test that staff home redirects if not logged in."""
        url = reverse('staff_home')
        response = client.get(url)
        assert response.status_code == 302 # Redirect to login
