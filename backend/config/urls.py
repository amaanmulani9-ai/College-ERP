from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

def api_root(request):
    return JsonResponse({
        "name": "College ERP REST API",
        "version": "v0.20.0",
        "status": "healthy",
        "frontend_url": "http://localhost:5173/",
        "admin_url": "http://localhost:8000/admin/",
        "endpoints": [
            "/admin/",
            "/api/auth/",
            "/api/tenancy/",
            "/api/rbac/",
            "/api/profiles/",
            "/api/academics/",
            "/api/students/",
            "/api/staff/",
            "/api/admissions/",
            "/api/timetable/",
            "/api/attendance/",
            "/api/examinations/",
            "/api/results/",
            "/api/certificates/",
            "/api/fees/",
            "/api/payments/",
            "/api/scholarships/",
            "/api/library/",
            "/api/hostel/",
            "/api/transport/",
            "/api/payroll/",
            "/api/hr/",
            "/api/inventory/"
        ]
    })

urlpatterns = [
    path("", api_root),
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
    path("api/transport/", include("apps.transport.urls")),
    path("api/payroll/", include("apps.payroll.urls")),
    path("api/hr/", include("apps.hr.urls")),
    path("api/inventory/", include("apps.inventory.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
