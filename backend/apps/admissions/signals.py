"""
Admissions Signal Handlers.
Listens for status transitions and triggers event hooks.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import AdmissionApplication
from .tasks import publish_admission_event


@receiver(post_save, sender=AdmissionApplication)
def on_application_saved(sender, instance, created, **kwargs):
    if created:
        publish_admission_event("admission_submitted", str(instance.id), {"app_num": instance.application_number})
    else:
        if instance.status == "approved":
            publish_admission_event("admission_approved", str(instance.id), {"app_num": instance.application_number})
        elif instance.status == "rejected":
            publish_admission_event("admission_rejected", str(instance.id), {"app_num": instance.application_number})
        elif instance.status == "enrolled":
            publish_admission_event("admission_enrolled", str(instance.id), {"app_num": instance.application_number})
