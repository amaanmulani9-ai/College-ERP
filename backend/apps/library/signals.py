"""
Library Signals
===============
Signal listeners for library domain events.
"""

import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import BookIssue

logger = logging.getLogger(__name__)


@receiver(post_save, sender=BookIssue)
def log_issue_status_change(sender, instance, created, **kwargs):
    """
    Log when a book circulation status changes.
    """
    if created:
        logger.debug("Book issue created for book %s", instance.book_id)
