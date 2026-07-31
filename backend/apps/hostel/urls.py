from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BedViewSet,
    BlockViewSet,
    FloorViewSet,
    HostelAllocationViewSet,
    HostelAuditLogViewSet,
    HostelViewSet,
    MaintenanceRequestViewSet,
    RoomViewSet,
    VisitorViewSet,
    WardenViewSet,
)

router = DefaultRouter()
router.register(r"hostels", HostelViewSet, basename="hostel")
router.register(r"blocks", BlockViewSet, basename="hostel-block")
router.register(r"floors", FloorViewSet, basename="hostel-floor")
router.register(r"rooms", RoomViewSet, basename="hostel-room")
router.register(r"beds", BedViewSet, basename="hostel-bed")
router.register(r"wardens", WardenViewSet, basename="hostel-warden")
router.register(r"allocations", HostelAllocationViewSet, basename="hostel-allocation")
router.register(r"visitors", VisitorViewSet, basename="hostel-visitor")
router.register(r"maintenance", MaintenanceRequestViewSet, basename="hostel-maintenance")
router.register(r"audit-logs", HostelAuditLogViewSet, basename="hostel-audit-log")

urlpatterns = [
    # Convenient Action Paths
    path("allocate/", HostelAllocationViewSet.as_view({"post": "allocate"}), name="hostel-allocate"),
    path("transfer/", HostelAllocationViewSet.as_view({"post": "transfer"}), name="hostel-transfer"),
    path("check-in/", HostelAllocationViewSet.as_view({"post": "check_in"}), name="hostel-check-in"),
    path("check-out/", HostelAllocationViewSet.as_view({"post": "check_out"}), name="hostel-check-out"),
    path("vacant/", RoomViewSet.as_view({"get": "vacant_rooms"}), name="hostel-vacant-rooms"),
    path("occupied/", RoomViewSet.as_view({"get": "occupied_rooms"}), name="hostel-occupied-rooms"),

    # Router URLs
    path("", include(router.urls)),
]
