from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.procurement.models import (
    PurchaseRequisition,
    QuotationRequest,
    VendorQuotation,
    QuotationComparison,
    PurchaseOrder,
    PurchaseInvoice,
    PurchasePayment,
    VendorContract,
    ContractRenewal,
    ProcurementApproval,
    ProcurementAuditLog,
)
from apps.procurement.serializers import (
    PurchaseRequisitionSerializer,
    QuotationRequestSerializer,
    VendorQuotationSerializer,
    QuotationComparisonSerializer,
    PurchaseOrderSerializer,
    PurchaseInvoiceSerializer,
    PurchasePaymentSerializer,
    VendorContractSerializer,
    ContractRenewalSerializer,
    ProcurementApprovalSerializer,
    ProcurementAuditLogSerializer,
)
from apps.procurement.services.procurement_service import ProcurementService
from apps.procurement.permissions import IsProcurementAdminOrManager


class PurchaseRequisitionViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequisition.objects.filter(is_deleted=False)
    serializer_class = PurchaseRequisitionSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        comments = request.data.get("comments", "")
        req = ProcurementService.approve_requisition(pk, request.user, comments=comments)
        return Response(PurchaseRequisitionSerializer(req).data)


class QuotationRequestViewSet(viewsets.ModelViewSet):
    queryset = QuotationRequest.objects.all()
    serializer_class = QuotationRequestSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class VendorQuotationViewSet(viewsets.ModelViewSet):
    queryset = VendorQuotation.objects.all()
    serializer_class = VendorQuotationSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class QuotationComparisonViewSet(viewsets.ModelViewSet):
    queryset = QuotationComparison.objects.all()
    serializer_class = QuotationComparisonSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class PurchaseInvoiceViewSet(viewsets.ModelViewSet):
    queryset = PurchaseInvoice.objects.all()
    serializer_class = PurchaseInvoiceSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class PurchasePaymentViewSet(viewsets.ModelViewSet):
    queryset = PurchasePayment.objects.all()
    serializer_class = PurchasePaymentSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class VendorContractViewSet(viewsets.ModelViewSet):
    queryset = VendorContract.objects.all()
    serializer_class = VendorContractSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class ContractRenewalViewSet(viewsets.ModelViewSet):
    queryset = ContractRenewal.objects.all()
    serializer_class = ContractRenewalSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class ProcurementApprovalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProcurementApproval.objects.all()
    serializer_class = ProcurementApprovalSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


class ProcurementAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProcurementAuditLog.objects.all()
    serializer_class = ProcurementAuditLogSerializer
    permission_classes = [IsAuthenticated, IsProcurementAdminOrManager]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def procurement_dashboard_kpis(request):
    kpis = ProcurementService.get_procurement_dashboard_kpis()
    return Response(kpis, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsProcurementAdminOrManager])
def procurement_reports(request):
    report_type = request.query_params.get("type", "general")
    if report_type == "orders":
        orders = PurchaseOrder.objects.all()[:100]
        return Response(PurchaseOrderSerializer(orders, many=True).data)
    elif report_type == "invoices":
        invoices = PurchaseInvoice.objects.all()[:100]
        return Response(PurchaseInvoiceSerializer(invoices, many=True).data)
    else:
        reqs = PurchaseRequisition.objects.filter(is_deleted=False)[:100]
        return Response(PurchaseRequisitionSerializer(reqs, many=True).data)
