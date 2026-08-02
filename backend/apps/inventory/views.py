from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.inventory.models import (
    Category,
    Warehouse,
    Supplier,
    InventoryItem,
    ItemStock,
    StockMovement,
    PurchaseRequest,
    GoodsReceipt,
    IssueVoucher,
    ReturnVoucher,
    StockAdjustment,
    ReorderRule,
    InventoryAuditLog,
)
from apps.inventory.serializers import (
    CategorySerializer,
    WarehouseSerializer,
    SupplierSerializer,
    InventoryItemSerializer,
    ItemStockSerializer,
    StockMovementSerializer,
    PurchaseRequestSerializer,
    GoodsReceiptSerializer,
    IssueVoucherSerializer,
    ReturnVoucherSerializer,
    StockAdjustmentSerializer,
    ReorderRuleSerializer,
    InventoryAuditLogSerializer,
)
from apps.inventory.services.inventory_service import InventoryService
from apps.inventory.permissions import IsInventoryAdminOrManager


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.filter(is_deleted=False)
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]

    @action(detail=True, methods=["post"])
    def receive_stock(self, request, pk=None):
        qty = int(request.data.get("quantity", 0))
        ref = request.data.get("reference_number", "")
        cost = Decimal(str(request.data.get("cost", "0.00")))
        stock = InventoryService.receive_stock(pk, qty, reference_number=ref, cost=cost, performed_by=request.user)
        return Response(ItemStockSerializer(stock).data)

    @action(detail=True, methods=["post"])
    def issue_stock(self, request, pk=None):
        qty = int(request.data.get("quantity", 0))
        ref = request.data.get("reference_number", "")
        try:
            stock = InventoryService.issue_stock(pk, qty, reference_number=ref, performed_by=request.user)
            return Response(ItemStockSerializer(stock).data)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ItemStockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ItemStock.objects.all()
    serializer_class = ItemStockSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all()
    serializer_class = PurchaseRequestSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class GoodsReceiptViewSet(viewsets.ModelViewSet):
    queryset = GoodsReceipt.objects.all()
    serializer_class = GoodsReceiptSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class IssueVoucherViewSet(viewsets.ModelViewSet):
    queryset = IssueVoucher.objects.all()
    serializer_class = IssueVoucherSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class ReturnVoucherViewSet(viewsets.ModelViewSet):
    queryset = ReturnVoucher.objects.all()
    serializer_class = ReturnVoucherSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class StockAdjustmentViewSet(viewsets.ModelViewSet):
    queryset = StockAdjustment.objects.all()
    serializer_class = StockAdjustmentSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class ReorderRuleViewSet(viewsets.ModelViewSet):
    queryset = ReorderRule.objects.all()
    serializer_class = ReorderRuleSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


class InventoryAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InventoryAuditLog.objects.all()
    serializer_class = InventoryAuditLogSerializer
    permission_classes = [IsAuthenticated, IsInventoryAdminOrManager]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def inventory_dashboard_kpis(request):
    kpis = InventoryService.get_inventory_dashboard_kpis()
    return Response(kpis, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsInventoryAdminOrManager])
def inventory_reports(request):
    report_type = request.query_params.get("type", "general")
    if report_type == "movements":
        movements = StockMovement.objects.all()[:100]
        return Response(StockMovementSerializer(movements, many=True).data)
    elif report_type == "suppliers":
        suppliers = Supplier.objects.all()
        return Response(SupplierSerializer(suppliers, many=True).data)
    else:
        items = InventoryItem.objects.filter(is_deleted=False)
        return Response(InventoryItemSerializer(items, many=True).data)
