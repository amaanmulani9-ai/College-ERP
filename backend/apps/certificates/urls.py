from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CertificateTypeViewSet, CertificateViewSet, TranscriptViewSet

router = DefaultRouter()
router.register(r"types", CertificateTypeViewSet, basename="certificate-type")
router.register(r"issued", CertificateViewSet, basename="certificate")
router.register(r"transcripts", TranscriptViewSet, basename="transcript")

# Alias paths according to API specifications:
# POST /certificate/generate/
# POST /transcript/generate/
# GET /certificate/student/{id}/
# GET /certificate/verify/{number}/
# GET /certificate/download/{id}/
urlpatterns = [
    path("generate/", CertificateViewSet.as_view({"post": "generate"}), name="certificate-generate"),
    path("transcript/generate/", TranscriptViewSet.as_view({"post": "generate"}), name="transcript-generate"),
    path(
        "student/<str:student_id>/",
        CertificateViewSet.as_view({"get": "student_certificates"}),
        name="certificate-student-list",
    ),
    path("verify/<str:number>/", CertificateViewSet.as_view({"get": "verify"}), name="certificate-verify"),
    path("download/<str:cert_id>/", CertificateViewSet.as_view({"get": "download"}), name="certificate-download"),
    path("", include(router.urls)),
]
