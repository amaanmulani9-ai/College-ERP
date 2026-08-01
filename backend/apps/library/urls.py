from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AuthorViewSet,
    BookCategoryViewSet,
    BookIssueViewSet,
    BookViewSet,
    LibraryAuditLogViewSet,
    PublisherViewSet,
    ReservationViewSet,
)

router = DefaultRouter()
router.register(r"categories", BookCategoryViewSet, basename="library-category")
router.register(r"authors", AuthorViewSet, basename="library-author")
router.register(r"publishers", PublisherViewSet, basename="library-publisher")
router.register(r"books", BookViewSet, basename="library-book")
router.register(r"issues", BookIssueViewSet, basename="library-issue")
router.register(r"reservations", ReservationViewSet, basename="library-reservation")
router.register(r"audit-logs", LibraryAuditLogViewSet, basename="library-audit-log")

urlpatterns = [
    # Aliased convenience paths
    path("issue/", BookIssueViewSet.as_view({"post": "issue"}), name="library-issue-create"),
    path("return/", BookIssueViewSet.as_view({"post": "return_book"}), name="library-return-create"),
    path("reserve/", ReservationViewSet.as_view({"post": "reserve"}), name="library-reserve-create"),
    path("history/", BookViewSet.as_view({"get": "history"}), name="library-history"),
    path("fines/", BookIssueViewSet.as_view({"get": "fines_report"}), name="library-fines-report"),
    path("lost/", BookIssueViewSet.as_view({"post": "lost"}), name="library-lost"),
    path("damaged/", BookIssueViewSet.as_view({"post": "damaged"}), name="library-damaged"),
    # Router URLs
    path("", include(router.urls)),
]
