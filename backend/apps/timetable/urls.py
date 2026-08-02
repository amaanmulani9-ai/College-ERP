from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BuildingViewSet, ClassroomViewSet, TimeSlotViewSet, TimetableViewSet

router = DefaultRouter()
router.register(r"buildings", BuildingViewSet, basename="building")
router.register(r"classrooms", ClassroomViewSet, basename="classroom")
router.register(r"timeslots", TimeSlotViewSet, basename="timeslot")
router.register(r"entries", TimetableViewSet, basename="timetable")

urlpatterns = [
    path("", include(router.urls)),
]
