from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AttendanceReportViewSet, AttendanceSessionViewSet, FacultyAttendanceViewSet, StudentAttendanceViewSet

router = DefaultRouter()
router.register(r"sessions", AttendanceSessionViewSet, basename="attendance-session")
router.register(r"students", StudentAttendanceViewSet, basename="student-attendance")
router.register(r"faculty", FacultyAttendanceViewSet, basename="faculty-attendance")
router.register(r"reports", AttendanceReportViewSet, basename="attendance-report")

urlpatterns = [
    path("", include(router.urls)),
]
