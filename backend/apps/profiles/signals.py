from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserProfile, UserContact, UserPreferences


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        profile, _ = UserProfile.objects.get_or_create(
            user=instance,
            defaults={
                "first_name": instance.first_name,
                "last_name": instance.last_name,
                "preferred_language": instance.preferred_language,
                "time_zone": instance.time_zone,
            },
        )
        UserContact.objects.get_or_create(profile=profile, defaults={"primary_email": instance.email})
        UserPreferences.objects.get_or_create(profile=profile)
