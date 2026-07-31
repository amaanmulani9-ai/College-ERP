from config.env import bool_env, int_env, list_env, str_env

from .base import *  # noqa: F403


DEBUG = False
SECRET_KEY = str_env("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY must be set in production.")

ALLOWED_HOSTS = list_env("ALLOWED_HOSTS")
if not ALLOWED_HOSTS:
    raise RuntimeError("ALLOWED_HOSTS must be set in production.")

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

EMAIL_BACKEND = str_env("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = str_env("EMAIL_HOST")
EMAIL_PORT = int_env("EMAIL_PORT", 587)
EMAIL_HOST_USER = str_env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = str_env("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = bool_env("EMAIL_USE_TLS", True)
DEFAULT_FROM_EMAIL = str_env("DEFAULT_FROM_EMAIL", "College ERP <noreply@example.com>")
