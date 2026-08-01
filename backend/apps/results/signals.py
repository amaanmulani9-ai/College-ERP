"""
Results Signals.
Listens for post-save events on student & semester results.
"""

import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import StudentResult

logger = logging.getLogger("apps.results")


@receiver(post_save, sender=StudentResult)
def on_student_result_saved(sender, instance, created, **kwargs):
    if created:
        logger.info(
            f"[RESULTS_SIGNAL] StudentResult created: {instance.student} - {instance.subject} ({instance.grade})"
        )
