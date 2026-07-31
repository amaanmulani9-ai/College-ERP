from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    AcademicSession,
    Department,
    Faculty,
    Program,
    Semester,
    Subject,
    SubjectOffering,
)
from .serializers import (
    AcademicSessionSerializer,
    DepartmentSerializer,
    FacultySerializer,
    ProgramSerializer,
    SemesterSerializer,
    SubjectOfferingSerializer,
    SubjectSerializer,
)
from .services import log_academic_action, restore_entity, soft_delete_entity


class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["is_active"]

    def perform_destroy(self, instance):
        soft_delete_entity(instance, request=self.request)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        instance = Faculty.all_objects.get(pk=pk)
        restore_entity(instance, request=request)
        return Response(FacultySerializer(instance).data, status=status.HTTP_200_OK)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["faculty", "is_active"]

    def perform_destroy(self, instance):
        soft_delete_entity(instance, request=self.request)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        instance = Department.all_objects.get(pk=pk)
        restore_entity(instance, request=request)
        return Response(DepartmentSerializer(instance).data, status=status.HTTP_200_OK)


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["department", "degree_level", "is_active"]

    def perform_destroy(self, instance):
        soft_delete_entity(instance, request=self.request)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        instance = Program.all_objects.get(pk=pk)
        restore_entity(instance, request=request)
        return Response(ProgramSerializer(instance).data, status=status.HTTP_200_OK)


class AcademicSessionViewSet(viewsets.ModelViewSet):
    queryset = AcademicSession.objects.all()
    serializer_class = AcademicSessionSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name"]
    filterset_fields = ["is_active", "is_current"]

    @action(detail=True, methods=["post"], url_path="set-current")
    def set_current(self, request, pk=None):
        session = self.get_object()
        session.is_current = True
        session.save()
        log_academic_action(request, "set_current_session", "AcademicSession", session.id)
        return Response(AcademicSessionSerializer(session).data, status=status.HTTP_200_OK)


class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name"]
    filterset_fields = ["program", "semester_number", "is_active"]

    def perform_destroy(self, instance):
        soft_delete_entity(instance, request=self.request)


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["semester", "is_elective", "is_active"]

    def perform_destroy(self, instance):
        soft_delete_entity(instance, request=self.request)


class SubjectOfferingViewSet(viewsets.ModelViewSet):
    queryset = SubjectOffering.objects.all()
    serializer_class = SubjectOfferingSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["subject__code", "subject__name"]
    filterset_fields = ["session", "department", "status"]
