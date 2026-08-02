import os
import sys
import django

# Setup Django settings
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.test_settings')
django.setup()

from django.contrib.auth import get_user_model
from main_app.models import Course, Session, Student, Staff, Parent, Backoffice

User = get_user_model()

def seed_data():
    print("Seeding local development database...")
    
    # 1. Create Session and Course
    session, _ = Session.objects.get_or_create(
        start_year="2026-01-01",
        end_year="2027-01-01"
    )
    course, _ = Course.objects.get_or_create(
        name="Computer Science & Engineering",
        total_semesters=8,
        monthly_fees=250.0
    )
    
    # Helper to create user
    def get_or_create_user(email, password, user_type, first_name, last_name):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'user_type': str(user_type),
                'first_name': first_name,
                'last_name': last_name,
                'is_staff': user_type == 1,
                'is_superuser': user_type == 1
            }
        )
        if created:
            user.set_password(password)
            user.save()
            print(f"Created user: {email}")
        else:
            print(f"User already exists: {email}")
        return user

    # 2. Seed Admin
    get_or_create_user('admin@admin.com', 'admin123', 1, 'System', 'Administrator')
    
    # 3. Seed Staff
    staff_user = get_or_create_user('staff@example.com', 'staffpass123', 2, 'Rahul', 'Sharma')
    staff, _ = Staff.objects.get_or_create(
        admin=staff_user,
        defaults={'course': course}
    )
    
    # 4. Seed Student
    student_user = get_or_create_user('student@example.com', 'studentpass123', 3, 'Aman', 'Kumar')
    student, _ = Student.objects.get_or_create(
        admin=student_user,
        defaults={'course': course, 'session': session, 'division': 'A'}
    )
    
    # 5. Seed Parent
    parent_user = get_or_create_user('parent@example.com', 'parentpass123', 4, 'Suresh', 'Kumar')
    Parent.objects.get_or_create(
        admin=parent_user,
        defaults={'student': student, 'mobile_number': '9876543210'}
    )
    
    # 6. Seed Backoffice/Receptionist
    backoffice_user = get_or_create_user('backoffice@example.com', 'backofficepass123', 7, 'Priya', 'Singh')
    Backoffice.objects.get_or_create(
        admin=backoffice_user
    )
    
    print("Database seeding completed successfully.")

if __name__ == '__main__':
    seed_data()
