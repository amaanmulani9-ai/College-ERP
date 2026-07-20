import os
import sys
import django
from datetime import date

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')
django.setup()

from saas_admin.models import Client, Domain

def setup():
    # Create or get the public tenant
    public_tenant, _ = Client.objects.get_or_create(
        schema_name='public',
        defaults={
            'name': 'Public Schema',
            'paid_until': date(2030, 12, 31),
            'on_trial': False
        }
    )
    # Ensure public.localhost is mapped
    Domain.objects.get_or_create(
        domain='public.localhost',
        defaults={
            'tenant': public_tenant,
            'is_primary': True
        }
    )
    print("Ensured public tenant and public.localhost domain.")

    # Create or get the demo tenant
    demo_tenant, _ = Client.objects.get_or_create(
        schema_name='demo',
        defaults={
            'name': 'Demo College',
            'paid_until': date(2030, 12, 31),
            'on_trial': False,
            'college_name': 'Demo College'
        }
    )
    # Ensure localhost is mapped
    Domain.objects.get_or_create(
        domain='localhost',
        defaults={
            'tenant': demo_tenant,
            'is_primary': True
        }
    )
    print("Ensured demo tenant and localhost domain.")

    # Dynamically add Render host if present
    render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
    if render_host:
        Domain.objects.get_or_create(
            domain=render_host,
            defaults={
                'tenant': demo_tenant,
                'is_primary': False
            }
        )
        print(f"Mapped Render host ({render_host}) to demo tenant.")
    
    # Explicitly map the known Render domain as fallback
    Domain.objects.get_or_create(
        domain='college-erp-web.onrender.com',
        defaults={
            'tenant': demo_tenant,
            'is_primary': False
        }
    )
    print("Mapped college-erp-web.onrender.com to demo tenant.")

    print("Tenant setup completed.")

if __name__ == '__main__':
    setup()
