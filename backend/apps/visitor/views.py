import decimal
from django.db.models import Count, Q
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.visitor.models import (
    Visitor,
    VisitorDocument,
    VisitorVehicle,
    Appointment,
    VisitPurpose,
    GatePass,
    EntryExitLog,
    Delivery,
    Contractor,
    ContractorPass,
    EmergencyVisitor,
    RestrictedAreaAccess,
    VisitorBlacklist,
    VisitorFeedback,
    SecurityOfficer,
    VisitorNotification,
    VisitorAuditLog,
)
from apps.visitor.serializers import (
    VisitorSerializer,
    VisitorDocumentSerializer,
    VisitorVehicleSerializer,
    AppointmentSerializer,
    VisitPurposeSerializer,
    GatePassSerializer,
    EntryExitLogSerializer,
    DeliverySerializer,
    ContractorSerializer,
    ContractorPassSerializer,
    EmergencyVisitorSerializer,
    RestrictedAreaAccessSerializer,
    VisitorBlacklistSerializer,
    VisitorFeedbackSerializer,
    SecurityOfficerSerializer,
    VisitorNotificationSerializer,
    VisitorAuditLogSerializer,
)
from apps.visitor.services.visitor_service import VisitorService
from apps.visitor.permissions import IsSecurityOrReceptionAdmin


class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.filter(is_deleted=False)
    serializer_class = VisitorSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["govt_id_type", "company"]
    search_fields = ["visitor_id", "first_name", "last_name", "mobile", "email", "govt_id_number"]

    def perform_create(self, serializer):
        visitor = VisitorService.register_visitor(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = visitor

    def perform_destroy(self, instance):
        VisitorService.soft_delete_visitor(visitor_id=instance.id, performed_by=self.request.user)


class VisitorDocumentViewSet(viewsets.ModelViewSet):
    queryset = VisitorDocument.objects.all()
    serializer_class = VisitorDocumentSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]


class VisitorVehicleViewSet(viewsets.ModelViewSet):
    queryset = VisitorVehicle.objects.all()
    serializer_class = VisitorVehicleSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["vehicle_type"]
    search_fields = ["vehicle_number", "parking_slot"]

    def perform_create(self, serializer):
        vehicle = VisitorService.register_vehicle(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = vehicle


class VisitPurposeViewSet(viewsets.ModelViewSet):
    queryset = VisitPurpose.objects.all()
    serializer_class = VisitPurposeSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["status", "scheduled_date", "department"]
    search_fields = ["visitor__first_name", "visitor__last_name", "purpose"]

    def perform_create(self, serializer):
        appt = VisitorService.create_appointment(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = appt

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        appt = VisitorService.approve_appointment(appointment_id=pk, performed_by=request.user)
        return Response(AppointmentSerializer(appt).data)


class GatePassViewSet(viewsets.ModelViewSet):
    queryset = GatePass.objects.all()
    serializer_class = GatePassSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["status"]
    search_fields = ["pass_number"]


class EntryExitLogViewSet(viewsets.ModelViewSet):
    queryset = EntryExitLog.objects.all()
    serializer_class = EntryExitLogSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["gate"]
    search_fields = ["visitor__first_name", "visitor__last_name", "gate_pass__pass_number"]

    @action(detail=False, methods=["post"])
    def check_in(self, request):
        visitor_id = request.data.get("visitor_id")
        gate = request.data.get("gate", "Main Gate A")
        pass_id = request.data.get("gate_pass_id")
        remarks = request.data.get("remarks", "")
        log = VisitorService.check_in_visitor(
            visitor_id=visitor_id,
            gate=gate,
            gate_pass_id=pass_id,
            remarks=remarks,
            performed_by=request.user
        )
        return Response(EntryExitLogSerializer(log).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def check_out(self, request, pk=None):
        log = VisitorService.check_out_visitor(log_id=pk, performed_by=request.user)
        return Response(EntryExitLogSerializer(log).data)

    @action(detail=False, methods=["post"])
    def bulk_checkout(self, request):
        count = VisitorService.bulk_check_out(performed_by=request.user)
        return Response({"message": f"Successfully checked out {count} visitor(s)."})


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["delivery_status"]
    search_fields = ["tracking_number", "courier_company"]

    def perform_create(self, serializer):
        delivery = VisitorService.log_delivery(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = delivery


class ContractorViewSet(viewsets.ModelViewSet):
    queryset = Contractor.objects.all()
    serializer_class = ContractorSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]

    def perform_create(self, serializer):
        contractor = VisitorService.manage_contractor(
            data=self.request.data,
            performed_by=self.request.user
        )
        serializer.instance = contractor


class ContractorPassViewSet(viewsets.ModelViewSet):
    queryset = ContractorPass.objects.all()
    serializer_class = ContractorPassSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]


class EmergencyVisitorViewSet(viewsets.ModelViewSet):
    queryset = EmergencyVisitor.objects.all()
    serializer_class = EmergencyVisitorSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["type", "priority"]


class RestrictedAreaAccessViewSet(viewsets.ModelViewSet):
    queryset = RestrictedAreaAccess.objects.all()
    serializer_class = RestrictedAreaAccessSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]


class VisitorBlacklistViewSet(viewsets.ModelViewSet):
    queryset = VisitorBlacklist.objects.all()
    serializer_class = VisitorBlacklistSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]

    def perform_create(self, serializer):
        bl = VisitorService.blacklist_visitor(
            visitor_id=self.request.data["visitor_id"],
            reason=self.request.data["reason"],
            performed_by=self.request.user
        )
        serializer.instance = bl


class VisitorFeedbackViewSet(viewsets.ModelViewSet):
    queryset = VisitorFeedback.objects.all()
    serializer_class = VisitorFeedbackSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]


class SecurityOfficerViewSet(viewsets.ModelViewSet):
    queryset = SecurityOfficer.objects.all()
    serializer_class = SecurityOfficerSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]
    filterset_fields = ["shift", "gate"]


class VisitorNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VisitorNotification.objects.all()
    serializer_class = VisitorNotificationSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]


class VisitorAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VisitorAuditLog.objects.all()
    serializer_class = VisitorAuditLogSerializer
    permission_classes = [IsAuthenticated, IsSecurityOrReceptionAdmin]


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsSecurityOrReceptionAdmin])
def visitor_dashboard_kpis(request):
    """Returns Key Performance Indicators for Enterprise Visitor System."""
    kpis = VisitorService.compute_dashboard_kpis()
    return Response(kpis)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsSecurityOrReceptionAdmin])
def visitor_reports(request):
    """Generates structured data for Visitor Reports suite."""
    report_type = request.query_params.get("type", "daily_visitor")

    if report_type == "department_visitor":
        data = list(
            Appointment.objects.values("department__name")
            .annotate(count=Count("id"))
        )
    elif report_type == "gate_activity":
        data = list(
            EntryExitLog.objects.values("gate")
            .annotate(count=Count("id"))
        )
    elif report_type == "delivery_report":
        data = list(
            Delivery.objects.values("delivery_status")
            .annotate(count=Count("id"))
        )
    elif report_type == "contractor_report":
        data = list(
            Contractor.objects.values("company")
            .annotate(count=Count("id"))
        )
    elif report_type == "blacklist_report":
        data = VisitorBlacklistSerializer(VisitorBlacklist.objects.all()[:50], many=True).data
    else: # daily_visitor
        data = EntryExitLogSerializer(EntryExitLog.objects.all()[:50], many=True).data

    return Response({
        "report_type": report_type,
        "data": data
    })
