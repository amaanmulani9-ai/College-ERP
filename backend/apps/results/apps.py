from django.apps import AppConfig


class ResultsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.results"
    verbose_name = "Result Management"

    def ready(self):
        try:
            import apps.results.signals  # noqa: F401
        except ImportError:
            pass
