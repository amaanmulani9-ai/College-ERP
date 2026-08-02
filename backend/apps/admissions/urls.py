from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdmissionApplicationViewSet,
    AdmissionDashboardView,
    AdmissionDocumentViewSet,
    SeatMatrixViewSet,
)

router = DefaultRouter()
router.register(r"applications", AdmissionApplicationViewSet, basename="admission-application")
router.register(r"documents", AdmissionDocumentViewSet, basename="admission-document")
router.register(r"seat-matrix", SeatMatrixViewSet, basename="seat-matrix")

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/", AdmissionDashboardView.as_view(), name="admissions-dashboard"),
]
