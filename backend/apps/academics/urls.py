from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicSessionViewSet,
    DepartmentViewSet,
    FacultyViewSet,
    ProgramViewSet,
    SemesterViewSet,
    SubjectOfferingViewSet,
    SubjectViewSet,
)

app_name = "academics"

router = DefaultRouter()
router.register(r"faculties", FacultyViewSet, basename="faculty")
router.register(r"departments", DepartmentViewSet, basename="department")
router.register(r"programs", ProgramViewSet, basename="program")
router.register(r"sessions", AcademicSessionViewSet, basename="session")
router.register(r"semesters", SemesterViewSet, basename="semester")
router.register(r"subjects", SubjectViewSet, basename="subject")
router.register(r"offerings", SubjectOfferingViewSet, basename="offering")

urlpatterns = [
    path("", include(router.urls)),
]
