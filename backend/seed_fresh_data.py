import os
import django
from datetime import datetime, date

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from main_app.models import CustomUser, Session, Course, Subject, Book, Staff, Student

def seed_data():
    print("Starting database seeding with fresh, clean data...")
    
    # 1. Clear existing data just in case
    print("Clearing any existing records...")
    CustomUser.objects.all().delete()
    Session.objects.all().delete()
    Course.objects.all().delete()
    Subject.objects.all().delete()
    Book.objects.all().delete()
    
    # 2. Create Session
    print("Creating academic session...")
    academic_session = Session.objects.create(
        start_year=date(2026, 1, 1),
        end_year=date(2027, 1, 1)
    )
    
    # 3. Create Course
    print("Creating course...")
    cs_course = Course.objects.create(
        name="Computer Science & Engineering"
    )
    
    # 4. Create HOD/Admin User
    print("Creating HOD/Admin account...")
    admin_user = CustomUser.objects.create(
        email="admin@admin.com",
        password=make_password("admin123"),
        user_type=1,
        gender="M",
        first_name="System",
        last_name="Administrator",
        address="University Main Campus"
    )
    
    # 5. Create Staff User
    print("Creating Staff account...")
    staff_user = CustomUser.objects.create(
        email="staffone@staff.com",
        password=make_password("staff123"),
        user_type=2,
        gender="M",
        first_name="John",
        last_name="Doe",
        address="Faculty Quarters, Sector 4"
    )
    # Associate staff profile with course
    staff_profile = staff_user.staff
    staff_profile.course = cs_course
    staff_profile.save()
    
    # 6. Create Student User (Amaan Mulani)
    print("Creating Student account...")
    student_user = CustomUser.objects.create(
        email="studentone@student.com",
        password=make_password("student123"),
        user_type=3,
        gender="M",
        first_name="Amaan",
        last_name="Mulani",
        address="Omkar sra blg,b1,2011,20th floor,Malad East, Mumbai 97"
    )
    # Associate student profile with course and session
    student_profile = student_user.student
    student_profile.course = cs_course
    student_profile.session = academic_session
    student_profile.save()
    
    # 7. Create Subjects
    print("Creating academic subjects...")
    Subject.objects.create(
        name="Software Engineering",
        staff=staff_profile,
        course=cs_course
    )
    Subject.objects.create(
        name="Database Management Systems",
        staff=staff_profile,
        course=cs_course
    )
    Subject.objects.create(
        name="Data Structures and Algorithms",
        staff=staff_profile,
        course=cs_course
    )
    
    # 8. Create Library Books
    print("Creating library books...")
    Book.objects.create(
        name="Introduction to Algorithms",
        author="Thomas H. Cormen",
        isbn=978026203,
        category="Computer Science"
    )
    Book.objects.create(
        name="Clean Code",
        author="Robert C. Martin",
        isbn=978013235,
        category="Software Engineering"
    )
    Book.objects.create(
        name="Design Patterns",
        author="Erich Gamma",
        isbn=978020163,
        category="Software Engineering"
    )
    Book.objects.create(
        name="Database System Concepts",
        author="Abraham Silberschatz",
        isbn=978007352,
        category="Databases"
    )
    
    print("Database seeding completed successfully!")
    print("\nFresh Credentials for Testing:")
    print("---------------------------------")
    print("Admin:   admin@admin.com / admin123")
    print("Staff:   staffone@staff.com / staff123")
    print("Student: studentone@student.com / student123")
    print("---------------------------------")

if __name__ == "__main__":
    from django_tenants.utils import schema_context
    with schema_context('demo'):
        seed_data()
