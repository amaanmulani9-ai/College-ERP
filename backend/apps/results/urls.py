from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ResultSchemeViewSet, SemesterResultViewSet, StudentResultViewSet

router = DefaultRouter()
router.register(r"schemes", ResultSchemeViewSet, basename="result-scheme")
router.register(r"student-results", StudentResultViewSet, basename="student-result")
router.register(r"semester-results", SemesterResultViewSet, basename="semester-result")

# Alias paths for direct POST /results/calculate/, POST /results/publish/, GET /results/student/{id}/, GET /results/semester/{id}/, GET /results/transcript-preview/
urlpatterns = [
    path("calculate/", StudentResultViewSet.as_view({"post": "calculate"}), name="results-calculate"),
    path("publish/", SemesterResultViewSet.as_view({"post": "publish"}), name="results-publish"),
    path("student/<str:student_id>/", StudentResultViewSet.as_view({"get": "student_history"}), name="results-student-history"),
    path("semester/<str:semester_id>/", SemesterResultViewSet.as_view({"get": "semester_summary"}), name="results-semester-summary"),
    path("transcript-preview/", StudentResultViewSet.as_view({"get": "transcript_preview"}), name="results-transcript-preview"),
    path("", include(router.urls)),
]
