from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ClientViewSet

router = DefaultRouter()
router.register(r"tenants", ClientViewSet, basename="tenant")

app_name = "tenancy"

urlpatterns = [
    path("", include(router.urls)),
]
