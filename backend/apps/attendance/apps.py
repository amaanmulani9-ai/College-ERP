from django.apps import AppConfig


class AttendanceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.attendance"
    verbose_name = "Attendance Management"

    def ready(self):
        try:
            import apps.attendance.signals  # noqa: F401
        except ImportError:
            pass
