from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ExamAttendanceViewSet,
    ExamScheduleViewSet,
    ExamTypeViewSet,
    ExamViewSet,
    HallTicketViewSet,
    InvigilatorAssignmentViewSet,
)

router = DefaultRouter()
router.register(r"types", ExamTypeViewSet, basename="exam-type")
router.register(r"exams", ExamViewSet, basename="exam")
router.register(r"schedules", ExamScheduleViewSet, basename="exam-schedule")
router.register(r"hall-tickets", HallTicketViewSet, basename="hall-ticket")
router.register(r"attendances", ExamAttendanceViewSet, basename="exam-attendance")
router.register(r"invigilators", InvigilatorAssignmentViewSet, basename="invigilator-assignment")

urlpatterns = [
    path("", include(router.urls)),
]
