from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.transport.views import (
    VehicleViewSet,
    RouteViewSet,
    StopViewSet,
    DriverViewSet,
    VehicleAssignmentViewSet,
    StudentTransportAllocationViewSet,
    TransportPassViewSet,
    VehicleMaintenanceViewSet,
    FuelLogViewSet,
    TransportAttendanceViewSet,
    TransportIncidentViewSet,
    TransportAuditLogViewSet,
    transport_dashboard_kpis,
    transport_reports,
)

router = DefaultRouter()
router.register(r"vehicles", VehicleViewSet, basename="vehicle")
router.register(r"routes", RouteViewSet, basename="route")
router.register(r"stops", StopViewSet, basename="stop")
router.register(r"drivers", DriverViewSet, basename="driver")
router.register(r"assignments", VehicleAssignmentViewSet, basename="vehicle-assignment")
router.register(r"allocations", StudentTransportAllocationViewSet, basename="student-allocation")
router.register(r"passes", TransportPassViewSet, basename="transport-pass")
router.register(r"maintenance", VehicleMaintenanceViewSet, basename="vehicle-maintenance")
router.register(r"fuel-logs", FuelLogViewSet, basename="fuel-log")
router.register(r"attendance", TransportAttendanceViewSet, basename="transport-attendance")
router.register(r"incidents", TransportIncidentViewSet, basename="transport-incident")
router.register(r"audit-logs", TransportAuditLogViewSet, basename="transport-audit-log")

urlpatterns = [
    path("dashboard/kpis/", transport_dashboard_kpis, name="transport-kpis"),
    path("reports/", transport_reports, name="transport-reports"),
    path("", include(router.urls)),
]
