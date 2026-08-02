from django.apps import AppConfig


class FeesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.fees"
    verbose_name = "Fee Management System"

    def ready(self):
        try:
            import apps.fees.signals  # noqa: F401
        except ImportError:
            pass
