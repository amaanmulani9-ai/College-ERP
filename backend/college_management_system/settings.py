"""Compatibility settings module.

New deployments should use one of:
- config.settings.development
- config.settings.production
- config.settings.test
"""

from config.settings.development import *  # noqa: F401,F403
