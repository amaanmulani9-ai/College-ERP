import pytest
from main_app.models import CustomUser, Student, Staff
from main_app.tests.factories import CustomUserFactory, StudentFactory, StaffFactory

pytestmark = pytest.mark.django_db

class TestCustomUser:
    def test_create_student_user(self):
        user = CustomUserFactory(email='teststudent@example.com', user_type='3')
        assert user.email == 'teststudent@example.com'
        assert user.user_type == '3'
        assert user.check_password('testpass123')
    
    def test_create_staff_user(self):
        user = CustomUserFactory(email='teststaff@example.com', user_type='2')
        assert user.email == 'teststaff@example.com'
        assert user.user_type == '2'

class TestStudentModel:
    def test_student_creation(self):
        student = StudentFactory()
        assert student.admin.user_type == '3'
        assert student.course is not None
        assert student.session is not None
        assert str(student.admin) == f"{student.admin.first_name} {student.admin.last_name}".strip()

class TestStaffModel:
    def test_staff_creation(self):
        staff = StaffFactory()
        assert staff.admin.user_type == '2'
        assert staff.course is not None
        assert str(staff.admin) == f"{staff.admin.first_name} {staff.admin.last_name}".strip()
