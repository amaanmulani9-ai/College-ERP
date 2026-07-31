from django.apps import AppConfig


class ScholarshipsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.scholarships"
    verbose_name = "Scholarship Management"

    def ready(self):
        try:
            import apps.scholarships.signals  # noqa: F401
        except ImportError:
            pass
