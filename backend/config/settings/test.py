from .base import *  # noqa: F403

DEBUG = True
SECRET_KEY = "test-secret-key"
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}
MIDDLEWARE = [item for item in MIDDLEWARE if "django_tenants" not in item]  # noqa: F405
INSTALLED_APPS = [item for item in INSTALLED_APPS if item != "django_tenants"]  # noqa: F405
DATABASE_ROUTERS = []
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
