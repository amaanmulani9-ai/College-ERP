from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().prefetch_related("domains")
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        tenant = self.get_object()
        tenant.is_active = False
        Client.objects.filter(pk=tenant.pk).update(is_active=False)
        return Response({"status": "deactivated", "name": tenant.name})

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        tenant = self.get_object()
        tenant.is_active = True
        Client.objects.filter(pk=tenant.pk).update(is_active=True)
        return Response({"status": "activated", "name": tenant.name})
