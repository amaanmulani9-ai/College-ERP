import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from django_tenants.utils import get_tenant_model, schema_context
from main_app.models import CustomUser, Admin, Staff, Student, Course, Session, Parent, Backoffice

def ensure_user(email, user_type, first_name, last_name):
    u = CustomUser.objects.filter(email=email).first()
    if not u:
        u = CustomUser.objects.create(
            email=email,
            password=make_password('admin'),
            user_type=user_type,
            first_name=first_name,
            last_name=last_name
        )
        print(f"Created CustomUser: {email}")
    else:
        u.password = make_password('admin')
        u.user_type = user_type
        u.save()
        print(f"Updated CustomUser password to 'admin': {email}")
    return u

def update_and_seed_schema(schema_name):
    with schema_context(schema_name):
        print(f"\n=== Processing schema: {schema_name} ===")
        
        # 1. Update all existing users' password to 'admin'
        count = 0
        for user in CustomUser.objects.all():
            user.password = make_password('admin')
            user.save()
            count += 1
        print(f"Updated password to 'admin' for {count} existing users.")

        # Ensure default Admin exists (user_type='1')
        u_admin = ensure_user('admin@admin.com', '1', 'System', 'Admin')
        if not Admin.objects.filter(admin=u_admin).exists():
            Admin.objects.create(admin=u_admin)
            print("Created Admin profile")

        # Ensure default Staff exists (user_type='2')
        u_staff = ensure_user('staff@admin.com', '2', 'Faculty', 'Member')
        if not Staff.objects.filter(admin=u_staff).exists():
            course = Course.objects.first()
            if not course:
                course = Course.objects.create(name='Computer Science')
            Staff.objects.create(admin=u_staff, course=course, id_card_code="STF001")
            print("Created Staff profile")

        # Ensure default Student exists (user_type='3')
        u_stu = ensure_user('student@admin.com', '3', 'Alex', 'Student')
        if not Student.objects.filter(admin=u_stu).exists():
            course = Course.objects.first()
            if not course:
                course = Course.objects.create(name='Computer Science')
            session = Session.objects.first()
            if not session:
                session = Session.objects.create(start_year=date(2025, 6, 1), end_year=date(2029, 5, 31))
            Student.objects.create(admin=u_stu, course=course, session=session, id_card_code="STU001")
            print("Created Student profile")

        # Ensure default Parent exists (user_type='4')
        u_parent = ensure_user('parent@admin.com', '4', 'Parent', 'Guardian')
        if not Parent.objects.filter(admin=u_parent).exists():
            student = Student.objects.first()
            if student:
                Parent.objects.create(admin=u_parent, student=student, mobile_number="9999999999")
                print("Created Parent profile")

        # Ensure default Backoffice exists (user_type='7')
        u_back = ensure_user('backoffice@admin.com', '7', 'Backoffice', 'Staff')
        if not Backoffice.objects.filter(admin=u_back).exists():
            Backoffice.objects.create(admin=u_back, department="Admissions & Finance")
            print("Created Backoffice profile")

def main():
    try:
        tenants = get_tenant_model().objects.all()
        for t in tenants:
            update_and_seed_schema(t.schema_name)
    except Exception as e:
        print("Tenant model not accessible or error:", e)
        update_and_seed_schema('public')

if __name__ == '__main__':
    main()
