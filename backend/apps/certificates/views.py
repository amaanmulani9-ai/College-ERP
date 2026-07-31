from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Certificate, CertificateType, Transcript
from .serializers import (
    CertificateAuditLogSerializer,
    CertificateSerializer,
    CertificateTypeSerializer,
    GenerateCertificateRequestSerializer,
    GenerateTranscriptRequestSerializer,
    TranscriptSerializer,
)
from .services import CertificateService


class CertificateTypeViewSet(viewsets.ModelViewSet):
    queryset = CertificateType.objects.all()
    serializer_class = CertificateTypeSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["is_active"]


class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all().select_related("student__profile", "certificate_type", "academic_session")
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["certificate_number", "student__student_id", "student__profile__first_name"]
    filterset_fields = ["student", "certificate_type", "status"]

    @action(detail=False, methods=["post"], url_path="generate")
    def generate(self, request):
        serializer = GenerateCertificateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = str(serializer.validated_data["student_id"])
        cert_type_id = str(serializer.validated_data["certificate_type_id"])

        try:
            cert = CertificateService.generate_certificate(student_id, cert_type_id, actor=request.user, request=request)
            return Response(CertificateSerializer(cert).data, status=status.HTTP_201_CREATED)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="student/(?P<student_id>[^/.]+)")
    def student_certificates(self, request, student_id=None):
        certs = CertificateService.student_certificates(student_id)
        return Response(CertificateSerializer(certs, many=True).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="verify/(?P<number>[^/.]+)", permission_classes=[AllowAny])
    def verify(self, request, number=None):
        res = CertificateService.verify_certificate(number, request=request)
        status_code = status.HTTP_200_OK if res["valid"] else status.HTTP_404_NOT_FOUND
        return Response(res, status=status_code)

    @action(detail=False, methods=["get"], url_path="download/(?P<cert_id>[^/.]+)")
    def download(self, request, cert_id=None):
        try:
            payload = CertificateService.download_pdf(cert_id, actor=request.user, request=request)
            return Response(payload, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        cert = self.get_object()
        logs = cert.audit_logs.all()
        return Response(CertificateAuditLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)


class TranscriptViewSet(viewsets.ModelViewSet):
    queryset = Transcript.objects.all().select_related("student__profile", "program")
    serializer_class = TranscriptSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["student__student_id", "student__profile__first_name"]
    filterset_fields = ["student", "program", "status"]

    @action(detail=False, methods=["post"], url_path="generate")
    def generate(self, request):
        serializer = GenerateTranscriptRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = str(serializer.validated_data["student_id"])

        try:
            transcript_obj = CertificateService.generate_transcript(student_id, actor=request.user, request=request)
            return Response(TranscriptSerializer(transcript_obj).data, status=status.HTTP_201_CREATED)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
