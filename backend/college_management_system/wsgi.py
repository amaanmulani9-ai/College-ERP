"""
WSGI config for college_management_system project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path

# Ensure backend/ is on the path when Vercel loads this file directly.
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))
os.chdir(BACKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_management_system.settings')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
app = application
