import os
from .base import *  # noqa: F403

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "*"]
CORS_ALLOW_ALL_ORIGINS = True
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Use local SQLite & LocMemCache for instant development setup
use_sqlite = os.getenv("USE_SQLITE", "true").lower() in ("true", "1", "yes")

if use_sqlite:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }
    MIDDLEWARE = [item for item in MIDDLEWARE if "django_tenants" not in item]
    INSTALLED_APPS = [item for item in INSTALLED_APPS if item != "django_tenants"]
    DATABASE_ROUTERS = []
