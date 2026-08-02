import os
import sys
import django

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from django_tenants.utils import schema_context
from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin():
    admin_email = os.environ.get('DEFAULT_ADMIN_EMAIL', 'admin@admin.com')
    admin_password = os.environ.get('DEFAULT_ADMIN_PASSWORD', 'admin123')
    
    with schema_context('demo'):
        if not User.objects.filter(email=admin_email).exists():
            print(f"Creating superuser {admin_email} for demo schema...")
            User.objects.create_superuser(email=admin_email, password=admin_password)
            print("Superuser created successfully.")
        else:
            print(f"Superuser {admin_email} already exists in demo schema.")

if __name__ == '__main__':
    create_admin()
