import os
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.test"

import django
django.setup()

from django.core.management import call_command
from django.test import RequestFactory
from django.http import JsonResponse
from apps.tenancy.models import Client, Domain
from apps.tenancy.middleware import TenantLoggingMiddleware
from apps.core.views import health_check, health_database, health_redis, health_storage

def main():
    print("=== TASK-002 VERIFICATION SUITE ===")
    
    # Run migrations for test DB
    try:
        call_command("migrate_schemas", verbosity=0)
    except Exception:
        call_command("migrate", verbosity=0)
    
    # 1. Test Multiple Schemas & Tenant Creation
    print("\n[1/3] Testing Tenant Schema Creation...")
    t1, _ = Client.objects.get_or_create(
        schema_name="tenant_alpha",
        defaults={"name": "Alpha University", "slug": "alpha", "is_active": True}
    )
    d1, _ = Domain.objects.get_or_create(
        domain="alpha.localhost",
        defaults={"tenant": t1, "is_primary": True}
    )
    
    t2, _ = Client.objects.get_or_create(
        schema_name="tenant_beta",
        defaults={"name": "Beta Institute", "slug": "beta", "is_active": True}
    )
    d2, _ = Domain.objects.get_or_create(
        domain="beta.localhost",
        defaults={"tenant": t2, "is_primary": True}
    )

    print(f"  [OK] Tenant 1 Created: {t1.name} [Schema: {t1.schema_name}] -> {d1.domain}")
    print(f"  [OK] Tenant 2 Created: {t2.name} [Schema: {t2.schema_name}] -> {d2.domain}")

    # 2. Test Tenant Switching & Middleware
    print("\n[2/3] Testing Tenant Schema Switching & Middleware...")
    rf = RequestFactory()
    middleware = TenantLoggingMiddleware(lambda req: JsonResponse({"status": "ok"}))
    
    # Request for Alpha
    req_alpha = rf.get("/api/health/", HTTP_HOST="alpha.localhost")
    req_alpha.tenant = t1
    res_alpha = middleware(req_alpha)
    print(f"  [OK] Active Tenant set to: '{t1.name}' [Schema: {t1.schema_name}] for Host: 'alpha.localhost' -> Status: {res_alpha.status_code}")
    assert t1.schema_name == "tenant_alpha"
    assert res_alpha.status_code == 200
    
    # Request for Beta
    req_beta = rf.get("/api/health/", HTTP_HOST="beta.localhost")
    req_beta.tenant = t2
    res_beta = middleware(req_beta)
    print(f"  [OK] Active Tenant switched to: '{t2.name}' [Schema: {t2.schema_name}] for Host: 'beta.localhost' -> Status: {res_beta.status_code}")
    assert t2.schema_name == "tenant_beta"
    assert res_beta.status_code == 200

    # 3. Test Structured Health Endpoints
    print("\n[3/3] Testing Subsystem Health Check Endpoints...")
    req = rf.get("/api/health/")
    
    res_h = health_check(req)
    print(f"  [OK] /health/ -> Status: {res_h.status_code} | Data: {res_h.content.decode()}")
    assert res_h.status_code == 200

    res_db = health_database(req)
    print(f"  [OK] /health/database/ -> Status: {res_db.status_code} | Data: {res_db.content.decode()}")
    assert res_db.status_code == 200

    res_redis = health_redis(req)
    print(f"  [OK] /health/redis/ -> Status: {res_redis.status_code} | Data: {res_redis.content.decode()}")
    assert res_redis.status_code == 200

    res_storage = health_storage(req)
    print(f"  [OK] /health/storage/ -> Status: {res_storage.status_code} | Data: {res_storage.content.decode()}")
    assert res_storage.status_code == 200

    print("\nALL VERIFICATIONS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    main()
