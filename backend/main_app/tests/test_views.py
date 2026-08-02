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
        # Retrieve the profile automatically created by post_save signal on user creation
        user_id = authenticated_student_client.session['_auth_user_id']
        from main_app.models import Student
        from main_app.tests.factories import CourseFactory, SessionFactory
        student = Student.objects.get(admin_id=user_id)
        student.course = CourseFactory()
        student.session = SessionFactory()
        student.save()
        
        url = reverse('student_home')
        response = authenticated_student_client.get(url)
        
        assert response.status_code == 200
        assert 'total_attendance' in response.context
        assert 'percent_present' in response.context

class TestStaffViews:
    def test_staff_home_requires_login(self, client):
        """Test that staff home redirects if not logged in."""
        url = reverse('staff_home')
        response = client.get(url)
        assert response.status_code == 302 # Redirect to login

class TestAdminIDCardViews:
    def test_admin_view_student_id_card_by_student_id(self, authenticated_admin_client):
        """Test admin_view_student_id_card using Student.id."""
        student = StudentFactory()
        url = reverse('admin_view_student_id_card', kwargs={'student_id': student.id})
        response = authenticated_admin_client.get(url)
        assert response.status_code == 200
        assert response.context['student'] == student

    def test_admin_view_student_id_card_by_admin_id(self, authenticated_admin_client):
        """Test admin_view_student_id_card using CustomUser.id (admin_id)."""
        student = StudentFactory()
        url = reverse('admin_view_student_id_card', kwargs={'student_id': student.admin.id})
        response = authenticated_admin_client.get(url)
        assert response.status_code == 200
        assert response.context['student'] == student

    def test_admin_view_staff_id_card_by_staff_id(self, authenticated_admin_client):
        """Test admin_view_staff_id_card using Staff.id."""
        staff = StaffFactory()
        url = reverse('admin_view_staff_id_card', kwargs={'staff_id': staff.id})
        response = authenticated_admin_client.get(url)
        assert response.status_code == 200
        assert response.context['staff'] == staff

    def test_admin_view_staff_id_card_by_admin_id(self, authenticated_admin_client):
        """Test admin_view_staff_id_card using CustomUser.id (admin_id)."""
        staff = StaffFactory()
        url = reverse('admin_view_staff_id_card', kwargs={'staff_id': staff.admin.id})
        response = authenticated_admin_client.get(url)
        assert response.status_code == 200
        assert response.context['staff'] == staff

