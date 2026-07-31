import os
from django.conf import settings
from django.core.cache import cache
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET


@require_GET
def health_check(request):
    """Overall system health endpoint."""
    return JsonResponse({"status": "ok", "service": "college-erp-api", "version": "1.0.0"})


@require_GET
def health_database(request):
    """Database connection and active schema health check."""
    status = {"connected": False, "schema": "unknown", "engine": "PostgreSQL"}
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            status["connected"] = cursor.fetchone()[0] == 1
        status["schema"] = getattr(connection, "schema_name", "public")
        status_code = 200
    except Exception as e:
        status["error"] = str(e)
        status_code = 503

    return JsonResponse({"status": "healthy" if status_code == 200 else "unhealthy", "database": status}, status=status_code)


@require_GET
def health_redis(request):
    """Redis cache and broker health check."""
    status = {"connected": False, "backend": "Redis"}
    try:
        cache.set("health_check_ping", "pong", timeout=5)
        status["connected"] = cache.get("health_check_ping") == "pong"
        status_code = 200 if status["connected"] else 503
    except Exception as e:
        status["error"] = str(e)
        status_code = 503

    return JsonResponse({"status": "healthy" if status_code == 200 else "unhealthy", "redis": status}, status=status_code)


@require_GET
def health_storage(request):
    """Media and file storage system health check."""
    status = {"writable": False, "media_root": str(settings.MEDIA_ROOT)}
    try:
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        test_file = os.path.join(settings.MEDIA_ROOT, ".health_check")
        with open(test_file, "w") as f:
            f.write("ok")
        if os.path.exists(test_file):
            os.remove(test_file)
            status["writable"] = True
        status_code = 200
    except Exception as e:
        status["error"] = str(e)
        status_code = 503

    return JsonResponse({"status": "healthy" if status_code == 200 else "unhealthy", "storage": status}, status=status_code)


@require_GET
def readiness_check(request):
    """Overall readiness check combining all subsystem checks."""
    checks = {"database": False, "cache": False, "storage": False}

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            checks["database"] = cursor.fetchone()[0] == 1
    except Exception:
        checks["database"] = False

    try:
        cache.set("readiness_ping", "ok", timeout=5)
        checks["cache"] = cache.get("readiness_ping") == "ok"
    except Exception:
        checks["cache"] = False

    try:
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        checks["storage"] = os.access(settings.MEDIA_ROOT, os.W_OK)
    except Exception:
        checks["storage"] = False

    status_code = 200 if all(checks.values()) else 503
    return JsonResponse({"status": "ready" if status_code == 200 else "degraded", "checks": checks}, status=status_code)
