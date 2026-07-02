import os
import sys
import django
from datetime import date

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from saas_admin.models import Client, Domain

def setup():
    # Create the public tenant
    public_tenant, created = Client.objects.get_or_create(
        schema_name='public',
        defaults={
            'name': 'Public Schema',
            'paid_until': date(2030, 12, 31),
            'on_trial': False
        }
    )
    if created:
        Domain.objects.get_or_create(
            domain='public.localhost',
            tenant=public_tenant,
            is_primary=True
        )
        print("Created public tenant and public.localhost domain.")

    # Create the demo tenant and map it to localhost
    demo_tenant, created = Client.objects.get_or_create(
        schema_name='demo',
        defaults={
            'name': 'Demo College',
            'paid_until': date(2030, 12, 31),
            'on_trial': False,
            'college_name': 'Demo College'
        }
    )
    if created:
        Domain.objects.get_or_create(
            domain='localhost',
            tenant=demo_tenant,
            is_primary=True
        )
        print("Created demo tenant and mapped to localhost domain.")

    print("Tenant setup completed.")

if __name__ == '__main__':
    setup()
