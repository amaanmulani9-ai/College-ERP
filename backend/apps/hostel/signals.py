"""
Hostel Signals
==============
Signal listeners for hostel domain events.
"""

import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import HostelAllocation

logger = logging.getLogger(__name__)


@receiver(post_save, sender=HostelAllocation)
def log_allocation_status_change(sender, instance, created, **kwargs):
    """Log hostel allocation state transitions."""
    if created:
        logger.debug("New HostelAllocation created for student %s", instance.student_id)
