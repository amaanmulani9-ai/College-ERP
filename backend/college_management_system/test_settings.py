from .settings import *

DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Remove tenant middleware since SQLite does not support PostgreSQL schemas
MIDDLEWARE = [m for m in MIDDLEWARE if 'django_tenants' not in m]

# Disable migrations for speed
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Faster password hashing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
