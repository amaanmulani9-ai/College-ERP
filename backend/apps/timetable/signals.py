"""
Timetable Signals.
Defines post-save signal handlers for timetable entries.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from .models import Timetable

logger = logging.getLogger("apps.timetable")


@receiver(post_save, sender=Timetable)
def on_timetable_entry_saved(sender, instance, created, **kwargs):
    if created:
        logger.info(f"[TIMETABLE_SIGNAL] Timetable entry created: {instance}")
