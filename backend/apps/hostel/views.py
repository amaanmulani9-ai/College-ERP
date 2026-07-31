import logging

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    Bed,
    Block,
    Floor,
    Hostel,
    HostelAllocation,
    HostelAuditLog,
    MaintenanceRequest,
    Room,
    Visitor,
    Warden,
)
from .permissions import IsStudentOrHostelStaff, IsWardenOrAdmin
from .serializers import (
    AllocateBedRequestSerializer,
    BedSerializer,
    BlockSerializer,
    CheckInRequestSerializer,
    CheckOutRequestSerializer,
    FloorSerializer,
    HostelAllocationSerializer,
    HostelAuditLogSerializer,
    HostelSerializer,
    MaintenanceRequestSerializer,
    RoomSerializer,
    TransferRoomRequestSerializer,
    VisitorSerializer,
    WardenSerializer,
)
from .services import HostelService

logger = logging.getLogger(__name__)


class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsWardenOrAdmin]
    filterset_fields = ["gender_type", "is_active"]
    search_fields = ["name", "code"]


class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all().select_related("hostel")
    serializer_class = BlockSerializer
    permission_classes = [IsWardenOrAdmin]
    filterset_fields = ["hostel"]
    search_fields = ["name", "code"]


class FloorViewSet(viewsets.ModelViewSet):
    queryset = Floor.objects.all().select_related("block__hostel")
    serializer_class = FloorSerializer
    permission_classes = [IsWardenOrAdmin]
    filterset_fields = ["block"]


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().select_related("floor__block__hostel")
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "room_type", "floor"]
    search_fields = ["room_number"]

    @action(detail=False, methods=["get"], url_path="vacant", permission_classes=[IsStudentOrHostelStaff])
    def vacant_rooms(self, request):
        """Get all vacant rooms with available bed capacity."""
        data = HostelService.vacant_rooms()
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="occupied", permission_classes=[IsStudentOrHostelStaff])
    def occupied_rooms(self, request):
        """Get all occupied rooms."""
        data = HostelService.occupied_rooms()
        return Response(data, status=status.HTTP_200_OK)


class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all().select_related("room")
    serializer_class = BedSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "room"]


class WardenViewSet(viewsets.ModelViewSet):
    queryset = Warden.objects.all().select_related("employee__profile__user", "hostel")
    serializer_class = WardenSerializer
    permission_classes = [IsWardenOrAdmin]
    filterset_fields = ["hostel"]


class HostelAllocationViewSet(viewsets.ModelViewSet):
    queryset = HostelAllocation.objects.all().select_related("student__profile__user", "bed__room", "academic_session")
    serializer_class = HostelAllocationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "academic_session", "student"]

    def get_permissions(self):
        if self.action in ["allocate", "transfer", "check_in", "check_out"]:
            return [IsWardenOrAdmin()]
        return super().get_permissions()

    @action(detail=False, methods=["post"], url_path="allocate")
    def allocate(self, request):
        """Allocate a vacant bed to a student."""
        serializer = AllocateBedRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            alloc = HostelService.allocate_bed(
                student_id=str(d["student_id"]),
                bed_id=str(d["bed_id"]),
                academic_session_id=str(d["academic_session_id"]),
                fee_amount=d.get("fee_amount"),
                actor=request.user,
            )
            return Response(HostelAllocationSerializer(alloc).data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="transfer")
    def transfer(self, request):
        """Transfer student allocation to a new room bed."""
        serializer = TransferRoomRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            alloc = HostelService.transfer_room(
                allocation_id=str(d["allocation_id"]),
                new_bed_id=str(d["new_bed_id"]),
                actor=request.user,
            )
            return Response(HostelAllocationSerializer(alloc).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="check-in")
    def check_in(self, request):
        """Perform student check-in."""
        serializer = CheckInRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            alloc = HostelService.check_in(
                allocation_id=str(d["allocation_id"]),
                check_in_date=d.get("check_in_date"),
                actor=request.user,
            )
            return Response(HostelAllocationSerializer(alloc).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="check-out")
    def check_out(self, request):
        """Process student check-out & vacate bed."""
        serializer = CheckOutRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            alloc = HostelService.check_out(
                allocation_id=str(d["allocation_id"]),
                check_out_date=d.get("check_out_date"),
                actor=request.user,
            )
            return Response(HostelAllocationSerializer(alloc).data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all().select_related("student__profile__user")
    serializer_class = VisitorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["student", "visit_date"]
    search_fields = ["visitor_name", "relation", "mobile"]


class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all().select_related("room", "assigned_to__profile__user")
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "room"]
    search_fields = ["title", "description"]


class HostelAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HostelAuditLog.objects.all().select_related("hostel", "allocation", "actor")
    serializer_class = HostelAuditLogSerializer
    permission_classes = [IsWardenOrAdmin]
    filterset_fields = ["event_type"]
    search_fields = ["description"]
