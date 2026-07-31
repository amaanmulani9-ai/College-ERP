"""
Attendance Signals.
Listens for post-save events on attendance sessions and records.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from .models import AttendanceSession

logger = logging.getLogger("apps.attendance")


@receiver(post_save, sender=AttendanceSession)
def on_attendance_session_saved(sender, instance, created, **kwargs):
    if created:
        logger.info(f"[ATTENDANCE_SIGNAL] Attendance session created for {instance.subject} on {instance.date}")
