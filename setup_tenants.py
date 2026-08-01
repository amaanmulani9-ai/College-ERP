import os
import sys
import django

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.tenancy.models import Client, Domain

def setup():
    # Ensure public tenant
    public_tenant, _ = Client.objects.get_or_create(
        schema_name='public',
        defaults={
            'name': 'System Public Tenant',
            'slug': 'public',
            'contact_email': 'admin@college.erp',
            'is_active': True,
            'subscription_plan': 'enterprise',
        }
    )
    Domain.objects.get_or_create(
        domain='localhost',
        defaults={
            'tenant': public_tenant,
            'is_primary': True
        }
    )
    Domain.objects.get_or_create(
        domain='127.0.0.1',
        defaults={
            'tenant': public_tenant,
            'is_primary': False
        }
    )
    print("Ensured public tenant mapped to localhost and 127.0.0.1.")

    # Create demo tenant
    demo_tenant, _ = Client.objects.get_or_create(
        schema_name='demo',
        defaults={
            'name': 'Demo College ERP',
            'slug': 'demo',
            'contact_email': 'demo@college.erp',
            'is_active': True,
            'subscription_plan': 'enterprise',
        }
    )
    Domain.objects.get_or_create(
        domain='demo.localhost',
        defaults={
            'tenant': demo_tenant,
            'is_primary': True
        }
    )
    print("Ensured demo tenant mapped to demo.localhost.")
    print("Tenant setup completed.")

if __name__ == '__main__':
    setup()
