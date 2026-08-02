import decimal
from django.db.models import Sum, Count, Q, Avg
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.assets.models import (
    AssetCategory,
    MaintenanceVendor,
    Asset,
    AssetAllocation,
    AssetTransfer,
    AssetMaintenance,
    MaintenanceSchedule,
    Warranty,
    AssetDepreciation,
    AssetAudit,
    AssetDisposal,
    AssetIncident,
    AssetDocument,
    QRCodeLabel,
    AssetAuditLog,
)
from apps.assets.serializers import (
    AssetCategorySerializer,
    MaintenanceVendorSerializer,
    AssetSerializer,
    AssetAllocationSerializer,
    AssetTransferSerializer,
    AssetMaintenanceSerializer,
    MaintenanceScheduleSerializer,
    WarrantySerializer,
    AssetDepreciationSerializer,
    AssetAuditSerializer,
    AssetDisposalSerializer,
    AssetIncidentSerializer,
    AssetDocumentSerializer,
    QRCodeLabelSerializer,
    AssetAuditLogSerializer,
)
from apps.assets.services.asset_service import AssetService
from apps.assets.permissions import IsAssetAdminOrManager


class AssetCategoryViewSet(viewsets.ModelViewSet):
    queryset = AssetCategory.objects.all()
    serializer_class = AssetCategorySerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]
    filterset_fields = ["status"]
    search_fields = ["category_code", "category_name"]


class MaintenanceVendorViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceVendor.objects.all()
    serializer_class = MaintenanceVendorSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]
    search_fields = ["vendor_name", "contact_person", "phone"]


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.filter(is_deleted=False)
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]
    filterset_fields = ["status", "category", "department", "supplier"]
    search_fields = ["asset_code", "asset_name", "serial_number", "barcode"]

    def perform_create(self, serializer):
        asset = AssetService.register_asset(
            data=serializer.validated_data,
            performed_by=self.request.user
        )
        serializer.instance = asset

    def perform_destroy(self, instance):
        AssetService.soft_delete_asset(asset_id=instance.id, performed_by=self.request.user)

    @action(detail=True, methods=["post"])
    def allocate(self, request, pk=None):
        allocation = AssetService.allocate_asset(
            asset_id=pk,
            allocation_data=request.data,
            performed_by=request.user
        )
        return Response(AssetAllocationSerializer(allocation).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def transfer(self, request, pk=None):
        transfer = AssetService.transfer_asset(
            asset_id=pk,
            transfer_data=request.data,
            performed_by=request.user
        )
        return Response(AssetTransferSerializer(transfer).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def schedule_maintenance(self, request, pk=None):
        maint = AssetService.schedule_maintenance(
            asset_id=pk,
            maintenance_data=request.data,
            performed_by=request.user
        )
        return Response(AssetMaintenanceSerializer(maint).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def calculate_depreciation(self, request, pk=None):
        method = request.data.get("method", "Straight Line")
        pct = request.data.get("annual_percentage", 10.0)
        dep = AssetService.calculate_depreciation(
            asset_id=pk,
            method=method,
            annual_percentage=pct,
            performed_by=request.user
        )
        return Response(AssetDepreciationSerializer(dep).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def dispose(self, request, pk=None):
        disposal = AssetService.dispose_asset(
            asset_id=pk,
            disposal_data=request.data,
            performed_by=request.user
        )
        return Response(AssetDisposalSerializer(disposal).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def log_incident(self, request, pk=None):
        inc = AssetService.log_incident(
            asset_id=pk,
            incident_data=request.data,
            performed_by=request.user
        )
        return Response(AssetIncidentSerializer(inc).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def qr_label(self, request, pk=None):
        asset = self.get_object()
        qr_obj, created = QRCodeLabel.objects.get_or_create(
            asset=asset,
            defaults={
                "qr_payload": asset.qr_code or f"ASSET:{asset.asset_code}",
                "printable_label": f"ASSET TAG [{asset.asset_code}] - {asset.asset_name}"
            }
        )
        return Response(QRCodeLabelSerializer(qr_obj).data)


class AssetAllocationViewSet(viewsets.ModelViewSet):
    queryset = AssetAllocation.objects.all()
    serializer_class = AssetAllocationSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]
    filterset_fields = ["status", "allocated_to_type", "department"]

    @action(detail=True, methods=["post"])
    def return_asset(self, request, pk=None):
        allocation = AssetService.return_asset(
            allocation_id=pk,
            return_data=request.data,
            performed_by=request.user
        )
        return Response(AssetAllocationSerializer(allocation).data)


class AssetTransferViewSet(viewsets.ModelViewSet):
    queryset = AssetTransfer.objects.all()
    serializer_class = AssetTransferSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]
    filterset_fields = ["status", "from_department", "to_department"]


class AssetMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = AssetMaintenance.objects.all()
    serializer_class = AssetMaintenanceSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]
    filterset_fields = ["status", "maintenance_type", "vendor"]

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        maint = AssetService.complete_maintenance(
            maintenance_id=pk,
            completion_data=request.data,
            performed_by=request.user
        )
        return Response(AssetMaintenanceSerializer(maint).data)


class MaintenanceScheduleViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceSchedule.objects.all()
    serializer_class = MaintenanceScheduleSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]


class WarrantyViewSet(viewsets.ModelViewSet):
    queryset = Warranty.objects.all()
    serializer_class = WarrantySerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]
    filterset_fields = ["status"]


class AssetDepreciationViewSet(viewsets.ModelViewSet):
    queryset = AssetDepreciation.objects.all()
    serializer_class = AssetDepreciationSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]

    @action(detail=False, methods=["post"])
    def calculate_all(self, request):
        pct = request.data.get("annual_percentage", 10.0)
        method = request.data.get("method", "Straight Line")
        assets = Asset.objects.filter(is_deleted=False, status__in=["Available", "Allocated"])
        results = []
        for asset in assets:
            dep = AssetService.calculate_depreciation(
                asset_id=asset.id,
                method=method,
                annual_percentage=pct,
                performed_by=request.user
            )
            results.append(dep.id)
        return Response({"calculated_count": len(results)}, status=status.HTTP_200_OK)


