from .settings import *

DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Remove tenant middleware since SQLite does not support PostgreSQL schemas
MIDDLEWARE = [m for m in MIDDLEWARE if 'django_tenants' not in m]
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != 'django_tenants']
DATABASE_ROUTERS = []

# Enable migrations for local SQLite running
MIGRATION_MODULES = {}

# Faster password hashing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
