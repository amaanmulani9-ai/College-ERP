"""
Certificate Signals.
Listens for post-save events on certificates and transcripts.
"""

import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Certificate

logger = logging.getLogger("apps.certificates")


@receiver(post_save, sender=Certificate)
def on_certificate_saved(sender, instance, created, **kwargs):
    if created:
        logger.info(f"[CERT_SIGNAL] Certificate issued: {instance.certificate_number} to {instance.student}")
