from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    FeeCategoryViewSet,
    FeeInstallmentViewSet,
    FeeReceiptViewSet,
    FeeStructureViewSet,
    StudentFeeViewSet,
)

router = DefaultRouter()
router.register(r"categories", FeeCategoryViewSet, basename="fee-category")
router.register(r"structures", FeeStructureViewSet, basename="fee-structure")
router.register(r"student-fees", StudentFeeViewSet, basename="student-fee")
router.register(r"installments", FeeInstallmentViewSet, basename="fee-installment")
router.register(r"receipts", FeeReceiptViewSet, basename="fee-receipt")

# Alias paths according to API specifications:
# POST /fees/assign/
# POST /fees/pay/
# GET /fees/student/{id}/
# GET /fees/outstanding/
# GET /fees/receipt/{id}/
urlpatterns = [
    path("assign/", StudentFeeViewSet.as_view({"post": "assign"}), name="fees-assign"),
    path("pay/", FeeReceiptViewSet.as_view({"post": "pay"}), name="fees-pay"),
    path("student/<str:student_id>/", StudentFeeViewSet.as_view({"get": "student_summary"}), name="fees-student-summary"),
    path("outstanding/", StudentFeeViewSet.as_view({"get": "outstanding_report"}), name="fees-outstanding"),
    path("receipt/<str:receipt_id>/", FeeReceiptViewSet.as_view({"get": "get_receipt"}), name="fees-receipt-detail"),
    path("", include(router.urls)),
]
