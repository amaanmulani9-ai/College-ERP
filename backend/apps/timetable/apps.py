from django.apps import AppConfig


class TimetableConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.timetable"
    verbose_name = "Timetable Management"

    def ready(self):
        try:
            import apps.timetable.signals  # noqa: F401
        except ImportError:
            pass