class AssetAuditViewSet(viewsets.ModelViewSet):
    queryset = AssetAudit.objects.all()
    serializer_class = AssetAuditSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]

    def perform_create(self, serializer):
        audit = AssetService.perform_audit(
            audit_data=serializer.validated_data,
            performed_by=self.request.user
        )
        serializer.instance = audit


class AssetDisposalViewSet(viewsets.ModelViewSet):
    queryset = AssetDisposal.objects.all()
    serializer_class = AssetDisposalSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]


class AssetIncidentViewSet(viewsets.ModelViewSet):
    queryset = AssetIncident.objects.all()
    serializer_class = AssetIncidentSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]


class AssetDocumentViewSet(viewsets.ModelViewSet):
    queryset = AssetDocument.objects.all()
    serializer_class = AssetDocumentSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]


class QRCodeLabelViewSet(viewsets.ModelViewSet):
    queryset = QRCodeLabel.objects.all()
    serializer_class = QRCodeLabelSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]


class AssetAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AssetAuditLog.objects.all()
    serializer_class = AssetAuditLogSerializer
    permission_classes = [IsAuthenticated, IsAssetAdminOrManager]


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAssetAdminOrManager])
def assets_dashboard_kpis(request):
    """Returns Key Performance Indicators for Enterprise Asset Management System."""
    total_assets = Asset.objects.filter(is_deleted=False).count()
    total_asset_val = Asset.objects.filter(is_deleted=False).aggregate(total=Sum("current_value"))["total"] or decimal.Decimal("0.00")
    allocated_assets = Asset.objects.filter(is_deleted=False, status="Allocated").count()
    maintenance_due = AssetMaintenance.objects.filter(status__in=["Scheduled", "In Progress"]).count()
    
    # Warranties expiring within 30 days
    import datetime
    today = datetime.date.today()
    in_30_days = today + datetime.timedelta(days=30)
    warranty_expiring = Warranty.objects.filter(end_date__gte=today, end_date__lte=in_30_days, status="Active").count()
    
    assets_under_repair = Asset.objects.filter(is_deleted=False, status="Maintenance").count()
    disposed_assets = Asset.objects.filter(is_deleted=False, status="Disposed").count()

    dept_utilization = list(
        Asset.objects.filter(is_deleted=False, department__isnull=False)
        .values("department__name")
        .annotate(count=Count("id"), total_val=Sum("current_value"))
        .order_by("-count")[:5]
    )

    return Response({
        "total_assets": total_assets,
        "total_asset_value": float(total_asset_val),
        "allocated_assets": allocated_assets,
        "maintenance_due": maintenance_due,
        "warranty_expiring": warranty_expiring,
        "assets_under_repair": assets_under_repair,
        "disposed_assets": disposed_assets,
        "department_utilization": dept_utilization,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAssetAdminOrManager])
def assets_reports(request):
    """Generates structured data for Asset Reports suite."""
    report_type = request.query_params.get("type", "asset_register")

    if report_type == "department_assets":
        data = list(
            Asset.objects.filter(is_deleted=False)
            .values("department__name")
            .annotate(asset_count=Count("id"), total_cost=Sum("purchase_cost"), current_value=Sum("current_value"))
        )
    elif report_type == "maintenance_cost":
        data = list(
            AssetMaintenance.objects.values("maintenance_type")
            .annotate(total_cost=Sum("cost"), total_records=Count("id"))
        )
    elif report_type == "depreciation":
        data = list(
            AssetDepreciation.objects.values("method")
            .annotate(total_depreciation=Sum("accumulated_depreciation"), count=Count("id"))
        )
    elif report_type == "warranty":
        data = list(
            Warranty.objects.values("status")
            .annotate(count=Count("id"))
        )
    elif report_type == "disposal":
        data = list(
            AssetDisposal.objects.values("method")
            .annotate(total_value=Sum("disposal_value"), count=Count("id"))
        )
    else: # asset_register
        data = AssetSerializer(Asset.objects.filter(is_deleted=False)[:50], many=True).data

    return Response({
        "report_type": report_type,
        "data": data
    })
