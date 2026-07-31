"""
Scholarship Signals
===================
Signal handler to keep fee discounts aligned when a Scholarship status changes.
"""
import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Scholarship

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Scholarship)
def sync_scholarship_status(sender, instance, created, **kwargs):
    """
    Log signal update when a scholarship is created or status changes.
    """
    if created:
        logger.debug("New scholarship created for student %s", instance.student_id)
