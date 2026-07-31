"""
Examination Signals.
Defines post-save signal listeners for exam entities.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from .models import Exam

logger = logging.getLogger("apps.examinations")


@receiver(post_save, sender=Exam)
def on_exam_saved(sender, instance, created, **kwargs):
    if created:
        logger.info(f"[EXAM_SIGNAL] Exam created: {instance}")
