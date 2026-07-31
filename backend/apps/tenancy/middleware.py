import logging
import time
from django.http import JsonResponse
from django.db import connection

logger = logging.getLogger("apps.tenancy")


class TenantLoggingMiddleware:
    """Logs incoming host, resolved tenant, active schema, request duration, and status."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        host = request.get_host()
        tenant = getattr(request, "tenant", None)
        schema_name = getattr(connection, "schema_name", "unknown")

        logger.info(
            f"Incoming Request | Host: {host} | Resolved Tenant: {tenant} | Schema: {schema_name} | Path: {request.path}"
        )

        response = self.get_response(request)
        duration_ms = round((time.time() - start_time) * 1000, 2)

        logger.info(
            f"Completed Request | Host: {host} | Schema: {schema_name} | Status: {response.status_code} | Duration: {duration_ms}ms"
        )
        return response
