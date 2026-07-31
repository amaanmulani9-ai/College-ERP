"""Compatibility WSGI module for the legacy project package."""

from config.wsgi import application  # noqa: F401

app = application
