from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.transport.models import (
    Vehicle,
    Route,
    Stop,
    Driver,
    VehicleAssignment,
    StudentTransportAllocation,
    TransportPass,
    VehicleMaintenance,
    FuelLog,
    TransportAttendance,
    TransportIncident,
    TransportAuditLog,
)
from apps.transport.serializers import (
    VehicleSerializer,
    RouteSerializer,
    StopSerializer,
    DriverSerializer,
    VehicleAssignmentSerializer,
    StudentTransportAllocationSerializer,
    TransportPassSerializer,
    VehicleMaintenanceSerializer,
    FuelLogSerializer,
    TransportAttendanceSerializer,
    TransportIncidentSerializer,
    TransportAuditLogSerializer,
)
from apps.transport.services.transport_service import TransportService
from apps.transport.permissions import IsTransportAdminOrManager, IsTransportAdminManagerOrDriver


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.filter(is_deleted=False)
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.filter(is_deleted=False)
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.filter(is_deleted=False)
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class VehicleAssignmentViewSet(viewsets.ModelViewSet):
    queryset = VehicleAssignment.objects.filter(is_active=True)
    serializer_class = VehicleAssignmentSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class StudentTransportAllocationViewSet(viewsets.ModelViewSet):
    queryset = StudentTransportAllocation.objects.filter(is_active=True)
    serializer_class = StudentTransportAllocationSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class TransportPassViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportPass.objects.all()
    serializer_class = TransportPassSerializer
    permission_classes = [IsAuthenticated]


class VehicleMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = VehicleMaintenance.objects.all()
    serializer_class = VehicleMaintenanceSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.all()
    serializer_class = FuelLogSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


class TransportAttendanceViewSet(viewsets.ModelViewSet):
    queryset = TransportAttendance.objects.all()
    serializer_class = TransportAttendanceSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminManagerOrDriver]


class TransportIncidentViewSet(viewsets.ModelViewSet):
    queryset = TransportIncident.objects.all()
    serializer_class = TransportIncidentSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminManagerOrDriver]


class TransportAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportAuditLog.objects.all()
    serializer_class = TransportAuditLogSerializer
    permission_classes = [IsAuthenticated, IsTransportAdminOrManager]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def transport_dashboard_kpis(request):
    kpis = TransportService.get_transport_dashboard_kpis()
    return Response(kpis, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTransportAdminOrManager])
def transport_reports(request):
    report_type = request.query_params.get("type", "general")
    if report_type == "fuel":
        logs = FuelLog.objects.select_related("vehicle").all()
        return Response(FuelLogSerializer(logs, many=True).data)
    elif report_type == "maintenance":
        logs = VehicleMaintenance.objects.select_related("vehicle").all()
        return Response(VehicleMaintenanceSerializer(logs, many=True).data)
    elif report_type == "attendance":
        logs = TransportAttendance.objects.select_related("allocation").all()
        return Response(TransportAttendanceSerializer(logs, many=True).data)
    else:
        allocations = StudentTransportAllocation.objects.select_related("student", "route", "vehicle").all()
        return Response(StudentTransportAllocationSerializer(allocations, many=True).data)
