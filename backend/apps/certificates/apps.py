from django.apps import AppConfig


class CertificatesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.certificates"
    verbose_name = "Certificate & Transcript Management"

    def ready(self):
        try:
            import apps.certificates.signals  # noqa: F401
        except ImportError:
            pass
