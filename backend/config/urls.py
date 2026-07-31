from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.core.urls")),
    path("api/tenancy/", include("apps.tenancy.urls")),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/rbac/", include("apps.rbac.urls")),
    path("api/profiles/", include("apps.profiles.urls")),
    path("api/academics/", include("apps.academics.urls")),
    path("api/students/", include("apps.students.urls")),
    path("api/staff/", include("apps.staff.urls")),
    path("api/", include("apps.parents.urls")),
    path("api/admissions/", include("apps.admissions.urls")),
    path("api/timetable/", include("apps.timetable.urls")),
    path("api/attendance/", include("apps.attendance.urls")),
    path("api/examinations/", include("apps.examinations.urls")),
    path("api/results/", include("apps.results.urls")),
    path("api/certificates/", include("apps.certificates.urls")),
    path("api/fees/", include("apps.fees.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/scholarships/", include("apps.scholarships.urls")),
    path("api/library/", include("apps.library.urls")),
    path("api/hostel/", include("apps.hostel.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
