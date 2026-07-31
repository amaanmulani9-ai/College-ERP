from django.apps import AppConfig


class ExaminationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.examinations"
    verbose_name = "Examination Management"

    def ready(self):
        try:
            import apps.examinations.signals  # noqa: F401
        except ImportError:
            pass
