from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ParentDashboardSummaryView, ParentDocumentViewSet, ParentViewSet

router = DefaultRouter()
router.register(r"parents", ParentViewSet, basename="parent")
router.register(r"parent-documents", ParentDocumentViewSet, basename="parent-document")

urlpatterns = [
    path("", include(router.urls)),
    path("parents/dashboard/", ParentDashboardSummaryView.as_view(), name="parent-dashboard"),
]
